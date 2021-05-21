import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }

  get(domain: string, pathToFile: string): Promise<any>{

    return new Promise((resolve, reject) => {
      this.http.get(`${domain}${pathToFile}`).subscribe({
        next: res => resolve(res),
        error: err => reject(err)
      });
    });

  }
}
