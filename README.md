# real-user-agent
Will the real user agent please stand up?

[![License: ISC](https://img.shields.io/npm/l/real-user-agent.svg)](https://opensource.org/licenses/ISC)

Get an up-to-date user-agent string, sourced from the [most common user agents](https://techblog.willshouse.com/2012/01/03/most-common-user-agents/). A simple cache, invalidated every 2 hours, prevents hammering the data source. A data cap is implemented in the request. There is a fallback string in case the data is corrupt or host is unreachable.

```js
const userAgent = require('real-user-agent');

// most common user-agent string
const ua = await userAgent();

// array of top 10 most common user-agent strings
const topTen = await userAgent().all();

// 5th most common user-agent
const notSoCommon = (await userAgent().all())[4];

// round robin top 10 most common user-agents
const randomUA = await userAgent().cycle();
const anotherUA = await userAgent().cycle();
```

```js
const request = require('request');
const userAgent = require('real-user-agent');
request({
  url: 'https://api.github.com/repos/fijimunkii/real-user-agent',
  headers: {
    'user-agent': await userAgent()
  }
});
```

## Authors

fijimunkii

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE.txt) file for details.
