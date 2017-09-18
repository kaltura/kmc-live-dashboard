import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { KalturaAPIException } from "kaltura-typescript-client";

@Injectable()
export class LiveEntryTimerTaskService {
  constructor() { }

  public runTimer<T>(func: ()=> Observable<T> | null, interval: number, isImmediate = false): Observable<{ error?: string | KalturaAPIException }> {

    return Observable.create(observer => {
      let active = true;
      let timeout;
      let subscription;

      if (isImmediate) {
        run()
      }
      else {
        execute();
      }

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
                observer.next({ error: reject });
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
