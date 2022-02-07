// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//import all as detailsCommands from the details_commands file
import * as detailsCommands from "./details_commands";

//add a command called the item in quotes as detailsCommands called the item after 
//the period. In this case the command is called clickTabByText, and is aliased as selectTabByText
Cypress.Commands.add("clickTabByText", detailsCommands.clickTabByText);

Cypress.Commands.add("clickSensorCard", detailsCommands.clickSensorCard);

