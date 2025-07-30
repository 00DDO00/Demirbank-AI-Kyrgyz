import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ChatMessage } from '../models/chat-message';

export interface SendMessageRequest {
  message: string;
}

export interface SendMessageResponse {
  success: boolean;
  data: ChatMessage;
}

export interface ChatHistoryResponse {
  success: boolean;
  data: {
    messages: ChatMessage[];
    total: number;
    page: number;
    totalPages: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private apiService: ApiService) {}

  sendMessage(message: string): Observable<SendMessageResponse> {
    return this.apiService.post<SendMessageResponse>('/chat/sendMessage', {
      message,
    });
  }

  getChatHistory(
    page: number = 1,
    limit: number = 20
  ): Observable<ChatHistoryResponse> {
    return this.apiService.get<ChatHistoryResponse>(
      `/chat/history?page=${page}&limit=${limit}`
    );
  }
}
