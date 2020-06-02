import { Component, OnInit , Inject} from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  dishes : Dish[];
  errMess : string;

  constructor(private dishServise : DishService , @Inject('BaseURL') private BaseURL) { }

  ngOnInit() {
    this.dishServise.getDishes()
    .subscribe(dishes => this.dishes = dishes , errmess => this.errMess = <any>errmess);
  }

}
