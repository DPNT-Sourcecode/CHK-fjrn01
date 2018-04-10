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
    if (!skus || typeof skus != String) {
        return -1;
    }

    let sum = 0;
    const numItems = skus.length;
    for (let i = 0; i < numItems; i++) {
        const itemPrice = getItemPrice(skus[i]);
        if (itemPrice < 0) {
            return -1;
        }
        sum += itemPrice;
    }
    return sum;
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
