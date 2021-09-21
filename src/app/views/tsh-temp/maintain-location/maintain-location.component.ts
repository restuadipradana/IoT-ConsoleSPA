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
  selector: 'app-maintain-location',
  templateUrl: './maintain-location.component.html',
  styleUrls: ['./maintain-location.component.scss']
})
export class MaintainLocationComponent implements OnInit, AfterViewInit {

  locationData: Location[] = []
  locationDataS: Location

  displayedColumns: string[] = ['locationId', 'locationName', 'remark', 'parent', 'isActive', 'action'];
  dataSource: MatTableDataSource<Location>;
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
    this.getLocation()
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getLocation() {
    this._maintainSvc.getLocation().subscribe(
      (res: any) => {
        this.locationData = []
        Object.assign(this.locationData, [])
        this.locationData = res
        this.dataSource = new MatTableDataSource(this.locationData)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.spinner.hide()
      },
      (error) => {
        console.log("err: ", error.error)
      }
    )
  }

  openMo(locationS: Location, kind: string) {
    console.log('modal', locationS)
    if (kind == 'add') {
      this.addModal.show()
      this.locationDataS = Object.assign(locationS, {})
    }
    else if (kind == 'edit') {
      this.editModal.show()
      this.locationDataS = Object.assign({}, locationS)
    }
    else if (kind == 'del') {
      this.deleteModal.show()
      this.locationDataS = Object.assign({}, locationS)
    }
  }

  //1 add 2 edit 3 delete
  saveChange(kind: number) {
    if (this.locationDataS == undefined || this.locationDataS == null || Object.keys(this.locationDataS).length == 0  )
    {
      console.log('nulll')
      this.toastr.info('Please fill the field!', 'Oops..!')
    }
    else
    {
      switch(kind) {
        case 1:
          this.spinner.show()
          this._maintainSvc.addLocation(this.locationDataS).subscribe(
            (res: any) => {
              console.log(res);
              this.addModal.hide();
              this.getLocation()
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
          this._maintainSvc.editLocation(this.locationDataS).subscribe(
            () => {
              this.editModal.hide();
              this.getLocation()
              this.toastr.success('Success to edit', 'Success')
            },
            (error) => {
              this.spinner.hide()
              console.log(error.error);
              this.editModal.hide();
              this.toastr.warning(error.error, 'Fail to edit!')
            }
          );
          console.log(this.locationDataS)
          break;
        case 3:
          this.spinner.show()
          this._maintainSvc.deleteLocation(this.locationDataS).subscribe(
            () => {
              this.deleteModal.hide();
              this.getLocation()
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
