import { should } from "chai";

describe("add request", () => {
  it("should go to the homepage", () => {
    cy.visit("http://localhost:3000/");
  });

  it("should successfully add a request", () => {
    const input = "cake";
    cy.request("http://localhost:3000/api/clear");
    const inputBox = cy.get('[data-cy="feature-input-box"]').type(input);
    cy.get('[data-cy="feature-input-button"]').click();

    inputBox.should("have.value", "");

    const featureListItem = cy.get('[data-cy="feature-title"]');
    featureListItem.should("not.be.null");
    featureListItem.should("have.text", input);

    const upvoteButton = cy.get('[data-cy="feature-upvote-button"]');
    upvoteButton.should("have.text", "👍");

    const upvoteCount = cy.get('[data-cy="feature-upvote-count"]');
    upvoteCount.should("have.text", "1");
  });

  it("should request empty validation", () => {
    cy.request("http://localhost:3000/api/clear");
    const inputBox = cy.get('[data-cy="feature-input-box"]').clear();
    cy.get('[data-cy="feature-input-button"]').click();

    inputBox
      .invoke("prop", "validationMessage")
      .should("eq", "Please fill out this field.");
  });
});
