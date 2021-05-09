import {
  noParentTextId,
  parentTextInputId,
  parentTextSubmitId,
  parentSelector,
} from "@im/sh/src/dom";

const serverUrl = Cypress.env("BACKEND_SERVER_URL");

context("App", () => {
  beforeEach(() => {
    cy.request(`${serverUrl}/reset`).then((resp) => {
      expect(resp.status).eq(200);
      expect(resp.body).eq("ok");
    });
  });

  it("parent form", () => {
    // When user visits app
    cy.visit("/");

    // user should see that there is no parent in the system
    cy.get("#" + noParentTextId).should("exist");
    cy.get("." + parentSelector).should("not.exist");

    // when user fills form correctly
    cy.get("#" + parentTextInputId).type("ab");

    // when user submits form
    cy.get("#" + parentTextSubmitId).click();

    // created parent should be visible
    cy.get("." + parentSelector)
      .should("exist")
      .then((el) => {
        const id = el.attr("id");
        expect(typeof id).eq("string");
      });
    cy.get("#" + noParentTextId).should("not.exist");
  });
});
