'use strict';

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

//noinspection JSUnusedLocalSymbols
module.exports = function (skus) {
    // TODO handle multiple products
    return getItemPrice(skus);
};

const getItemPrice = (sku) => {
    switch (sku) {
        case "A": return 50;
        case "B": return 30;
        case "C": return 20;
        case "D": return 15;
        default:  return -1;
    }
}