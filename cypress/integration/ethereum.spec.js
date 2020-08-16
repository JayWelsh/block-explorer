describe('Ethereum Actions', () => {
    it('Loads Latest 10 Ethereum Blocks', () => {
        cy.wait(1000) // Wait to prevent API rate limiting
        cy.visit('http://localhost:3000/ethereum')
        cy.get('#blockchain-latest-blocks-table-row-9')
    })
    it('Detects An Incorrect Block Search', () => {
        cy.wait(1000) // Wait to prevent API rate limiting
        cy.visit('http://localhost:3000/ethereum')
        cy.get('#blockchain-search-field').type("test")
        cy.wait(1000) // Wait to prevent API rate limiting
        cy.get('#blockchain-search-button').click()
        cy.get('#blockchain-search-field-helper-text').contains("Please enter a valid Ethereum Block Hash or ID")
    })
    it('Performs A Correct Block Search And Loads Latest 10 Transactions', () => {
        cy.wait(1000) // Wait to prevent API rate limiting
        cy.visit('http://localhost:3000/ethereum')
        cy.get('#blockchain-search-field').type("0x54929b2c65f0c0a35c0ce0a16017e9da419c795822f58a4a0fb010589d2ca000")
        cy.get('#blockchain-search-field').type('{enter}')
        cy.wait(1000) // Wait to prevent API rate limiting
        cy.get('#block-info-table > :nth-child(1) > :nth-child(2)').contains("0x54929b2c65f0c0a35c0ce0a16017e9da419c795822f58a4a0fb010589d2ca000")
        cy.get('#blockchain-transaction-table-row-9')
        cy.wait(5000) // Wait to prevent API rate limiting
    })
})