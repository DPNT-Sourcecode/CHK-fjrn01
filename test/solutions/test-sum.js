var sum = require('../../lib/solutions/sum');

exports['compute sum'] = function (test) {
    test.equal(sum(1, 2), 3);
    test.done();
};
