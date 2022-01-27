// paige_test.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test
/* ==== Test Created with Cypress Studio ==== */
it("Tabs_Test", function () {
  /* ==== Generated with Cypress Studio ==== */
  cy.visit("/");
  cy.selectSensorCard("0");
  // waits for device details page to render
  cy.get("h2").should("be.visible");
  cy.selectTab("0", "2");
  cy.selectTab("0", "1");
  /* ==== End Cypress Studio ==== */
});

it("Tabs_Test_2", function () {
  /* ==== Generated with Cypress Studio ==== */
  cy.visit("/");
  cy.selectSensorCard("1");
  // waits for device details page to render
  cy.get("h2").should("be.visible");
  cy.selectTabByText("Device Details");
  cy.selectTabByText("Summary");
  /* ==== End Cypress Studio ==== */
});
