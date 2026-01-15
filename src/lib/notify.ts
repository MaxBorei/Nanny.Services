import { Notify } from "notiflix/build/notiflix-notify-aio";

export function notifyLoginRequired(): void {
  Notify.info("This feature is available only for logged-in users");
}
