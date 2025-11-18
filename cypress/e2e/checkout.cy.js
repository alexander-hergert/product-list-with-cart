import "cypress-iframe";

describe("Checkout Process", () => {
  it("should not allow checkout when not signed in", () => {
    cy.visit("http://localhost:3000/products/breakfast");
    // Add a product to the cart
    cy.get("[data-testid='products-list']")
      .first()
      .contains("Add to Cart")
      .click();
    // Open the cart
    cy.get("[data-testid='cart']").contains("Confirm Order").click();
    // Check for modal indicating user must be logged in
    cy.get("[data-testid='modal']").contains(
      "You have to be logged in to place an order."
    );
  });

  it("should complete checkout process when signed in", () => {
    cy.visit("http://localhost:3000/");
    cy.contains("Sign in").click();

    cy.origin("https://pet-mustang-19.accounts.dev", () => {
      cy.get("input[name='identifier']").type("test_user@gmail.com");
      cy.get(".cl-formButtonPrimary").contains("Continue").click();
      cy.get("input[name='password']").type("password_password_123");
      cy.get(".cl-formButtonPrimary").contains("Continue").click();
    });

    // wrap in cy.origin callback chain to ensure it waits for completion
    cy.origin("https://pet-mustang-19.accounts.dev", () => {
      // Optional: assert login success if there’s a redirect element
      cy.url().should("include", "http://localhost:3000/");
    });
    // Now proceed to checkout
    cy.visit("http://localhost:3000/products/breakfast");
    // Add a product to the cart
    cy.get("[data-testid='products-list']")
      .first()
      .contains("Add to Cart")
      .click();
    // Open the cart
    cy.get("[data-testid='cart']").contains("Confirm Order").click();
    // Confirm order in modal
    cy.get("[data-testid='modal']").contains("Go to Checkout").click();
    cy.contains("h1", "Payment Process");
  });
});
