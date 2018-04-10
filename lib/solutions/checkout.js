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
| F    | 10    | 2F get one F free      |
+------+-------+------------------------+
*/

const PRICES = {
    "A": 50,
    "B": 30,
    "C": 20,
    "D": 15,
    "E": 40,
    "F": 10,
};

// Offers will be applied and consumed in order
// best offers should come first to ensure that
// they consume products before worse offers.
const OFFERS = [
    multibuy("A", 5, 50),
    multibuy("A", 3, 20),
    buyXGetYFree("E", 2, "B"),
    multibuy("B", 2, 15),
    buyXGetYFree("F", 2, "F"),
];

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

function getItemPrice(sku) {
    if (!PRICES.hasOwnProperty(sku)) {
        return -1;
    }
    return PRICES[sku];
}

function multibuy(sku, amount, discount) {
    return (skus) => {
        const count = countOccurances(skus, sku);
        const multiBuysPresent = Math.floor(count / amount);
        const remaining = consume(skus, sku, multiBuysPresent * amount);
        const value = multiBuysPresent * discount;
        return { discount: value, remaining };
    }
}

function buyXGetYFree(xsku, xamount, ysku) {
    const yprice = getItemPrice(ysku);
    if (yprice < 0) {
        throw new Error(`Unkown SKU: ${ysku}`);
    }

    return (skus) => {
        const xcount = countOccurances(skus, xsku);
        const ycount = countOccurances(skus, ysku);
        const maxEligableDiscounts = Math.floor(xcount / xamount);
        const numberOfFreeProducts = Math.min(ycount, maxEligableDiscounts);
        const remainingWithXRemoved = consume(skus, xsku, numberOfFreeProducts * xamount);
        const remaining = consume(remainingWithXRemoved, ysku, numberOfFreeProducts);
        const discount = numberOfFreeProducts * yprice;
        return { discount, remaining };
    }
}

// TODO can this be combined with buyXGetYFree?
function buyXGetAnotherFree(xsku, amount) {
    const yprice = getItemPrice(ysku);
    if (yprice < 0) {
        throw new Error(`Unkown SKU: ${ysku}`);
    }

    return (skus) => {

    }
}

function calculateDiscount(skus) {
    let discount = 0;
    let remaining = skus;
    OFFERS.forEach(offer => {
        const result = offer(remaining);
        discount += result.discount;
        remaining = result.remaining;
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
        remaining = remaining.replace(sku, "");
    }
    return remaining;
}
