import { Component, OnInit, OnDestroy, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { TemperatureService } from '../../../_core/_services/temperature.service';
import { KanbanTemperatureData } from './../../../_core/_models/kanban-temperature-data';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-warning-window',
  templateUrl: './warning-window.component.html',
  styleUrls: ['./warning-window.component.scss']
})
export class WarningWindowComponent implements OnInit, OnDestroy, AfterViewInit {

  id_data: any
  kanbanData: KanbanTemperatureData
  datenow: any
  interval: any
  warning_id: string //by loc id
  public onClose: Subject<string>;

  /****GAUGE PROP****/
  gaugeCap = "round"
  gaugeSize = 505
  gaugeThick = 25
  gaugeType = "arch";

  //Temperature Gauge
  gaugeValue = 0;
  gaugeLabel = "Temperature";
  gaugeAppendText = "°C";
  thresholdConfig = {
      '0': {color: 'orange'},
      '20': {color: 'green'},
      '31': {color: 'orange'},
  };

  //Humidity Gauge
  gaugeValueH = 0;
  gaugeLabelH = "Humidity";
  gaugeAppendTextH = "%";
  thresholdConfigH = {
      '0': {color: 'orange'},
      '25': {color: 'green'},
      '70': {color: 'orange'},
  };
  /****GAUGE-PROP****/

  constructor(private _tempSvc: TemperatureService, public bsModalRef: BsModalRef, public datepipe: DatePipe) { }

  ngOnInit(): void {
    console.log('sm' , this.warning_id)
    this.onClose = new Subject();

    const updateValues = (): void => {
      //console.log(1)
      this.getTodayData()
    };
    const INTERVAL: number = 10000;
    this.interval = setInterval(updateValues, INTERVAL);
    updateValues();
  }

  ngOnDestroy(): void {
    //console.log('destroy')
    clearInterval(this.interval);
  }

  ngAfterViewInit(): void {
  }

  getTodayData() {
    this._tempSvc.getSingleData(this.id_data).subscribe(
      (res: any) => {
        this.kanbanData = res
        if(((new Date).getTime() - new Date(this.kanbanData.lastAcknowledgeDate).getTime()) < 3600000 ) {
          this.modalClose() //dibawah sejam
        }
      },
      (error) => {
        console.log("err: ", error)
      }
    )
  }

  setAckDate() {
    this.datenow = new Date()
    let latest_date =this.datepipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss')
    this._tempSvc.setAck(this.id_data, latest_date).subscribe(
      () => {
          this.modalClose()
      },
      (error) => {
        console.log("err: ", error)
      }
    )
  }

  modalClose() {
    this.onClose.next(this.warning_id);
    this.bsModalRef.hide();
  }



}
