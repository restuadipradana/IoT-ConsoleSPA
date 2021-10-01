export class NewTemperatureData {
  id: number
  deviceId: string
  locationId: string
  locationName: string
  gateway: string
  temperature: number
  humidity: number
  altitude: number
  pressure: number
  detectAt: Date
  insertAt: Date
}
