import { endpoints } from "../../lib/constants";
import {upvoteButton} from "../e2e/helper-methods"

const createRequestToAddAFeature = (featureTitle: any) => {
    return {
        method: "POST",
        url: endpoints.createApiEndpoint,
        headers: {
            "x-forwarded-for": "192.168.0.1",
            "Content-Type": 'application/json',
        },
        body: {
            title: featureTitle,
        }
    }
}

const createRequestToVote = (id: any, featureTitle: any, ip: string = "192.168.0.2") => {
    return {
        method: "POST",
        url: endpoints.voteApiEndpoint,
        headers: {
            "x-forwarded-for": ip,
            "Content-Type": 'application/json',
        },
        body: {
            id: id,
            title: featureTitle,
        }
    }
}



describe("voting", () => {
    beforeEach(() => {
        clearDatabase();
    })

    describe("voting on someone else's request", () => {
        it("should upvote successfully", () => {
            const featureTitle = "other person's feature";
            cy.request(createRequestToAddAFeature(featureTitle)).then(() => {
                cy.visit(endpoints.localhost);
                getFeatureTitles().should("have.text", featureTitle);
                getUpvoteCounts().should("have.text", 1);
                  
                upvoteButton().click();

                getUpvoteCounts().should("have.text", 2);
                upvoteButton().should("have.class", "bg-green-100")
            });
        });
    });

    describe("someone else voting on our request", () => {
        it("should upvote successfully", () => {
            const input = "our request";
            cy.visit(endpoints.localhost);
            cy.get('[data-cy="feature-input-box"]').type(input);
            cy.get('[data-cy="feature-input-button"]').click();

            let newFeatureId = '';
            cy.request(createRequestToGetFeatures()).then((response) => {
                newFeatureId = response.body.features[0].id;
                cy.request(createRequestToVote(newFeatureId, input)).then(() => {
                    cy.visit(endpoints.localhost);
                    getUpvoteCounts().should("have.text", 2);
                });
            });
        });
    });

    describe("feature ordering", () => {
        it("should order the features",  () => {
            const featureNames = ['Chocolate Cake', 'Carrot Cake', 'Strawberry Tart'];
            createFeatureRequests(featureNames);
            visitHomePage();
            assertThereAreFeaturesInTheList(featureNames);

            cy.request(createRequestToGetFeatures()).then((response) => {
                const features:{id:string, title:string}[] = response.body.features;
                const carrotCake = features.find((cake) => cake.title === "Carrot Cake")!;
                const chocolateCake = features.find((cake) => cake.title === "Chocolate Cake")!;
                const strawberryTart = features.find((cake) => cake.title === "Strawberry Tart")!;
                
                voteForFeatureThroughEndpoint(carrotCake);
                visitHomePage();
                assertFirstFeatureHasTitle(carrotCake.title);
                assertFirstFeatureHasVotes(2);

                voteForFeatureThroughEndpoint(chocolateCake, "192.168.0.3");
                voteForFeatureThroughEndpoint(chocolateCake, "192.168.0.4");
                visitHomePage();

                assertFirstFeatureHasTitle(chocolateCake.title);
                assertFirstFeatureHasVotes(3);
                getFeatureTitles().then(titles => titles[1]).should("have.text", carrotCake.title);
                getFeatureTitles().then(titles => titles[2]).should("have.text", strawberryTart.title);
            })
            
        });
    });

})

function voteForFeatureThroughEndpoint(feature: { id: string; title: string; }, ip: string = "192.168.0.2") {
    cy.request(createRequestToVote(feature.id, feature.title, ip));
}

function createRequestToGetFeatures(): Partial<Cypress.RequestOptions> {
    return { method: "GET", url: endpoints.featuresApiEndpoint };
}

function assertFirstFeatureHasVotes(votes: number) {
    getUpvoteCounts().first().should("have.text", votes);
}

function assertFirstFeatureHasTitle(title: string) {
    getFeatureTitles().first().should("have.text", title);
}

function getUpvoteCounts() {
    return cy.get('[data-cy="feature-upvote-count"]');
}

function getFeatureTitles() {
    return cy.get('[data-cy="feature-title"]');
}

function assertThereAreFeaturesInTheList(featureNames: string[]) {
    getFeatureTitles().should("have.length", featureNames.length);
    featureNames.forEach((featureName: string) => {
        getFeatureTitles().should("contain", featureName);
    })
}

function visitHomePage() {
    cy.visit(endpoints.localhost);
}

function clearDatabase() {
    cy.request(endpoints.clearApiEndpoint);
}

function createFeatureRequests(features: string[]) {
    features.forEach(featureName => {
        cy.request(createRequestToAddAFeature(featureName));
    })
}