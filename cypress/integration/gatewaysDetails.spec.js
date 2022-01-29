// gatewaysDetails.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test
/* ==== Test Created with Cypress Studio ==== */
it('gatewayDetail', function() {
  /* ==== Generated with Cypress Studio ==== */
  cy.visit('http://localhost:4000/');
  //cy.get(':nth-child(2) > .ant-card > .ant-card-head > .ant-card-head-wrapper > .ant-card-extra > a').click();
  cy.get('[data-testid="gateway[0]-details"]').click()
  /* ==== End Cypress Studio ==== */
  /* ==== Generated with Cypress Studio ==== */
  cy.get('.ant-layout-content > :nth-child(1) > h1').should('have.text', 'Gateway Details');
  cy.get('.Home_container__CCFUG > :nth-child(1)').should('include.text', 'Gateway');
  cy.get('.Home_container__CCFUG > :nth-child(2) > :nth-child(1)').should('include.text', 'Device Name: ');
  cy.get('.Home_container__CCFUG > :nth-child(2) > :nth-child(3)').should('include.text', 'Location:');
  cy.get('.Home_container__CCFUG > :nth-child(2) > :nth-child(5)').should('include.text', 'Last Seen:');
  cy.get('.Home_container__CCFUG > :nth-child(3)').should('have.text', 'Sensors');
  cy.get(':nth-child(1) > .ant-card-head > .ant-card-head-wrapper > .ant-card-head-title').should('be.visible');
  cy.get(':nth-child(1) > .ant-card-body > ul > :nth-child(1)').should('include.text', 'Temperature: ');
  cy.get(':nth-child(1) > .ant-card-body > ul > :nth-child(2)').should('include.text', 'Humidity:');
  cy.get(':nth-child(1) > .ant-card-body > ul > :nth-child(4)').should('include.text', 'Battery:');
  cy.get(':nth-child(1) > .ant-card-body > ul > :nth-child(5)').should('include.text', 'Last active:');

  cy.get('[data-testid="sensor[0]-summary"]').click()
  
  /* ==== End Cypress Studio ==== */
});
