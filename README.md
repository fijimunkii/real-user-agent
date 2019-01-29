# real-user-agent
Will the real user agent please stand up?

[![License: ISC](https://img.shields.io/npm/l/real-user-agent.svg)](https://opensource.org/licenses/ISC)

Get an up-to-date user-agent string, sourced from the [most common user agents](https://techblog.willshouse.com/2012/01/03/most-common-user-agents/). A simple cache, invalidated every 2 hours, prevents hammering the data source. A data cap is implemented in the request. There is a fallback string in case the data is corrupt or host is unreachable.

```js
const userAgent = require('real-user-agent');

// most common user-agent string
const ua = await userAgent();

// round robin top 10 most common user-agents
const randomUA = await userAgent().cycle();
const anotherUA = await userAgent().cycle();

// array of top 10 most common user-agent strings
const topTen = await userAgent().all();
```

## Authors

fijimunkii

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE.txt) file for details.
