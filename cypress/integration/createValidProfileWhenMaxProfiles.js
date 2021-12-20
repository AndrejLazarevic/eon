// This test will try to create a random profile when profile number is maxed out
// The expected result is to get an error message that profile maximum has been reached
// Test will not run if there is less than maximum number of profiles present

import selectors from '../support/selectors.js';  // import all DOM selectors for testing purposes
import testData from '../support/testData.js';  // import all test data for testing purposes
import pageActions from '../support/pageActions.js';  // import all predefined page actions for testing purposes

const actions = new pageActions(); // define actions so we can use them

describe('Try to create a new profile when no of profiles is maxed', () => {   
    before(() => {    // login with username and pass before the actual test
        actions.clearCookies()
        actions.visitLogin()
        actions.login(testData.username, testData.password)
    })
    it('Check if there are 6 profiles', () => {    // if there is less than 6 profiles test will stop
        cy.get(selectors.profile).should('exist').its('length').should('be.gte', 6)
        cy.get(selectors.profileAvatar).should('exist').its('length').should('be.gte', 6)
        cy.get(selectors.profileName).should('exist').its('length').should('be.gte', 6)
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
    it('Click on create profile in header', () => {
        cy.get(selectors.headerCreate).should('exist')
        cy.wait(1000)
    })
    it('Click on create profile in header', () => {
        cy.get(selectors.headerCreate).click()
        cy.wait(1000)
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
        cy.get(selectors.ageText).its('length').then(elementCount => {  // click on random age
            let selected = Cypress._.random(elementCount - 1);
            cy.get(selectors.ageText).eq(selected).click();
        });
        cy.wait(500)
        cy.get('body').then((body) => {              
            if (body.find(selectors.age18plusChecked).length > 0) {                
                cy.get(selectors.enterAge).type(Cypress._.random(18, 120));  // enter random age number between 18 and 120 (I set 120 at max but it could be anything)
            }
        });
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
        cy.get(selectors.errorMessage).should('exist').should('have.text', 'Maximum number of profiles reached for this user.')
        cy.wait(1000)
    })
    it('Check if create profile button is disabeled', () => {        
        cy.get(selectors.createProfile).should('be.disabled')
        cy.wait(1000)
    })
    afterEach(function () {
        if (this.currentTest.state === 'failed') {  // stops the runner if error was found, mainly if there are less than 6 profiles
            Cypress.runner.stop()
        }
    });
})




