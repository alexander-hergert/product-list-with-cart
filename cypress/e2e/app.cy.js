describe("Navigation", () => {
  //sign in before each test with clerk test user
  beforeEach("should sign in", () => {
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
  });

  it("should not show sign in button after signing in", () => {
    cy.contains("Sign in").should("not.exist");
  });

  it("should navigate to the products page", () => {
    // Start from the index page
    cy.visit("http://localhost:3000/");
    // Find a link with an href attribute containing "products" and click it
    cy.get('a[href*="products"]').click();
    // The new url should include "/products"
    cy.url().should("include", "/products");
    // The new page should contain an h1 with "Products"
    cy.get("h1").contains("Welcome, please select your category.");
  });

  it("should navigate to the home page", () => {
    // Start from the products page
    cy.visit("http://localhost:3000/products");
    // Find a link with an href attribute containing "/" and click it
    cy.get('a[href="/"]').click();
    // The new url should include "/"
    cy.url().should("include", "/");
    // The new page should contain an h1 with "Home"
    cy.get("h1").contains("Your Daily Cravings, Delivered");
  });
});
