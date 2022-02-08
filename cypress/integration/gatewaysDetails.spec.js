// gatewaysDetails.spec.js created with Cypress

describe("Gateway Details page", () => {
  it("should successfully render the gateway details page and contents", function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit("/");
    cy.selectGatewayCard(0);
    // check for Gatway details header // todo cont clean up
    cy.get("h1").should("have.text", "Gateway Details");
    cy.get(".Home_container__CCFUG > :nth-child(1)").should(
      "include.text",
      "Gateway"
    );
    cy.get(".Home_container__CCFUG > :nth-child(2) > :nth-child(1)").should(
      "include.text",
      "Device Name: "
    );
    cy.get(".Home_container__CCFUG > :nth-child(2) > :nth-child(3)").should(
      "include.text",
      "Location:"
    );
    cy.get(".Home_container__CCFUG > :nth-child(2) > :nth-child(5)").should(
      "include.text",
      "Last Seen:"
    );
    cy.get(".Home_container__CCFUG > :nth-child(3)").should(
      "have.text",
      "Sensors"
    );
    cy.get(
      ":nth-child(1) > .ant-card-head > .ant-card-head-wrapper > .ant-card-head-title"
    ).should("be.visible");
    cy.get(":nth-child(1) > .ant-card-body > ul > :nth-child(1)").should(
      "include.text",
      "Temperature: "
    );
    cy.get(":nth-child(1) > .ant-card-body > ul > :nth-child(2)").should(
      "include.text",
      "Humidity:"
    );
    cy.get(":nth-child(1) > .ant-card-body > ul > :nth-child(4)").should(
      "include.text",
      "Battery:"
    );
    cy.get(":nth-child(1) > .ant-card-body > ul > :nth-child(5)").should(
      "include.text",
      "Last active:"
    );

    cy.get('[data-testid="sensor[0]-summary"]').click();

    /* ==== End Cypress Studio ==== */
  });
});
