import { inject, Injectable } from '@angular/core';
import { SwPush } from "@angular/service-worker";
import { toSignal } from "@angular/core/rxjs-interop";
import {catchError, concatMap, EMPTY, from, of, switchMap, tap} from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class WebNotificactionService {
  #swPush = inject(SwPush)
  #http = inject(HttpClient)
  #baseUrl = 'http://localhost:3000'

  messages = toSignal(this.#swPush.messages)

  get isEnabled() {
    return this.#swPush.isEnabled;
  }

  #vapidPublicKey() {
    return this.#http.get(`${this.#baseUrl}/vapidPublicKey`, { responseType: 'text' })
  }

  #registerOnServer(params: PushSubscription) {
    return this.#http.post(`${this.#baseUrl}/notifications/subscribe`, params);
  }

  requestSubscription() {
    return this.#vapidPublicKey().pipe(
      switchMap(key =>
        from(this.#swPush.requestSubscription({
          serverPublicKey: key
        }))
      ),
      concatMap(sub => this.#registerOnServer(sub)),
      catchError((e) => {
        console.log(e)
        return EMPTY
      })
    )
  }

  sendMessage(message: Partial<{ title: string | null, description: string | null }>) {
    return this.#http.post(`${this.#baseUrl}/notifications/send`, message);
  }
}
