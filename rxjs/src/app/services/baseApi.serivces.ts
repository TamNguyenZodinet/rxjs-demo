import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BaseApiService {
  notificationErrorTitle = '';

  constructor(public http: HttpClient) {}
}
