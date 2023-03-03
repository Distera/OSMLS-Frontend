import {IPropertyReport} from '../property/property-report';

export interface ITypeReport {
  name: string;
  featuresCountChartData: IFeaturesCountChartData;
  propertiesReports: IPropertyReport[];
}

export interface IFeaturesCountChartData {
  // name: string;
  series: {
    name: Date;
    value: number;
  }[];
}
