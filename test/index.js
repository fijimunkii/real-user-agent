const userAgent = require('../index');

module.exports = t => {
  t.test('returns a user agent string', async (t) => {
    const ua = await userAgent();
    t.same(ua.substr(0, 13), 'Mozilla/5.0 (');
  });
  t.test('cycle - returns a string', async (t) => {
    const ua = await userAgent.cycle();
    t.type(ua, 'string');
  });
  t.test('all - returns an array', async (t) => {
    const all = await userAgent.all();
    t.type(all, Array);
  });
};

if (!module.parent) module.exports(require('tap'));
