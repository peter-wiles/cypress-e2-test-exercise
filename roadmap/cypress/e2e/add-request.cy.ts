describe('add request', () => {
  it('should go to the homepage', () => {
    cy.visit('http://localhost:3000/') 
  })


  it('should successfully add a request', () => {
    const inputBox = cy.get('[data-cy="feature-input-box"]').type('cake')
    const inputButton = cy.get('[data-cy="feature-input-button"]').click()
    
    
  })
})