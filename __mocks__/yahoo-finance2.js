/* global jest module */

const mockQuoteSummary = jest.fn()

const YahooFinance = jest.fn().mockImplementation(() => ({
  quoteSummary: mockQuoteSummary
}))

module.exports = {
  __esModule: true,
  default: YahooFinance,
  mockQuoteSummary
}
