import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';
import { Observable , of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { map , catchError} from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';

import { ProcessHTTPMsgService } from '../services/process-httpmsg.service';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor(private http : HttpClient , private processHttpMsgService : ProcessHTTPMsgService) { }

  getLeaders(): Observable<Leader[]>{
    return this.http.get<Leader[]>(baseURL + 'leadership')
      .pipe(catchError(this.processHttpMsgService.handleError));
  }
  getFeaturedLeader() : Observable<Leader> {
    return this.http.get<Leader>(baseURL + 'leadership?featured=true')
      .pipe(map(dishes => dishes[0]))
      .pipe(catchError(this.processHttpMsgService.handleError));
  }
}
