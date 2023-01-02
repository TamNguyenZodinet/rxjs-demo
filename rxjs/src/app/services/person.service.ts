import { Injectable } from '@angular/core';
import { map, Observable, ReplaySubject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

export interface IPerson {
  id: string;
  name: string;
}

export interface IPagedResult<T> {
  data: Array<T>;
  count: number;
}

export interface IPagingParams {
  pageSize: number;
  pageIndex: number;
}

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  // Key - value
  private subjectMap: Map<string, ReplaySubject<IPagedResult<IPerson>>> =
    new Map();

  apiUrl = 'https://627536705dc4f5764ba0a454.mockapi.io/api/v1';
  constructor(private http: HttpClient) {}

  getPersons(
    params: IPagingParams,
    forceUpdate?: boolean
  ): Observable<IPagedResult<IPerson>> {
    const subjectKey: string = JSON.stringify(params);

    if (!this.subjectMap.has(subjectKey)) {
      this.subjectMap.set(
        subjectKey,
        new ReplaySubject<IPagedResult<IPerson>>(1)
      );
      this.fetchTimes(params);
    }

    if (forceUpdate) {
      this.fetchTimes(params);
    }

    // We know that the subject exists here so we cast it since it CANNOT be undefined
    const subject$: ReplaySubject<IPagedResult<IPerson>> = this.subjectMap.get(
      subjectKey
    ) as ReplaySubject<IPagedResult<IPerson>>;

    return subject$.asObservable();
  }

  private fetchTimes(params: IPagingParams): void {
    const cacheKey: string = JSON.stringify(params);

    this.get<IPagedResult<IPerson>>('person', {
      page: params.pageIndex,
      limit: params.pageSize,
    } as any)
      .pipe(
        map((response: IPagedResult<IPerson>) => {
          const subject$: ReplaySubject<IPagedResult<IPerson>> | undefined =
            this.subjectMap.get(cacheKey);
          subject$?.next(response);
        })
      )
      // fires only once (http get)
      // eslint-disable-next-line rxjs/no-ignored-subscription
      .subscribe();
  }

  public get<T>(
    endPoint: string,
    params?:
      | HttpParams
      | {
          [param: string]: string | string[];
        }
  ): Observable<T> {
    // const lang = this.getLang();
    const url = `${this.apiUrl}/${endPoint}`;
    return this.http.get<T>(`${url}`, { params: params });
  }

  public post<T>(
    endPoint: string,
    data: any,
    params?:
      | HttpParams
      | {
          [param: string]: string | string[];
        }
  ): Observable<T> {
    // const lang = this.getLang();
    const url = `${this.apiUrl}/${endPoint}`;
    // let headers = new HttpHeaders();
    // headers = headers.set('Accept-Language', lang);
    return this.http.post<T>(`${url}`, data, { params });
  }

  public put<T>(
    endPoint: string,
    data: any,
    params?:
      | HttpParams
      | {
          [param: string]: any | any[];
        }
  ): Observable<T> {
    const url = `${this.apiUrl}/${endPoint}`;
    return this.http.put<T>(`${url}`, data, {
      params: params,
    });
  }

  public delete<T>(
    endPoint: string,
    params?:
      | HttpParams
      | {
          [param: string]: string | string[];
        }
  ): Observable<T> {
    const url = `${this.apiUrl}/${endPoint}`;
    return this.http.delete<T>(`${url}`);
  }
}
