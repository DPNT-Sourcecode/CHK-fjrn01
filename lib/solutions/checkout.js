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
| G    | 20    |                        |
| H    | 10    | 5H for 45, 10H for 80  |
| I    | 35    |                        |
| J    | 60    |                        |
| K    | 80    | 2K for 150             |
| L    | 90    |                        |
| M    | 15    |                        |
| N    | 40    | 3N get one M free      |
| O    | 10    |                        |
| P    | 50    | 5P for 200             |
| Q    | 30    | 3Q for 80              |
| R    | 50    | 3R get one Q free      |
| S    | 30    |                        |
| T    | 20    |                        |
| U    | 40    | 3U get one U free      |
| V    | 50    | 2V for 90, 3V for 130  |
| W    | 20    |                        |
| X    | 90    |                        |
| Y    | 10    |                        |
| Z    | 50    |                        |
+------+-------+------------------------+
*/

const PRICES = {
    "A": 50,
    "B": 30,
    "C": 20,
    "D": 15,
    "E": 40,
    "F": 10,
    "G": 20, //                        |
    "H": 10,
    "I": 35, //                        |
    "J": 60, //                        |
    "K": 80, // 2K for 150             |
    "L": 90, //                        |
    "M": 15, //                        |
    "N": 40, // 3N get one M free      |
    "O": 10, //                        |
    "P": 50, // 5P for 200             |
    "Q": 30, // 3Q for 80              |
    "R": 50, // 3R get one Q free      |
    "S": 30, //                        |
    "T": 20, //                        |
    "U": 40, // 3U get one U free      |
    "V": 50, // 2V for 90, 3V for 130  |
    "W": 20, //                        |
    "X": 90, //                        |
    "Y": 10, //                        |
    "Z": 50, //                        |
};

// Offers will be applied and consumed in order
// best offers should come first to ensure that
// they consume products before worse offers.
const OFFERS = [
    multibuy("A", 5, 50),
    multibuy("A", 3, 20),
    buyXGetYFree("E", 2, "B"),
    multibuy("B", 2, 15),
    buyXGetAnotherFree("F", 2),
    multibuy("H", 10, 80),
    multibuy("H", 5, 45),
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
function buyXGetAnotherFree(sku, amount) {
    const amountWithFreeItem = amount + 1;
    const price = getItemPrice(sku);
    if (price < 0) {
        throw new Error(`Unkown SKU: ${sku}`);
    }

    return (skus) => {
        const xcount = countOccurances(skus, sku);
        const eligableFreeItems = Math.floor(xcount / amountWithFreeItem);
        const remaining = consume(skus, sku, eligableFreeItems * amountWithFreeItem);
        const discount = eligableFreeItems * price;
        return { discount, remaining };
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