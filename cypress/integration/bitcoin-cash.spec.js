describe('Bitcoin Cash Actions', () => {
    it('Loads Latest 10 Bitcoin Cash Blocks', () => {
        cy.wait(1000) // Wait to prevent API rate limiting
        cy.visit('http://localhost:3000/bitcoin-cash')
        cy.get('#blockchain-latest-blocks-table-row-9')
    })
    it('Detects An Incorrect Block Search', () => {
        cy.wait(1000) // Wait to prevent API rate limiting
        cy.visit('http://localhost:3000/bitcoin-cash')
        cy.get('#blockchain-search-field').type("test")
        cy.wait(1000) // Wait to prevent API rate limiting
        cy.get('#blockchain-search-button').click()
        cy.get('#blockchain-search-field-helper-text').contains("Please enter a valid Bitcoin Cash Block Hash or ID")
    })
    it('Performs A Correct Block Search And Loads Latest 10 Transactions', () => {
        cy.wait(1000) // Wait to prevent API rate limiting
        cy.visit('http://localhost:3000/bitcoin-cash')
        cy.get('#blockchain-search-field').type("000000000000000001e46cc6e845d748eba430d099270f33b1c33646e9eb0eab")
        cy.wait(1000) // Wait to prevent API rate limiting
        cy.get('#blockchain-search-field').type('{enter}')
        cy.get('#block-info-table > :nth-child(1) > :nth-child(2)').contains("000000000000000001e46cc6e845d748eba430d099270f33b1c33646e9eb0eab")
        cy.get('#blockchain-transaction-table-row-9')
        cy.wait(5000) // Wait to prevent API rate limiting
    })
})