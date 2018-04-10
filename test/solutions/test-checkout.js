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

exports['checkout'] = function (test) {
    test.equal(checkout("A"), 50);
    test.done();
};
