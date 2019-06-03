const count = 10; // how many user agents (10)
const url = 'https://techblog.willshouse.com/2012/01/03/most-common-user-agents/';
const GIST_ID = '952acac988f2d25bef7e0284bc63c406';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
if (!GITHUB_TOKEN) {
  throw new Error('Missing env GITHUB_TOKEN');
}
const https = require('https');
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
  });
}

async function set(data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({files:{"ua.json":{content:JSON.stringify(data,null,2)}}});
    const options = {
      hostname: 'api.github.com',
      port: 443,
      path: `/gists/${GIST_ID}`,
      method: 'PATCH',
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'fijimunkii'
      }
    };
    const req = https.request(options, async (res) => {
      let resBody = [];
      res.on('data', d => resBody.push(d));
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(Buffer.from(resBody).toString('utf8'));
        }
        resolve();
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function sync() {
  try {
    const data = await get();
    await set(data);
    const gist = `https://gist.githubusercontent.com/fijimunkii/${GIST_ID}/raw/ua.json`;
    console.log(`User agents synced: ${url} -> ${gist}`);
  } catch(err) {
    console.log(err);
  }
}

module.exports = sync();
