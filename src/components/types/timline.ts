export interface InfoType {
  title: string,
  description: string,
}

export interface TimelineDataType {
  id: number,
  name: string,
  startYear: number,
  endYear: number,
  info: InfoType[]
}