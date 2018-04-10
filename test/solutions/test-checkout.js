var checkout = require('../../lib/solutions/checkout');

/*
+------+-------+---------------------------------+
| Item | Price | Special offers                  |
+------+-------+---------------------------------+
| A    | 50    | 3A for 130, 5A for 200          |
| B    | 30    | 2B for 45                       |
| C    | 20    |                                 |
| D    | 15    |                                 |
| E    | 40    | 2E get one B free               |
| F    | 10    | 2F get one F free               |
| G    | 20    |                                 |
| H    | 10    | 5H for 45, 10H for 80           |
| I    | 35    |                                 |
| J    | 60    |                                 |
| K    | 70    | 2K for 120                      |
| L    | 90    |                                 |
| M    | 15    |                                 |
| N    | 40    | 3N get one M free               |
| O    | 10    |                                 |
| P    | 50    | 5P for 200                      |
| Q    | 30    | 3Q for 80                       |
| R    | 50    | 3R get one Q free               |
| S    | 20    | buy any 3 of (S,T,X,Y,Z) for 45 |
| T    | 20    | buy any 3 of (S,T,X,Y,Z) for 45 |
| U    | 40    | 3U get one U free               |
| V    | 50    | 2V for 90, 3V for 130           |
| W    | 20    |                                 |
| X    | 17    | buy any 3 of (S,T,X,Y,Z) for 45 |
| Y    | 20    | buy any 3 of (S,T,X,Y,Z) for 45 |
| Z    | 21    | buy any 3 of (S,T,X,Y,Z) for 45 |
+------+-------+---------------------------------+
*/

exports['checkout single items with correct price'] = function (test) {
    test.equal(checkout("A"), 50);
    test.equal(checkout("B"), 30);
    test.equal(checkout("C"), 20);
    test.equal(checkout("D"), 15);
    test.equal(checkout("E"), 40);
    test.equal(checkout("F"), 10);
    test.equal(checkout(""), 0);
    test.done();
};

exports['checkout invalid item gives price of -1'] = function (test) {
    test.equal(checkout("56"), -1);
    test.equal(checkout(undefined), -1);
    test.equal(checkout(null), -1);
    test.equal(checkout(-50), -1);
    test.equal(checkout(10), -1);
    test.done();
};

exports['checkout mulitple items gives total'] = function (test) {
    test.equal(checkout("ABCD"), 115);
    test.equal(checkout("AA"), 100);
    test.equal(checkout("DDDD"), 60);
    test.equal(checkout("CCDD"), 70);
    test.done();
}

exports['checkout correctly applies multi-buy discounts'] = function (test) {
    test.equal(checkout("AAA"), 130);
    test.equal(checkout("BB"), 45);
    test.done();
}

exports['checkout applies more than one multi-buy in a single transaction'] = function (test) {
    test.equal(checkout("BBBB"), 90);
    test.equal(checkout("AAABB"), 175);
    test.equal(checkout("AAAC"), 150);
    test.equal(checkout("DDBB"), 75);
    test.done();
}

exports['checkout gives B when purchasing 2E'] = function (test) {
    test.equal(checkout("EEB"), 80);
    test.equal(checkout("EEEEBB"), 160);
    test.equal(checkout("BEBEEE"), 160);
    test.done();
}

exports['checkout gives the best offer when two offers conflict'] = function (test) {
    test.equal(checkout("AAAAA"), 200); // 5A for 200
    test.equal(checkout("AAAAAA"), 250); // 5A for 200 and 1A for 50
    test.equal(checkout("AAAAAAAAA"), 380); // 5A for 200 3A for 130 and 1A for 50
    test.equal(checkout("ABCDEABCDE"), 280); // 2E = 1B Free
    test.done();
}

exports['checkout gives free F when three are purchased'] = function (test) {
    test.equal(checkout("FFF"), 20);
    test.equal(checkout("FFFFF"), 40);
    test.equal(checkout("FFFFFF"), 40);
    test.done();
}

exports['checkout allows a group to be purchased at a fixed price'] = function (test) {
    test.equal(checkout("STX"), 45);
    test.equal(checkout("STXYZ"), 82);
    test.equal(checkout("ZZZZZZ"), 90);
    test.equal(checkout("XZZZ"), 62);
    test.equal(checkout("XSYSTZ"), 90);
    test.done();
}