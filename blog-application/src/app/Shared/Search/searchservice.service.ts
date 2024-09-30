import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchserviceService {

  constructor() { }

  private searchQuery = new BehaviorSubject<string>('');
  currentSearchQuery = this.searchQuery.asObservable();

  updateSearchQuery(query: string) {
    this.searchQuery.next(query);
  }
}