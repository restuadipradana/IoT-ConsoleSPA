import { KanbanTemperatureData } from './../../../_core/_models/kanban-temperature-data';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';

import { TemperatureData } from '../../../_core/_models/temperature-data';
import { TemperatureService } from '../../../_core/_services/temperature.service';

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.scss']
})
export class KanbanComponent implements OnInit, OnDestroy, AfterViewInit {

/****GAUGE PROP****/
  gaugeCap = "round"
  gaugeSize = 180
  gaugeThick = 10
  gaugeType = "arch";

  //Temperature Gauge
  gaugeValue = 0;
  gaugeLabel = "Temperature";
  gaugeAppendText = "°C";
  thresholdConfig = {
      '0': {color: 'DodgerBlue'},
      '20': {color: 'green'},
      '30': {color: 'orange'},
      '37': {color: 'tomato'},
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

  //Tile
  dateNow: any
  location: string = ''

  interval: any
  todayTemprData: any = []
  temprData: TemperatureData[]
  kanbanData: KanbanTemperatureData[] = []

  constructor(private _tempSvc: TemperatureService) { }

  ngOnInit(): void {
    const updateValues = (): void => {
      //this.getTodayData()
      //console.log('st', this.kanbanData)
      //console.log('updt')
      this.getTodayKanbanData()
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

  getTodayKanbanData() {
    this._tempSvc.getTodayTemperatureKanban().subscribe(
      (res: any) => {
        this.kanbanData = [] // CARA INI SANGAT EFEKTIF UNTUK MENGOSONGKAN OBJECT
        //console.log('st2', this.kanbanData)
        //console.log('res ', res)
        if (res.length > 0 ) {
          Object.assign(this.kanbanData, res)
          //console.log('nd', this.kanbanData)
        }
        else {
          this.kanbanData = []
        }

      },
      (error) => {
        console.log("err: ", error.error)
      }
    )
  }






  //deprecated
  getTodayData() {
    this._tempSvc.getTodayTemperature().subscribe(
      (res: any) => {
        //this.todayTemprData = res
        Object.assign(this.todayTemprData, res)
        //console.log('Four ', this.todayTemprData)
        if (this.todayTemprData.length > 0) {
          //this.gaugeValue = this.todayTemprData[this.todayTemprData.length -1].temperature
          //this.gaugeValueH = this.todayTemprData[this.todayTemprData.length -1].humidity
          //this.dateNow = new Date(this.todayTemprData[this.todayTemprData.length -1].insertAt).toLocaleTimeString()
          //this.location = this.todayTemprData[this.todayTemprData.length -1].location
        }
      },
      (error) => {
        console.log("err: ", error.error)
      }
    )
  }



}
