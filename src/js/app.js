import Messages from "./Messages";
import { ajax } from "rxjs/ajax";
import { catchError, map, mergeMap } from "rxjs/operators";
import { interval } from "rxjs";
import { format } from "date-fns"

const messages = new Messages();
const unreadMessage = [];

const pollingInterval$ = interval(10000);

pollingInterval$
  .pipe(
    mergeMap(() =>
      ajax.getJSON("http://localhost:9000/messages/unread").pipe(
        map((response) => {
          if (response.status === "ok") {
            return response;
          } else {
            throw new Error(`HHTP Error: ${response.status}`);
          }
        }),
        catchError((error) => {
          console.error("Ошибка запроса: ", error);
          messages.setStatus("error");
          return { messages: [] };
        }),
      ),
    ),
  )
  .subscribe({
    next: (event) => {
      const existingIds = new Set(unreadMessage.map((item) => item.id));
      const arrayMessage = event.messages;
      const newMessages = arrayMessage.filter(
        (item) => !existingIds.has(item.id),
      );
      if (newMessages.length === 0) {
        messages.showError("Нет новых непрочитанных");
        setTimeout(() => messages.clearError(), 4000);
      }
      newMessages.map((message) => {
        unreadMessage.push(message);
        const { from, subject, received } = message;
        const date = new Date(received);
        messages.createElementMessage(from, subject, format(date, 'HH:mm dd.MM.yyyy'));
      });
    },
    error: (error) => {
      console.error("Необработанная ошибка: ", error);
    },
  });
