import { Injectable } from '@angular/core';
import { Observable } from "rxjs";

@Injectable()
export class LiveEntryTimerTaskService {
  constructor() { }

  public runTimer(func: ()=> Observable<void> | null, interval: number): Observable<{ status : string }> {

    return Observable.create(observer => {
      let active = true;
      let timeout;

      function execute() {
        timeout = setTimeout(() => {
          const result = func();
          if (result instanceof Observable) {
            result.subscribe(
              response => {
                if (active) execute();
              },
              reject => {
                if (active) execute();
              })
          }
          else {
            if (active) execute();
          }
        }, interval);
      }

      execute();

      return () => {
        active = false;
        if (timeout) {
          clearTimeout(timeout);
        }
      }
    });
  }
}
