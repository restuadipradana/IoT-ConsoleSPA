import { NewTemperatureData } from './../_models/new-temperature-data';
import { Injectable } from '@angular/core';
import { DateRange } from '../_models/date-range';
import { TemperatureData } from '../_models/temperature-data';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseDT } from '../_models/dtModels/datatable';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TemperatureService {
  baseUrl = environment.apiUrl;
  todayTHsource = new BehaviorSubject<Object>({});
  currentTodayTH = this.todayTHsource.asObservable();

  constructor(private http: HttpClient) { }

  getTemperatureDataRange(range: DateRange){
    return this.http.post(this.baseUrl + 'sensor/get-temp-range', range);
  }

  getTodayTemperature(){
    return this.http.get<any>(this.baseUrl + 'sensor/get-today-temp');
  }

  // =============================

  //kanban
  getTodayTemperatureKanban(){
    return this.http.get<any>(this.baseUrl + 'kanban/get-kanban');
  }

  //query data
  searchData(dateRange: DateRange, locationId: string) {
    const url = this.baseUrl + 'query/search';

    return this.http
      .post<NewTemperatureData>(url, { rangeParam: dateRange, locationParam: locationId }, {});

  }

  esportExcel(dateRange: DateRange, locationId: string) {
    return this.http.post(this.baseUrl + 'query/report',{rangeParam: dateRange, locationParam: locationId},{responseType: 'blob' })
  }


  // =============================

  getTodayTemperaturePromise(){
    return this.http.get<any>(this.baseUrl + 'sensor/get-today-temp').toPromise();
  }

  loadTodayData() {
    return new Promise((resolve, reject) => {
    //An Http Get to my API to get the available languages in my application
      this.http.get<any>(this.baseUrl + 'sensor/get-today-temp').subscribe(res => {
      //Store the available languages in a data store
      console.log('load : ', res)
      this.changeDataTH(res)
      //this.updateٍSupportedLanguages(res);
      //Make the first language selected by default , you can cache the selected one and make it selected
      //this.updateSelectedLanguage(res[0]);
      resolve(true);
      })
    })
  }
  changeDataTH(data:any)
  {
    this.todayTHsource.next(data);
  }
}
