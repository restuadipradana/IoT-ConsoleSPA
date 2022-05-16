import { KanbanTemperatureData } from './../../../_core/_models/kanban-temperature-data';
import { Component, OnInit, OnDestroy, AfterViewInit, TemplateRef  } from '@angular/core';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { TemperatureData } from '../../../_core/_models/temperature-data';
import { TemperatureService } from '../../../_core/_services/temperature.service';
import { WarningWindowComponent } from '../warning-window/warning-window.component';

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.scss']
})
export class KanbanComponent implements OnInit, OnDestroy, AfterViewInit {

  activeModal: boolean[] = [];
  modalRef: BsModalRef[] = [];
  config = {
    keyboard: false
  };

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

  //Tile
  dateNow: any
  location: string = ''

  interval: any
  todayTemprData: any = []
  temprData: TemperatureData[]
  kanbanData: KanbanTemperatureData[] = []

  shouldDanger: boolean

  constructor(private _tempSvc: TemperatureService, private modalService: BsModalService  ) { }

  ngOnInit(): void {
    //this.getTodayKanbanData()

    const updateValues = (): void => {
      this.getTodayKanbanData()
      console.log('mod', this.activeModal)
    };
    const INTERVAL: number = 5000;
    this.interval = setInterval(updateValues, INTERVAL);
    updateValues();
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  ngAfterViewInit(): void {
  }

  getTodayKanbanData() {
    this._tempSvc.getTodayTemperatureKanban().subscribe(
      (res: any) => {
        this.kanbanData = [] // CARA INI SANGAT EFEKTIF UNTUK MENGOSONGKAN OBJECT
        if (res.length > 0 ) {
          Object.assign(this.kanbanData, res)
          this.kanbanData.forEach((e, idx) => {
            e.isDanger = this.isDanger(e.temperature, e.minTemperature, e.maxTemperature, e.humidity, e.minHumidity, e.maxHumidity)
          })
          this.showWarning();
        }
        else {
          this.kanbanData = []
        }
      },
      (error) => {
        console.log("err: ", error)
      }
    )
  }

  showWarning() {
    this.kanbanData.forEach((e) => {
      if(e.isDanger && ((new Date).getTime() - new Date(e.lastAcknowledgeDate).getTime()) > 3600000 ) {
        //console.log('diatas sejam!, show alert' , e.locationName)
        this.openWarningWdw(e.temperatureDataId, e.locationId)
      }
    })
  }

  isDanger(tval, tmin, tmax, hval, hmin, hmax: number): boolean {
    if (tval < tmin || tval > tmax || hval < hmin || hval > hmax ) {
      return true
    } else {
      return false
    }
  }

  openWarningWdw(id_data: any, warning_id: string) {
    const initialState = {
      id_data: id_data,
      warning_id: warning_id
    };
    if(!this.activeModal[warning_id]) { //kalo masih aktif jangan dimunculin lagi
      this.modalRef[warning_id] = this.modalService.show(WarningWindowComponent, {class: 'modal-danger modal-xl', initialState, keyboard: false, ignoreBackdropClick: true, animated: false});
      this.modalRef[warning_id].content.onClose.subscribe(result => {
        console.log('results', result); //tangkap event saat user close warning
        this.closeWarningWdw(result)
      })
      this.activeModal[warning_id] = true
    }

  }

  closeWarningWdw(warning_id: string) {
    this.modalRef[warning_id].hide()
    this.activeModal[warning_id] = false

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
