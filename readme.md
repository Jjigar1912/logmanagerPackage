# Logger NPM Package

# How to Use

## Installation

```
npm i logger


const app = express();

app.use(logger.init({
    apiKey : 'xyz' ,
    code : '123'
}))

```

## Info Method

```
import logger from 'logger';

logger.info('Hello')

```

## Warning Method

```
import logger from 'logger';

logger.warning('Warning')

```

## Error Method

```
import logger from 'logger';

logger.error(new Error('Provide instance of error'))

```
