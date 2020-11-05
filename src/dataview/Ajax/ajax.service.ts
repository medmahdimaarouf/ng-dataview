import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry, catchError, map } from 'rxjs/operators';

export interface AjaxSettings {
  url: string,
  headers?: HttpHeaders | { [header: string]: string | string[] },
  body: any,
  params?: HttpParams | {
    [param: string]: string | string[];
  },
  method?: "GET" | "POST" | "PUT" | "DELETE",
  parse(response): Array<Array<String | Object>>,
  error?(error): void,
}

@Injectable({
  providedIn: 'root'
})

export class AjaxService {
  pipe = (
    map((res: Response) => {
      return res || {}
    })
  );
  constructor(private http: HttpClient) { }
  send(settings: AjaxSettings) {
    var method: Function;
    switch (settings.method) {
      case "GET": method = this.http.get; break;
      case "POST": method = this.http.post; break;
      case "PUT": method = this.http.put; break;
      case "DELETE": method = this.http.delete; break;
      default: method = this.http.get;
    }

    return method(settings.url, { headers: settings.headers || new HttpHeaders().set('Content-Type', 'application/json'), params: settings.params }).pipe(this.pipe).subscribe(
      response => {
        return settings.parse ? settings.parse(response) : response;
      },
      error => {
        return settings.error ? settings.parse(error) : error;
      }
    );
  }
}
