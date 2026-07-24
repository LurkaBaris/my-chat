
## Критичные замечания
### C1. Разные критерии «авторизован» → возможна петля редиректов

| Место | Критерий |
|-------|----------|
| `src/_app/proxy/proxy.ts:8` | `Boolean(request.auth)` |
| `app/(auth)/layout.tsx:9` | `session?.user` |
| `app/chat/layout.tsx:13` | `isAuthUser` (нужен непустой `id`) |

Если cookie сессии есть, а `user.id` нет: proxy пускает на `/chat` → layout шлёт на `/login` → auth-layout видит `session.user` и шлёт обратно на `/chat` → **цикл**.

**Воспроизведено** при открытии `http://localhost:3000/` в среде ревью: `net::ERR_TOO_MANY_REDIRECTS`.

**Фикс:** везде один критерий — `isAuthUser(session?.user)` / в proxy: непустой `request.auth?.user?.id`.

---

### C2. Смена беседы не сбрасывает клиентский стейт ленты

**Файл:** `src/widgets/chat-messages/ui/ChatMessagesWidget.tsx:28`, `:88-105`  
**Страница:** `app/chat/[conversationId]/page.tsx:37-42` — нет `key={conversation.id}`.

`liveMessages = useState(messages)` инициализируется один раз. Soft-navigation `/chat/A` → `/chat/B` внутри layout переиспользует виджет: EventSource переподключается к B, а на экране остаются сообщения A (+ новые события B). `isInitialScrollRef` тоже не сбрасывается.

То же семейство: `MessageComposer` не сбрасывает draft при смене `conversationId` (`defaultValues` только на mount).

**Фикс:** `key={conversation.id}` на виджете/composer **или** `useEffect` сброса при смене id/`messages`.

---

### C3. README всё ещё про polling — критерий 3.1 не выполнен

**Файл:** `README.md:3-5`

> «На первом этапе сообщения будут обновляться через polling, дальше при необходимости можно перейти на SSE…»

SSE уже в коде, в README — нет. RoadMap 3.1 требует коротко: зачем SSE, vs polling/WebSocket, лимит in-memory на один процесс.


### C4. Поправить точки с запятой притером во всех файлах, в task-manager тоже
---


## Средние замечания

### M1. Нет catch-up после reconnect SSE
`EventSource` сам переподключается, но нет `Last-Event-ID`, replay и refetch из Postgres при `open`/`onerror`. Сообщения за время обрыва пропадут из UI до F5. Источник истины — БД, клиент это не использует при восстановлении.

### M2. Нет `eventSource.onerror`
При `401`/`403` (истекла сессия, выгнали из беседы) браузер будет бесконечно ретраить stream без UI и без `close()`.

### M3. Auth-layout vs proxy (связано с C1)
Даже без полного цикла: двойной hop `/` → `/chat` → `/login` для гостя; избыточный `redirect` в `app/page.tsx` при уже работающем proxy.

### M4. FSD: entity → entity
`entities/conversation/model/types.ts` и `chatListEventSchema` тянут `@/entities/message`. Лучше общий тип/схему в `shared` или опустить зависимость.

