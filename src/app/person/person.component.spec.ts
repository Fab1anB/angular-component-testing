import {ComponentFixture, TestBed} from "@angular/core/testing";
import {PersonComponent} from "./person.component";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {firstValueFrom, of} from "rxjs";
import {BankAccountApiService} from "./bank-account-api.service";
import {PersonApiService} from "./person-api.service";
import {CommonModule} from "@angular/common";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {AppModule} from "../app.module";

class BankAccountApiServiceMock {
  getBankAccount() {
    return of({
      balance: 50_000
    });
  }
}

class PersonApiServiceMock {
  getPerson() {
    return of({
      age: 18, name: 'Random', hobby: 'tennis'
    });
  }
}


describe('PersonComponent', () => {
  let component: PersonComponent;
  let fixture: ComponentFixture<PersonComponent>;


  async function init(setup?: ({bankAccountApiService, personApiService}:
                                 {
                                   bankAccountApiService: BankAccountApiService,
                                   personApiService: PersonApiService
                                 }) => void) {
    let bankAccountApiService = new BankAccountApiServiceMock();
    let personApiService = new PersonApiServiceMock();

    if (setup) {
      setup({bankAccountApiService, personApiService});
    }

    await TestBed.configureTestingModule({
      imports: [AppModule],
      providers: [
        {provide: BankAccountApiService, useValue: bankAccountApiService},
        {provide: PersonApiService, useValue: personApiService},
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PersonComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    return {bankAccountApiService, personApiService, component, fixture};
  }

  it('should create', async () => {
    await init();
    expect(component).toBeTruthy();
  });

  describe('#richKid$', () => {
    it('should return normal kid, when person is under 18 and has less than 50k on bank account', async () => {
      // setup
      const {component} = await init(({bankAccountApiService, personApiService}) => {
        spyOn(bankAccountApiService, 'getBankAccount').and.returnValue(of({balance: 20_000}));
        spyOn(personApiService, 'getPerson').and.returnValue(of({name: 'Alex', age: 17, hobby: 'soccer'}));
      });

      // execute
      const result = await firstValueFrom(component.richKid$);

      // assert
      expect(result).toEqual('Just a normal Kid :)');
    });

    it('should return rich kid, when person is under 18 and has more than 50k on bank account', async () => {
      // setup
      const {component} = await init(({bankAccountApiService, personApiService}) => {
        spyOn(bankAccountApiService, 'getBankAccount').and.returnValue(of({balance: 100_000}));
        spyOn(personApiService, 'getPerson').and.returnValue(of({name: 'Alex', age: 17, hobby: 'soccer'}));
      });

      // execute
      const result = await firstValueFrom(component.richKid$);

      // assert
      expect(result).toEqual('$$$ RICH KID $$$');
    });

    it('should return you are old when person is 18 or older', async () => {
      // setup
      const {component} = await init(({bankAccountApiService, personApiService}) => {
        spyOn(bankAccountApiService, 'getBankAccount').and.returnValue(of({balance: 100_000}));
        spyOn(personApiService, 'getPerson').and.returnValue(of({name: 'Alex', age: 18, hobby: 'soccer'}));
      });

      // execute
      const result = await firstValueFrom(component.richKid$);

      // assert
      expect(result).toEqual('You are old. T_T');
    });
  });
});

