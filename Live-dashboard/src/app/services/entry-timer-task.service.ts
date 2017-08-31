import { Injectable } from '@angular/core';
import { Observable } from "rxjs";

@Injectable()
export class LiveEntryTimerTaskService {
  constructor() { }

  public runTimer<T>(func: ()=> Observable<T> | null, interval: number): Observable<{ errorType? : string }> {

    return Observable.create(observer => {
      let active = true;
      let timeout;

      const firstRunResult = func();
      if (firstRunResult instanceof Observable) {
        firstRunResult.subscribe(response => {
          observer.next({ result: response });
        },
        reject => {
          observer.next({ errorType: 'error' });
        })
      }
      else {
        observer.next({ firstRunResult });
      }

      function execute() {
        timeout = setTimeout(() => {
          const result = func();
          if (result instanceof Observable) {
            result.subscribe(response => {
                if (active) {
                  observer.next({ result: response });
                  execute();
                }
              },
              reject => {
                if (active) {
                  observer.next({ errorType: 'error'});
                  execute();
                }
              });
          }
          else {
            if (active) {
              observer.next({ result });
              execute();
            }
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
