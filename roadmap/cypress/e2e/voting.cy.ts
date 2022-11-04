import { endpoints } from "../../lib/constants";

const createRequestToAddAFeature = (id: any, featureTitle: any) => {
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

const createRequestToVote = (id: any, featureTitle: any) => {
    return {
        method: "POST",
        url: endpoints.voteApiEndpoint,
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
        cy.request(createRequestToAddAFeature(id, featureTitle)).then(() => {
            cy.visit(endpoints.localhost);
            cy.get('[data-cy="feature-title"]').should("have.text", featureTitle);
            cy.get('[data-cy="feature-upvote-count"]').should("have.text", id);

            cy.get('[data-cy="feature-upvote-button"]').click();

            cy.get('[data-cy="feature-upvote-count"]').should("have.text", id + 1);
            cy.get('[data-cy="feature-upvote-button"]').should("have.class", "bg-green-100")
        });
    });

    it("should vote on someone elses request", async () => {
        const input = "cake";
        cy.request(endpoints.clearApiEndpoint);
        cy.get('[data-cy="feature-input-box"]').type(input);
        cy.get('[data-cy="feature-input-button"]').click();

        cy.request(createRequestToVote("edca09b0-7060-4f8d-a80a-315c68d53353", "cake")).then(() => {
            cy.visit(endpoints.localhost);
            cy.get('[data-cy="feature-upvote-count"]').should("have.text", 1);
        });
    });

    it("should order the features",  () => {
        cy.request(endpoints.clearApiEndpoint);
        cy.request(createRequestToAddAFeature(1, 'cake 1'))
        .request(createRequestToAddAFeature(2, 'cake 2'))
        .request(createRequestToAddAFeature(3, 'cake 3')).then(()=>{
        cy.visit(endpoints.localhost);

        });
        
    });
});
