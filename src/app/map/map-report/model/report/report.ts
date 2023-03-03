import {ITypeReport} from './type/type-report';

export interface IReport {
  date: Date;
  typesReports: ITypeReport[];
}
