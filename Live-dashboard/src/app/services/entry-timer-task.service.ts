import { Injectable } from '@angular/core';
import { Observable } from "rxjs";

@Injectable()
export class LiveEntryTimerTaskService {
  constructor() { }

  public runTimer<T>(func: ()=> Observable<T> | null, interval: number): Observable<{ errorType? : string }> {

    return Observable.create(observer => {
      let active = true;
      let timeout;
      let subscription;

      run();

      function execute() {
        timeout = setTimeout(() => {
          timeout = null;
          run();
        }, interval);
      }

      function run(){
        let result = func();
        if (result instanceof Observable) {
          subscription = result.subscribe(
            response => {
              subscription = null;
              if (active) {
                observer.next({ result: response });
                execute();
              }
            },
            reject => {
              subscription = null;
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
      }

      return () => {
        active = false;
        if (timeout) {
          clearTimeout(timeout);
        }
        if (subscription){
          subscription.unsubscribe();
        }
      }
    });
  }
}
