import { Injectable } from '@angular/core';
import { Promotion } from '../shared/promotion';
import { Observable , of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { map , catchError} from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';

import { ProcessHTTPMsgService } from '../services/process-httpmsg.service';


@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor(private http : HttpClient , private processHttpMsgService : ProcessHTTPMsgService) { }

  getPromotions() : Observable<Promotion[]>{
    return this.http.get<Promotion[]>(baseURL + 'promotions')
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getPromotion(id : String ) : Observable<Promotion>{
    return this.http.get<Promotion>(baseURL + 'promotions/'+ id)
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

  getFeaturedPromotion() : Observable<Promotion> {
    return this.http.get<Promotion>(baseURL + 'promotions?featured=true')
      .pipe(map(promotions => promotions[0]))
      .pipe(catchError(this.processHttpMsgService.handleError));
  }

}
