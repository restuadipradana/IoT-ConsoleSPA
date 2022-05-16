export class KanbanTemperatureData {
  sequence: number
  temperatureDataId: number
  locationName: string
  temperature: number
  humidity: number
  lastUpdate: Date
  maxTemperature: number
  maxHumidity: number
  minTemperature: number
  minHumidity: number
  lastAcknowledgeDate: Date
  isDanger: boolean
  locationId: string
}
