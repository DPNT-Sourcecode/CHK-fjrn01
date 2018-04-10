'use strict';

const PRICES = {
    "A": 50,
    "B": 30,
    "C": 20,
    "D": 15,
    "E": 40,
    "F": 10,
    "G": 20,
    "H": 10,
    "I": 35,
    "J": 60,
    "K": 70,
    "L": 90,
    "M": 15,
    "N": 40,
    "O": 10,
    "P": 50,
    "Q": 30,
    "R": 50,
    "S": 20,
    "T": 20,
    "U": 40,
    "V": 50,
    "W": 20,
    "X": 17,
    "Y": 20,
    "Z": 21,
};

// Offers will be applied and consumed in order
// best offers should come first to ensure that
// they consume products before worse offers.
const OFFERS = [
    multibuy("A", 5, 200),
    multibuy("A", 3, 130),
    buyXGetYFree("E", 2, "B"),
    multibuy("B", 2, 45),
    buyXGetAnotherFree("F", 2),
    multibuy("H", 10, 80),
    multibuy("H", 5, 45),
    multibuy("K", 2, 120),
    buyXGetYFree("N", 3, "M"),
    multibuy("P", 5, 200),
    buyXGetYFree("R", 3, "Q"),
    multibuy("Q", 3, 80),
    buyXGetAnotherFree("U", 3),
    multibuy("V", 3, 130),
    multibuy("V", 2, 90),
    buyAny("STXYZ", 3, 45),
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

function getItemsPrice(skus) {
    let result = 0;
    skus.forEach(sku => result += getItemPrice(sku));
    return result;
}

function multibuy(sku, amount, price) {
    const unitPrice = getItemPrice(sku);
    const ordinaryPrice = unitPrice * amount;
    const discount = ordinaryPrice - price;

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

function buyAny(groupSkus, amount, price) {
    const groupOrdered = groupSkus.split("").sort((a, b) => getItemPrice(b) - getItemPrice(a));

    return (skus) => {
        const results = [];
        groupOrdered.forEach(sku => {
            const n = countOccurances(skus, sku);
            for (let i = 0; i < n; i++) {
                results.push(sku);
            }
        });

        const offerCount = Math.floor(results.length / amount);
        results.length = offerCount * amount;
        const discountedPrice = offerCount * price;
        const originalPrice = getItemsPrice(results);

        const discount = originalPrice - discountedPrice;
        const remaining = consumeItems(skus, results);
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

function consumeItems(skus, items) {
    let remaining = skus;
    items.forEach(sku => {
        remaining = remaining.replace(sku, "");
    });
    return remaining;
}