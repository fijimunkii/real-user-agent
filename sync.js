const count = 10; // how many user agents (10)
const url = 'https://techblog.willshouse.com/2012/01/03/most-common-user-agents/';
const cloudscraper = require('cloudscraper');
const writeFile = require('util').promisify(require('fs').writeFile);
const readFile = require('util').promisify(require('fs').readFile);
const file = require('path').join(__dirname,'ua.json');

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
  });
}

async function set(data) {
  data = JSON.stringify(data,null,2) + '\n';
  const existingData = (await readFile(file)).toString();
  if (existingData === data) {
    console.log('No changes');
    return;
  }
  await writeFile(file,data);
  console.log('New user agents synced');
}

async function sync() {
  try {
    const data = await get();
    await set(data);
  } catch(err) {
    console.log(err);
  }
}

module.exports = sync();
