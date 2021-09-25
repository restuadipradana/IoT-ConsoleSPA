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

@Component({
  selector: 'app-maintain-device',
  templateUrl: './maintain-device.component.html',
  styleUrls: ['./maintain-device.component.scss']
})
export class MaintainDeviceComponent implements OnInit, AfterViewInit {


  deviceData: Device[] = []
  deviceDataS: Device

  displayedColumns: string[] = ['deviceId', 'deviceSpec', 'remark', 'isActive', 'action'];
  dataSource: MatTableDataSource<Device>;
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
    this.getDevice()

  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getDevice() {
    this._maintainSvc.getDevice().subscribe(
      (res: any) => {
        this.deviceData = []
        Object.assign(this.deviceData, [])
        this.deviceData = res
        this.dataSource = new MatTableDataSource(this.deviceData)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.spinner.hide()
      },
      (error) => {
        console.log("err: ", error.error)
      }
    )
  }

  openMo(deviceS: Device, kind: string) {
    console.log('modal', deviceS)
    if (kind == 'add') {
      this.addModal.show()
      this.deviceDataS = Object.assign(deviceS, {})
    }
    else if (kind == 'edit') {
      this.editModal.show()
      this.deviceDataS = Object.assign({}, deviceS)
    }
    else if (kind == 'del') {
      this.deleteModal.show()
      this.deviceDataS = Object.assign({}, deviceS)
    }

  }

  //1 add 2 edit 3 delete
  saveChange(kind: number) {
    if (this.deviceDataS.deviceId == undefined ||
        this.deviceDataS.deviceId == '' ||
        Object.keys(this.deviceDataS).length == 0  )
    {
      console.log('nulll')
      this.toastr.info('Please fill the field!', 'Oops..!')
    }
    else
    {
      switch(kind) {
        case 1:
          this.spinner.show()
          this._maintainSvc.addDevice(this.deviceDataS).subscribe(
            (res: any) => {
              console.log(res);
              this.addModal.hide();
              this.getDevice()
              this.toastr.success('Success to add', 'Success')
            },
            (error) => {
              this.spinner.hide()
              console.log(error.error);
              this.addModal.hide();
              this.toastr.warning(error.error, 'Fail to add!')
            }
          );
          console.log(this.deviceDataS)
          break;
        case 2:
          this.spinner.show()
          this._maintainSvc.editDevice(this.deviceDataS).subscribe(
            () => {
              this.editModal.hide();
              this.getDevice()
              this.toastr.success('Success to edit', 'Success')
            },
            (error) => {
              this.spinner.hide()
              console.log(error.error);
              this.editModal.hide();
              this.toastr.warning(error.error, 'Fail to edit!')
            }
          );
          console.log(this.deviceDataS)
          break;
        case 3:
          this.spinner.show()
          this._maintainSvc.deleteDevice(this.deviceDataS).subscribe(
            () => {
              this.deleteModal.hide();
              this.getDevice()
              this.toastr.success('Success to delete', 'Success')
            },
            (error) => {
              this.spinner.hide()
              console.log(error.error);
              this.deleteModal.hide();
              this.toastr.warning(error.error, 'Fail to delete!')
            }
          );
          console.log(this.deviceDataS)
          break;
        default:
          break;
      }
    }
  }

}
