import { should } from "chai";
import { endpoints } from "../../lib/constants"

describe("when subscribing with email address", () => {
    it("should go to the homepage", () => {
        cy.visit(endpoints.localhost);
    });

    it("should succesfully subscribe", () => {
        cy.request(endpoints.clearApiEndpoint);
        const emailInput = cy.get('[data-cy="feature-email-address"]');
        emailInput.type("email@gmail.com");
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
        const emailInput = cy.get('[data-cy="feature-email-address"]').type("emailgmail.com");
        cy.get('[data-cy="feature-email-submit"]').click();

        emailInput
        .invoke("prop", "validationMessage")   
        .should("eq", `Please include an "@" in the email address. ${emailInput.invoke('text')} is missing an "@".`);
    });

});
