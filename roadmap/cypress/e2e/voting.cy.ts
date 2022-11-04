import { endpoints } from "../../lib/constants";

const requestAddFeature = (id:any, featureTitle:any) => {
    return {
        method: "POST",
        url: endpoints.createApiEndpoint,
        headers: {
            "x-forwarded-for": "192.168.0.1",
        },
        body: {
            id: id,
            title: featureTitle,
        }
    }
}

describe("when voting on a request", () => {
  it("should vote on someones request", () => {
    const featureTitle = "cake";
    const id = 1;
    cy.request(endpoints.clearApiEndpoint);
    cy.request(requestAddFeature(id, featureTitle)).then(() => {
        cy.visit(endpoints.localhost);
        cy.get('[data-cy="feature-title"]').should("have.text", featureTitle);
        cy.get('[data-cy="feature-upvote-count"]').should("have.text", id);
        
        cy.get('[data-cy="feature-upvote-button"]').click();

        cy.get('[data-cy="feature-upvote-count"]').should("have.text", id + 1);
        cy.get('[data-cy="feature-upvote-button"]').should("have.class", "bg-green-100")
    });
  });
});
