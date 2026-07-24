export const createDirectConversationKey = (firstUserId: string, secondUserId: string) => {
  return [firstUserId, secondUserId].sort().join(':');
};
