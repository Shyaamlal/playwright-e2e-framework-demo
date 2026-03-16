/**
 * Product test data for SauceDemo
 * Each product has two button states: addToCart (before) and remove (after).
 * Pattern: add-to-cart-{slug} → remove-{slug} — same element, two states.
 */
export const PRODUCTS = {
  backpack: {
    addToCart: 'add-to-cart-sauce-labs-backpack',
    remove: 'remove-sauce-labs-backpack',
  },
  bikeLight: {
    addToCart: 'add-to-cart-sauce-labs-bike-light',
    remove: 'remove-sauce-labs-bike-light',
  },
  boltTShirt: {
    addToCart: 'add-to-cart-sauce-labs-bolt-t-shirt',
    remove: 'remove-sauce-labs-bolt-t-shirt',
  },
  fleeceJacket: {
    addToCart: 'add-to-cart-sauce-labs-fleece-jacket',
    remove: 'remove-sauce-labs-fleece-jacket',
  },
  onesie: {
    addToCart: 'add-to-cart-sauce-labs-onesie',
    remove: 'remove-sauce-labs-onesie',
  },
  redTShirt: {
    addToCart: 'add-to-cart-test.allthethings()-t-shirt-(red)',
    remove: 'remove-test.allthethings()-t-shirt-(red)',
  },
};
