export const selectTabByText = (tabText) => {
  cy.contains(`${tabText}`).click();
};

export const selectSensorCard = (cardTextIDNumber) => {
  cy.get(`[data-testid="sensor[${cardTextIDNumber}]-summary"]`).click();
};

export const selectGatewayCard = (cardTextIDNumber) => {
  cy.get(`[data-testid="gateway[${cardTextIDNumber}]-details"]`).click();
};
