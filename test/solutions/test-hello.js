var hello = require('../../lib/solutions/hello');

exports['say hello'] = function (test) {
    test.equal(hello("anything"), "Hello, world");
    test.done();
};
