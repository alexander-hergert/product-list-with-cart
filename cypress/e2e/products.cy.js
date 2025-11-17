describe("Products Page", () => {
  it("should contain heading and categories and elements", () => {
    cy.visit("http://localhost:3000/products");
    cy.get("h1").contains("Welcome, please select your category.");
    cy.contains("Breakfast");
    cy.contains("Lunch");
    cy.contains("Dessert");
    cy.contains("Drinks");
    cy.contains("Menu");
    cy.contains("Your Cart");
  });
});

describe("Products Page category rendering", () => {
  it("should contain filter form", () => {
    cy.visit("http://localhost:3000/products/breakfast");
    cy.get("form[data-testid='filter-form']").should("exist");
  });

  it("should contain sort form", () => {
    cy.visit("http://localhost:3000/products/breakfast");
    cy.get("form[data-testid='sort-form']").should("exist");
  });

  it("should contain pagination component", () => {
    cy.visit("http://localhost:3000/products/breakfast");
    cy.get("[data-testid='product-pagination']").should("exist");
  });

  it("should contain the cart component", () => {
    cy.visit("http://localhost:3000/products/breakfast");
    cy.contains("Your Cart");
  });

  it("should show products in the category", () => {
    cy.visit("http://localhost:3000/products/breakfast");
    cy.get("[data-testid='products-list']").should(
      "have.length.greaterThan",
      0
    );
  });
});

describe("Filter forms submission", () => {
  it("should filter by product name", () => {
    cy.visit("http://localhost:3000/products/breakfast");
    //get filter and type into product name input
    cy.get("form[data-testid='filter-form'] input[name='productName']").type(
      "Pancake"
    );
    //submit the form
    cy.get("form[data-testid='filter-form']").submit();
    //assert url contains productName query
    cy.url().should("contain", "productName=Pancake");
    //it should not contain products that do not match the filter
    cy.get("[data-testid='products-list']").should("not.contain", "Granola");
  });

  it("should filter by product category", () => {
    cy.visit("http://localhost:3000/products/breakfast");
    //get filter and select category
    cy.get(
      "form[data-testid='filter-form'] input[name='productCategory']"
    ).type("Burrito");
    //submit the form
    cy.get("form[data-testid='filter-form']").submit();
    //assert url contains category query
    cy.url().should("contain", "productCategory=Burrito");
    //it should only contain products that match the category
    cy.get("[data-testid='products-list']").should("contain", "Burrito");
    cy.get("[data-testid='products-list']").should("not.contain", "Pancake");
  });

  it("should filter by price range", () => {
    cy.visit("http://localhost:3000/products/breakfast");
    //get filter and type into min and max price inputs
    cy.get("form[data-testid='filter-form'] input[name='minPrice']").type("6");
    cy.get("form[data-testid='filter-form'] input[name='maxPrice']").type("8");
    //submit the form
    cy.get("form[data-testid='filter-form']").submit();
    //assert url contains minPrice and maxPrice query
    cy.url().should("contain", "minPrice=6");
    cy.url().should("contain", "maxPrice=8");
    //it should only contain products within the price range
    cy.get("[data-testid='products-list']").should("contain", "Burrito");
    cy.get("[data-testid='products-list']").should("not.contain", "Granola");
  });
});

describe("Sort form submission", () => {
  it("should sort by product name ascending", () => {
    cy.visit("http://localhost:3000/products/breakfast");
    //get sort form and select price ascending
    cy.get("form[data-testid='sort-form'] select[name='order']").select(
      "productnameAsc"
    );
    //submit the form
    cy.get("form[data-testid='sort-form']").submit();
    //test first element
    cy.get("[data-testid='products-list']").first().contains("Acai Bowl");
  });

  it("should sort by product name descending", () => {
    cy.visit("http://localhost:3000/products/breakfast");
    //get sort form and select price descending
    cy.get("form[data-testid='sort-form'] select[name='order']").select(
      "productnameDesc"
    );
    //submit the form
    cy.get("form[data-testid='sort-form']").submit();
    //test first element
    cy.get("[data-testid='products-list']").first().contains("Veggie Frittata");
  });

  it("should sort the products by catgeory ascending", () => {
    cy.visit("http://localhost:3000/products/breakfast");
    //get sort form and select category ascending
    cy.get("form[data-testid='sort-form'] select[name='order']").select(
      "productCategoryAsc"
    );
    //submit the form
    cy.get("form[data-testid='sort-form']").submit();
    //test first element
    cy.get("[data-testid='products-list']")
      .first()
      .contains("Smoked Salmon Bagel");
  });

  it("should sort the products by category descending", () => {
    cy.visit("http://localhost:3000/products/breakfast");
    //get sort form and select category descending
    cy.get("form[data-testid='sort-form'] select[name='order']").select(
      "productCategoryDesc"
    );
    //submit the form
    cy.get("form[data-testid='sort-form']").submit();
    //test first element
    cy.get("[data-testid='products-list']").first().contains("Avocado Toast");
  });

  it("should sort the products by price ascending", () => {
    cy.visit("http://localhost:3000/products/breakfast");
    //get sort form and select price ascending
    cy.get("form[data-testid='sort-form'] select[name='order']").select(
      "priceAsc"
    );
    //submit the form
    cy.get("form[data-testid='sort-form']").submit();
    //test first element
    cy.get("[data-testid='products-list']")
      .first()
      .contains("Homestyle Hash Browns");
  });

  it("should sort the products by price descending", () => {
    cy.visit("http://localhost:3000/products/breakfast");
    //get sort form and select price descending
    cy.get("form[data-testid='sort-form'] select[name='order']").select(
      "priceDesc"
    );
    //submit the form
    cy.get("form[data-testid='sort-form']").submit();
    //test first element
    cy.get("[data-testid='products-list']")
      .first()
      .contains("Tropical Superfood Bowl");
  });
});

describe("Product Pagination", () => {
  it("should navigate to the next page", () => {
    cy.visit("http://localhost:3000/products/breakfast");
    cy.get('[data-testid="product-pagination"]')
      .find('button[aria-label="Go to next page"]')
      .click();

    cy.url().should("contain", "page=2");
    cy.get("[data-testid='products-list']")
      .first()
      .contains("Classic Oatmeal Porridge");
  });

  it("should navigate to the previous page", () => {
    cy.visit("http://localhost:3000/products/breakfast?page=2");
    cy.get("[data-testid='product-pagination']")
      .find('button[aria-label="Go to previous page"]')
      .click();

    cy.url().should("contain", "page=1");
    cy.get("[data-testid='products-list']")
      .first()
      .contains("Granola & Yogurt Bowl");
  });

  it("should navigate to a specific page", () => {
    cy.visit("http://localhost:3000/products/breakfast");
    cy.get("[data-testid='product-pagination']").contains("3").click();

    cy.url().should("contain", "page=3");
    cy.get("[data-testid='products-list']")
      .first()
      .contains("Tropical Superfood Bowl");
  });
});
