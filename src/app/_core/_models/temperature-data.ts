export interface TemperatureData {
  id: number
  location: string
  gateway: string
  temperature: number
  humidity: number
  altitude: number
  pressure: number
  detectAt: Date
  insertAt: Date
}
