/*! *****************************************************************************
  mmm-jast
  Version 2.5.2

  A minimalistic stock ticker based on Yahoo's finance API for the MagicMirror² platform.
  Please submit bugs at https://github.com/jalibu/MMM-Jast/issues

  (c) Jan.Litzenburger@gmail.com
  Licence: MIT

  This file is auto-generated. Do not edit.
***************************************************************************** */

(function (Log) {
    'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () {
                            return e[k];
                        }
                    });
                }
            });
        }
        n['default'] = e;
        return Object.freeze(n);
    }

    var Log__namespace = /*#__PURE__*/_interopNamespace(Log);

    class JastUtils {
        constructor(config) {
            this.config = config;
            this.currentValueStyle = {
                style: config.showCurrency ? 'currency' : 'decimal',
                useGrouping: config.useGrouping,
                currencyDisplay: config.currencyStyle,
                minimumFractionDigits: config.numberDecimalsValues <= 8 ? config.numberDecimalsValues : 8
            };
            this.changeValueStyle = {
                style: config.showChangeValueCurrency ? 'currency' : 'decimal',
                useGrouping: config.useGrouping,
                currencyDisplay: config.currencyStyle,
                minimumFractionDigits: config.numberDecimalsValues <= 8 ? config.numberDecimalsValues : 8
            };
            this.percentStyle = {
                style: 'percent',
                useGrouping: config.useGrouping,
                minimumFractionDigits: config.numberDecimalsPercentages <= 8 ? config.numberDecimalsPercentages : 8
            };
        }
        getStockChange(stock) {
            var _a;
            return (_a = stock.price) === null || _a === void 0 ? void 0 : _a.regularMarketChange;
        }
        getStockChangePercent(stock) {
            var _a;
            return (_a = stock.price) === null || _a === void 0 ? void 0 : _a.regularMarketChangePercent;
        }
        getCurrentValue(stock) {
            var _a;
            return (_a = stock.price) === null || _a === void 0 ? void 0 : _a.regularMarketPrice;
        }
        getStockChangeAsString(stock) {
            return this.getStockChange(stock).toLocaleString(this.config.locale, Object.assign(this.changeValueStyle, {
                currency: stock.price.currency
            }));
        }
        getStockChangePercentAsString(stock) {
            return this.getStockChangePercent(stock).toLocaleString(this.config.locale, this.percentStyle);
        }
        getCurrentValueAsString(stock) {
            return this.getCurrentValue(stock).toLocaleString(this.config.locale, Object.assign(this.currentValueStyle, {
                currency: stock.price.currency
            }));
        }
        getStockName(stock) {
            return stock.meta.name || stock.price.longName;
        }
        getPortfolioValueAsString(portfolio) {
            return portfolio.value.toLocaleString(this.config.locale, Object.assign(this.currentValueStyle, {
                currency: portfolio.currency
            }));
        }
        getPortfolioChangeAsString(portfolio) {
            const change = portfolio.value - portfolio.oldValue;
            return change.toLocaleString(this.config.locale, Object.assign(this.currentValueStyle, {
                currency: portfolio.currency
            }));
        }
        getPortfolioChangePercentAsString(portfolio) {
            const change = (portfolio.value - portfolio.oldValue) / portfolio.oldValue;
            return change.toLocaleString(this.config.locale, this.percentStyle);
        }
        getPortfolio(stocks) {
            var _a, _b, _c;
            const portfolio = [];
            for (const stock of stocks) {
                try {
                    const configStock = (_a = this.config.stocks) === null || _a === void 0 ? void 0 : _a.find((current) => { var _a; return current.symbol === ((_a = stock.meta) === null || _a === void 0 ? void 0 : _a.symbol); });
                    if (configStock === null || configStock === void 0 ? void 0 : configStock.quantity) {
                        const currentStockValue = ((_b = stock.price) === null || _b === void 0 ? void 0 : _b.regularMarketPrice) * configStock.quantity;
                        const lastStockValue = ((_c = stock.price) === null || _c === void 0 ? void 0 : _c.regularMarketPreviousClose) * configStock.quantity;
                        const existingCurrency = portfolio.find((growth) => growth.currency === stock.price.currency);
                        if (existingCurrency) {
                            existingCurrency.value += currentStockValue;
                            existingCurrency.oldValue += lastStockValue;
                        }
                        else {
                            portfolio.push({
                                value: currentStockValue,
                                oldValue: lastStockValue,
                                currency: stock.price.currency
                            });
                        }
                    }
                }
                catch (err) {
                    Log__namespace.warn('There was a problem calculating the detpot growth', err);
                }
            }
            return portfolio;
        }
    }

    Module.register('MMM-Jast', {
        defaults: {
            locale: config.locale || 'en-GB',
            updateIntervalInSeconds: 600,
            useGrouping: false,
            currencyStyle: 'code',
            fadeSpeedInSeconds: 3.5,
            stocks: [
                { name: 'BASF', symbol: 'BAS.DE', quantity: 100 },
                { name: 'SAP', symbol: 'SAP.DE', quantity: 200 },
                { name: 'Henkel', symbol: 'HEN3.DE' },
                { name: 'AbbVie', symbol: '4AB.DE' },
                { name: 'Bitcoin', symbol: 'BTC-EUR' },
                { name: 'Alibaba', symbol: 'BABA' }
            ],
            scroll: 'vertical',
            maxWidth: '100%',
            numberDecimalsValues: 2,
            numberDecimalsPercentages: 1,
            showColors: true,
            showCurrency: true,
            showChangePercent: true,
            showChangeValue: false,
            showChangeValueCurrency: false,
            showPortfolioValue: false,
            showPortfolioGrowth: false,
            showPortfolioGrowthPercent: false,
            virtualHorizontalMultiplier: 2
        },
        getStyles() {
            return ['MMM-Jast.css'];
        },
        getTranslations() {
            return {
                en: 'translations/en.json',
                de: 'translations/de.json'
            };
        },
        getTemplate() {
            return 'templates/MMM-Jast.njk';
        },
        getTemplateData() {
            const utils = new JastUtils(this.config);
            return {
                config: this.config,
                stocks: this.stocks,
                utils
            };
        },
        start() {
            this.loadData();
            this.scheduleUpdate();
            this.updateDom();
        },
        scheduleUpdate() {
            this.config.updateIntervalInSeconds =
                this.config.updateIntervalInSeconds < 120 ? 120 : this.config.updateIntervalInSeconds;
            setInterval(() => {
                this.loadData();
            }, this.config.updateIntervalInSeconds * 1000);
        },
        loadData() {
            this.sendSocketNotification('JAST_STOCKS_REQUEST', this.config);
        },
        socketNotificationReceived(notificationIdentifier, payload) {
            if (notificationIdentifier === 'JAST_STOCKS_RESPONSE') {
                this.stocks = payload;
                Log__namespace.log('Stocks', this.stocks);
                this.updateDom();
            }
        }
    });

}(Log));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTU1NLUphc3QuanMiLCJzb3VyY2VzIjpbInNyYy9mcm9udGVuZC9KYXN0RnJvbnRlbmRVdGlscy50cyIsInNyYy9mcm9udGVuZC9Gcm9udGVuZC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBMb2cgZnJvbSAnbG9nZ2VyJztcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEphc3RVdGlscyB7XG4gICAgY29uc3RydWN0b3IoY29uZmlnKSB7XG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgICAgICB0aGlzLmN1cnJlbnRWYWx1ZVN0eWxlID0ge1xuICAgICAgICAgICAgc3R5bGU6IGNvbmZpZy5zaG93Q3VycmVuY3kgPyAnY3VycmVuY3knIDogJ2RlY2ltYWwnLFxuICAgICAgICAgICAgdXNlR3JvdXBpbmc6IGNvbmZpZy51c2VHcm91cGluZyxcbiAgICAgICAgICAgIGN1cnJlbmN5RGlzcGxheTogY29uZmlnLmN1cnJlbmN5U3R5bGUsXG4gICAgICAgICAgICBtaW5pbXVtRnJhY3Rpb25EaWdpdHM6IGNvbmZpZy5udW1iZXJEZWNpbWFsc1ZhbHVlcyA8PSA4ID8gY29uZmlnLm51bWJlckRlY2ltYWxzVmFsdWVzIDogOFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmNoYW5nZVZhbHVlU3R5bGUgPSB7XG4gICAgICAgICAgICBzdHlsZTogY29uZmlnLnNob3dDaGFuZ2VWYWx1ZUN1cnJlbmN5ID8gJ2N1cnJlbmN5JyA6ICdkZWNpbWFsJyxcbiAgICAgICAgICAgIHVzZUdyb3VwaW5nOiBjb25maWcudXNlR3JvdXBpbmcsXG4gICAgICAgICAgICBjdXJyZW5jeURpc3BsYXk6IGNvbmZpZy5jdXJyZW5jeVN0eWxlLFxuICAgICAgICAgICAgbWluaW11bUZyYWN0aW9uRGlnaXRzOiBjb25maWcubnVtYmVyRGVjaW1hbHNWYWx1ZXMgPD0gOCA/IGNvbmZpZy5udW1iZXJEZWNpbWFsc1ZhbHVlcyA6IDhcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5wZXJjZW50U3R5bGUgPSB7XG4gICAgICAgICAgICBzdHlsZTogJ3BlcmNlbnQnLFxuICAgICAgICAgICAgdXNlR3JvdXBpbmc6IGNvbmZpZy51c2VHcm91cGluZyxcbiAgICAgICAgICAgIG1pbmltdW1GcmFjdGlvbkRpZ2l0czogY29uZmlnLm51bWJlckRlY2ltYWxzUGVyY2VudGFnZXMgPD0gOCA/IGNvbmZpZy5udW1iZXJEZWNpbWFsc1BlcmNlbnRhZ2VzIDogOFxuICAgICAgICB9O1xuICAgIH1cbiAgICBnZXRTdG9ja0NoYW5nZShzdG9jaykge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHJldHVybiAoX2EgPSBzdG9jay5wcmljZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnJlZ3VsYXJNYXJrZXRDaGFuZ2U7XG4gICAgfVxuICAgIGdldFN0b2NrQ2hhbmdlUGVyY2VudChzdG9jaykge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHJldHVybiAoX2EgPSBzdG9jay5wcmljZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnJlZ3VsYXJNYXJrZXRDaGFuZ2VQZXJjZW50O1xuICAgIH1cbiAgICBnZXRDdXJyZW50VmFsdWUoc3RvY2spIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICByZXR1cm4gKF9hID0gc3RvY2sucHJpY2UpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5yZWd1bGFyTWFya2V0UHJpY2U7XG4gICAgfVxuICAgIGdldFN0b2NrQ2hhbmdlQXNTdHJpbmcoc3RvY2spIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0U3RvY2tDaGFuZ2Uoc3RvY2spLnRvTG9jYWxlU3RyaW5nKHRoaXMuY29uZmlnLmxvY2FsZSwgT2JqZWN0LmFzc2lnbih0aGlzLmNoYW5nZVZhbHVlU3R5bGUsIHtcbiAgICAgICAgICAgIGN1cnJlbmN5OiBzdG9jay5wcmljZS5jdXJyZW5jeVxuICAgICAgICB9KSk7XG4gICAgfVxuICAgIGdldFN0b2NrQ2hhbmdlUGVyY2VudEFzU3RyaW5nKHN0b2NrKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFN0b2NrQ2hhbmdlUGVyY2VudChzdG9jaykudG9Mb2NhbGVTdHJpbmcodGhpcy5jb25maWcubG9jYWxlLCB0aGlzLnBlcmNlbnRTdHlsZSk7XG4gICAgfVxuICAgIGdldEN1cnJlbnRWYWx1ZUFzU3RyaW5nKHN0b2NrKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEN1cnJlbnRWYWx1ZShzdG9jaykudG9Mb2NhbGVTdHJpbmcodGhpcy5jb25maWcubG9jYWxlLCBPYmplY3QuYXNzaWduKHRoaXMuY3VycmVudFZhbHVlU3R5bGUsIHtcbiAgICAgICAgICAgIGN1cnJlbmN5OiBzdG9jay5wcmljZS5jdXJyZW5jeVxuICAgICAgICB9KSk7XG4gICAgfVxuICAgIGdldFN0b2NrTmFtZShzdG9jaykge1xuICAgICAgICByZXR1cm4gc3RvY2subWV0YS5uYW1lIHx8IHN0b2NrLnByaWNlLmxvbmdOYW1lO1xuICAgIH1cbiAgICBnZXRQb3J0Zm9saW9WYWx1ZUFzU3RyaW5nKHBvcnRmb2xpbykge1xuICAgICAgICByZXR1cm4gcG9ydGZvbGlvLnZhbHVlLnRvTG9jYWxlU3RyaW5nKHRoaXMuY29uZmlnLmxvY2FsZSwgT2JqZWN0LmFzc2lnbih0aGlzLmN1cnJlbnRWYWx1ZVN0eWxlLCB7XG4gICAgICAgICAgICBjdXJyZW5jeTogcG9ydGZvbGlvLmN1cnJlbmN5XG4gICAgICAgIH0pKTtcbiAgICB9XG4gICAgZ2V0UG9ydGZvbGlvQ2hhbmdlQXNTdHJpbmcocG9ydGZvbGlvKSB7XG4gICAgICAgIGNvbnN0IGNoYW5nZSA9IHBvcnRmb2xpby52YWx1ZSAtIHBvcnRmb2xpby5vbGRWYWx1ZTtcbiAgICAgICAgcmV0dXJuIGNoYW5nZS50b0xvY2FsZVN0cmluZyh0aGlzLmNvbmZpZy5sb2NhbGUsIE9iamVjdC5hc3NpZ24odGhpcy5jdXJyZW50VmFsdWVTdHlsZSwge1xuICAgICAgICAgICAgY3VycmVuY3k6IHBvcnRmb2xpby5jdXJyZW5jeVxuICAgICAgICB9KSk7XG4gICAgfVxuICAgIGdldFBvcnRmb2xpb0NoYW5nZVBlcmNlbnRBc1N0cmluZyhwb3J0Zm9saW8pIHtcbiAgICAgICAgY29uc3QgY2hhbmdlID0gKHBvcnRmb2xpby52YWx1ZSAtIHBvcnRmb2xpby5vbGRWYWx1ZSkgLyBwb3J0Zm9saW8ub2xkVmFsdWU7XG4gICAgICAgIHJldHVybiBjaGFuZ2UudG9Mb2NhbGVTdHJpbmcodGhpcy5jb25maWcubG9jYWxlLCB0aGlzLnBlcmNlbnRTdHlsZSk7XG4gICAgfVxuICAgIGdldFBvcnRmb2xpbyhzdG9ja3MpIHtcbiAgICAgICAgdmFyIF9hLCBfYiwgX2M7XG4gICAgICAgIGNvbnN0IHBvcnRmb2xpbyA9IFtdO1xuICAgICAgICBmb3IgKGNvbnN0IHN0b2NrIG9mIHN0b2Nrcykge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBjb25maWdTdG9jayA9IChfYSA9IHRoaXMuY29uZmlnLnN0b2NrcykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmZpbmQoKGN1cnJlbnQpID0+IHsgdmFyIF9hOyByZXR1cm4gY3VycmVudC5zeW1ib2wgPT09ICgoX2EgPSBzdG9jay5tZXRhKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2Euc3ltYm9sKTsgfSk7XG4gICAgICAgICAgICAgICAgaWYgKGNvbmZpZ1N0b2NrID09PSBudWxsIHx8IGNvbmZpZ1N0b2NrID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjb25maWdTdG9jay5xdWFudGl0eSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50U3RvY2tWYWx1ZSA9ICgoX2IgPSBzdG9jay5wcmljZSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLnJlZ3VsYXJNYXJrZXRQcmljZSkgKiBjb25maWdTdG9jay5xdWFudGl0eTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbGFzdFN0b2NrVmFsdWUgPSAoKF9jID0gc3RvY2sucHJpY2UpID09PSBudWxsIHx8IF9jID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYy5yZWd1bGFyTWFya2V0UHJldmlvdXNDbG9zZSkgKiBjb25maWdTdG9jay5xdWFudGl0eTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXhpc3RpbmdDdXJyZW5jeSA9IHBvcnRmb2xpby5maW5kKChncm93dGgpID0+IGdyb3d0aC5jdXJyZW5jeSA9PT0gc3RvY2sucHJpY2UuY3VycmVuY3kpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXhpc3RpbmdDdXJyZW5jeSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXhpc3RpbmdDdXJyZW5jeS52YWx1ZSArPSBjdXJyZW50U3RvY2tWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4aXN0aW5nQ3VycmVuY3kub2xkVmFsdWUgKz0gbGFzdFN0b2NrVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3J0Zm9saW8ucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGN1cnJlbnRTdG9ja1ZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9sZFZhbHVlOiBsYXN0U3RvY2tWYWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW5jeTogc3RvY2sucHJpY2UuY3VycmVuY3lcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIExvZy53YXJuKCdUaGVyZSB3YXMgYSBwcm9ibGVtIGNhbGN1bGF0aW5nIHRoZSBkZXRwb3QgZ3Jvd3RoJywgZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcG9ydGZvbGlvO1xuICAgIH1cbn1cbiIsImltcG9ydCAqIGFzIExvZyBmcm9tICdsb2dnZXInO1xuaW1wb3J0IFV0aWxzIGZyb20gJy4vSmFzdEZyb250ZW5kVXRpbHMnO1xuTW9kdWxlLnJlZ2lzdGVyKCdNTU0tSmFzdCcsIHtcbiAgICBkZWZhdWx0czoge1xuICAgICAgICBsb2NhbGU6IGNvbmZpZy5sb2NhbGUgfHwgJ2VuLUdCJyxcbiAgICAgICAgdXBkYXRlSW50ZXJ2YWxJblNlY29uZHM6IDYwMCxcbiAgICAgICAgdXNlR3JvdXBpbmc6IGZhbHNlLFxuICAgICAgICBjdXJyZW5jeVN0eWxlOiAnY29kZScsXG4gICAgICAgIGZhZGVTcGVlZEluU2Vjb25kczogMy41LFxuICAgICAgICBzdG9ja3M6IFtcbiAgICAgICAgICAgIHsgbmFtZTogJ0JBU0YnLCBzeW1ib2w6ICdCQVMuREUnLCBxdWFudGl0eTogMTAwIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdTQVAnLCBzeW1ib2w6ICdTQVAuREUnLCBxdWFudGl0eTogMjAwIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdIZW5rZWwnLCBzeW1ib2w6ICdIRU4zLkRFJyB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnQWJiVmllJywgc3ltYm9sOiAnNEFCLkRFJyB9LFxuICAgICAgICAgICAgeyBuYW1lOiAnQml0Y29pbicsIHN5bWJvbDogJ0JUQy1FVVInIH0sXG4gICAgICAgICAgICB7IG5hbWU6ICdBbGliYWJhJywgc3ltYm9sOiAnQkFCQScgfVxuICAgICAgICBdLFxuICAgICAgICBzY3JvbGw6ICd2ZXJ0aWNhbCcsXG4gICAgICAgIG1heFdpZHRoOiAnMTAwJScsXG4gICAgICAgIG51bWJlckRlY2ltYWxzVmFsdWVzOiAyLFxuICAgICAgICBudW1iZXJEZWNpbWFsc1BlcmNlbnRhZ2VzOiAxLFxuICAgICAgICBzaG93Q29sb3JzOiB0cnVlLFxuICAgICAgICBzaG93Q3VycmVuY3k6IHRydWUsXG4gICAgICAgIHNob3dDaGFuZ2VQZXJjZW50OiB0cnVlLFxuICAgICAgICBzaG93Q2hhbmdlVmFsdWU6IGZhbHNlLFxuICAgICAgICBzaG93Q2hhbmdlVmFsdWVDdXJyZW5jeTogZmFsc2UsXG4gICAgICAgIHNob3dQb3J0Zm9saW9WYWx1ZTogZmFsc2UsXG4gICAgICAgIHNob3dQb3J0Zm9saW9Hcm93dGg6IGZhbHNlLFxuICAgICAgICBzaG93UG9ydGZvbGlvR3Jvd3RoUGVyY2VudDogZmFsc2UsXG4gICAgICAgIHZpcnR1YWxIb3Jpem9udGFsTXVsdGlwbGllcjogMlxuICAgIH0sXG4gICAgZ2V0U3R5bGVzKCkge1xuICAgICAgICByZXR1cm4gWydNTU0tSmFzdC5jc3MnXTtcbiAgICB9LFxuICAgIGdldFRyYW5zbGF0aW9ucygpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGVuOiAndHJhbnNsYXRpb25zL2VuLmpzb24nLFxuICAgICAgICAgICAgZGU6ICd0cmFuc2xhdGlvbnMvZGUuanNvbidcbiAgICAgICAgfTtcbiAgICB9LFxuICAgIGdldFRlbXBsYXRlKCkge1xuICAgICAgICByZXR1cm4gJ3RlbXBsYXRlcy9NTU0tSmFzdC5uamsnO1xuICAgIH0sXG4gICAgZ2V0VGVtcGxhdGVEYXRhKCkge1xuICAgICAgICBjb25zdCB1dGlscyA9IG5ldyBVdGlscyh0aGlzLmNvbmZpZyk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb25maWc6IHRoaXMuY29uZmlnLFxuICAgICAgICAgICAgc3RvY2tzOiB0aGlzLnN0b2NrcyxcbiAgICAgICAgICAgIHV0aWxzXG4gICAgICAgIH07XG4gICAgfSxcbiAgICBzdGFydCgpIHtcbiAgICAgICAgdGhpcy5sb2FkRGF0YSgpO1xuICAgICAgICB0aGlzLnNjaGVkdWxlVXBkYXRlKCk7XG4gICAgICAgIHRoaXMudXBkYXRlRG9tKCk7XG4gICAgfSxcbiAgICBzY2hlZHVsZVVwZGF0ZSgpIHtcbiAgICAgICAgdGhpcy5jb25maWcudXBkYXRlSW50ZXJ2YWxJblNlY29uZHMgPVxuICAgICAgICAgICAgdGhpcy5jb25maWcudXBkYXRlSW50ZXJ2YWxJblNlY29uZHMgPCAxMjAgPyAxMjAgOiB0aGlzLmNvbmZpZy51cGRhdGVJbnRlcnZhbEluU2Vjb25kcztcbiAgICAgICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5sb2FkRGF0YSgpO1xuICAgICAgICB9LCB0aGlzLmNvbmZpZy51cGRhdGVJbnRlcnZhbEluU2Vjb25kcyAqIDEwMDApO1xuICAgIH0sXG4gICAgbG9hZERhdGEoKSB7XG4gICAgICAgIHRoaXMuc2VuZFNvY2tldE5vdGlmaWNhdGlvbignSkFTVF9TVE9DS1NfUkVRVUVTVCcsIHRoaXMuY29uZmlnKTtcbiAgICB9LFxuICAgIHNvY2tldE5vdGlmaWNhdGlvblJlY2VpdmVkKG5vdGlmaWNhdGlvbklkZW50aWZpZXIsIHBheWxvYWQpIHtcbiAgICAgICAgaWYgKG5vdGlmaWNhdGlvbklkZW50aWZpZXIgPT09ICdKQVNUX1NUT0NLU19SRVNQT05TRScpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvY2tzID0gcGF5bG9hZDtcbiAgICAgICAgICAgIExvZy5sb2coJ1N0b2NrcycsIHRoaXMuc3RvY2tzKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlRG9tKCk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcbiJdLCJuYW1lcyI6WyJMb2ciLCJVdGlscyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFDZSxNQUFNLFNBQVMsQ0FBQztJQUMvQixJQUFJLFdBQVcsQ0FBQyxNQUFNLEVBQUU7SUFDeEIsUUFBUSxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUM3QixRQUFRLElBQUksQ0FBQyxpQkFBaUIsR0FBRztJQUNqQyxZQUFZLEtBQUssRUFBRSxNQUFNLENBQUMsWUFBWSxHQUFH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
