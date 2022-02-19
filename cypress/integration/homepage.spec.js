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
    cy.get('[data-testid="blues-link"]').should("be.visible");
    // Check footer links are correct
    cy.get('[data-testid="notecard-link"]')
      .should("have.attr", "href")
      .and("include", "https://blues.io/products");
    cy.get('[data-testid="blues-link"]')
      .should("have.attr", "href")
      .and("include", "https://blues.io");
  });

  it("should be able to click on a gateway UID and see the details of that gateway and its related sensors", function () {
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
    // check sensor details
    cy.get('[data-testid="sensor[0]-summary"]').should("be.visible");
    cy.get('[data-testid="sensor-timestamp"]').should("be.visible");
    cy.get('[data-testid="sensor-location"]').should("be.visible");
    cy.get(".ant-card-body :nth-child(1)").should("contain", "Humidity");
    cy.get(".ant-card-body :nth-child(2)").should("contain", "Pressure");
    cy.get(".ant-card-body :nth-child(3)").should("contain", "Temperature");
    cy.get(".ant-card-body :nth-child(4)").should("contain", "Voltage");
    cy.get(".ant-card-body :nth-child(5)").should("contain", "Motion");
    //Click the sparrow Logo to return to the homepage
    cy.get('[data-testid="logo"]').click({ force: true });
    // verify it navigates back to the homepage
    cy.get('[data-testid="gateway-header"]', { timeout: 10000 }).should(
      "be.visible"
    );
  });

  it("should be able to click on a sensor card and see more details about that sensor and update the name and location of that sensor", function () {
    cy.visit("/");
    //Click the first Sensor arrow
    cy.clickSensorCard("0");
    //TODO: remove once the page architexture is fixed
    //wait for the (very slow) page to load
    //Verify the Sensor Name header
    cy.get('[data-testid="sensor-name"]', { timeout: 90000 }).should(
      "be.visible"
    );
    // Verify the parent gateway name is displayed
    cy.get('[data-testid="sensor-gateway-name"]').should("be.visible");
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
    //Verify the Voltage header
    cy.get('[data-testid="voltage"]').should("contain", "Voltage");
    //Verify the Pressure header
    cy.get('[data-testid="pressure"]').should("contain", "Pressure");
    //Verify the Motion Count header
    cy.get('[data-testid="motion-count"]').should("contain", "Motion");
    //Click the Details tab
    cy.clickTabByText("Device Details");
    //Check for the Name label
    cy.get(".ant-form-item-required").should("contain", "Name");
    //Verify the Name field exists in the Details tab
    const sensorNameInput = cy.get('[data-testid="form-input-sensor-name"]');
    sensorNameInput.should("be.visible");
    // Enter a new sensor name
    sensorNameInput.clear().type("Cypress Test Sensor");
    //Check for the location label
    cy.get(".ant-form-item-required").should("contain", "Location");
    //Verify the Location field exists in the Details tab
    const sensorLocationInput = cy.get(
      '[data-testid="form-input-sensor-location"]'
    );
    sensorLocationInput.should("be.visible");
    // Enter a new sensor location
    sensorLocationInput.clear().type("Cypress Runner");
    //Click the Submit button
    const sensorSubmitButton = cy.get('[data-testid="form-submit"]');
    sensorSubmitButton.should("be.visible");
    cy.get(".ant-form").submit();
    // Verify the sensor name is now updated to "Cypress Test Sensor"
    cy.get('[data-testid="sensor-name"]', { timeout: 15000 }).should(
      "contain",
      "Cypress Test Sensor"
    );
    // Enter a second new sensor name
    cy.get('[data-testid="form-input-sensor-name"]')
      .clear()
      .type("Other Sensor Name");
    // Enter a second new sensor location
    cy.get('[data-testid="form-input-sensor-location"]').clear().type("Garage");
    //Click the Submit button
    cy.get(".ant-form").submit();
    // Verify the sensor name is now updated to "Other Sensor Name"
    cy.get('[data-testid="sensor-name"]', { timeout: 15000 }).should(
      "contain",
      "Other Sensor Name"
    );
    //Click the sparrow Logo to return to the homepage
    cy.get('[data-testid="logo"]').click({ force: true });
    // verify the sensor location is now updated to "Garage"
    cy.get('[data-testid="sensor-location"]', { timeout: 10000 }).should(
      "contain",
      "Garage"
    );
  });
});
