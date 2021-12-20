// This test will delete a random profile that is not family
// The expected result is that the number of profiles decreased by one
// Test will not run if there is just one (family) profile present

import selectors from '../support/selectors.js';  // import all DOM selectors for testing purposes
import testData from '../support/testData.js';  // import all test data for testing purposes
import pageActions from '../support/pageActions.js';  // import all predefined page actions for testing purposes


var profNoBefore  // to store no of profiles before we delete one
var profNoAfter   // to store no of profiles after we delete one
var profName      // to store name of profile we are deleting
var profAvatar    // to store avatar of profile we are deleting
const actions = new pageActions(); // define actions so we can use them


describe('Delete a profile', () => {   
    before(() => {    // login with username and pass before the actual test
        actions.clearCookies()
        actions.visitLogin()
        actions.login(testData.username, testData.password)
    })
    it('Check if there are between 2 and 6 profiles', () => {   // if there is just one profile (family) test will not run
        cy.get(selectors.profile).should('exist').its('length').should('be.lte', 6).should('be.gt', 1)
        cy.get(selectors.profileAvatar).should('exist').its('length').should('be.lte', 6).should('be.gt', 1)
        cy.get(selectors.profileName).should('exist').its('length').should('be.lte', 6).should('be.gt', 1)
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
    it('Count the number of already created profiles', () => {
        cy.get(selectors.profile).then(($profile) => {
            profNoBefore = $profile.length    // add no of curent profiles to a variable
        })
        cy.wait(1000)
    })
    it('Open random profile that is not family', () => {
        cy.get(selectors.profile).its('length').then(elementCount => {  
            let selected = Cypress._.random(1, elementCount - 1);
            cy.get(selectors.profile).eq(selected).as('selectedProfile');
            cy.get('@selectedProfile').find('img').invoke('attr', 'src').then((profileAvatar) => {
                profAvatar = profileAvatar    
            });
            cy.get('@selectedProfile').then((profile) => {
                profName = profile.text()    
            });
            cy.get('@selectedProfile').click();
            cy.wait(1000)
        });
    })
    it('Check profile card', () => {
        cy.url().should('be.equal', Cypress.config().baseUrl)
        cy.get(selectors.profileCard).should('exist')
        cy.get(selectors.profileCardImage).should('exist')
        cy.get(selectors.profileCardImageBig).should('exist')
        cy.get(selectors.profileCardName).should('exist')
        cy.get(selectors.profileCardType).should('exist')
        cy.get(selectors.profileCardLorem).should('exist')
        cy.get(selectors.profileCardDelete).should('exist')
        cy.get(selectors.profileCardLogout).should('exist')
        cy.get(selectors.profileCardName).then((profileName) => {   // check if profile card name is the same as profile we opened
            expect(profileName.text()).to.eq(profName)
        })
        cy.get(selectors.profileCardAvatar).find('img').invoke('attr', 'src').then((cardAvatar) => {
            expect(profAvatar).to.eq(cardAvatar)    // check if card avatar is same as profile we opened
        });
        cy.get(selectors.headerCreate).should('exist')
        cy.get(selectors.headerChoose).should('exist')
        cy.wait(1000)
    })
    it('Click on delete profile', () => {        
        cy.get(selectors.profileCardDelete).click()        
        cy.wait(2000)
    })
    it('Check if you are back on profiles page and profile was deleted', () => {
        cy.url().should('include', '/choose-profile')
        cy.get(selectors.profile).then(($profile) => {
            profNoAfter = $profile.length
            expect(profNoAfter).to.eq(profNoBefore - 1)    // check if profile number decreased by 1
        })
    })
    afterEach(function () {
        if (this.currentTest.state === 'failed') {  // stops the runner if error was found, mainly used to stop if there are no profiles to delete (less than 2)
            Cypress.runner.stop()
        }
    });
})




