import { should } from "chai";
import {endpoints} from "../../lib/constants"

describe("when subscribing with email address", () => {
  it("should go to the homepage", () => {
    cy.visit(endpoints.localhost);
    cy.request(endpoints.clearApiEndpoint);
    const emailInput = cy.get('[data-cy="feature-email-address"]');
    emailInput.type("email@gmail.com");
    cy.get('[data-cy="feature-email-submit"]').click();

    emailInput.should("have.value","");
    cy.get('.toast').children().should('have.text','You are now subscribed to feature updates!');
  });

});
