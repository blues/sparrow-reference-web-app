// homepage.spec.js created with Cypress

describe("Sparrow Application", () => {
  it("should be able to see gateways and sensors on homepage dashboard", function () {
    cy.visit("/");
    // Check logo is visible
    cy.get('[data-testid="logo"]').should("be.visible");
    // Check company name in header is visible
    cy.get('[data-testid="company-name"]').should("be.visible");
    // Check Gateways header is visible
    cy.get('[data-testid="gateway-header"]').should("contain", "Gateways");
    // Check Sensors header is visible
    cy.get('[data-testid="sensor-header"]').should("contain", "Sensors");
    // Check footer elements are visible
    cy.get('[data-testid="notecard-link"]').should("be.visible");
    cy.get('[data-testid="notecard-link"]')
      .should("have.attr", "href")
      .and("include", "https://blues.io/products");
    cy.get('[data-testid="blues-link"]').should("be.visible");
    cy.get('[data-testid="blues-link"]')
      .should("have.attr", "href")
      .and("include", "https://blues.io");
  });

  it("should be able to click on a gateway UID and see the details of that gateway and it's related sensors", function () {
    cy.visit("/");
    //Click the Gateway Details arrow
    cy.clickGatewayCard("0");
    //Verify the Gateway Details header
    cy.get('[data-testid="gateway-details-header"]', { timeout: 5000 }).should(
      "contain",
      "Gateway"
    );
    // check for gateway details
    cy.get(".ant-card-body").should("contain", "Location");
    cy.get('[data-testid="gateway-location"]').should("be.visible");
    cy.get(".ant-card-body").should("contain", "Voltage");
    cy.get('[data-testid="gateway-last-seen"]').should("contain", "Last seen");
    // check for sensors related to gateway
    cy.get('[data-testid="gateway-sensor-header"]').should(
      "contain",
      "Sensors"
    );
    //Click the sparrow Logo to return to the homepage
    cy.get('[data-testid="logo"]').click();
    // verify it navigates back to the homepage
    cy.get('[data-testid="company-name"]').should("be.visible");
  });

  it("should be able to click on a sensor card and see more details about that sensor", function () {
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
    cy.get('[data-testid="logo"]').click();
    // verify it navigates back to the homepage
    cy.get('[data-testid="company-name"]').should("be.visible");
  });
});
