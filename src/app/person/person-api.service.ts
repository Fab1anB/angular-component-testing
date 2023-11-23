import {Injectable} from '@angular/core';
import {of} from 'rxjs';

@Injectable({providedIn: 'root'})
export class PersonApiService {
  constructor() {
  }

  public getPerson() {
    return of({name: 'Alex', age: 17, hobby: 'soccer'});
  }
}
