describe("Homepage Visibility", () => {
  it("should load the homepage and display the main heading", () => {
    cy.visit("http://localhost:3000/");
    cy.contains("h1", "Your Daily Cravings, Delivered");
  });

  it("should have the sign in and sign up buttons", () => {
    cy.visit("http://localhost:3000/");
    cy.contains("Sign in");
    cy.contains("To Sign up");
  });

  it("should render the animated image container", () => {
    cy.visit("http://localhost:3000/");
    cy.get('[data-testid="animated-image"]').should("exist");
  });

  it("should contain the link to products page", () => {
    cy.visit("http://localhost:3000/");
    cy.get('a[href*="products"]').should("exist");
  });
});

describe("Homepage log in flow", () => {
  it("should navigate to sign in page when clicking sign in button", () => {
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

    // After login, verify that the sign in button is no longer visible
    cy.contains("Sign in").should("not.exist");
  });
});
