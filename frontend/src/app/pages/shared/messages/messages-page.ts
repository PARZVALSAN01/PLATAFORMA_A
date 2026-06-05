import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DashboardLayoutComponent } from '../../../components/dashboard-layout/dashboard-layout';
import { ContentService } from '../../../services/content.service';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-messages-page',
  standalone: true,
  imports: [DashboardLayoutComponent, FormsModule, DatePipe],
  template: `
    <app-dashboard-layout>
      <div class="page-header">
        <h1 class="page-title">Mensajes</h1>
        <button class="btn btn-primary" (click)="showCompose = true">+ Nuevo Mensaje</button>
      </div>

      @if (messages.length) {
        <div class="messages-list">
          @for (m of messages; track m.id) {
            <div class="card message-card" (click)="selected = m">
              <div class="message-from">{{ userName(m.sender) || 'Sin remitente' }}</div>
              <div class="message-subject">{{ m.subject }}</div>
              <div class="message-date">{{ m.createdAt | date:'dd/MM/yyyy HH:mm' }}</div>
            </div>
          }
        </div>
      } @else {
        <div class="empty card" style="padding:3rem;text-align:center;color:var(--gray-400);">No hay mensajes.</div>
      }

      @if (selected) {
        <div class="modal-overlay" (click)="selected = null">
          <div class="modal card" (click)="$event.stopPropagation()">
            <div class="modal-header"><h2>{{ selected.subject }}</h2><button class="modal-close" (click)="selected = null">✕</button></div>
            <div style="padding:1.5rem;">
              <p class="msg-from">De: {{ userName(selected.sender) }}</p>
              <p class="msg-from">Para: {{ userName(selected.recipient) }}</p>
              <p class="msg-body">{{ selected.content }}</p>
            </div>
          </div>
        </div>
      }

      @if (showCompose) {
        <div class="modal-overlay" (click)="showCompose = false">
          <div class="modal card" (click)="$event.stopPropagation()">
            <div class="modal-header"><h2>Nuevo Mensaje</h2><button class="modal-close" (click)="showCompose = false">✕</button></div>
            <form (ngSubmit)="sendMessage()" class="form-stack" style="padding:1.5rem;">
              <div class="form-group"><label class="form-label">Destinatario (ID)</label><input type="number" class="form-input" [(ngModel)]="compose.recipientId" name="to" required></div>
              <div class="form-group"><label class="form-label">Asunto</label><input class="form-input" [(ngModel)]="compose.subject" name="subj" required></div>
              <div class="form-group"><label class="form-label">Mensaje</label><textarea class="form-input" [(ngModel)]="compose.content" name="msg" rows="5" required></textarea></div>
              <button type="submit" class="btn btn-primary w-full">Enviar</button>
            </form>
          </div>
        </div>
      }
    </app-dashboard-layout>
  `,
  styles: [`
    .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
    .page-title { font-size: 1.5rem; font-weight: 700; color: var(--gray-800); }
    .messages-list { display: flex; flex-direction: column; gap: 0.5rem; }
    .message-card { display: grid; grid-template-columns: 1fr 2fr auto; gap: 1rem; padding: 1rem 1.25rem; cursor: pointer; align-items: center;
      &:hover { background: var(--gray-50); }
      .message-from { font-weight: 600; font-size: 0.875rem; color: var(--gray-800); }
      .message-subject { font-size: 0.875rem; color: var(--gray-600); }
      .message-date { font-size: 0.75rem; color: var(--gray-400); white-space: nowrap; }
    }
    .form-stack { display: flex; flex-direction: column; gap: 1rem; }
    .w-full { width: 100%; }
    .msg-from { font-size: 0.8125rem; color: var(--gray-400); margin-bottom: 1rem; }
    .msg-body { color: var(--gray-600); line-height: 1.7; }
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1rem; }
    .modal { width: 100%; max-width: 550px; }
    .modal-header { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--gray-200);
      h2 { font-size: 1.125rem; font-weight: 600; }
      .modal-close { background: none; border: none; font-size: 1.25rem; cursor: pointer; color: var(--gray-400); }
    }
  `]
})
export class MessagesPageComponent implements OnInit {
  messages: any[] = [];
  selected: any = null;
  showCompose = false;
  compose = { recipientId: 0, subject: '', content: '' };

  constructor(private content: ContentService, private toast: ToastService) {}

  ngOnInit() { this.content.getMessages().subscribe({ next: d => this.messages = d?.content || d || [], error: () => {} }); }

  sendMessage() {
    if (!this.compose.recipientId || !this.compose.subject || !this.compose.content) {
      this.toast.show('Completa todos los campos', 'error'); return;
    }
    const payload = {
      recipient: { id: this.compose.recipientId },
      subject: this.compose.subject,
      content: this.compose.content
    };
    this.content.sendMessage(payload).subscribe({
      next: () => { this.toast.show('Mensaje enviado', 'success'); this.showCompose = false; this.ngOnInit(); },
      error: () => this.toast.show('Error al enviar', 'error')
    });
  }

  userName(user: any): string {
    return user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '';
  }
}
