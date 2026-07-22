-- Add the column as nullable so existing conversations can be backfilled safely.
ALTER TABLE "Conversation" ADD COLUMN "title" TEXT;

UPDATE "Conversation"
SET "title" = 'Чат'
WHERE "title" IS NULL;

ALTER TABLE "Conversation" ALTER COLUMN "title" SET NOT NULL;
