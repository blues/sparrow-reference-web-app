// sensor.spec.js created with Cypress

describe("Sensor Details page", () => {
  it("should successfully render the sensor details page and contents", () => {
    cy.visit("/");
    //Click the first Sensor arrow
    cy.clickSensorCard("0");
    //TODO: remove once the page architexture is fixed
    //wait for the (very slow) page to load
    //Verify the Sensor Name header
    cy.get('[data-testid="sensor-name"]', { timeout: 60000 }).should(
      "be.visible"
    );
    //Verify the Current Readings header
    cy.get('[data-testid="current-readings"]').should(
      "contain",
      "Current Readings"
    );
    //Verify the Last Seen header
    cy.get('[data-testid="last-seen"]').should("contain", "Last updated");
    //Verify the Temperature header
    cy.get('[data-testid="temperature"]').should("contain", "Temperature");
    //Verify the Humidity header
    cy.get('[data-testid="humidity"]').should("contain", "Humidity");
    //Verify the Pressure header
    cy.get('[data-testid="pressure"]').should("contain", "Pressure");
    //Verify the Voltage header
    cy.get('[data-testid="voltage"]').should("contain", "Voltage");
    //Click the Details tab
    cy.clickTabByText("Device Details");
    //Check for the Name label
    cy.get(".ant-form-item-required").should("contain", "Name");
    //Verify the Name field exists in the Details tab
    cy.get('[data-testid="form-input-sensor-name"]').should("be.visible");
    //Check for the location label
    cy.get(".ant-form-item-required").should("contain", "Location");
    //Verify the Location field exists in the Details tab
    cy.get('[data-testid="form-input-sensor-location"]').should("be.visible");
    //Verify the Location field in the Details tab
    cy.get('[data-testid="sensor-gateway-name"]').should("contain", "Gateway");
    //Click the Submit button
    cy.get('[data-testid="form-submit"]').should("be.visible");
    //Click the sparrow Logo to return to the homepage
  });
});
