# Chat App

Чат с регистрацией и авторизацией, личными беседами и доставкой сообщений. На первом
этапе обновление сообщений будет работать через polling, затем при необходимости через
SSE или Realtime.

## Целевой стек

- Next.js 16 с App Router и Server Actions
- React 19
- TypeScript
- Auth.js v5 с Credentials provider и JWT-сессиями
- PostgreSQL
- Prisma v6
- bcryptjs
- CSS Modules
- Feature-Sliced Design
- ESLint
- Prettier

## Запуск проекта

Установить зависимости:

```bash
npm i
```

Создать локальный файл окружения на основе примера:

```bash
cp .env.example .env.local
```

Запустить dev-сервер:

```bash
npm run dev
```

После запуска приложение будет доступно по адресу
[http://localhost:3000](http://localhost:3000).

## Проверки

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

Запустить TypeScript, ESLint и проверку форматирования одной командой:

```bash
npm run check
```

Команда `npm run check` также автоматически запускается Husky перед `git push`.

Запустить собранное приложение:

```bash
npm run start
```

## Переменные окружения

Пример переменных находится в `.env.example`. Локальные значения хранятся в `.env.local` и не должны попадать в Git.

- `POSTGRES_USER` — пользователь локальной базы данных
- `POSTGRES_PASSWORD` — пароль пользователя локальной базы данных
- `POSTGRES_DB` — название локальной базы данных
- `POSTGRES_HOST` — адрес PostgreSQL
- `POSTGRES_PORT` — порт PostgreSQL
- `DATABASE_URL` — готовая строка подключения для Prisma
- `AUTH_SECRET` — секрет Auth.js; будет сгенерирован на этапе настройки авторизации

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
