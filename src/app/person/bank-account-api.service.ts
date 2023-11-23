import {Injectable} from '@angular/core';
import {of} from 'rxjs';

@Injectable({providedIn: 'root'})
export class BankAccountApiService {
  public getBankAccount() {
    return of({balance: 100_000});
  }

  constructor() {
  }
}
