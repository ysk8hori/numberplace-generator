export default interface IAnswer {
  value: string;
  equals(answer: IAnswer): boolean;
}
