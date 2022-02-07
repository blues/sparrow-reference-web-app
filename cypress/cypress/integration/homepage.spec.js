// homepage.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test

describe('Sparrow Pages', () => {


it('can-visit-homepage', function() {

cy.visit("http://localhost:4000");
cy.get('[data-testid="logo"]').should('exist');
cy.get('[data-testid="company-name"]').should('exist');
cy.get('[data-testid="gateway-header"]').contains("Gateway");
 //Check for the Gateway Name label
 cy.get(".ant-card-head-title").should('exist');
cy.get('[data-testid="sensor-header"]').contains("Sensors");
cy.get('[data-testid="notecard-link"]').should('exist');
cy.get('[data-testid="blues-link"]').should('exist');
});

it('can-visit-gateway-UID', function() {
    cy.visit("http://localhost:4000");
    //Click the Gateway Details arrow
    cy.get('[data-testid="gateway[0]-details"]').click();
    //Verify the Gateway Details header
    cy.get('[data-testid="gateway-details-header"]').contains("Gateway Details");
    //
    cy.get('[data-testid="gateway-name"]').contains("Device Name");
    //
    cy.get('[data-testid="gateway-location"]').contains("Location");
    //
    cy.get('[data-testid="gateway-last-seen"]').contains("Last Seen");
    //Verify the Sensors header
    cy.get('[data-testid="gateway-sensor-header"]').contains("Sensors");
    //Click the first Sensor arrow
   // cy.get('[data-testid="sensor[0]-summary"]').click();
    cy.clickSensorCard("0");
    //Click the sparrow Logo to return to the homepage
    cy.get('[data-testid="logo"]').click();
});

it('can-visit-sensor-UID', function() {
    cy.visit("http://localhost:4000");
    //Click the first Sensor arrow
    cy.clickSensorCard("0");
    //cy.get('[data-testid="sensor[0]-summary"]').click();
    //TODO: remove once the page architexture is fixed
    //wait for the (very slow) page to load
    cy.wait(5000);
    //Verify the Sensor Name header
    cy.get('[data-testid="sensor-name"]').should('exist');
    //Verify the Current Readings header
    cy.get('[data-testid="current-readings"]').contains("Current Readings");
     //Verify the Last Seen header
     cy.get('[data-testid="last-seen"]').contains("Last Seen");
      //Verify the Temperature header
    cy.get('[data-testid="temperature"]').contains("Temperature");
     //Verify the Humidity header
     cy.get('[data-testid="humidity"]').contains("Humidity");
      //Verify the Pressure header
      cy.get('[data-testid="pressure"]').contains("Pressure");
      //Verify the Voltage header
    cy.get('[data-testid="voltage"]').contains("Voltage");
    //Click the Details tab 
    cy.clickTabByText("Device Details");
    //Check for the Name label
    cy.get(".ant-form-item-required").contains("Name");
    //Verify the Name field exists in the Details tab
    cy.get('[data-testid="form-input-sensor-name"]').should('exist');
     //Check for the lOcation label
     cy.get(".ant-form-item-required").contains("Location");
    //Verify the Location field exists in the Details tab
    cy.get('[data-testid="form-input-sensor-location"]').should('exist');
      //Verify the Location field in the Details tab
      cy.get('[data-testid="sensor-gateway-name"]').contains("Gateway");
      //Click the Submit button 
    cy.get('[data-testid="form-submit"]').should('exist');
    //Click the sparrow Logo to return to the homepage
    cy.get('[data-testid="logo"]').click();
});
});