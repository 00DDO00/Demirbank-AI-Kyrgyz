import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ChatService } from '../../../services/chat.service';
import { ChatMessage } from '../../../models/chat-message';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatePipe, CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-interface',
  templateUrl: './chat-interface-ky.component.html',
  styleUrls: ['./chat-interface.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    DatePipe,
  ],
})
export class ChatInterfaceComponent implements OnInit, AfterViewChecked {
  @ViewChild('messageContainer') messageContainer!: ElementRef;

  messageForm: FormGroup;
  messages: ChatMessage[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private chatService: ChatService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.messageForm = this.fb.group({
      message: ['', [Validators.required, Validators.minLength(1)]],
    });
  }

  ngOnInit(): void {
    this.loadChatHistory();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop =
        this.messageContainer.nativeElement.scrollHeight;
    } catch (err) {
      // Handle error
    }
  }

  private loadChatHistory(): void {
    this.chatService.getChatHistory().subscribe({
      next: (response) => {
        this.messages = response.data.messages.reverse(); // Show newest first
      },
      error: (error) => {
        console.error('Error loading chat history:', error);
        this.snackBar.open('Failed to load chat history', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  sendMessage(): void {
    if (this.messageForm.valid && !this.isLoading) {
      const message = this.messageForm.get('message')?.value.trim();
      if (!message) return;

      this.isLoading = true;
      this.messageForm.get('message')?.disable();

      this.chatService.sendMessage(message).subscribe({
        next: (response) => {
          this.messages.push(response.data);
          this.messageForm.reset();
          this.snackBar.open('Message sent successfully!', 'Close', {
            duration: 2000,
          });
        },
        error: (error) => {
          console.error('Error sending message:', error);
          this.snackBar.open(
            'Failed to send message. Please try again.',
            'Close',
            { duration: 5000 }
          );
        },
        complete: () => {
          this.isLoading = false;
          this.messageForm.get('message')?.enable();
        },
      });
    }
  }

  onEnterPress(event: any): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.snackBar.open('Logged out successfully', 'Close', { duration: 2000 });
  }
}
