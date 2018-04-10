var hello = require('../../lib/solutions/hello');

exports['say hello'] = function (test) {
    test.equal(hello("friend"), "Hello, friend!");
    test.equal(hello("John"), "Hello, John!");
    test.done();
};
