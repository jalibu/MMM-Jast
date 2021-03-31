export type Config = {
  header: string,
  updateIntervalInSeconds: number,
  fadeSpeedInSeconds: number,
  stocks: Stock[],
  scroll: "vertical" | "horizontal" | "none",
  maxWidth: string,
  showCurrency: boolean,
  showChangePercent: boolean,
  showChangeValue: boolean,
  showChangeValueCurrency: boolean,
  showDepotGrowth: boolean
};

type Stock = {
  name: string,
  symbol: string,
  quantity: number
}