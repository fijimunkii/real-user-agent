module.exports = () => all().then(d => d.shift());
module.exports.all = all;
module.exports.cycle = cycle;

let i = 0; // cycle inc
let cache; // simple cache
let lastUpdated; // cache invalidation
const timeToUpdate = 1000 * 60 * 60 * 2; // 2 hours
const count = 10; // how many user agents (10)
const fallbackString = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36';
const url = 'https://techblog.willshouse.com/2012/01/03/most-common-user-agents/';
const cloudscraper = require('cloudscraper');

async function get() {
  return cloudscraper.get(url).then(html => {
    let data;
    // extract JSON
    data = html
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
    return data;
  })
  .catch(err => {
    console.log('sourcing user-agents failed: using fallback');
    return fallbackString;
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
