---
sidebar_position: 1
---
import PnrDemo from './../src/components/PnrDemo';

# Open PNR

An Open Source Amadeus PNR converter

## Getting Started

<PnrDemo></PnrDemo>

## Installation

Install the package

```bash
npm i open-pnr
```

## Usage
```js
import {pnrParser} from 'open-pnr';
// .... 
const parsed = pnrParser(pnrText);
console.log(parsed);
```
