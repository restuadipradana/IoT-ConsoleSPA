import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Device } from '../../../_core/_models/device';
import { Location } from '../../../_core/_models/location';
import { DeviceLocation } from '../../../_core/_models/device-location';
import { DeviceAndLocation } from '../../../_core/_models/device-and-location';
import { NewTemperatureData } from '../../../_core/_models/new-temperature-data';
import { MaintainService } from '../../../_core/_services/maintain.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DeviceLocationView } from '../../../_core/_models/device-location-view';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-maintain-device-location',
  templateUrl: './maintain-device-location.component.html',
  styleUrls: ['./maintain-device-location.component.scss']
})
export class MaintainDeviceLocationComponent implements OnInit, AfterViewInit {

  // colorControl = new FormControl({});
  // fontSizeControl = new FormControl();

  locationData: Location[] = []
  locationDataS: Location
  deviceData: Device[] = []
  deviceDataS: Device
  dnl: DeviceAndLocation // available device and location
  dlDataS: DeviceLocation //= { id: null, sequence: null, deviceId: null, locationId: null, isActive: null }
  dlvData: DeviceLocationView[] = []

  displayedColumns: string[] = ['sequence', 'device', 'location', 'isActive', 'action'];
  dataSource: MatTableDataSource<DeviceLocationView>;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  @ViewChild('addModal') public addModal: ModalDirective;
  @ViewChild('editModal') public editModal: ModalDirective;
  @ViewChild('deleteModal') public deleteModal: ModalDirective;

  constructor(private toastr: ToastrService, private _maintainSvc: MaintainService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show()
    this.dataSource = new MatTableDataSource([])
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getData()
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getData() {
    this._maintainSvc.getDeviceLocation().subscribe(
      (res: any) => {
        this.dlvData = []
        this.dlvData = res
        this.dataSource = new MatTableDataSource(this.dlvData)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        //this.getAvailableDL()
        this.spinner.hide()
      },
      (error) => {
        console.log("err: ", error.error)
      }
    )
  }

  getAvailableDL() {
    this._maintainSvc.getAvailableDeviceLocation().subscribe(
      (res: DeviceAndLocation) => {
        console.log(res)
        this.locationData = []
        this.deviceData = []
        this.locationData = res.availableLocations
        this.deviceData = res.availableDevices
      },
      (error) => {
        console.log("err: ", error.error)
      }
    )
  }

  openMo(dl: DeviceLocation, kind: string) {
    console.log('modal', dl)
    if (kind == 'add') {
      this.getAvailableDL()
      this.addModal.show()
      this.dlDataS = Object.assign(dl, {})
      console.log('dd', this.deviceData)
    }
    else if (kind == 'edit') {
      this.getAvailableDL()
      this.editModal.show()
      this.dlDataS = Object.assign({}, dl)
    }
    else if (kind == 'del') {
      this.deleteModal.show()
      this.dlDataS = Object.assign({}, dl)
    }
  }

  saveChange(kind: number) {
    console.log('dlsvc', this.dlDataS)
    if (this.dlDataS.locationId == undefined ||
      this.dlDataS.locationId == '' ||
      this.dlDataS.deviceId == undefined ||
      this.dlDataS.deviceId == '' ||
      this.dlDataS.isActive == undefined ||
      this.dlDataS.sequence == undefined ||
      Object.keys(this.dlDataS).length == 0  )
    {
      console.log('nulll')
      this.toastr.info('Please fill the required field!', 'Oops..!')
    }
    else
    {
      switch(kind) {
        case 1:
          this.spinner.show()
          this._maintainSvc.addDeviceLocation(this.dlDataS).subscribe(
            (res: any) => {
              console.log(res);
              this.addModal.hide();
              this.getData()
              this.toastr.success('Success to add', 'Success')
            },
            (error) => {
              this.spinner.hide()
              console.log(error.error);
              this.addModal.hide();
              this.toastr.warning(error.error, 'Fail to add!')
            }
          );
          console.log(this.locationDataS)
          break;
        case 2:
          this.spinner.show()
          this._maintainSvc.editDeviceLocation(this.dlDataS).subscribe(
            () => {
              this.editModal.hide();
              this.getData()
              this.toastr.success('Success to edit', 'Success')
            },
            (error) => {
              this.spinner.hide()
              console.log(error);
              this.editModal.hide();
              this.toastr.warning(error.error, 'Fail to edit!')
            }
          );
          console.log(this.locationDataS)
          break;
        case 3:
          this.spinner.show()
          this._maintainSvc.deleteDeviceLocation(this.dlDataS).subscribe(
            () => {
              this.deleteModal.hide();
              this.getData()
              this.toastr.success('Success to delete', 'Success')
            },
            (error) => {
              this.spinner.hide()
              console.log(error.error);
              this.deleteModal.hide();
              this.toastr.warning(error.error, 'Fail to delete!')
            }
          );
          console.log(this.locationDataS)
          break;
        default:
          break;
      }
    }
  }

}
