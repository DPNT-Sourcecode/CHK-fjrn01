'use strict';

/*
+------+-------+------------------------+
| Item | Price | Special offers         |
+------+-------+------------------------+
| A    | 50    | 3A for 130, 5A for 200 |
| B    | 30    | 2B for 45              |
| C    | 20    |                        |
| D    | 15    |                        |
| E    | 40    | 2E get one B free      |
+------+-------+------------------------+
*/

//noinspection JSUnusedLocalSymbols
module.exports = function (skus) {
    if (typeof skus !== "string") {
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

    sum -= calculateDiscount(skus);
    return sum;
};

const getItemPrice = (sku) => {
    switch (sku) {
        case "A": return 50;
        case "B": return 30;
        case "C": return 20;
        case "D": return 15;
        case "E": return 40;
        default:  return -1;
    }
}

function multibuy(sku, amount, discount) {
    return (skus) => {
        const count = countOccurances(skus, sku);
        const multiBuysPresent = Math.floor(count / amount);
        const remaining = consumes(skus, sku, multiBuysPresent * amount);
        const discount = multiBuysPresent * discount;
        return { discount, remaining };
    }
}

function buyXGetYFree(xsku, xamount, ysku, yamount) {
    const yprice = getItemPrice(ysku);
    if (yprice < 0) {
        throw new Error(`Unkown SKU: ${ysku}`);
    }

    return (skus) => {
        const xcount = countOccurances(skus, xsku);
        const ycount = countOccurances(skus, ysku);
        const maxEligableDiscounts = Math.floor(xcount / xamount);
        const numberOfFreeProducts = Math.min(ycount, maxEligableDiscounts);
        const remaining = consume(skus, xsku, numberOfFreeProducts * xamount);
        const discount = numberOfFreeProducts * yprice;
        return { discount, remaining };
    }
}

function calculateDiscount(skus) {
    // Offers will be applied and consumed in order
    // best offers should come first to ensure that
    // they consume products before worse offers.
    const currentOffers = [
        multibuy("A", 5, 50),
        multibuy("A", 3, 20),
        multibuy("B", 2, 15),
        buyXGetYFree("E", 2, "B", 1)
    ];

    let discount = 0;
    let remaining = skus;
    currentOffers.forEach(offer => {

        discount += offer(skus)
    });
    return discount;
}

function countOccurances(str, value) {
    var regExp = new RegExp(value, "gi");
    return (str.match(regExp) || []).length;
}

function consume(skus, sku, amount) {
    let remaining = skus;
    for (let i = 0; i < amount; i++) {
        remaining = skus.replace(sku, "");
    }
    return remaining;
}
