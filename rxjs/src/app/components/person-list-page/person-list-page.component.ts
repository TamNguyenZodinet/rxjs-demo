import { IPagingParams } from './../../services/person.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, Injectable, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { PersonService } from 'src/app/services/person.service';
interface IPerson {
  id: string;
  name: string;
}

@Component({
  selector: 'app-person-list-page',
  templateUrl: './person-list-page.component.html',
  styleUrls: ['./person-list-page.component.scss'],
})
export class PersonListPageComponent {
  total = 1;
  users: IPerson[] = [];
  loading = true;
  pageSize = 10;
  pageIndex = 1;
  filterGender = [
    { text: 'male', value: 'male' },
    { text: 'female', value: 'female' },
  ];

  loadDataFromServer(forceUpdate?: boolean): void {
    this.loading = true;
    this.personService
      .getPersons(
        { pageIndex: this.pageIndex, pageSize: this.pageSize },
        forceUpdate
      )
      .subscribe((res: any) => {
        this.loading = false;
        this.total = res.count;
        this.users = res.data;
      });
  }

  get params(): IPagingParams {
    return { pageIndex: this.pageIndex, pageSize: this.pageSize };
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    console.log(params);
    const { pageSize, pageIndex } = params;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.loadDataFromServer(false);
  }

  constructor(private personService: PersonService) {}

  ngOnInit(): void {
    this.loadDataFromServer();
  }
}
