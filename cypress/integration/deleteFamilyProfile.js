// This test will try to delete a family profile
// The expected result is for the delete button on family card to be disabeled

import selectors from '../support/selectors.js';  // import all DOM selectors for testing purposes
import testData from '../support/testData.js';  // import all test data for testing purposes
import pageActions from '../support/pageActions.js';  // import all predefined page actions for testing purposes

const actions = new pageActions(); // define actions so we can use them

describe('Try to delete family profile', () => {   
    before(() => {    // login with username and pass before the actual test
        actions.clearCookies()
        actions.visitLogin()
        actions.login(testData.username, testData.password)
    })
    it('Check if there are between 1 and 6 profiles', () => {   
        cy.get(selectors.profile).should('exist').its('length').should('be.lte', 6).should('be.gt', 0)
        cy.get(selectors.profileAvatar).should('exist').its('length').should('be.lte', 6).should('be.gt', 0)
        cy.get(selectors.profileName).should('exist').its('length').should('be.lte', 6).should('be.gt', 0)
        cy.wait(1000)
    })
    it('Check if there is create new profile based on how many profiles there are', () => {
        cy.get(selectors.profile).then(($profile) => {
            if ($profile.length >= 6) {
                cy.get(selectors.createNewProfile).should('not.exist')
            } else {
                cy.get(selectors.createNewProfile).should('exist')
            }             
        })
        cy.wait(1000)
    })
    it('Check if first profile is family', () => {
        cy.get(selectors.profile).eq(0).should('have.text', 'Family')
    })
    it('Click on family profile', () => {
        cy.get(selectors.profile).eq(0).click()
        cy.wait(1000)
    })
    it('Check family profile card', () => {
        cy.url().should('be.equal', Cypress.config().baseUrl)
        cy.get(selectors.profileCard).should('exist')
        cy.get(selectors.profileCardImage).should('exist')
        cy.get(selectors.profileCardImageBig).should('exist')
        cy.get(selectors.profileCardName).should('exist')
        cy.get(selectors.profileCardType).should('exist')
        cy.get(selectors.profileCardLorem).should('exist')
        cy.get(selectors.profileCardDelete).should('exist')
        cy.get(selectors.profileCardLogout).should('exist')
        cy.get(selectors.profileCardName).should('have.text', 'Family')
        cy.get(selectors.profileCardAvatar).find(selectors.familyAvatarImage).should('exist')
        cy.get(selectors.headerCreate).should('exist')
        cy.get(selectors.headerChoose).should('exist')
        cy.wait(1000)
    })
    it('Check if delete button for family is disabeled', () => {
        cy.get(selectors.profileCardDelete).should('be.disabled')
        cy.wait(1000)
    })
    afterEach(function () {
        if (this.currentTest.state === 'failed') {  // stops the runner if error was found
            Cypress.runner.stop()
        }
    });    
})




