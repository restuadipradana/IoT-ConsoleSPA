import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { QueryComponent } from './query/query.component';
import { KanbanComponent } from './kanban/kanban.component';
import { MaintainDeviceComponent } from './maintain-device/maintain-device.component';
import { MaintainLocationComponent } from './maintain-location/maintain-location.component';
import { MaintainDeviceLocationComponent } from './maintain-device-location/maintain-device-location.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Temperature'
    },
    children: [
      {
        path: 'kanban',
        component: KanbanComponent,
        data: {
          title: 'Kanban'
        }
      },
      {
        path: 'overview',
        component: OverviewComponent,
        data: {
          title: 'Overview'
        }
      },
      {
        path: 'query',
        component: QueryComponent,
        data: {
          title: 'Search data'
        }
      },
      {
        path: 'maintain-device',
        component: MaintainDeviceComponent,
        data: {
          title: 'Maintain Device'
        }
      },
      {
        path: 'maintain-location',
        component: MaintainLocationComponent,
        data: {
          title: 'Maintain Location'
        }
      },
      {
        path: 'maintain-dl',
        component: MaintainDeviceLocationComponent,
        data: {
          title: 'Maintain Device Location'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TshTempRoutingModule { }
