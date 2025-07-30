export interface ChatMessage {
  id: number;
  message: string;
  response: string;
  timestamp: Date;
  user_id: number;
}
