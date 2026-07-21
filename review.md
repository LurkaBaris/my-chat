## 1. После регистрации нужен сразу переброс на авторизацию(или же сразу авторизовать)

## 2. Нет callbacks `jwt` / `session` → `session.user.id` недоступен

**Файл:** `src/shared/lib/auth/auth.config.ts`, `auth.ts`

ТЗ, задача 1.3, явно требует: «Callbacks `jwt` / `session` — положить `user.id` в токен и сессию» и критерий приёмки «`session.user.id` доступен на сервере через `auth()`».

Сейчас callbacks не заданы вообще. При JWT-стратегии Auth.js v5 по умолчанию кладёт в `session.user` только `name/email/image`, а `id` — **нет** (он лежит в `token.sub`, но наружу в `session.user.id` не пробрасывается). То есть критерий не выполнен.

Пока это не заметно, потому что единственная защищённая страница (`app/page.tsx`) проверяет только `session?.user`. Но на **этапе 2** сообщения требуют `senderId = id текущего юзера` — без `session.user.id` его негде взять. Это прямой блокер следующего этапа.

**Как чинить:**

```ts
// auth.config.ts (callbacks)
callbacks: {
  jwt({ token, user }) {
    if (user) token.id = user.id
    return token
  },
  session({ session, token }) {
    if (token.id) session.user.id = token.id as string
    return session
  },
}
```

И добавить аугментацию типов (`types/next-auth.d.ts`), чтобы `session.user.id` был типизирован — сейчас такого файла нет.

---

## 3. Разделение `auth.config.ts` / `auth.ts` сделано формально — конфиг НЕ edge-safe

**Файл:** `src/shared/lib/auth/auth.config.ts`

ТЗ, задача 1.1 и оговорка: смысл разделения на два файла — **edge-совместимость** (`auth.config.ts` без Prisma, чтобы его можно было импортировать в `middleware.ts`, который крутится на edge).

Здесь получилось наоборот: весь «тяжёлый» node-код (`prisma`, `bcryptjs.compare`) находится именно в `auth.config.ts`, а `auth.ts` — почти пустой. То есть `auth.config.ts` невозможно импортировать в edge-middleware — а это и была цель разделения. Разделение сейчас чисто косметическое.

**Как задумано в Auth.js v5:** `auth.config.ts` — edge-safe часть (провайдеры без DB-логики, `pages`, `callbacks`, в т.ч. `authorized`), а Credentials-провайдер с обращением к БД/bcrypt инстанцируется в `auth.ts`. Тогда `middleware.ts` импортирует только `authConfig` и остаётся на edge.

---

## 4. Отсутствует `middleware.ts`

**Файл:** ожидался в корне/`src`, отсутствует.

ТЗ, задача 1.4, явно требует `middleware.ts` с редиректом неавторизованных. Сейчас защита реализована только на уровне server-компонентов (`app/page.tsx` и `app/(auth)/layout.tsx` через `auth()` + `redirect`).

Функционально DoD «неавторизованный не попадает в защищённую зону» выполняется (проверено в браузере). Но:

- явный deliverable из ТЗ (`middleware.ts`) не сдан;
- защита «на каждой странице руками» хрупкая: любой новый защищённый роут легко забыть прикрыть. Middleware закрывает зону централизованно.

Связано с C2: чтобы добавить middleware правильно, сначала нужно сделать `auth.config.ts` edge-safe.

## 5. Непоследовательные импорты Prisma в обход публичного API

**Файл:** `src/shared/lib/auth/auth.config.ts:1`

```ts
import { prisma } from '@/shared/db/prisma' // ← внутренний модуль напрямую
```

Везде в проекте Prisma берётся через barrel `@/shared/db/index.server`, а здесь — напрямую из внутреннего `prisma.ts`. Это нарушает собственную FSD-конвенцию «импорт только через публичный индекс слоя» и создаёт разнобой. Привести к одному виду.

## 6. Нет аугментации типов next-auth

Связано с 2 пунктом. Нет `next-auth.d.ts` с расширением `Session`/`JWT`. После добавления `session.user.id` типов без аугментации TS будет ругаться либо потребует `as string`. Заодно стоит завести отдельную папку `types/` или разместить в `shared`.

## 7. Мелкие замечания / стиль

- **S1.** `registerUser.action.ts:22` — `result.error.issues[0].message`: обращение к `issues[0]` без проверки. При `safeParse` с `success:false` массив непустой, так что не упадёт, но безопаснее `issues[0]?.message ?? 'дефолт'`.
- **S2.** `LoginForm.tsx:50` — после успешного `signIn` делается `router.replace('/')`. Работает, но серверная сессия на клиенте подхватится только после навигации; для явного обновления server-компонентов можно добавить `router.refresh()`.
- **S3.** `next.config.ts` — `logging.serverFunctions: false` глушит логи server actions. В учебном проекте на этапе отладки логи скорее полезны; решение спорное, стоит осознанно.
- **S4.** Нет защиты от перебора (rate limiting) на логине/регистрации. По ТЗ — вне scope, отмечаю только для общего понимания рисков.
- **S5.** `.env.example` — `AUTH_SECRET=""` пустой. Ок как плейсхолдер, но в README полезно явно указать `npx auth secret` как канонический способ генерации (сейчас показан только `openssl`).
- **S6.** `POSTGRES_HOST` объявлен в env, но в `docker-compose.yml` не используется (нужен только для `DATABASE_URL`) — не ошибка, просто для ясности.
