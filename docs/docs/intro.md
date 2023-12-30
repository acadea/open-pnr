---
sidebar_position: 1
---
import { Alert } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

# Open PNR

An Open Source Amadeus PNR converter.

<Alert variant="light" color="blue" title="Disclaimer" icon={<IconInfoCircle />}>
  <span>Note: This is not an official PNR converter, there may be errors or bugs. If you found any issues, please raise it on [Github](https://github.com/acadea/open-pnr/issues)</span>
</Alert>

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

## Contributing
Contributions are welcome and will be fully credited.

Please submit a pull request if you noticed an error or wanted to improve the source code.