import { Component } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    @if (toast.toasts().length) {
      <div class="toast-container">
        @for (t of toast.toasts(); track t.id) {
          <div [class]="'toast toast-' + t.type" (click)="toast.remove(t.id)">
            {{ t.message }}
          </div>
        }
      </div>
    }
  `
})
export class ToastComponent {
  constructor(public toast: ToastService) {}
}
