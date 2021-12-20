// This test will try to create an adult profile with invalid data entered in age field
// The expected result is to get an error message for invalid age input
// Test will not run if there is already a max number of profiles

import selectors from '../support/selectors.js';  // import all DOM selectors for testing purposes
import testData from '../support/testData.js';  // import all test data for testing purposes
import pageActions from '../support/pageActions.js';  // import all predefined page actions for testing purposes

const actions = new pageActions(); // define actions so we can use them

describe('Try to create adult profile with invalid data for age', () => {   
    before(() => {    // login with username and pass before the actual test
        actions.clearCookies()
        actions.visitLogin()
        actions.login(testData.username, testData.password)
    })
    it('Check if there are between 1 and 5 profiles', () => {    // if there is more than 5 test will fail as it's the max number of profiles 
        cy.get(selectors.profile).should('exist').its('length').should('be.lte', 5).should('be.gt', 0)
        cy.get(selectors.profileAvatar).should('exist').its('length').should('be.lte', 5).should('be.gt', 0)
        cy.get(selectors.profileName).should('exist').its('length').should('be.lte', 5).should('be.gt', 0)
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
    it('Click on create profile', () => {
        cy.get(selectors.createNewProfile).click()
        cy.wait(500)        
    })
    it('Check for right URL', () => {
        cy.url().should('include', '/create-profile')
    })
    it('Type in user name', () => {
        cy.wait(1000)
        cy.get(selectors.profileNameInput).should('exist')
        const uuid = () => Cypress._.random(0, 1e6)
        const id = uuid()        
        const profName = `Test Name ${id}`   // crate random unique name
        cy.get(selectors.profileNameInput).type(profName).should('have.value', profName)        
    })
    it('Select age', () => {
        cy.get(selectors.profileNameInput).should('exist')
        cy.get(selectors.age0_6).should('exist')
        cy.get(selectors.age7_11).should('exist')
        cy.get(selectors.age12_14).should('exist')
        cy.get(selectors.age15_17).should('exist')
        cy.get(selectors.age18plus).should('exist')
        cy.get(selectors.ageText).should('exist')
        cy.get(selectors.ageText).its('length').then(elementCount => {  // click on adult age (last from age group)       
            cy.get(selectors.ageText).eq(elementCount - 1).click();
        });
        cy.wait(500)        
        cy.get(selectors.enterAge).type(-67);  // type invalid age 
        cy.wait(1000)
    })
    it('Select avatar', () => {
        cy.get(selectors.avatarRadio).should('exist')
        cy.get(selectors.avatarRadioImage).should('exist')
        cy.get(selectors.avatarRadioLabel).should('exist')
        cy.get(selectors.avatarRadioLabel).its('length').then(elementCount => {   // click on random avatar
            let selected = Cypress._.random(elementCount - 1); 
            cy.get(selectors.avatarRadioLabel).eq(selected).as('avatarChecked').click();            
        });
        cy.wait(1000)
    })
    it('Click on create profile', () => {
        cy.get(selectors.createProfile).should('exist')
        cy.get(selectors.createProfile).click()
        cy.wait(1000)
    })
    it('Check for error message', () => {
        cy.get(selectors.errorMessage).should('exist')
        cy.wait(1000)
    })
    afterEach(function () {
        if (this.currentTest.state === 'failed') {  // stops the runner if error was found, mainly used to stop if there is already a max number of profiles (more than 5)
            Cypress.runner.stop()
        }
    });
})




