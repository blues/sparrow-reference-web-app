export const clickTabByText = (tabText) => {
  cy.contains(`${tabText}`).click();
};

export const clickSensorCard = (cardTextIDNumber) => {
  cy.get(`[data-testid="sensor[${cardTextIDNumber}]-summary"]`).first().click({
    force: true,
  });
};

export const clickGatewayCard = (cardTextIDNumber) => {
  cy.get(`[data-testid="gateway[${cardTextIDNumber}]-details"]`).first().click({
    force: true,
  });
};

export const clickCarouselButton = (buttonDirection) => {
  cy.get(`[data-testid="${buttonDirection}-carousel-arrow"]`).click({
    force: true,
  });
};
