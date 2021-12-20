import selectors from './selectors.js';  // import all DOM selectors for testing purposes

class pageActions {

    clearCookies() {
        cy.clearCookies().wait(2000)
    }

    visitLogin() {
        cy.visit('/login').wait(2000)
    }

    login(username, password) {
        cy.get(selectors.loginInputUser).type(username)
        cy.get(selectors.loginInputPass).type(password)
        cy.wait(1000)
        cy.get(selectors.loginButton).click()
        cy.wait(2000)
    }

}

export default pageActions;