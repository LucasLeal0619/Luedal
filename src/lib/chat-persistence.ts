export function messagePair(conversationId: string, userId: string, message: string, answer: string, time: number) {
  // Bulk inserts share one column set: every row must explicitly supply required timestamps.
  return [
    {conversation_id:conversationId,user_id:userId,role:"user",content:message,created_at:new Date(time).toISOString()},
    {conversation_id:conversationId,user_id:userId,role:"assistant",content:answer.slice(0,12000),created_at:new Date(time+1).toISOString()},
  ];
}