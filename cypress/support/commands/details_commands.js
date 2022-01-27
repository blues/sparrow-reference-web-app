/* this works but it's more prone to error because the `tabs` and `tab` numbers need to be provided,
versus text strings */
export const selectTab = (tabsNumber, tabNumber) => {
  cy.get(`#rc-tabs-${tabsNumber}-tab-${tabNumber}`).click();
};

export const selectTabByText = (tabText) => {
  cy.contains(`${tabText}`).click();
};

export const selectSensorCard = (cardTestIdNumber) => {
  cy.get(`[data-testid="sensor[${cardTestIdNumber}]-summary"]`).click();
};
