import { Component, inject, signal } from '@angular/core';
import { WebNotificactionService } from "./web-notificaction.service";
import { JsonPipe } from "@angular/common";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [JsonPipe, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  permission = signal<NotificationPermission>("default");
  notificationService = inject(WebNotificactionService)

  notificationForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
  });

  constructor() {
    if (this.notificationService.isEnabled) {
      this.permission.set(Notification.permission)
    }
  }

  subscribe() {
    this.notificationService.requestSubscription().subscribe(() => {
      this.permission.set(Notification.permission)
    });
  }

  submit() {
    this.notificationService.sendMessage(
      this.notificationForm.value.title || '',
      this.notificationForm.value.description || ''
    ).subscribe()
  }
}
