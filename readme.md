# Logger NPM Package

# How to Use

## Installation

```
npm i jigarkhalas-logger

```

## Importing Package

```
import logger from 'jigarkhalas-logger';

const app = express();

app.use(logger.init({
    apiKey : 'xyz' ,
    code : '123'
}))


```

## Info Method

```
import logger from 'jigarkhalas-logger';

logger.info('Hello')

```

## Warning Method

```
import logger from 'jigarkhalas-logger';

logger.warning('Warning')

```

## Error Method

```
import logger from 'jigarkhalas-logger';

logger.error(new Error('Provide instance of error'))

```
