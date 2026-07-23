# Chat App

Чат-приложение на Next.js с регистрацией, авторизацией по email/паролю и базовой
заготовкой под общий чат. На первом этапе сообщения будут обновляться через polling,
дальше при необходимости можно перейти на SSE или Realtime.

## Стек

- Next.js 16 с App Router и Server Actions
- React 19
- TypeScript
- Auth.js v5 с Credentials provider и JWT-сессиями
- PostgreSQL
- Prisma v6
- bcryptjs
- Ant Design v6
- React Hook Form
- Zod
- CSS Modules
- Feature-Sliced Design
- ESLint
- Prettier

## Запуск проекта

Установить зависимости:

```bash
npm i
```

Создать `.env` на основе примера:

```bash
cp .env.example .env
```

Заполнить `AUTH_SECRET`. Например:

```bash
npx auth secret
```

Запустить PostgreSQL:

```bash
docker compose up -d
```

Применить миграции Prisma:

```bash
npx prisma migrate dev
```

Запустить dev-сервер:

```bash
npm run dev
```

После запуска приложение будет доступно по адресу
[http://localhost:3000](http://localhost:3000). Если порт `3000` занят, Next.js запустит приложение на следующем свободном порту

## Проверки

Запустить TypeScript, ESLint и проверку форматирования одной командой:

```bash
npm run check
```

Проверить TypeScript без сборки:

```bash
npm run type-check
```

Собрать production-версию:

```bash
npm run build
```

Запустить ESLint:

```bash
npm run lint
```

Автоматически исправить доступные lint-ошибки:

```bash
npm run lint:fix
```

Проверить форматирование:

```bash
npm run format:check
```

Отформатировать проект:

```bash
npm run format
```

Запустить собранное приложение:

```bash
npm run start
```

Команда `npm run check` также автоматически запускается Husky перед `git push`.

## База данных

Локальная база запускается через Docker Compose:

```bash
docker compose up -d
```

Остановить контейнеры:

```bash
docker compose down
```

Схема Prisma находится в `prisma/schema.prisma`. Сейчас в ней описаны:

- пользователи;
- таблицы Auth.js adapter;
- беседы;
- участники бесед;
- сообщения.

После изменения схемы нужно создать и применить миграцию:

```bash
npx prisma migrate dev
```

## Переменные окружения

Пример переменных находится в `.env.example`. Локальные значения хранятся в `.env`
и не должны попадать в Git.

- `POSTGRES_USER` — пользователь локальной базы данных
- `POSTGRES_PASSWORD` — пароль пользователя локальной базы данных
- `POSTGRES_DB` — название локальной базы данных
- `POSTGRES_PORT` — порт PostgreSQL
- `DATABASE_URL` — готовая строка подключения для Prisma
- `AUTH_SECRET` — секрет Auth.js

## Что делает Auth.js, а что реализовано вручную

Auth.js используется для аутентификации и управления пользовательской сессией.

Auth.js отвечает за:

- работу Credentials provider;
- вызов функции `authorize` при входе;
- создание и проверку JWT-сессии;
- хранение сессии в защищённой `HttpOnly` cookie;
- функции `auth`, `signIn` и `signOut`;
- обработчики маршрута `/api/auth/[...nextauth]`;
- выполнение callbacks `jwt` и `session`.

Вручную в приложении реализованы:

- регистрация пользователя;
- валидация данных через Zod;
- проверка уникальности email;
- хэширование и проверка пароля через `bcryptjs`;
- работа с пользователями через Prisma;
- логика функции `authorize`;
- обработка ошибок входа и регистрации;
- правила доступа к маршрутам.

Auth.js не проверяет email и пароль самостоятельно. При входе библиотека передаёт данные в `authorize`, где приложение ищет пользователя в базе и сравнивает введённый пароль с сохранённым хэшем.

Для Credentials provider используется JWT-стратегия сессий. После успешного входа Auth.js создаёт JWT и сохраняет его в cookie. Закрытые данные, включая хэш пароля, в сессию не передаются.

Проверка доступа выполняется на двух уровнях:

- в `proxy.ts` — для раннего перенаправления между публичными и защищёнными маршрутами;
- в серверных страницах и layout через `auth()` — перед рендерингом защищённого содержимого.

## Структура проекта

Проект организован по FSD с учётом соглашений Next.js App Router:

```text
app               — маршруты, layout и metadata Next.js
src/_app          — глобальные стили и конфигурация приложения
src/_pages        — страницы приложения
src/widgets       — крупные самостоятельные UI-блоки
src/features      — пользовательские сценарии
src/entities      — бизнес-сущности
src/shared        — переиспользуемый UI, утилиты, конфигурация и ресурсы
public            — файлы, доступные напрямую по URL
```

## UI

В качестве UI kit используется Ant Design. Глобальный AntD provider и theme provider
лежат в `src/_app/providers/antd`.

Переиспользуемые UI-компоненты находятся в `src/shared/ui`. Для локальной стилизации используются CSS Modules
