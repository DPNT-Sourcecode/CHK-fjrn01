var hello = require('../../lib/solutions/hello');

exports['say hello'] = function (test) {
    test.equal(hello("friend"), "Hello, World!");
    test.done();
};
