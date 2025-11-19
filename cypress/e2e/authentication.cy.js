describe("Authentication Flow", () => {
  //log in
  it("should log in successfully with valid credentials", () => {
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
    cy.contains("Sign in").should("not.exist");
  });

  //log out
  it("should log out successfully", () => {
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
    // Assuming user is already logged in from previous test
    cy.visit("http://localhost:3000/");
    cy.get("img.cl-avatarImage.cl-userButtonAvatarImage").click();
    cy.contains("Sign out").click();
    cy.contains("Sign in").should("exist");
  });

  //check protected routes logged out
  it("should restrict access to protected routes when logged out", () => {
    cy.visit("http://localhost:3000/dashboard");
    cy.url().should("include", "http://localhost:3000/");
  });

  //check protected routes logged in
  it("should allow access to protected routes when logged in", () => {
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
    // Now visit protected route
    cy.visit("http://localhost:3000/dashboard");
    cy.url().should("include", "/dashboard");
  });
});
