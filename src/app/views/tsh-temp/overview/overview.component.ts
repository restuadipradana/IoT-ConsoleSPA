import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild  } from '@angular/core';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { BmeData } from '../../../_core/_models/bme-data';
import { TemperatureData } from '../../../_core/_models/temperature-data';
import { DateRange } from '../../../_core/_models/date-range';
import { TemperatureService } from '../../../_core/_services/temperature.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';


//import 'rxjs/add/operator/map';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements  AfterViewInit, OnInit {

  radioModel: string = 'Month';

  public mainChartElements = 27;
  public mainChartData1: Array<number> = [];
  public mainChartData2: Array<number> = [];
  public mainChartData3: Array<number> = [];

  public mainChartData: Array<any> = [
    {
      data: this.mainChartData1,
      label: 'Temperature'
    },
    {
      data: this.mainChartData2,
      label: 'Humidity'
    },
    // {
    //   data: this.mainChartData3,
    //   label: 'Margin'
    // }
  ];
  /* tslint:disable:max-line-length */
  public mainChartLabels: Array<any> = ['Monday'];
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
            return value.charAt(3);
          }
        }
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true,
          maxTicksLimit: 8,
          stepSize: 8,
          max: 70
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

  public random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  startDate: Date = null
  endDate: Date = null
  konten: string =''
  dateNow: any
  range: DateRange = {startDate: null, endDate: null}
  temprData: TemperatureData[]
  todayTemprData: any = []
  srcBmeData: TemperatureData[] = []
  location: string = ''

  displayedColumns: string[] = ['insertAt', 'temperature', 'humidity', 'pressure', 'location'];
  dataSource: MatTableDataSource<TemperatureData>;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;


  constructor(private toastr: ToastrService, private _tempSvc: TemperatureService) { }

  ngOnInit(): void {
    //console.log('eheh: ', this._tempSvc.todayTHsource.value)
    this.dateNow = new Date().toDateString()
    this.todayTemprData = this._tempSvc.todayTHsource.value
    if (this.todayTemprData.length > 0) {
      this.location = this.todayTemprData[this.todayTemprData.length -1].location
      this.mainChartLabels = this.todayTemprData.map(x => x.insertAt.substr(11,8))
      //console.log('clog map', this.todayTemprData.map(x => x.InsertAt.toTimeString().substr(0, 8)))
      for (let data of this.todayTemprData) {
        this.mainChartData1.push(data.temperature)
        this.mainChartData2.push(data.humidity)
        //this.mainChartData3.push(30);
      }
    }

    this.dataSource = new MatTableDataSource([])
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }


  search() {
    if (this.range.startDate === null && this.range.endDate === null){
      this.toastr.warning('Date tidak boleh kosong', 'Perhatian!')
    }
    else {
      Object.assign(this.srcBmeData, {})
      this.range.endDate = new Date(this.range.endDate.setHours(23,59,59))
      //console.log(this.range)
      this._tempSvc.getTemperatureDataRange(this.range).subscribe(
        (res: any) => {
          this.temprData = res
          this.srcBmeData = res
          this.dataSource = new MatTableDataSource(this.srcBmeData)
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        (error) => {
          console.log("err: ", error.error)
        }
      )

    }

  }

  getTodayData() {

    this._tempSvc.getTodayTemperature().subscribe(
      (res: any) => {
        this.todayTemprData = res
        Object.assign(this.todayTemprData, res)
        console.log("today: ", this.todayTemprData)
      },
      (error) => {
        console.log("err: ", error.error)
      }
    )
  }

  ngAfterViewInit(): void {
    // this.sort.sortChange.subscribe((x) => {
    //   console.log('x', x);
    // });
    // console.log(this.sort)
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    //console.log('ds', this.dataSource)
  }

}
