import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';

export enum API_MODE {
   OPEN = 'open',
   CLOSED = 'closed'
}
export enum API_METHOD {
  GET = 'get',
  UPDATE = 'update',
  CREATE = 'create'
}

@Injectable({
  providedIn: 'root'
})
export class ApiManagerService {
  private endPoint = 'https://3j1b7pw3nd.execute-api.eu-central-1.amazonaws.com'; // prod
  // private endPoint = 'https://vr0uojtaa1.execute-api.eu-central-1.amazonaws.com' // testing


  constructor(private http: HttpClient) { }

  get(mode: API_MODE, method: API_METHOD, restOfPath: string, params: HttpParams): Observable<object>{
    const header = new HttpHeaders();
    header.append('Authorization', null);

    const resp = this.http.get(`${this.endPoint}/${mode}/${method}/${restOfPath}`, {
      params,
      headers: header
    });
    return resp;
  }

  post(mode: API_MODE, method: API_METHOD, restOfPath: string, params: HttpParams, body: any): Observable<object>{
    const header = new HttpHeaders();

    const resp = this.http.post(`${this.endPoint}/${mode}/${method}/${restOfPath}`, JSON.stringify(body), {
        headers: header,
        params
    });

    return resp;
  }
}
