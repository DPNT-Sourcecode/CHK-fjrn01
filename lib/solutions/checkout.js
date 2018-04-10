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
    if (!skus || typeof skus !== "string") {
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

    sum -= discountAmount(skus);
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

const currentOffers = {
    "A": { amount: 3, discount: 20 },
    "B": { amount: 2, discount: 15 },
}

const discountAmount = (skus) => {
    let discount = 0;
    for (let sku in currentOffers) {
        const offer = currentOffers[sku];
        const count = countOccurances(skus, sku);
        if (count >= offer.amount) {
            discount += offer.discount;
        }
        // TODO if we can apply multiple offers in a single transaction
        //discount +=  Math.floor(count / offer.amount) * offer.discount;
    }
    return discount;
}

function countOccurances(str, value) {
    var regExp = new RegExp(value, "gi");
    return (str.match(regExp) || []).length;
  }
