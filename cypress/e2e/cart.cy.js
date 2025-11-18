describe("Cart Functionality", () => {
  it("should display added products in the cart", () => {
    cy.visit("http://localhost:3000/products/breakfast");
    //click on first product
    cy.get("[data-testid='products-list']")
      .first()
      .contains("Add to Cart")
      .click();
    //check if product is in cart
    cy.get("[data-testid='cart']").contains("Granola & Yogurt Bowl");
  });

  it("should update product quantity in the cart", () => {
    cy.visit("http://localhost:3000/products/breakfast");
    //click on first product
    cy.get("[data-testid='products-list']")
      .first()
      .contains("Add to Cart")
      .click();
    //increment quantity
    cy.get("[data-testid='increment-button']").click();
    //check if quantity is updated in cart
    cy.get("[data-testid='cart']").contains("Your Cart (2)");

    //decrement quantity
    cy.get("[data-testid='decrement-button']").click();
    //check if quantity is updated in cart
    cy.get("[data-testid='cart']").contains("Your Cart (1)");
  });

  it("should remove product from the cart", () => {
    cy.visit("http://localhost:3000/products/breakfast");
    //click on first product
    cy.get("[data-testid='products-list']")
      .first()
      .contains("Add to Cart")
      .click();
    //remove product
    cy.get("[data-testid='remove-button']").click();
    //check if product is removed from cart
    cy.get("[data-testid='cart']").contains("Your Cart (0)");
  });

  it("should persist cart items after page reload", () => {
    cy.visit("http://localhost:3000/products/breakfast");
    //click on first product
    cy.get("[data-testid='products-list']")
      .first()
      .contains("Add to Cart")
      .click();
    //reload page
    cy.reload();
    //check if product is still in cart
    cy.get("[data-testid='cart']").contains("Granola & Yogurt Bowl");
  });

  it("should update the total price in the cart", () => {
    cy.visit("http://localhost:3000/products/breakfast");
    //click on first product
    cy.get("[data-testid='products-list']")
      .first()
      .contains("Add to Cart")
      .click();
    //check if total price is correct
    cy.get("[data-testid='cart']").contains("$5.5");
    //increment quantity
    cy.get("[data-testid='increment-button']").click();
    //check if total price is updated
    cy.get("[data-testid='cart']").contains("$11.0");
  });

  it("should persist cart items across different product pages", () => {
    cy.visit("http://localhost:3000/products/breakfast");
    //click on first product
    cy.get("[data-testid='products-list']")
      .first()
      .contains("Add to Cart")
      .click();
    //navigate to another product category
    cy.visit("http://localhost:3000/products/lunch");
    //check if product is still in cart
    cy.get("[data-testid='cart']").contains("Granola & Yogurt Bowl");
  });
});
