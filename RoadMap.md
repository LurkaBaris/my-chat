# ТЗ: Чат с авторизацией (Next.js + Auth.js + PostgreSQL)

## Стек

```
Next.js (App Router, Server Actions)
Auth.js v5 (next-auth@beta) — Credentials provider, свой bcrypt-хэш, JWT-сессии
PostgreSQL + Prisma (adapter @auth/prisma-adapter)
Доставка сообщений: server actions (этап 2) → WebSocket / Socket.IO (этап 3)
```

### Важные оговорки (прочитать до старта)

1. **Credentials в Auth.js — не «первоклассный» путь.** Регистрацию (signup) и хэширование пароля пишешь **сам** — Auth.js этого не делает.
2. С Credentials сессии работают **только как JWT** (не database sessions). Это нормально и ожидаемо.
3. **Строго Auth.js v5 (`next-auth@beta`).** v4 использовать нельзя: у неё другой API (`getServerSession(authOptions)` вместо `auth()`), устаревшие паттерны под App Router и путаница при миграции. Большинство туториалов в сети — под v4 и **не подходят**: сверяйся только с офиц. доками на authjs.dev. Если пример использует `authOptions` и `getServerSession` — это v4, игнорируй.

### Примерная схема БД:

Модели `User`, `Account`, `Session`, `VerificationToken` требуются Prisma-адаптером Auth.js (даже при JWT часть из них создаётся). Доменные модели — `Conversation`, `ConversationParticipant`, `Message`.

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id           String   @id @default(cuid())
  email        String   @unique
  name         String?
  passwordHash String                        // свой bcrypt-хэш (не от Auth.js)
  createdAt    DateTime @default(now())

  accounts      Account[]
  sessions      Session[]
  participantIn ConversationParticipant[]
  messages      Message[]
}

model Conversation {
  id           String   @id @default(cuid())
  createdAt    DateTime @default(now())

  participants ConversationParticipant[]
  messages     Message[]
}

model ConversationParticipant {
  id             String       @id @default(cuid())
  conversationId String
  userId         String
  joinedAt       DateTime     @default(now())

  conversation Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  user         User         @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([conversationId, userId])          // один юзер — один раз в беседе
}

model Message {
  id             String       @id @default(cuid())
  conversationId String
  senderId       String
  body           String
  createdAt      DateTime     @default(now())

  conversation Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  sender       User         @relation(fields: [senderId], references: [id], onDelete: Cascade)

  @@index([conversationId, createdAt])         // выборка ленты беседы по времени
}

// Модели Account / Session / VerificationToken — по образцу @auth/prisma-adapter
```

### Задача 0.1 — Инициализация Next.js

**Что сделать:**

- Создать проект: `npx create-next-app@latest` (App Router, TypeScript, ESLint).
- Настроить Prettier (перенести привычный конфиг из task-manager).
- `.env.local` + `.env.example` (без секретов в git).
- README со стеком и командами запуска.

**Критерии приёмки:**

- [ ] `npm run dev` поднимает пустую стартовую страницу
- [ ] `npm run lint` и `npm run build` проходят
- [ ] `.env` в `.gitignore`, `.env.example` закоммичен
- [ ] Первый commit в новом репозитории

---

### Задача 0.2 — PostgreSQL + Prisma

**Что сделать:**

- Поднять Postgres (локально Docker).
- `npm i prisma -D`, `npm i @prisma/client`, `npx prisma init`.
- Прописать `DATABASE_URL` в `.env`.
- Завести `schema.prisma` с моделями из раздела с примерной схемой БД.
- Первая миграция: `npx prisma migrate dev --name init`.
- Настроить singleton `PrismaClient` (чтобы в dev не плодить коннекты при hot-reload).

**Критерии приёмки:**

- [ ] `npx prisma migrate dev` создаёт таблицы без ошибок
- [ ] `npx prisma studio` показывает пустые таблицы `User`, `Conversation`, `Message`
- [ ] `lib/prisma.ts` экспортирует singleton-клиент
- [ ] Схема закоммичена вместе с папкой `migrations/`

**Подсказка (singleton):**

```ts
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

---

## ЭТАП 1 — Регистрация и логин

### Задача 1.1 — Установка и конфиг Auth.js v5

**Что сделать:**

- `npm i next-auth@beta @auth/prisma-adapter bcryptjs`, типы для bcrypt.
- Сгенерировать `AUTH_SECRET` (`npx auth secret`) → в `.env`.
- Разделить конфиг на два файла (edge-совместимость):
  - `auth.config.ts` — провайдеры и callbacks (без Prisma, edge-safe);
  - `auth.ts` — основной инстанс с `PrismaAdapter` и JWT-стратегией.
- Роут-хендлер `app/api/auth/[...nextauth]/route.ts`.

**Критерии приёмки:**

- [ ] Проект собирается с подключённым Auth.js
- [ ] `AUTH_SECRET` в `.env`
- [ ] Конфиг разделён на `auth.config.ts` / `auth.ts`

**Ориентир:**

```ts
// auth.ts
import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import authConfig from './auth.config'

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  ...authConfig,
})
```

```ts
// app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/auth'
export const { GET, POST } = handlers
```

---

### Задача 1.2 — Регистрация (signup) — пишется вручную

**Что сделать:**

- Server action `registerUser` (или route handler) — **не** через Auth.js.
- Валидация ввода через **Zod** (знакомо по task-manager): email, пароль (мин. длина).
- Проверка, что email не занят.
- Хэш пароля: `bcrypt.hash(password, 10)` → сохранить в `User.passwordHash`.
- Форма регистрации (React Hook Form + Zod — как в прошлом проекте).
- Понятные ошибки («email занят», «пароль слишком короткий»).

**Критерии приёмки:**

- [ ] Новый юзер появляется в БД (виден в Prisma Studio)
- [ ] В БД хранится **хэш**, а не открытый пароль
- [ ] Повторный email отклоняется с внятной ошибкой
- [ ] Пароль короче минимума не проходит валидацию (сервер, не только клиент)
- [ ] Пароль/хэш нигде не попадает в логи и в ответ клиенту

---

### Задача 1.3 — Логин (Credentials provider)

**Что сделать:**

- В `auth.config.ts` — `Credentials`-провайдер с `authorize`:
  - найти юзера по email;
  - сравнить пароль через `bcrypt.compare`;
  - вернуть безопасный объект юзера (**без** `passwordHash`) или бросить ошибку.
- Форма логина, вызов `signIn('credentials', ...)`.
- Callbacks `jwt` / `session` — положить `user.id` в токен и сессию.

**Критерии приёмки:**

- [ ] Верные email+пароль → успешный вход, сессия создана
- [ ] Неверный пароль / несуществующий email → ошибка, без входа
- [ ] `passwordHash` **никогда** не возвращается из `authorize`
- [ ] `session.user.id` доступен на сервере через `auth()`
- [ ] Logout (`signOut`) завершает сессию

**Ориентир:**

```ts
// auth.config.ts
import Credentials from 'next-auth/providers/credentials'
import type { NextAuthConfig } from 'next-auth'

export default {
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: async (credentials) => {
        // 1. валидировать credentials (Zod)
        // 2. найти юзера в БД по email
        // 3. bcrypt.compare(пароль, user.passwordHash)
        // 4. вернуть { id, email, name } БЕЗ passwordHash, либо null/throw
      },
    }),
  ],
} satisfies NextAuthConfig
```

---

### Задача 1.4 — Защищённые роуты

**Что сделать:**

- `middleware.ts` — редирект неавторизованных на `/login`.
- Разделить зоны: публичные (`/login`, `/register`) и защищённые (`/chat`, ...).
- На сервере страницы читать сессию через `auth()`; если нет — `redirect('/login')`.
- В шапке показать email/имя вошедшего + кнопку выхода.

**Критерии приёмки:**

- [ ] Заход на `/chat` без сессии → редирект на `/login`
- [ ] После логина `/chat` доступен
- [ ] `/login` и `/register` доступны без входа
- [ ] Кнопка выхода возвращает на `/login`

**Ориентир (сверено с доками Auth.js v5):**

```ts
// middleware.ts
export { auth as middleware } from '@/auth'

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

---

### Задача 1.5 — Шапка с данными вошедшего пользователя

**Что сделать:**

- В защищённой зоне читать сессию через `auth()` и прокидывать пользователя в шапку.
- Показать в шапке имя (или email, если имени нет) вошедшего юзера рядом с кнопкой выхода.
- Убедиться, что `session.user.id` реально доступен (callbacks `jwt` / `session` из задачи 1.3) — он понадобится на этапе 2.

**Критерии приёмки:**

- [ ] После входа в шапке видно имя/email текущего пользователя
- [ ] Данные берутся из сессии на сервере, а не хардкодом
- [ ] `passwordHash` в сессию/на клиент не попадает

---

### Задача 1.6 — README: «что делает Auth.js, а что я сам»

**Что сделать:**

- Отдельным разделом README описать границу ответственности: что берёт на себя Auth.js (сессии, JWT, роут-хендлеры, `signIn` / `signOut`), а что написано вручную (регистрация, хэширование пароля, `authorize`, валидация Zod).
- Кратко пояснить, почему с Credentials сессии только JWT и где проверяется авторизация (middleware + страницы).
- Никаких «чёрных ящиков»: любой пункт студент должен уметь объяснить на созвоне.

**Критерии приёмки:**

- [ ] В README есть раздел «что делает Auth.js, а что я сам»
- [ ] Разделены зоны ответственности библиотеки и собственного кода
- [ ] Объяснено, почему сессии JWT и где происходит проверка доступа

---

## 5. Definition of Done для этапов 0–1

- [ ] Можно: зарегистрироваться → выйти → войти обратно → попасть в защищённую зону → выйти
- [ ] Пароли хранятся **только** как bcrypt-хэш
- [ ] Неавторизованный не попадает в `/chat`
- [ ] `npm run lint` + `npm run build` зелёные
- [ ] Секреты не в git; `.env.example` актуален
- [ ] README: стек, запуск, команды Prisma, раздел «что делает Auth.js, а что я сам»
- [ ] Осмысленные commit-сообщения (как в task-manager)

---

## ЭТАП 2 — Беседы и сообщения

### Задача 2.1 — Отправка и чтение сообщений (server actions)

**Что сделать:**

- Server action `sendMessage(conversationId, body)`:
  - взять текущего пользователя через `auth()`, `senderId = session.user.id` (**не** доверять id с клиента);
  - провалидировать `body` через Zod (не пустое после trim, разумный `max`);
  - проверить, что юзер — участник беседы (`ConversationParticipant`), иначе отказать;
  - создать `Message` и вызвать `revalidatePath` для страницы беседы.
- Server action / server-запрос `getMessages(conversationId)` — лента беседы, отсортированная по `createdAt`, с именем отправителя.
- Заменить моки в UI (`entities/message/model/mocks.ts`) на реальные данные из БД.
- Композер (`ChatMessagesWidget`) подключить к `sendMessage`, очищать поле после отправки.

**Критерии приёмки:**

- [ ] Отправленное сообщение появляется в БД с корректным `senderId` и `conversationId`
- [ ] Пустое сообщение и слишком длинное отклоняются на сервере
- [ ] Не-участник беседы не может писать в неё и читать её
- [ ] Лента показывает сообщения по возрастанию времени, свои и чужие визуально различимы
- [ ] `senderId` берётся из сессии, а не из данных формы

---

### Задача 2.2 — Список бесед и создание диалога 1-на-1

**Что сделать:**

- Server-запрос `getConversations()` — беседы текущего пользователя (через `ConversationParticipant`), с последним сообщением и временем для превью, отсортированные по свежести.
- Server action `startConversation(otherUserId)`:
  - взять текущего пользователя через `auth()`;
  - запретить беседу с самим собой;
  - если диалог 1-на-1 между этими двумя уже есть — вернуть существующий, а не плодить дубликаты;
  - иначе в транзакции создать `Conversation` и два `ConversationParticipant`.
- Подключить `ChatListWidget` к реальным данным вместо моков; клик по беседе открывает её ленту.
- Выбор собеседника — минимально: по email или из простого списка пользователей (без дизайна).

**Критерии приёмки:**

- [ ] В сайдбаре видны только беседы текущего пользователя
- [ ] Повторный `startConversation` с тем же собеседником не создаёт вторую беседу
- [ ] Нельзя создать беседу с самим собой
- [ ] Клик по беседе открывает её сообщения (из задачи 2.1)
- [ ] Список отсортирован по времени последнего сообщения

---

### Задача 2.3 — Доработка создания беседы и UX списка

**Что сделать:**

- Обернуть поиск существующего DIRECT + создание новой беседы в `prisma.$transaction` (закрыть гонку двух параллельных `startConversation`).
- Ошибки при старте чата по email — нейтральные (не раскрывать, существует ли пользователь).
- Empty-state в сайдбаре, если бесед ещё нет («Начните диалог по email»).
- Добавить `postinstall: prisma generate` (или явный шаг в README/`check`), чтобы после `npm i` типы Prisma совпадали со схемой.

**Критерии приёмки:**

- [ ] Два параллельных запроса на один и тот же диалог не создают две беседы
- [ ] Текст ошибки не выдаёт факт существования email в системе
- [ ] После свежего `npm i` проходит `npm run type-check` без ручного `prisma generate`

---

## ЭТАП 3 — Realtime (WebSocket)

Polling и SSE пропускаем: сразу двусторонний канал, как в «настоящем» чате.

### Задача 3.1 — Доставка сообщений через WebSocket (Socket.IO)

**Контекст:** App Router сам по себе не поднимает долгоживущий WS. Нужен кастомный Node-сервер рядом с Next (или `server.ts` + Socket.IO). Источник истины по-прежнему Postgres + `sendMessage`; сокет только доставляет событие онлайн-клиентам.

**Что сделать:**

- Поднять Socket.IO на том же origin в dev: например `server.ts` + `socket.io`, скрипт запуска в `package.json` (не обычный `next dev` в одиночку). Документировать в README.
- На `connection`:
  - достать сессию (cookie Auth.js) и понять `userId`; без сессии — `disconnect`;
  - клиент шлёт `joinConversation({ conversationId })` → сервер проверяет membership в БД → `socket.join(conversationId)` либо ошибка.
- После успешного `sendMessage` (server action **или** сокет-событие — на выбор, но запись в БД обязательна **до** emit):
  - `io.to(conversationId).emit('message:new', payload)` без лишних полей и без `passwordHash`.
- Клиент на `/chat/[conversationId]`:
  - подключается к сокету, делает `joinConversation`;
  - слушает `message:new`, добавляет в ленту **без дублей** (по `id`);
  - на `unmount` / смене чата — `leaveConversation` + cleanup слушателей.
- После reconnect снова `join` текущей беседы (Socket.IO переподключается сам — нужно лишь повторить join).
- Автоскролл вниз только если пользователь был у низа ленты.
- README: зачем WebSocket; чем отличается от polling/SSE; что in-memory adapter = один процесс (Redis adapter — вне scope).

**Критерии приёмки:**

- [ ] Сообщение второго участника появляется в открытом чате без F5
- [ ] Неавторизованный сокет отключается; join в чужую беседу отклоняется
- [ ] Сообщение сначала в БД, потом в сокет (после рестарта история читается из Postgres)
- [ ] Нет дубликатов в ленте; leave/unmount чистит подписку
- [ ] После краткого обрыва сети и reconnect новые сообщения снова приходят
- [ ] README описывает запуск с Socket.IO и ограничение одного инстанса

**Ориентир по событиям:**

```ts
// клиент → сервер
joinConversation: { conversationId: string }
leaveConversation: { conversationId: string }

// сервер → клиент
message:new: {
  id: string
  conversationId: string
  body: string
  senderId: string
  createdAt: string
  sender: { id: string; name: string | null; email: string }
}
```

**Важно:** не тащить бизнес-логику «только в сокет». Сохранение в Prisma — обязательный шаг; сокет — транспорт уведомления, не единственное хранилище.

---
