import { ChartPanel, ChartProps } from "./ChartPanel";
export type PropsDashboard = ChartProps;
export const AreaChartCompo = (props: ChartProps) => (
  <ChartPanel {...props} variant="area" />
);
