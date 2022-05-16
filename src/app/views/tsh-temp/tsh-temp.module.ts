import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ChartsModule } from 'ng2-charts';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule} from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { DataTablesModule } from "angular-datatables";
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatCardModule} from '@angular/material/card';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import { NgxGaugeModule } from 'ngx-gauge';


import { TshTempRoutingModule } from './tsh-temp-routing.module';
import { OverviewComponent } from './overview/overview.component';
import { QueryComponent } from './query/query.component';
import { KanbanComponent } from './kanban/kanban.component';
import { NgxGauge } from 'ngx-gauge/gauge/gauge';
import { MaintainDeviceComponent } from './maintain-device/maintain-device.component';
import { MaintainLocationComponent } from './maintain-location/maintain-location.component';
import { MaintainDeviceLocationComponent } from './maintain-device-location/maintain-device-location.component';
import { WarningWindowComponent } from './warning-window/warning-window.component';


@NgModule({
  declarations: [
    OverviewComponent,
    QueryComponent,
    KanbanComponent,
    MaintainDeviceComponent,
    MaintainLocationComponent,
    MaintainDeviceLocationComponent,
    WarningWindowComponent,

  ],
  imports: [
    CommonModule,
    TshTempRoutingModule,
    AlertModule.forRoot(),
    FormsModule,
    ModalModule.forRoot(),
    ChartsModule,
    ButtonsModule.forRoot(),
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatSelectModule,
    MatInputModule,
    DataTablesModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatProgressBarModule,
    MatDividerModule,
    MatExpansionModule,
    NgxGaugeModule

  ]
})
export class TshTempModule { }
