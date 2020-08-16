describe('Bitcoin Actions', () => {
  it('Loads Latest 10 Bitcoin Blocks', () => {
    cy.wait(1000) // Wait to prevent API rate limiting
    cy.visit('http://localhost:3000/bitcoin')
    cy.get('#blockchain-latest-blocks-table-row-9')
  })
  it('Detects An Incorrect Block Search', () => {
    cy.wait(1000) // Wait to prevent API rate limiting
    cy.visit('http://localhost:3000/bitcoin')
    cy.get('#blockchain-search-field').type("test")
    cy.wait(1000) // Wait to prevent API rate limiting
    cy.get('#blockchain-search-button').click()
    cy.get('#blockchain-search-field-helper-text').contains("Please enter a valid Bitcoin Block Hash or ID")
  })
  it('Performs A Correct Block Search And Loads Latest 10 Transactions', () => {
    cy.wait(1000) // Wait to prevent API rate limiting
    cy.visit('http://localhost:3000/bitcoin')
    cy.get('#blockchain-search-field').type("0000000000000000000e71be43da804896364305f096b99881cf5379225d4aa9")
    cy.wait(1000) // Wait to prevent API rate limiting
    cy.get('#blockchain-search-field').type('{enter}')
    cy.get('#block-info-table > :nth-child(1) > :nth-child(2)').contains("0000000000000000000e71be43da804896364305f096b99881cf5379225d4aa9")
    cy.get('#blockchain-transaction-table-row-9')
    cy.wait(5000) // Wait to prevent API rate limiting
  })
})