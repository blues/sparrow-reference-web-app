export const clickTabByText = (tabText) => {
  cy.contains(`${tabText}`).click();
};

export const clickSensorCard = (cardTextIDNumber) => {
	cy.get(`[data-testid="sensor[${cardTextIDNumber}]-summary"]`).click();
};