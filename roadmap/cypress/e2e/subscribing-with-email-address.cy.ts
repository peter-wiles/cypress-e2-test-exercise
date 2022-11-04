import { endpoints } from "../../lib/constants"

describe("when subscribing with email address", () => {
    it("should go to the homepage", () => {
        cy.visit(endpoints.localhost);
    });

    it("should succesfully subscribe", () => {
        cy.request(endpoints.clearApiEndpoint);
        const emailInput = cy.get('[data-cy="feature-email-address"]').type("email@gmail.com");
        cy.get('[data-cy="feature-email-submit"]').click();

        emailInput.should("have.value", "");
        cy.get('.toast').children().should('have.text', 'You are now subscribed to feature updates!');
    });

    it("email address is required", () => {
        cy.request(endpoints.clearApiEndpoint);
        const emailInput = cy.get('[data-cy="feature-email-address"]').clear();
        cy.get('[data-cy="feature-email-submit"]').click();

        emailInput
        .invoke("prop", "validationMessage")   
        .should("eq", "Please fill out this field.");
    });

    it("email address should contain @ symbol", () => {
        const expected = "bobmail.com";
        cy.request(endpoints.clearApiEndpoint);
        const emailInput = cy.get('[data-cy="feature-email-address"]').clear()
                                                                      .type(expected);
        cy.get('[data-cy="feature-email-submit"]').click();
        
        emailInput
        .invoke("prop", "validationMessage")   
        .should("equal", `Please include an '@' in the email address. '${expected}' is missing an '@'.`);
    });

    it("email address should be valid after the @ symbol", () => {
        const expected = "bobmail@";
        cy.request(endpoints.clearApiEndpoint);
        const emailInput = cy.get('[data-cy="feature-email-address"]').clear()
                                                                      .type(expected);
        cy.get('[data-cy="feature-email-submit"]').click();
        
        emailInput
        .invoke("prop", "validationMessage")   
        .should("equal", `Please enter a part following '@'. '${expected}' is incomplete.`);
    });

});
