// sensor.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test

describe('Sensor Test', () => {
    it('Visits the Sparrow Homepage', () => {
      cy.visit('http://localhost:4000/')
      /* ==== Generated with Cypress Studio ==== */
      cy.get('[data-testid="sensor[0]-details"]').click();
      cy.get('h2').should('have.text', 'Current Readings');
      cy.get('#rc-tabs-0-panel-1 > p').should('include.text', 'Last Seen:');
      cy.get('#rc-tabs-0-panel-1 > :nth-child(4)').should('include.text', 'Voltage');
      cy.get('#rc-tabs-0-panel-1 > :nth-child(5)').should('include.text', 'Temperature');
      cy.get('#rc-tabs-0-panel-1 > :nth-child(6)').should('include.text', 'Humidity');
     
      /* ==== End Cypress Studio ==== */
    })
  })
