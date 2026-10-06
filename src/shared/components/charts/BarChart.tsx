import { ChartPanel, ChartProps } from "./ChartPanel";
export type PropsDashboard = ChartProps;
export const BarChartCompo = (props: ChartProps) => <ChartPanel {...props} />;
