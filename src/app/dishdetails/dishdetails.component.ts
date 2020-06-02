import { Component, OnInit, ViewChild , Inject} from '@angular/core';
import { Dish } from '../shared/dish';
import { Comment } from '../shared/comment'; 

import { ActivatedRoute ,Params } from '@angular/router';
import { Location } from '@angular/common';

import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { FormBuilder , FormGroup , Validators, Form } from '@angular/forms';


@Component({
  selector: 'app-dishdetails',
  templateUrl: './dishdetails.component.html',
  styleUrls: ['./dishdetails.component.scss']
})

export class DishdetailsComponent implements OnInit {

  @ViewChild('cform') commentFormDirective;

  commentForm : FormGroup;
  comment: Comment;

  dish : Dish;
  dishIds: string[];
  prev: string;
  next: string;
  errMess : string;

  constructor( private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject('BaseURL') private BaseURL) { 
      this.createForm();
    }

    formErrors = {
      'author': '',
      'comment' : '',
      'rating' : 5,
    };
  
    validationMessages = {
      'author': {
        'required':      'Author Name is required.',
        'minlength':     'Author Name must be at least 2 characters long.',
        'maxlength':     'Author Name cannot be more than 25 characters long.'
      },
      'comment': {
        'required':      'Comment is required.'
      },
    };  

  ngOnInit() {
    this.createForm();

    this.dishservice.getDishIds()
    .subscribe(dishIds => this.dishIds = dishIds);
    
    this.route.params
    .pipe(switchMap((params: Params) => this.dishservice.getDish(params['id'])))
    .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); } , errmess => this.errMess = <any>errmess);
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack() : void {
    this.location.back();
  }

  createForm(){
    this.commentForm = this.fb.group({
      author: ['', [Validators.required,Validators.minLength(2),Validators.maxLength(25)]],
      comment: ['' , Validators.required],
      rating:5
    });
    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  onValueChanged(data? : any){
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }

  }

  onSubmit() {
    this.comment = this.commentForm.value;
    this.comment.date = new Date().toISOString();
    this.dish.comments.push(this.comment);
    console.log(this.comment);
    this.commentForm.reset({
      author: '',
      comment: '',
      rating:5

    });
    this.commentFormDirective.resetForm();
  }
}
