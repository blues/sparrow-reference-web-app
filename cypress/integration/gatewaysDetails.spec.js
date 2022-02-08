// gatewaysDetails.spec.js created with Cypress

describe("Gateway Details page", () => {
  it("should successfully render the gateway details page and contents", function () {
    cy.visit("/");
    cy.selectGatewayCard(0);
    // check for Gatway details header
    cy.get('[data-testid="gateway-details-header"]').should(
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
    cy.get(".ant-card-body :nth-child(1)").should("contain", "Humidity");
    cy.get(".ant-card-body :nth-child(2)").should("contain", "Pressure");
    cy.get(".ant-card-body :nth-child(3)").should("contain", "Temperature");
    cy.get(".ant-card-body :nth-child(4)").should("contain", "Voltage");
  });
});
