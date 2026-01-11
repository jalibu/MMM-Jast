# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [2.10.3](https://github.com/jalibu/MMM-Jast/compare/v2.10.2...v2.10.3) (2026-01-11)

### Fixed

- **template:** explicitly set animationStyle for non-vertical modes ([e60373e](https://github.com/jalibu/MMM-Jast/commit/e60373e6897078f2d6758d0bd53b17e5682c366b))

### Chores

- add missing @eslint/js as a dev dependency ([cbddf9c](https://github.com/jalibu/MMM-Jast/commit/cbddf9c0784a3ecd3c1b86b28c7cb0aa167b85de))
- change runner from ubuntu-latest to ubuntu-slim in automated tests ([687bf03](https://github.com/jalibu/MMM-Jast/commit/687bf03e86b8596f0963bd54f92523079f958534))
- **lint:** update lint:fix script ([1a789bf](https://github.com/jalibu/MMM-Jast/commit/1a789bf517be7ba6f1697e94718b7873a67bcaa1))
- update devDependencies ([e17e840](https://github.com/jalibu/MMM-Jast/commit/e17e840b07562a0382dadae8ad27c984f1d27e9e))
- update postbump script to use node --run ([2012433](https://github.com/jalibu/MMM-Jast/commit/2012433f951e3b5f084ab310bad3b1d1d26ca2aa))

### Code Refactoring

- **date:** replace moment.js with custom formatDate function ([8e35a64](https://github.com/jalibu/MMM-Jast/commit/8e35a642f5e1805baf2721201a865efeaaa2c483))

## [2.10.2](https://github.com/jalibu/MMM-Jast/compare/v2.10.1...v2.10.2) (2026-01-07)

### Fixed

- **vertical:** only duplicate stock list for vertical scroll mode ([2443d6e](https://github.com/jalibu/MMM-Jast/commit/2443d6ecda27d8a0b1f43e4c67b02b67b8b8fc9a)), closes [#79](https://github.com/jalibu/MMM-Jast/issues/79)

## [2.10.1](https://github.com/jalibu/MMM-Jast/compare/v2.10.0...v2.10.1) (2026-01-06)

### Fixed

- implement continuous one-directional vertical scrolling ([cc53c24](https://github.com/jalibu/MMM-Jast/commit/cc53c24f2007cdb497214c274bedf86722d6e49b))

### Code Refactoring

- replace console.warn with Log.warn ([906384f](https://github.com/jalibu/MMM-Jast/commit/906384fd033ca61f5c10fd5e71d4199cf635f608))

## [2.10.0](https://github.com/jalibu/MMM-Jast/compare/v2.9.5...v2.10.0) (2026-01-06)

### Added

- add default MagicMirror table layout with default size small ([#76](https://github.com/jalibu/MMM-Jast/issues/76)) ([f6b1000](https://github.com/jalibu/MMM-Jast/commit/f6b100091266d9651ef04c0ea5e8c6b4a621d884))

### Fixed

- **css:** improve layout alignment for static display mode ([14323a4](https://github.com/jalibu/MMM-Jast/commit/14323a435d280a0b1549c713777160bcdb1c2e7e)), closes [#69](https://github.com/jalibu/MMM-Jast/issues/69)
- resolve yahoo-finance2 ESM/CommonJS interop and improve logging ([7c67938](https://github.com/jalibu/MMM-Jast/commit/7c67938a4bd4a0fea994be82a9dfeef8ba043e89))

### Performance Improvements

- **css:** optimize ticker animation for Raspberry Pi ([48e9dab](https://github.com/jalibu/MMM-Jast/commit/48e9dabefb09d443d9aaa5f445626fc8e1f724c8))

### Documentation

- add changelog ([1cd8477](https://github.com/jalibu/MMM-Jast/commit/1cd8477ad0dddd1ecd313a94e3d632fa3b480c48))
- update installation instructions and add update section in README ([fd65d63](https://github.com/jalibu/MMM-Jast/commit/fd65d6342f2dfc61d5101932d7037927a661d4b6))
- update README to enhance Raspberry Pi performance guidance ([126fad0](https://github.com/jalibu/MMM-Jast/commit/126fad0e64a8dbf23efb00457d3832d8d75b1b99))

### Chores

- add automated tests workflow ([bed1a1c](https://github.com/jalibu/MMM-Jast/commit/bed1a1cb188f89e3536c2bb5cbcc8ec1a0abe9c3))
- add Code of Conduct file to promote community guidelines ([962d405](https://github.com/jalibu/MMM-Jast/commit/962d40599177a2809d23bb544fab86febabc4946))
- add demo config file and script ([14c0846](https://github.com/jalibu/MMM-Jast/commit/14c08468157bd54e5e2f9468070b2f63331c49aa))
- add Dependabot configuration for GitHub Actions and npm updates ([9bd17cb](https://github.com/jalibu/MMM-Jast/commit/9bd17cb53fcb3d2db850ac0b22ce340c6529f472))
- add release script ([45a51e1](https://github.com/jalibu/MMM-Jast/commit/45a51e112a24ed4fac31e72f79f3da2216fb8493))
- add simple-git-hooks and lint-staged for pre-commit checks ([529f82c](https://github.com/jalibu/MMM-Jast/commit/529f82c9a1ce5d4b84c573f251a29f2dfe86df85))
- change license file to markdown ([6b626ae](https://github.com/jalibu/MMM-Jast/commit/6b626aef5da1694e854a4d1991513c546b41dd10))
- migrate Prettier configuration to flat format ([33a44ed](https://github.com/jalibu/MMM-Jast/commit/33a44ed671b1bf8caf1bfbcc001712204970ca7a))
- modernize build setup ([d057fa2](https://github.com/jalibu/MMM-Jast/commit/d057fa22703777cc358470ae5ae800535500370b))
- modernize ESLint setup ([6a6e80a](https://github.com/jalibu/MMM-Jast/commit/6a6e80a8901313abd14d45fd8dc40fa85cada571))
- update command syntax ([5fb6d6c](https://github.com/jalibu/MMM-Jast/commit/5fb6d6ca65ef91299e9911c59c31aad3ef339d72))
- upgrade yahoo-finance2 to major version 3 ([#77](https://github.com/jalibu/MMM-Jast/issues/77)) ([76297e6](https://github.com/jalibu/MMM-Jast/commit/76297e6058d8ade9b7d4ebc92eae307ed6c7904b))

### Code Refactoring

- handle linter issues ([2857278](https://github.com/jalibu/MMM-Jast/commit/28572782fb4d22e05e1e4cabefb142b1b3ccf821))
- **test:** add type safety to test mocks and fix optional chaining ([75e4715](https://github.com/jalibu/MMM-Jast/commit/75e47151f030497a3c629cf34f378291fe49dcf0))

### Tests

- migrate testing framework from Jest to Vitest ([0fe46a9](https://github.com/jalibu/MMM-Jast/commit/0fe46a9f411f80405e681e07f105f7439cd30956))

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
