/// <reference types="cypress" />

before(() => {
  cy.visit("/");
});
describe("Home page testing", () => {
  it("Loads home page", () => {
    cy.get(".featured-product").should("contain.text", "shop now");
  });
  it("Contains banner", () => {
    cy.get(".image-body");
  });
  it("opens and closes bottom cart section on mobile", () => {
    cy.viewport(599, 1080)
      .get(".mobile-cart-btn")
      .should("be.visible")
      .click()
      .get(".v-bottom-sheet")
      .should("be.visible")
      .get(".close-btn")
      .click()
      .get(".v-bottom-sheet")
      .should("not.be.visible")
      .viewport(601, 1080)
      .get(".mobile-cart-btn")
      .should("not.be.visible");
  });
  it("opens and closes cart dropdown on desktop", () => {
    cy.get(".cart-btn")
      .should("be.visible")
      .click()
      .get(".v-menu__content")
      .should("be.visible")
      .contains("checkout", {
        matchCase: false
      })
      .get(".cart-btn")
      .click()
      .get(".v-menu__content")
      .should("not.be.visible")
      .viewport(599, 1080)
      .get(".cart-btn")
      .should("not.be.visible");
  });
});
