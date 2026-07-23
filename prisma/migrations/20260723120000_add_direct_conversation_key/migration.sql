ALTER TABLE "Conversation"
ADD COLUMN "directKey" TEXT;

-- A DIRECT conversation must represent exactly one pair of users.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM "Conversation" AS conversation
    LEFT JOIN "ConversationParticipant" AS participant
      ON participant."conversationId" = conversation."id"
    WHERE conversation."type" = 'DIRECT'
    GROUP BY conversation."id"
    HAVING COUNT(participant."id") <> 2
  ) THEN
    RAISE EXCEPTION 'Cannot backfill directKey: a DIRECT conversation does not have exactly two participants';
  END IF;
END;
$$;

-- Store the same key for a pair regardless of which user initiated the chat.
UPDATE "Conversation" AS conversation
SET "directKey" = participant_pair."directKey"
FROM (
  SELECT
    participant."conversationId",
    string_agg(
      participant."userId",
      ':' ORDER BY participant."userId"
    ) AS "directKey"
  FROM "ConversationParticipant" AS participant
  GROUP BY participant."conversationId"
) AS participant_pair
WHERE conversation."id" = participant_pair."conversationId"
  AND conversation."type" = 'DIRECT';

CREATE UNIQUE INDEX "Conversation_directKey_key"
ON "Conversation"("directKey");

ALTER TABLE "Conversation"
ADD CONSTRAINT "Conversation_direct_key_check"
CHECK (
  ("type" = 'DIRECT' AND "directKey" IS NOT NULL)
  OR
  ("type" = 'GROUP' AND "directKey" IS NULL)
);
