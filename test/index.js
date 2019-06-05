const userAgent = require('../index');
const uaJSON = require('../ua');

module.exports = t => {
  t.test('returns a user agent string', async (t) => {
    const ua = await userAgent();
    t.same(ua.substr(0, 13), 'Mozilla/5.0 (');
  });
  t.test('cycle - returns a string', async (t) => {
    const ua = await userAgent.cycle();
    t.type(ua, 'string');
  });
  t.test('cycle - cycles through strings', async (t) => {
    const ua1 = await userAgent.cycle();
    const ua2 = await userAgent.cycle();
    t.notEqual(ua1, ua2);
  });
  t.test('cycle - can be provided an index', async (t) => {
    const ua1 = await userAgent.cycle(0);
    const ua2 = await userAgent.cycle(0);
    t.equal(ua1, ua2);
    const ua3 = await userAgent.cycle(1);
    t.notEqual(ua2, ua3);
  });
  t.test('cycle - can be provided a uid', async (t) => {
    const uid = 1;
    const uid2 = 2;
    const ua1 = await userAgent.cycle(uid);
    const ua2 = await userAgent.cycle(uid);
    t.equal(ua1, ua2);
    const ua3 = await userAgent.cycle(uid2);
    t.notEqual(ua2, ua3);
  });
  t.test('all - returns an array', async (t) => {
    const all = await userAgent.all();
    t.type(all, Array);
  });
  t.test('ua.json - is an array of 10 user agent strings', async (t) => {
    t.type(uaJSON, Array);
    t.same(uaJSON.length, 10);
    t.type(uaJSON[0], 'string');
    t.same(uaJSON[0].substr(0, 13), 'Mozilla/5.0 (');
  });

};

if (!module.parent) module.exports(require('tap'));
