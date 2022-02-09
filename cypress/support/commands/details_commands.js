export const clickTabByText = (tabText) => {
  cy.contains(`${tabText}`).click();
};

export const clickSensorCard = (cardTextIDNumber) => {
  cy.get(`[data-testid="sensor[${cardTextIDNumber}]-summary"]`).click({
    force: true,
  });
};

export const clickGatewayCard = (cardTextIDNumber) => {
  cy.get(`[data-testid="gateway[${cardTextIDNumber}]-details"]`).click({
    force: true,
  });
};
