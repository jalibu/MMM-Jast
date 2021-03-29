export type Config = {
  debug: false,
  header: string,
  updateIntervalInSeconds: number,
  fadeSpeedInSeconds: number,
  stocks: Stock[],
  scroll: "vertical" | "horizontal" | "none",
  maxWidth: string,
  showDepotGrowth: boolean
};

type Stock = {
  name: string,
  symbol: string,
  quantity: number
}