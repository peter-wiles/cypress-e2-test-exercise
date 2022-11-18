import {endpoints} from "../../lib/constants"
import {upvoteButton,featureInputBox} from "../e2e/helper-methods"

describe("add request", () => {
  it("should go to the homepage", () => {
    cy.visit(endpoints.localhost);
  });

  it("should successfully add a request", () => {
    const input = "cake";
    cy.request(endpoints.clearApiEndpoint);
    const inputBox = cy.get('[data-cy="feature-input-box"]').type(input);
    cy.get('[data-cy="feature-input-button"]').click();

    inputBox.should("have.value", "");

    const featureListItem = cy.get('[data-cy="feature-title"]');
    featureListItem.should("not.be.null");
    featureListItem.should("have.text", input);

    
    upvoteButton().should("have.text", "👍");

    const upvoteCount = cy.get('[data-cy="feature-upvote-count"]');
    upvoteCount.should("have.text", "1");
  });

  it("should request empty validation", () => {
    cy.request(endpoints.clearApiEndpoint);
    const inputBox = cy.get('[data-cy="feature-input-box"]').clear();
    cy.get('[data-cy="feature-input-button"]').click();

    inputBox
      .invoke("prop", "validationMessage")
      .should("eq", "Please fill out this field.");
  });

  it("should show maximum length validation", () => {
    cy.request(endpoints.clearApiEndpoint);
    const input = "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 20";
    cy.get('[data-cy="feature-input-box"]').type(input);
    cy.get('[data-cy="feature-input-button"]').click();
    
    cy.get('.toast').children().should('have.text','Max 150 characters please.')
  });
});
