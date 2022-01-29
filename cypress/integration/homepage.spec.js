// homepage.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test

it('can-visit-homepage', function() {

cy.visit('http://localhost:4000');
cy.get('[data-testid="logo"]').should('exist');
cy.get('[data-testid="company-name"]').should('exist');
cy.get('[data-testid="gateway-header"]').contains("Gateway");
cy.get('[data-testid="sensor-header"]').contains("Sensors");
cy.get('[data-testid="notecard-link"]').should('exist');
cy.get('[data-testid="blues-link"]').should('exist');
});

it('can-visit-gateway-UID', function() {
    cy.visit('http://localhost:4000');
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
    cy.get('[data-testid="sensor[0]-summary"]').click();
    //Click the sparrow Logo to return to the homepage
    cy.get('[data-testid="logo"]').click();
});

it('can-visit-sensor-UID', function() {
    cy.visit('http://localhost:4000');
    //Click the first Sensor arrow
    cy.get('[data-testid="sensor[0]-summary"]').click();
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
    //Verify the Name field in the Details tab
    //Click the Details tab 
    cy.get('[data-testid="device-details"]').click();
    cy.get('[data-testid="form-input-sensor-name"]').contains("Name");
    //Verify the Location field in the Details tab
    cy.get('[data-testid="form-input-sensor-location"]').contains("Location");
      //Verify the Location field in the Details tab
      cy.get('[data-testid="sensor-gateway"]').contains("Gateway");
      //Click the Submit button 
    cy.get('[data-testid="form-submit"]').should('exist');
    //Click the sparrow Logo to return to the homepage
    cy.get('[data-testid="logo"]').click();
});