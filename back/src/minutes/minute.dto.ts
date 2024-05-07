export class MinuteDTO {
  constructor(
    public id: number,
    public date: string,
    public content: string,
    public voters: number[]
  ) {
  }
}