export const clickTabByText = (tabText) => {
  cy.contains(`${tabText}`).click();
};

export const clickGatewayCard = (cardTextIDNumber) => {
  cy.get(`[data-testid="gateway[${cardTextIDNumber}]-details"]`).first().click({
    force: true,
  });
};

export const clickNodeCard = (cardTextIDNumber) => {
  cy.get(`[data-testid="node[${cardTextIDNumber}]-summary"]`).first().click({
    force: true,
  });
};
