import { DateRange } from './../../../_core/_models/date-range';
import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild  } from '@angular/core';
import { Location } from '../../../_core/_models/location';
import { NewTemperatureData } from '../../../_core/_models/new-temperature-data';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { TemperatureService } from '../../../_core/_services/temperature.service';
import { MaintainService } from '../../../_core/_services/maintain.service';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import {FormControl, Validators} from '@angular/forms';


@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.scss']
})
export class QueryComponent implements OnInit, AfterViewInit {

  radioModel: string = 'Month';
  public mainChartElements = 27;
  public mainChartData1: Array<number> = [];
  public mainChartData2: Array<number> = [];
  public mainChartData: Array<any> = [
    {
      data: this.mainChartData1,
      label: 'Temperature'
    },
    {
      data: this.mainChartData2,
      label: 'Humidity'
    },
  ];
  /* tslint:disable:max-line-length */
  public mainChartLabels: Array<any> = ['Time'];
  /* tslint:enable:max-line-length */
  public mainChartOptions: any = {
    tooltips: {
      enabled: false,
      custom: CustomTooltips,
      intersect: true,
      mode: 'index',
      position: 'nearest',
      callbacks: {
        labelColor: function(tooltipItem, chart) {
          return { backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor };
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function(value: any) {
            return value.substr(0,5);
          }
        }
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true,
          maxTicksLimit: 10,
          stepSize: 10,
          max: 90
        }
      }]
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      }
    },
    legend: {
      display: false
    }
  };
  public mainChartColours: Array<any> = [
    { // brandInfo
      backgroundColor: hexToRgba(getStyle('--info'), 10),
      borderColor: getStyle('--info'),
      pointHoverBackgroundColor: '#fff'
    },
    { // brandSuccess
      backgroundColor: 'transparent',
      borderColor: getStyle('--success'),
      pointHoverBackgroundColor: '#fff'
    },
    { // brandDanger
      backgroundColor: 'transparent',
      borderColor: getStyle('--danger'),
      pointHoverBackgroundColor: '#fff',
      borderWidth: 1,
      borderDash: [8, 5]
    }
  ];
  public mainChartLegend = false;
  public mainChartType = 'line';

  panelOpenState = false;

  isLoad: boolean = false
  locations: Location[]
  location: Location
  locationTrend: Location
  listTempHum: NewTemperatureData[]
  trendTempHum: any = []
  dateRange: DateRange = {startDate: null, endDate: null}
  dateTrend: DateRange = {startDate: null, endDate: null}
  sdate: Date
  locname: string = ""
  dnow: Date

  displayedColumns: string[] = ['locationName', 'temperature', 'humidity', 'insertAt'];
  dataSource: MatTableDataSource<NewTemperatureData>;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(private toastr: ToastrService, private _tempSvc: TemperatureService, private _maintainSvc: MaintainService) { }


  ngOnInit(): void {
    this.getLocation()
    this.dataSource = new MatTableDataSource([])
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }

  getLocation() {
    this.location = {locationId: null, locationName: null, parent: null, isActive: null, remark: null}
    this.locationTrend = {locationId: null, locationName: null, parent: null, isActive: null, remark: null}
    this._maintainSvc.getLocation().subscribe(
      (res: any) => {
        this.locations = []
        Object.assign(this.locations, [])
        this.locations = res
      },
      (error) => {
        console.log("err: ", error.error)
      }
    )
  }

  search() {
    this.isLoad = true
    if (this.dateRange.startDate === null || this.dateRange.endDate === null || this.location.locationId === null){
      this.toastr.warning('Date range or Location cannot be empty!', 'Warning!')
      this.isLoad = false
    }
    else {
      //Object.assign(this.listTempHum, {})
      this.dateRange.endDate = new Date(this.dateRange.endDate.setHours(23,59,59,999))
      //console.log(this.range)
      this.listTempHum = []
      this._tempSvc.searchData(this.dateRange, this.location.locationId).subscribe(
        (res: any) => {
          this.listTempHum = res
          //console.log("res data: ", this.listTempHum)
          if ( this.listTempHum.length == 0) {
            this.toastr.info('No data found', 'Info')
          }
          this.dataSource = new MatTableDataSource(this.listTempHum)
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.isLoad = false
        },
        (error) => {
          console.log("err: ", error.error)
          this.isLoad = false
        }
      )
    }
    //console.log('searched: ', this.location.locationId, this.dateRange)
  }

  exportExcel() {
    if (this.dateRange.startDate === null || this.dateRange.endDate === null || this.location.locationId === null){
      this.toastr.warning('Date range or Location cannot be empty!', 'Warning!')
    }
    else {
      this.isLoad = true
      this.dateRange.endDate = new Date(this.dateRange.endDate.setHours(23,59,59,999))
      this._tempSvc.esportExcel(this.dateRange, this.location.locationId)
        .subscribe((result: Blob) => {
          if (result.type !== 'application/xlsx') {
            alert(result.type);
          }
          const blob = new Blob([result]);
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          const currentTime = new Date();
          const filename = 'TemperatureReport_' + this.location.locationId + '_' + this.dateRange.startDate.toString().substr(0, 15) + '~' +
          this.dateRange.endDate.toString().substr(0, 15) + '.xlsx';
          link.href = url;
          link.setAttribute('download', filename);
          document.body.appendChild(link);
          link.click();
          this.isLoad = false
      });
    }
  }

  getGraphTrend() {
    if (this.sdate === null || this.locationTrend.locationId === null){
      this.toastr.warning('Date or Location cannot be empty!', 'Warning!')
      this.isLoad = false
    }
    else {
      this.mainChartData1.length  = 0 //reset value
      this.mainChartData2.length = 0
      this.dateTrend.startDate = new Date(this.sdate.setHours(0,0,0,0))
      this.dateTrend.endDate = new Date(this.sdate.setHours(23,59,59,999))
      //console.log('date', this.dateTrend)
      this.listTempHum = []
      this._tempSvc.searchData(this.dateTrend, this.locationTrend.locationId).subscribe(
        (res: any) => {
          this.trendTempHum = res

          if (this.trendTempHum.length > 0) {
            this.locname = this.trendTempHum[this.trendTempHum.length -1].locationName
            this.dnow = this.trendTempHum[this.trendTempHum.length -1].InsertAt
            this.mainChartLabels = this.trendTempHum.map(x => x.insertAt.substr(11,8))
            for (let data of this.trendTempHum) {
              this.mainChartData1.push(data.temperature)
              this.mainChartData2.push(data.humidity)
            }
          }
          else {
            this.toastr.info('No data', 'Info')
          }
        },
        (error) => {
          console.log("err: ", error.error)
        }
      )
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

}
