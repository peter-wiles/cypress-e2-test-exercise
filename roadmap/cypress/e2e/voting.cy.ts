import { endpoints } from "../../lib/constants";

const createRequestToAddAFeature = (id:any, featureTitle:any) => {
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

const createRequestToVote = (id:any, featureTitle:any) => {
    return {
        method: "POST",
        url: endpoints.voteApiEndpoint,
        headers: {
            "x-forwarded-for": "192.168.0.2",
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
    cy.request(createRequestToAddAFeature(id, featureTitle)).then(() => {
        cy.visit(endpoints.localhost);
        cy.get('[data-cy="feature-title"]').should("have.text", featureTitle);
        cy.get('[data-cy="feature-upvote-count"]').should("have.text", id);
        
        cy.get('[data-cy="feature-upvote-button"]').click();

        cy.get('[data-cy="feature-upvote-count"]').should("have.text", id + 1);
        cy.get('[data-cy="feature-upvote-button"]').should("have.class", "bg-green-100")
    });
  });

  it("should vote on someone elses request", () => {
    
    const input = "cake";
    cy.request(endpoints.clearApiEndpoint);
    const inputBox = cy.get('[data-cy="feature-input-box"]').type(input);
    cy.get('[data-cy="feature-input-button"]').click();

    cy.request(createRequestToVote("1aa12b33-a1af-4d38-8aab-0d85aa044d72", "a cool request")).then(() => {
        cy.visit(endpoints.localhost);
        cy.get('[data-cy="feature-upvote-count"]').should("have.text", 2);

    });

  });
});
