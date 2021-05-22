/// <reference types="cypress" />

before(() => {
  cy.visit("/checkout/");
});

describe("checkout page", () => {
  it("Checks if cart is empty", () => {
    cy.get(".cart-list")
      .children(".cart-list-item")
      .should("not.exist")
      .get(".cart-list")
      .contains("No products added");
  });
  it("Adds product to cart", () => {
    cy.visit("/products/")
      .get(".product-card")
      .first()
      .click()
      .get(".add2cart-btn")
      .click()
      .click()
      .visit("/checkout/", { timeout: 10000 })
      .get(".cart-list-item")
      .get(".item-qty")
      .contains(2);
  });

  it("Increses and decreses product quantity", () => {
    // eslint-disable-next-line
    cy.wait(200)
      .get(".cart-list-item")
      .find("[aria-label='prepend icon']")
      .click()
      .get(".item-qty")
      .contains(1)
      .get(".cart-list-item")
      .find("[aria-label='append icon']")
      .click()
      .get(".item-qty")
      .contains(2);
  });
});
