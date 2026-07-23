CREATE TYPE "ConversationType" AS ENUM ('DIRECT', 'GROUP');

ALTER TABLE "Conversation"
ADD COLUMN "type" "ConversationType" NOT NULL DEFAULT 'DIRECT',
ALTER COLUMN "title" DROP NOT NULL;

-- До этой миграции приложение поддерживало только личные диалоги.
UPDATE "Conversation"
SET "title" = NULL;

ALTER TABLE "Conversation"
ADD CONSTRAINT "Conversation_type_title_check"
CHECK (
  ("type" = 'DIRECT' AND "title" IS NULL)
  OR
  ("type" = 'GROUP' AND "title" IS NOT NULL AND BTRIM("title") <> '')
);
