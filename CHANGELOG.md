# Changelog

All notable changes to this project will be documented in this file.

## [2.9.5] - 2024-06-04

### Changed

- Updated Yahoo Finance dependency

### Notes

- Please run `npm install` after pulling this version to upgrade local dependencies

## [2.9.4] - 2024-04-17

### Fixed

- Fixed Yahoo Finance API dependency after breaking changes
- Yahoo recently changed their unofficial Finance API breaking data-fetching

### Notes

- **Mandatory upgrade** to continue module usage
- Run `git pull` and `npm install` to update

## [2.9.3] - 2024-01-23

### Fixed

- Fixed devDependencies issue

## [2.9.2] - 2024-01-21

### Changed

- CSS improvements for better custom styling support
- Added classes to elements for easier custom CSS
- Improved horizontal scrolling animation for smoother performance

## [2.9.1] - 2023-12-12

### Changed

- Updated dependencies

### Contributors

- [@KristjanESPERANTO](https://github.com/KristjanESPERANTO)

## [2.9.0] - 2023-11-12

### Added

- New display mode: "table"
- Additional features for table display mode

### Changed

- Configuration property `scroll` renamed to `displayMode`

### Breaking Changes

- Please update your config to use `displayMode` instead of `scroll`

## [2.8.2] - 2023-07-15

### Fixed

- Fixed problem with decimal fraction digits limit ([#55](https://github.com/jalibu/MMM-Jast/issues/55))

## [2.8.1] - 2023-07-15

### Fixed

- Fixed Yahoo Finance "Invalid Cookie" error

### Notes

- Run `npm install --only=production` in MMM-Jast folder to update dependencies

## [2.8.0] - 2022-08-13

### Added

- New option: Hidden Stocks
- Ability to hide specific stocks from display while keeping them in portfolio calculations

## [2.7.0] - 2022-06-18

### Added

- New config option `maxChangeAge` to hide stock value changes older than specified age
  - Useful for weekends/market closures ([#43](https://github.com/jalibu/MMM-Jast/issues/43))

### Fixed

- Better alignment for lines in static list (non-scrolling) ([#42](https://github.com/jalibu/MMM-Jast/issues/42))

## [2.6.3] - 2022-05-17

### Changed

- Updated dependencies

## [2.6.2] - 2022-01-25

### Fixed

- Fixed support for stocks in GBp ([#36](https://github.com/jalibu/MMM-Jast/issues/36))

## [2.6.0] - 2021-10-02

### Added

- New option to show time of last update

## [2.5.1] - 2021-09-22

### Fixed

- Improved error handling with API response sanity checks
- Fixed undefined objects that caused bad user experience

## [2.5.0] - 2021-09-11

### Changed

- Internal refactoring and build process updates

## [2.4.5] - 2021-08-31

### Changed

- Removed synchronous nunjucks template loading

## [2.4.4] - 2021-08-18

### Security

- Removed vulnerable dependency

## [2.4.3] - 2021-07-14

### Changed

- Fixed translation for portfolio (German "Depot" terminology)

### Breaking Changes

- Configuration properties renamed for portfolio feature
- Old and new properties temporarily supported, but will be removed in future versions

## [2.4.2] - 2021-06-21

### Fixed

- Currency value now retrieved from price API object instead of sumDetail object

## [2.4.1] - 2021-06-20

### Added

- Added schema.json for MMM-Config support

## [2.4.0] - 2021-06-20

### Added

- Virtual horizontal multiplier option to avoid whitespaces in horizontal mode

## [2.3.0] - 2021-05-05

### Added

- Portfolio (Depot) feature now shows value with additional settings
- Option for monochromatic/uncolored tickers

### Fixed

- Fixed problem with header config setting

## [2.2.0] - 2021-04-24

### Added

- Auto value formatting based on MagicMirror locale
- `useGrouping` option for grouping character in high value numbers (e.g., BTC 60,000.00 EUR)
- `currencyStyle` option to define currency rendering style: "code", "symbol", or "name"

## [2.1.0] - 2021-04-10

### Added

- Configurable number of decimals for stock values (default: 2) and percentages (default: 1)
- Browser locale-based decimal separator symbols
- Stock name field is now optional (uses official trade name if not set)

## [2.0.0] - 2021-03-31

### Changed

- **Breaking**: Switched from Alphavantage to Yahoo Finance API

### Added

- No API key required
- Support for Stocks, ETF, Crypto, Indexes, etc.
- No request limit
- Improved data quality

## [1.2.0] - 2021-01-24

### Added

- Auto-calculate best possible request interval for ≤500 requests per day (Alphavantage free plan)

### Fixed

- Nunjucks async rendering
- Various typos

## [1.1.0] - 2021-01-19

### Added

- Cryptocurrency support

## [1.0.0] - 2021-01-14

### Added

- Initial release

---

[2.9.5]: https://github.com/jalibu/MMM-Jast/compare/v2.9.4...v2.9.5
[2.9.4]: https://github.com/jalibu/MMM-Jast/compare/v2.9.3...v2.9.4
[2.9.3]: https://github.com/jalibu/MMM-Jast/compare/v2.9.2...v2.9.3
[2.9.2]: https://github.com/jalibu/MMM-Jast/compare/v2.9.1...v2.9.2
[2.9.1]: https://github.com/jalibu/MMM-Jast/compare/v2.9.0...v2.9.1
[2.9.0]: https://github.com/jalibu/MMM-Jast/compare/v2.8.2...v2.9.0
[2.8.2]: https://github.com/jalibu/MMM-Jast/compare/v2.8.1...v2.8.2
[2.8.1]: https://github.com/jalibu/MMM-Jast/compare/v2.8.0...v2.8.1
[2.8.0]: https://github.com/jalibu/MMM-Jast/compare/v2.7.0...v2.8.0
[2.7.0]: https://github.com/jalibu/MMM-Jast/compare/v2.6.3...v2.7.0
[2.6.3]: https://github.com/jalibu/MMM-Jast/compare/v2.6.2...v2.6.3
[2.6.2]: https://github.com/jalibu/MMM-Jast/compare/v2.6.0...v2.6.2
[2.6.0]: https://github.com/jalibu/MMM-Jast/compare/v2.5.1...v2.6.0
[2.5.1]: https://github.com/jalibu/MMM-Jast/compare/v2.5.0...v2.5.1
[2.5.0]: https://github.com/jalibu/MMM-Jast/compare/v2.4.5...v2.5.0
[2.4.5]: https://github.com/jalibu/MMM-Jast/compare/v2.4.4...v2.4.5
[2.4.4]: https://github.com/jalibu/MMM-Jast/compare/v2.4.3...v2.4.4
[2.4.3]: https://github.com/jalibu/MMM-Jast/compare/v2.4.2...v2.4.3
[2.4.2]: https://github.com/jalibu/MMM-Jast/compare/v2.4.1...v2.4.2
[2.4.1]: https://github.com/jalibu/MMM-Jast/compare/v2.4.0...v2.4.1
[2.4.0]: https://github.com/jalibu/MMM-Jast/compare/v2.3.0...v2.4.0
[2.3.0]: https://github.com/jalibu/MMM-Jast/compare/v2.2.0...v2.3.0
[2.2.0]: https://github.com/jalibu/MMM-Jast/compare/v2.1.0...v2.2.0
[2.1.0]: https://github.com/jalibu/MMM-Jast/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/jalibu/MMM-Jast/compare/v1.2.0...v2.0.0
[1.2.0]: https://github.com/jalibu/MMM-Jast/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/jalibu/MMM-Jast/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/jalibu/MMM-Jast/releases/tag/v1.0.0
