describe("Product Details Page", () => {
  it("should navigate to product details page when a product is clicked", () => {
    cy.visit("http://localhost:3000/products/breakfast");
    //click on first product
    cy.contains("Granola & Yogurt Bowl").click();
    //check if url is correct
    cy.url().should(
      "eq",
      "http://localhost:3000/products/breakfast/03fb2adc-4aa4-4f96-aacc-03ca22e92ba0"
    );
    //check if product details are displayed
    cy.contains("Granola & Yogurt Bowl");
  });

  it("should render the elements correctly on the product details page", () => {
    cy.visit(
      "http://localhost:3000/products/breakfast/03fb2adc-4aa4-4f96-aacc-03ca22e92ba0"
    );
    //check if product title is displayed
    cy.get("[data-testid='product-title']").contains("Granola & Yogurt Bowl");
    //check if product image is displayed
    cy.get("[data-testid='product-image']").should("be.visible");
    //check if product description is displayed
    cy.get("[data-testid='product-description']").contains(
      "A refreshing and healthy breakfast bowl featuring creamy yogurt layered with crunchy granola, fresh berries, and a touch of honey. Perfect for a light and energizing meal."
    );
    //check if product price is displayed
    cy.get("[data-testid='product-price']").contains("$5.5");
    //check if add to cart button is displayed
    cy.contains("Add to Cart");
  });

  it("should add the product to the cart when 'Add to Cart' button is clicked", () => {
    cy.visit(
      "http://localhost:3000/products/breakfast/03fb2adc-4aa4-4f96-aacc-03ca22e92ba0"
    );
    //click on add to cart button
    cy.contains("Add to Cart").click();
    //check if cart count is updated
    cy.get("[data-testid='cart']").contains("Granola & Yogurt Bowl");
  });
});
