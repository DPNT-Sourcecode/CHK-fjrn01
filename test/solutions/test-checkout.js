var checkout = require('../../lib/solutions/checkout');

/*
+------+-------+----------------+
| Item | Price | Special offers |
+------+-------+----------------+
| A    | 50    | 3A for 130     |
| B    | 30    | 2B for 45      |
| C    | 20    |                |
| D    | 15    |                |
+------+-------+----------------+
*/

exports['checkout single items with correct price'] = function (test) {
    test.equal(checkout("A"), 50);
    test.equal(checkout("B"), 30);
    test.equal(checkout("C"), 20);
    test.equal(checkout("D"), 15);
    test.done();
};

exports['checkout invalid item gives price of -1'] = function (test) {
    test.equal(checkout("ABC"), -1);
    test.equal(checkout("Z"), -1);
    test.equal(checkout("56"), -1);
    test.equal(checkout(undefined), -1);
    test.equal(checkout(null), -1);
    test.equal(checkout(-50), -1);
    test.equal(checkout(10), -1);
    test.done();
};
