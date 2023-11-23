import {Component} from '@angular/core';
import {map, Observable, switchMap} from "rxjs";
import {PersonApiService} from "./person-api.service";
import {BankAccountApiService} from "./bank-account-api.service";
import {AsyncPipe, CommonModule} from "@angular/common";

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  standalone: true,
  imports: [ AsyncPipe],
  styleUrls: ['./person.component.scss']
})
export class PersonComponent {
  private is18OrOlder$: Observable<boolean> = this.personAPiService
    .getPerson()
    .pipe(map((person) => person.age >= 18));

  public richKid$: Observable<string> = this.is18OrOlder$.pipe(
    switchMap((is18OrOlder) =>
      this.bankAccountService.getBankAccount().pipe(
        map((bankAccount) => {
          if (!is18OrOlder && bankAccount.balance >= 50_000) {
            return '$$$ RICH KID $$$';
          } else if (!is18OrOlder && bankAccount.balance < 50_000) {
            return 'Just a normal Kid :)';
          }
          return 'You are old. T_T';
        })
      )
    )
  );

  constructor(
    private personAPiService: PersonApiService,
    private bankAccountService: BankAccountApiService
  ) {
  }
}
