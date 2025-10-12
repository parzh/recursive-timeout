# `recursive-timeout`

[![npm version](https://badge.fury.io/js/recursive-timeout.svg)](https://badge.fury.io/js/recursive-timeout)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A simple solution to a classic problem: `setInterval` implemented as recursive `setTimeout` calls.

This package is designed to be a drop-in replacement for the normal `setInterval`.

## "Why exactly do I need this?"

Take a look at [this section from javascript.info](https://javascript.info/settimeout-setinterval#nested-settimeout), it outlines the problem and the solution.

Basically, the normal `setInterval` doesn't wait for the callback to happen, – it schedules the next iteration right away:

```js
function runsForOneSecond() {
  const startTime = Date.now()

  while (Date.now() - startTime < 1000) { /* just wait */ }

  console.log(Date.now(), 'Done!')
}

console.log(Date.now(), 'Start')
setInterval(runsForOneSecond, 500)
// logs (approximately):
// 1234567890000 Start
// 1234567891500 Done!
// 1234567892500 Done!
// 1234567893500 Done!
```

… while the "recursive timeout" approach necessarily waits for the callback to finish before scheduling the next call:

```js
import { setInterval } from 'recursive-timeout'

console.log(Date.now(), 'Start')
setInterval(runsForOneSecond, 500)
// logs (approximately):
// 1234567890000 Start
// 1234567891500 Done!
// 1234567893000 Done!
// 1234567894500 Done!
```

## Features

- **Dual Module Support:** Works seamlessly with both ECMAScript Modules (`import`) and CommonJS (`require`).
- **Familiar API:** Designed as a drop-in replacement for `setInterval`.
- **Promise-based API:** ⚠️ _(coming soon)_ ⚠️ A promise-based interface for use with asynchronous callbacks.

## Installation

```bash
npm install recursive-timeout
```

## Usage

The API is straightforward and mirrors the native `setInterval` function.

### Callback-Based API

This is the standard way to use the package, ideal for most cases.

<!-- *** -->

#### ECMAScript

```js
import { setInterval } from 'recursive-timeout'
```

#### ECMAScript (promise-based)

⚠️ _(coming soon)_ ⚠️

```js
import { setInterval } from 'recursive-timeout/promises'
```

```js
import { promises } from 'recursive-timeout'

promises.setInterval(…)
```

#### CommonJS

```js
const { setInterval } = require('recursive-timeout')
```

#### CommonJS (promise-based)

⚠️ _(coming soon)_ ⚠️

```js
const { setInterval } = require('recursive-timeout/promises')
```

```js
const { promises } = require('recursive-timeout')

promises.setInterval(…)
```

## License

This project is licensed under the MIT License.
