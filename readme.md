# [Ad blocker fingerprint article](https://fingerprintjs.com/blog/ad-blocker-fingerprinting/) interactive demos

## Usage

You need to install [Node.js](https://nodejs.org) and [Yarn](https://yarnpkg.com) to run the application.

Install Yarn dependencies.
Open this directory in a terminal and run:

```bash
yarn install
```

### Quick run

```bash
yarn start
```

Then open one of the demos in a browser:
- http://localhost:8080
- http://localhost:8080/?demo=selectors
- http://localhost:8080/?demo=filters

Press <kbd>Ctrl</kbd>+<kbd>C</kbd> in the terminal to stop.

### Production build

```bash
yarn build
```

The result HTML code will appear in the `dist` directory.

### Website integration

Blocked Selectors demo:

```html
<div
    id="selectorsDemo"
    style="width: calc(100% + 40px); height: 75vh; min-height: 360px; margin-left: -20px; margin-right: -20px;"
></div>
<script
    async
    src="https://fingerprintjs.github.io/adblocker-fingerprint-article-demos/main.js"
    onload="fpjsAdblockerArticleDemos.runSelectorsDemo(document.querySelector('#selectorsDemo'))"
></script>
```

Enabled Filters demo:

```html
<div
    id="filtersDemo"
    style="width: calc(100% + 40px); height: 75vh; min-height: 360px; margin-left: -20px; margin-right: -20px;"
></div>
<script
    async
    src="https://fingerprintjs.github.io/adblocker-fingerprint-article-demos/main.js"
    onload="fpjsAdblockerArticleDemos.runFiltersDemo(document.querySelector('#filtersDemo'))"
></script>
```

## Development

See [contributing.md](contributing.md)
