export interface IPropertyReport {
  title: string;
  numericData?: {
    featuresChartData?: INumericFeatureChartData[];
    featuresMeanChartData?: INumericFeatureMeanChartData[];
  };
  literalData?: {
    featuresChartData?: ILiteralFeatureChartData[];
  };
}

export interface INumericFeatureChartData {
  name: string;
  series: {
    name: Date;
    value: any;
  }[];
}

export interface INumericFeatureMeanChartData {
  name: string;
  value: any;
}

export interface ILiteralFeatureChartData {
  name: string;
  series: {
    name: any;
    value: number;
  }[];
}
