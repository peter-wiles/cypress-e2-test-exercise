import { should } from "chai"

describe('add request', () => {
  it('should go to the homepage', () => {
    cy.visit('http://localhost:3000/') 
  })


  it('should successfully add a request', () => {
    const input = 'cake';
    cy.request('http://localhost:3000/api/clear');
    const inputBox = cy.get('[data-cy="feature-input-box"]').type(input);
    cy.get('[data-cy="feature-input-button"]').click();
    //input text box should be cleared
    inputBox.should('have.value','');
    //request should apear in request list
    const featureListItem = cy.get('[data-cy="feature-title"]');
    featureListItem.should('not.be.null');
    featureListItem.should('have.text',input);
    //request should have your vote
    const upvoteButton = cy.get('[data-cy="feature-upvote-button"]');
    upvoteButton.should('have.text','👍');
    //vote count should be 1
    const upvoteCount = cy.get('[data-cy="feature-upvote-count"]');
    upvoteCount.should('have.text','1');
  })
})