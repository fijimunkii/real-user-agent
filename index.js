module.exports = () => all().then(d => d.shift());
module.exports.all = all;
module.exports.cycle = cycle;

let i = 0; // cycle inc
let cache; // simple cache
let lastUpdated; // cache invalidation
const timeToUpdate = 1000 * 60 * 60 * 2; // 2 hours
const count = 10; // how many user agents (10)
const fallbackString = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36';
const https = require('https');

async function get() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'cdn.jsdelivr.net',
      port: 443,
      path: '/gh/fijimunkii/real-user-agent@master/ua.json',
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
        // extract data
        data = buffer.join('');
        data = JSON.parse(data);
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

async function cycle(index) {
  if (index === undefined) {
    i++;
    if (i > count-1) {
      i = 0;
    }
    index = i;
  } else if (index < 1) {
    index = index * 100;
  }
  index = Math.floor(index) % count;
  const data = await all();
  return data[index];
}
