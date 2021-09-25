import { Injectable } from '@angular/core';
import { TemperatureData } from '../_models/temperature-data';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from './../../../environments/environment';
import { NewTemperatureData } from '../_models/new-temperature-data';
import { Device } from '../_models/device';
import { Location } from '../_models/location';
import { DeviceLocation } from '../_models/device-location';
import { DeviceAndLocation } from '../_models/device-and-location';

@Injectable({
  providedIn: 'root'
})
export class MaintainService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getDevice(){
    return this.http.get<any>(this.baseUrl + 'setting/get-device');
  }
  getLocation(){
    return this.http.get<any>(this.baseUrl + 'setting/get-location');
  }
  getDeviceLocation(){
    return this.http.get<any>(this.baseUrl + 'setting/get-devicelocation');
  }
  getAvailableDeviceLocation(){
    return this.http.get<DeviceAndLocation>(this.baseUrl + 'setting/get-available-devicelocation');
  }

  addDevice(device: Device){
    return this.http.post(this.baseUrl + 'setting/add-device', device);
  }
  addLocation(location: Location){
    return this.http.post(this.baseUrl + 'setting/add-location', location);
  }
  addDeviceLocation(devicelocation: DeviceLocation){
    return this.http.post(this.baseUrl + 'setting/add-devicelocation', devicelocation);
  }

  editDevice(device: Device){
    return this.http.post(this.baseUrl + 'setting/edit-device', device);
  }
  editLocation(location: Location){
    return this.http.post(this.baseUrl + 'setting/edit-location', location);
  }
  editDeviceLocation(devicelocation: DeviceLocation){
    return this.http.post(this.baseUrl + 'setting/edit-devicelocation', devicelocation);
  }

  deleteDevice(device: Device){
    return this.http.post(this.baseUrl + 'setting/delete-device', device);
  }
  deleteLocation(location: Location){
    return this.http.post(this.baseUrl + 'setting/delete-location', location);
  }
  deleteDeviceLocation(devicelocation: DeviceLocation){
    return this.http.post(this.baseUrl + 'setting/delete-devicelocation', devicelocation);
  }

}
