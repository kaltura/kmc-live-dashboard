import { Injectable } from '@angular/core';
import { Observable } from "rxjs";

@Injectable()
export class LiveEntryTimerTaskService {
  constructor() { }

  public runTimer<T>(func: ()=> Observable<T> | null, interval: number): Observable<{ errorType? : string }> {

    return Observable.create(observer => {
      let active = true;
      let timeout;

      run();

      function execute() {
        timeout = setTimeout(() => {
          run();
        }, interval);
      }

      function run(){
        let result = func();
        if (result instanceof Observable) {
          let subscription = result.subscribe(response => {
              if (active) {
                observer.next({ result: response });
                execute();
              }
              else {
                subscription.unsubscribe();
              }
            },
            reject => {
              if (active) {
                observer.next({ errorType: 'error'});
                execute();
              }
              else {
                subscription.unsubscribe();
              }
            });
        }
        else {
          if (active) {
            observer.next({ result });
              execute();
          }
        }
      }

      return () => {
        active = false;
        if (timeout) {
          clearTimeout(timeout);
        }
      }
    });
  }
}
