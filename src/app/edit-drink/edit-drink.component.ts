import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { DrinkService } from '../drink.service'
import { LogService, LogLevel } from '../log.service'
import { Drink } from '../../json-schema/drink'
import { StatusResponse } from '../../json-schema/statusResponse'

@Component({
  selector: 'app-edit-drink',
  templateUrl: './edit-drink.component.html',
  styleUrls: ['./edit-drink.component.css']
})
export class EditDrinkComponent implements OnInit {
  public drink?: Drink;

  constructor(
    private route: ActivatedRoute,
    private drinkService: DrinkService,
    private logService: LogService
  ) {
  }

  ngOnInit(): void {
    this.getDrinkDataForEdit()
  }

  getDrinkDataForEdit(): void {
    const drinkId = +(this.route.snapshot.paramMap.get('id') || 0)

    this.drinkService.getDataByDrinkId(drinkId)
      .subscribe(drinkJsonString => {
        if (drinkJsonString) {
          this.drink = JSON.parse(drinkJsonString);
          this.log(LogLevel.Success, `Retrieved drink data for: ${this.drink?.name}`)
        }

        if (!this.drink) {
          this.log(LogLevel.Info, `Did not find drink. Adding new drink.`)
          this.drink = new Drink();
          this.drink.id = drinkId;
        }
      });
  }

  saveDrinkData() {
    if (this.drink) {
      this.drinkService.saveDrinkData(this.drink)
        .subscribe((response: StatusResponse) => {
          this.log(LogLevel.Success, `Saved drink data for: ${this.drink?.name}`)
          this.log(LogLevel.Verbose, `response: ${JSON.stringify(response)}`)
        });
    }
  }

  log(logLevel: LogLevel, message: string) {
    this.logService.log(logLevel, message, this.constructor.name)
  }
}