module.exports = () => all().then(d => d.shift());
module.exports.all = all;
module.exports.cycle = cycle;

let i = 0; // cycle inc
let cache; // simple cache
let lastUpdated; // cache invalidation
const timeToUpdate = 1000 * 60 * 60 * 2; // 2 hours
const count = 10; // how many user agents (10)
const fallbackString = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36';
const https = require('https');

async function get() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'techblog.willshouse.com',
      port: 443,
      path: '/2012/01/03/most-common-user-agents/',
      method: 'GET'
    };
    const req = https.request(options, async (res) => {
      // download with data cap
      const maxData = 41943040; //5mb
      let totalLength = 0;
      let buffer = [];
      let data;
      try {
        for await (const chunk of res) {
          totalLength += chunk.length;
          if (totalLength > maxData)
            throw 'data cap reached';
          buffer.push(chunk);
        }
        // extract JSON
        data = buffer.join('')
          .replace(/^[\S\s]*JSON.*\[/, '[')
          .replace(/\][\S\s]*$/, ']');
        // extract data
        data = JSON.parse(data).map(d => d.useragent);
        // data integrity
        data = data.filter(d => d.substr(0, 13) === 'Mozilla/5.0 (');
        data = data.slice(0,count);
        if (data.length < count) {
          throw 'invalid data';
        }
        resolve(data);
      } catch(e) { reject(e); }
    });
    req.on('error', (e) => {
      console.error(e);
      reject(e);
    });
    req.end();
  });
}

async function all() {
  let data;
  if (cache && (new Date() - lastUpdated < timeToUpdate)) {
    data = cache;
  } else {
    try {
      data = await get();
      cache = data;
      lastUpdated = new Date();
    } catch(err) {
      console.error(err);
      data = Array.from(Array(count)).map(() => fallbackString);
    }
  }
  return data;
}

async function cycle() {
  const data = await all();
  i++;
  if (i > count-1) {
    i = 0;
  }
  return data[i];
}
