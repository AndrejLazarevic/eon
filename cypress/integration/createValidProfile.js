// This test will create a random valid profile 
// The expected result is that we get a profile card with right info and than the number of profiles increased by one
// Test will not run if there is already a max number of profiles

import selectors from '../support/selectors.js';  // import all DOM selectors for testing purposes
import testData from '../support/testData.js';  // import all test data for testing purposes
import pageActions from '../support/pageActions.js';  // import all predefined page actions for testing purposes

var profNoBefore  // to store no of profiles before new profile creation
var profNoAfter   // to store no of profiles after new profile creation
var profName      // to store random name of new profile
var profType      // to store profile type based on what radio button is checked
var profCreateAvatar    // to store avatar src of profile we are making
const actions = new pageActions(); // define actions so we can use them


describe('Create a valid new profile', () => {   
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
    it('Count the number of already created profiles', () => {
        cy.get(selectors.profile).then(($profile) => {
            profNoBefore = $profile.length    // add no of curent profiles to a variable
        })
    })
    it('Click on create profile', () => {
        cy.get(selectors.createNewProfile).click()
        cy.wait(500)        
    })
    it('Check for right URL', () => {
        cy.url().should('include', '/create-profile')
        cy.wait(1000)
    })
    it('Type in user name', () => {
        cy.get(selectors.profileNameInput).should('exist')
        const uuid = () => Cypress._.random(0, 1e6)
        const id = uuid()        
        profName = `Test Name ${id}`   // crate random unique name
        cy.get(selectors.profileNameInput).type(profName).should('have.value', profName)
        cy.wait(1000)
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
        cy.get('body').then((body) => {   // add profile type to a variable based on what is clicked
            if (body.find(selectors.age0_6Checked).length > 0 || body.find(selectors.age7_11Checked).length > 0) {
                profType = 'KIDS'
            }
            if (body.find(selectors.age12_14Checked).length > 0 || body.find(selectors.age15_17Checked).length > 0) {
                profType = 'TEEN'
            }
            if (body.find(selectors.age18plusChecked).length > 0) {
                profType = 'ADULT'
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
            cy.get('@avatarChecked').find(selectors.avatarRadioImage).invoke('attr', 'src').then((avatarSrc) => {
                profCreateAvatar = avatarSrc;   // store avatar src in variable
            });
        });
        cy.wait(1000)
    })
    it('Click on create profile', () => {
        cy.get(selectors.createProfile).should('exist')
        cy.get(selectors.createProfile).click()
        cy.url().should('be.equal', Cypress.config().baseUrl)
        cy.wait(1000)
    })
    it('Check if Profile Card contains right info', () => {
        cy.wait(1000)
        cy.get(selectors.profileCard).should('exist')
        cy.get(selectors.profileCardImage).should('exist')
        cy.get(selectors.profileCardImageBig).should('exist')
        cy.get(selectors.profileCardName).should('exist')
        cy.get(selectors.profileCardType).should('exist')
        cy.get(selectors.profileCardLorem).should('exist')
        cy.get(selectors.profileCardDelete).should('exist')
        cy.get(selectors.profileCardLogout).should('exist')
        cy.get(selectors.profileCardName).should((profileName) => {   // check if profile card name is the one we made
            expect(profileName.text()).to.eq(profName)
        })
        cy.get(selectors.profileCardType).should((profileType) => {   // check if profile type is the one we made
            expect(profileType.text()).to.eq(profType)
        })
        cy.get(selectors.profileCardAvatar).should('exist').as('avatarCreated')        
        cy.get('@avatarCreated').find('img').invoke('attr', 'src').then((avatarCreatedSrc) => {  
            expect(profCreateAvatar).to.eq(avatarCreatedSrc)    // check if profile avatar is the one we made
        });
        cy.get(selectors.headerCreate).should('exist')
        cy.get(selectors.headerChoose).should('exist')
        cy.wait(1000)
    })
    it('Go back to choose profile page', () => {
        cy.get(selectors.headerChoose).click()
        cy.url().should('include', '/choose-profile')
    })
    it('Check if number of profiles increased', () => {
        cy.wait(1000)
        cy.get(selectors.profile).then(($profile) => {            
            profNoAfter = $profile.length
            expect(profNoAfter).to.eq(profNoBefore + 1)    // check if profile number increased by 1
        })
    })
    it('Check if profile we made is present', () => {
        cy.get(selectors.profileName).contains(profName).should("exist")  // check if profile name we made now exists in profile page
    })
    afterEach(function () {
        if (this.currentTest.state === 'failed') {  // stops the runner if error was found, mainly used to stop if there is already a max number of profiles (more than 5)
            Cypress.runner.stop()
        }
    });
})




