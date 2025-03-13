import prisma from "../lib/prisma";
import { v4 } from "uuid";

async function main() {
  const userPromises = [
    // Add 3 users to the database
    prisma.users.upsert({
      where: { email: "rauchg@vercel.com" },
      update: {},
      create: {
        id: v4(),
        role: "USER",
        name: "Guillermo Rauch",
        email: "rauchg@vercel.com",
        address: "Vercel Street",
        image:
          "https://images.ctfassets.net/e5382hct74si/2P1iOve0LZJRZWUzfXpi9r/9d4d27765764fb1ad7379d7cbe5f1043/ucxb4lHy_400x400.jpg",
      },
    }),
    prisma.users.upsert({
      where: { email: "lee@vercel.com" },
      update: {},
      create: {
        id: v4(),
        role: "USER",
        name: "Lee Robinson",
        email: "lee@vercel.com",
        address: "Vercel Street",
        image:
          "https://images.ctfassets.net/e5382hct74si/4BtM41PDNrx4z1ml643tdc/7aa88bdde8b5b7809174ea5b764c80fa/adWRdqQ6_400x400.jpg",
      },
    }),
    prisma.users.upsert({
      where: { email: "stey@vercel.com" },
      update: {},
      create: {
        id: v4(),
        role: "USER",
        name: "Steven Tey",
        address: "Vercel Street",
        email: "stey@vercel.com",
        image:
          "https://images.ctfassets.net/e5382hct74si/4QEuVLNyZUg5X6X4cW4pVH/eb7cd219e21b29ae976277871cd5ca4b/profile.jpg",
      },
    }),
    prisma.users.upsert({
      where: { email: "admin@gmail.com" },
      update: {},
      create: {
        id: process.env.ADMIN_ID || "",
        role: "ADMIN",
        name: "Alexander Hergert",
        email: process.env.ADMIN_EMAIL || "admin@gmail.com",
        address: process.env.ADMIN_ADDRESS || "Admin Street",
        image: process.env.ADMIN_PROFILE || "/images/profilePic.avif",
      },
    }),
  ];

  // Add all initial products to the database
  const productPromises = [];

  productPromises.push(
    // Add breakfast
    //1-a
    prisma.products.create({
      data: {
        id: v4(),
        name: "Classic Pancakes",
        main_category: "Breakfast",
        sub_category: "Pancake",
        price: 5.0,
        description:
          "A stack of fluffy pancakes served with butter and maple syrup. Perfect for breakfast or brunch, these pancakes are light, airy, and deliciously comforting.",
        image: "/images/breakfast/image-pancake-desktop.jpeg",
        rating: 0,
      },
    }),
    //1-b
    prisma.products.create({
      data: {
        id: v4(),
        name: "Blueberry Pancakes",
        main_category: "Breakfast",
        sub_category: "Pancake",
        price: 6.0,
        description:
          "A stack of fluffy pancakes bursting with fresh blueberries, served with a dusting of powdered sugar and a drizzle of maple syrup. The juicy berries add a sweet and tangy twist to this classic breakfast favorite.",
        image: "/images/breakfast/image-blueberry-pancake-desktop.jpeg",
        rating: 0,
      },
    }),
    //2-a
    prisma.products.create({
      data: {
        id: v4(),
        name: "Classic Eggs Benedict",
        main_category: "Breakfast",
        sub_category: "Egg Dishes",
        price: 8.5,
        description:
          "A breakfast classic featuring perfectly poached eggs on toasted English muffins, topped with savory Canadian bacon and rich hollandaise sauce. Served with a side of fresh greens or roasted potatoes.",
        image: "/images/breakfast/image-eggs-benedict-desktop.jpeg",
        rating: 0,
      },
    }),
    //2-b
    prisma.products.create({
      data: {
        id: v4(),
        name: "Veggie Frittata",
        main_category: "Breakfast",
        sub_category: "Egg Dishes",
        price: 7.5,
        description:
          "A hearty and wholesome frittata packed with fresh vegetables like spinach, bell peppers, and mushrooms, baked with fluffy eggs and melted cheese. Perfect for a filling and nutritious breakfast or brunch.",
        image: "/images/breakfast/image-veggie-frittata-desktop.jpeg",
        rating: 0,
      },
    }),
    //3-a
    prisma.products.create({
      data: {
        id: v4(),
        name: "Avocado Toast",
        main_category: "Breakfast",
        sub_category: "Toast & Sandwiches",
        price: 6.0,
        description:
          "A modern classic featuring creamy mashed avocado on toasted artisan bread, topped with a sprinkle of chili flakes, a drizzle of olive oil, and optional poached eggs for extra richness. Simple, fresh, and delicious.",
        image: "/images/breakfast/image-avocado-toast-desktop.jpeg",
        rating: 0,
      },
    }),
    //3-b
    prisma.products.create({
      data: {
        id: v4(),
        name: "Grilled Chicken Sandwich",
        main_category: "Breakfast",
        sub_category: "Toast & Sandwiches",
        price: 9.0,
        description:
          "A hearty sandwich made with tender grilled chicken breast, fresh lettuce, ripe tomatoes, and a zesty garlic aioli, served on a toasted ciabatta roll. Perfect for a satisfying and flavorful lunch.",
        image: "/images/breakfast/image-grilled-chicken-sandwich-desktop.jpeg",
        rating: 0,
      },
    }),
    //4-a
    prisma.products.create({
      data: {
        id: v4(),
        name: "Crispy Bacon Strips",
        main_category: "Breakfast",
        sub_category: "Meats & Sides",
        price: 4.5,
        description:
          "Perfectly cooked bacon strips, crispy and golden, with a smoky flavor. A classic breakfast side that pairs well with eggs, pancakes, or toast.",
        image: "/images/breakfast/image-crispy-bacon-desktop.jpeg",
        rating: 0,
      },
    }),
    //4-b
    prisma.products.create({
      data: {
        id: v4(),
        name: "Homestyle Hash Browns",
        main_category: "Breakfast",
        sub_category: "Meats & Sides",
        price: 3.5,
        description:
          "Golden and crispy shredded potato hash browns, seasoned to perfection. A comforting and savory side dish that complements any breakfast meal.",
        image: "/images/breakfast/image-hash-browns-desktop.jpeg",
        rating: 0,
      },
    }),
    //5-a
    prisma.products.create({
      data: {
        id: v4(),
        name: "Classic Oatmeal Porridge",
        main_category: "Breakfast",
        sub_category: "Cereals & Porridges",
        price: 4.0,
        description:
          "A warm and comforting bowl of creamy oatmeal porridge, made with rolled oats and your choice of milk. Topped with fresh fruits, nuts, and a drizzle of honey for a wholesome and nutritious start to your day.",
        image: "/images/breakfast/image-oatmeal-porridge-desktop.jpeg",
        rating: 0,
      },
    }),
    //5-b
    prisma.products.create({
      data: {
        id: v4(),
        name: "Granola & Yogurt Bowl",
        main_category: "Breakfast",
        sub_category: "Cereals & Porridges",
        price: 5.5,
        description:
          "A refreshing and healthy breakfast bowl featuring creamy yogurt layered with crunchy granola, fresh berries, and a touch of honey. Perfect for a light and energizing meal.",
        image: "/images/breakfast/image-granola-yogurt-bowl-desktop.jpeg",
        rating: 0,
      },
    }),
    //6-a
    prisma.products.create({
      data: {
        id: v4(),
        name: "Fresh Fruit Platter",
        main_category: "Breakfast",
        sub_category: "Fruits & Juices",
        price: 6.0,
        description:
          "A colorful assortment of fresh seasonal fruits, such as berries, melon, pineapple, and kiwi, served with a side of yogurt or honey for dipping. A light and refreshing option for breakfast or a healthy snack.",
        image: "/images/breakfast/image-fruit-platter-desktop.jpeg",
        rating: 0,
      },
    }),
    //6-b
    prisma.products.create({
      data: {
        id: v4(),
        name: "Green Detox Juice",
        main_category: "Breakfast",
        sub_category: "Fruits & Juices",
        price: 5.0,
        description:
          "A revitalizing green juice made with a blend of fresh spinach, kale, cucumber, apple, and lemon. Packed with vitamins and nutrients, this detoxifying drink is a refreshing way to start your day.",
        image: "/images/breakfast/image-green-juice-desktop.jpeg",
        rating: 0,
      },
    }),
    // 7-a
    prisma.products.create({
      data: {
        id: v4(),
        name: "Greek Yogurt Parfait",
        main_category: "Breakfast",
        sub_category: "Healthy Options",
        price: 6.5,
        description:
          "Creamy Greek yogurt layered with granola, fresh berries, and a drizzle of honey. A light and refreshing breakfast choice.",
        image: "/images/breakfast/image-yogurt-parfait-desktop.jpeg",
        rating: 0,
      },
    }),
    // 7-b
    prisma.products.create({
      data: {
        id: v4(),
        name: "Acai Bowl",
        main_category: "Breakfast",
        sub_category: "Healthy Options",
        price: 7.0,
        description:
          "A vibrant and nutritious bowl featuring acai puree topped with granola, fresh fruits, coconut flakes, and a drizzle of honey. A delicious and energizing breakfast or snack.",
        image: "/images/breakfast/image-acai-bowl-desktop.jpeg",
        rating: 0,
      },
    }),
    // 8-a
    prisma.products.create({
      data: {
        id: v4(),
        name: "Classic Breakfast Burrito",
        main_category: "Breakfast",
        sub_category: "Burrito",
        price: 7.5,
        description:
          "A hearty breakfast burrito filled with scrambled eggs, crispy bacon, sautéed bell peppers, onions, and melted cheese, all wrapped in a warm flour tortilla. Served with a side of salsa and sour cream.",
        image: "/images/breakfast/image-breakfast-burrito-desktop.jpeg",
        rating: 0,
      },
    }),
    // 8-b
    prisma.products.create({
      data: {
        id: v4(),
        name: "Vegetarian Breakfast Burrito",
        main_category: "Breakfast",
        sub_category: "Burrito",
        price: 7.0,
        description:
          "A flavorful vegetarian breakfast burrito filled with scrambled eggs, black beans, sautéed spinach, bell peppers, onions, and melted cheese, all wrapped in a warm flour tortilla. Served with a side of salsa and sour cream.",
        image: "/images/breakfast/image-vegetarian-burrito-desktop.jpeg",
        rating: 0,
      },
    }),
    // 9-a
    prisma.products.create({
      data: {
        id: v4(),
        name: "Classic Bagel with Cream Cheese",
        main_category: "Breakfast",
        sub_category: "Bagel",
        price: 4.5,
        description:
          "A toasted bagel with a generous schmear of creamy, tangy cream cheese. Simple, satisfying, and perfect for breakfast or a quick snack.",
        image: "/images/breakfast/image-bagel-cream-cheese-desktop.jpeg",
        rating: 0,
      },
    }),
    // 9-b
    prisma.products.create({
      data: {
        id: v4(),
        name: "Smoked Salmon Bagel",
        main_category: "Breakfast",
        sub_category: "Bagel",
        price: 6.0,
        description:
          "A classic bagel topped with silky smoked salmon, cream cheese, capers, red onion, and fresh dill. A delicious and elegant breakfast option that’s perfect for special occasions or a leisurely weekend brunch.",
        image: "/images/breakfast/image-salmon-bagel-desktop.jpeg",
        rating: 0,
      },
    }),
    // 10-a
    prisma.products.create({
      data: {
        id: v4(),
        name: "Tropical Superfood Bowl",
        main_category: "Breakfast",
        sub_category: "Superfood Bowls",
        price: 10.0,
        description:
          "A tropical blend of acai, mango, and pineapple, topped with coconut flakes, granola, fresh kiwi, and a drizzle of honey. A refreshing and nutrient-packed way to start your day.",
        image: "/images/breakfast/image-tropical-bowl-desktop.jpeg",
        rating: 0,
      },
    }),
    // 10-b
    prisma.products.create({
      data: {
        id: v4(),
        name: "Green Power Bowl",
        main_category: "Breakfast",
        sub_category: "Superfood Bowls",
        price: 9.5,
        description:
          "A base of spinach and kale topped with quinoa, avocado, roasted sweet potatoes, and a tahini drizzle. Packed with vitamins and minerals to power your morning.",
        image: "/images/breakfast/image-green-bowl-desktop.jpeg",
        rating: 0,
      },
    }),
    // Add lunch
    //1-a
    prisma.products.create({
      data: {
        id: v4(),
        name: "Classic Caesar Salad",
        main_category: "Lunch",
        sub_category: "Salad",
        price: 8.0,
        description:
          "A timeless favorite featuring crisp romaine lettuce, garlic croutons, shaved Parmesan cheese, and tangy Caesar dressing. Topped with grilled chicken or shrimp for a protein-packed meal.",
        image: "/images/lunch/image-caesar-salad-desktop.jpeg",
        rating: 0,
      },
    }),
    //1-b
    prisma.products.create({
      data: {
        id: v4(),
        name: "Greek Salad",
        main_category: "Lunch",
        sub_category: "Salad",
        price: 9.0,
        description:
          "A refreshing and colorful salad featuring crisp lettuce, juicy tomatoes, cucumbers, red onions, Kalamata olives, and feta cheese. Tossed in a zesty lemon-herb vinaigrette for a burst of Mediterranean flavors.",
        image: "/images/lunch/image-greek-salad-desktop.jpeg",
        rating: 0,
      },
    }),
    //2-a
    prisma.products.create({
      data: {
        id: v4(),
        name: "Caprese Panini",
        main_category: "Lunch",
        sub_category: "Sandwich",
        price: 9.5,
        description:
          "A classic Italian sandwich featuring ripe tomatoes, fresh mozzarella, basil leaves, and a drizzle of balsamic glaze, pressed between two slices of ciabatta bread. Served warm and melty, it’s a simple yet satisfying lunch option.",
        image: "/images/lunch/image-caprese-panini-desktop.jpeg",
        rating: 0,
      },
    }),
    //2-b
    prisma.products.create({
      data: {
        id: v4(),
        name: "Turkey Club Sandwich",
        main_category: "Lunch",
        sub_category: "Sandwich",
        price: 10.0,
        description:
          "A hearty triple-decker sandwich featuring roasted turkey, crispy bacon, lettuce, tomato, and mayonnaise on toasted bread. Served with a side of potato chips or a fresh salad for a classic lunchtime favorite.",
        image: "/images/lunch/image-turkey-club-sandwich-desktop.jpeg",
        rating: 0,
      },
    }),
    //3-a
    prisma.products.create({
      data: {
        id: v4(),
        name: "Margherita Pizza",
        main_category: "Lunch",
        sub_category: "Pizza",
        price: 12.0,
        description:
          "A classic pizza topped with fresh tomato sauce, mozzarella cheese, basil leaves, and a drizzle of olive oil. Baked to perfection in a wood-fired oven for a crispy crust and gooey cheese.",
        image: "/images/lunch/image-margherita-pizza-desktop.jpeg",
        rating: 0,
      },
    }),
    //3-b
    prisma.products.create({
      data: {
        id: v4(),
        name: "Pepperoni Pizza",
        main_category: "Lunch",
        sub_category: "Pizza",
        price: 13.0,
        description:
          "A crowd-pleasing pizza topped with zesty tomato sauce, mozzarella cheese, and slices of spicy pepperoni. Baked to golden perfection for a crispy crust and bubbling cheese.",
        image: "/images/lunch/image-pepperoni-pizza-desktop.jpeg",
        rating: 0,
      },
    }),
    //4-a
    prisma.products.create({
      data: {
        id: v4(),
        name: "Spaghetti Carbonara",
        main_category: "Lunch",
        sub_category: "Pasta",
        price: 11.0,
        description:
          "A classic Roman pasta dish featuring spaghetti tossed with crispy pancetta, creamy egg sauce, Parmesan cheese, and freshly cracked black pepper. Rich, indulgent, and satisfying.",
        image: "/images/lunch/image-spaghetti-carbonara-desktop.jpeg",
        rating: 0,
      },
    }),
    //4-b
    prisma.products.create({
      data: {
        id: v4(),
        name: "Penne alla Vodka",
        main_category: "Lunch",
        sub_category: "Pasta",
        price: 12.0,
        description:
          "A creamy and flavorful pasta dish featuring penne tossed in a luscious vodka sauce made with tomatoes, cream, garlic, and a splash of vodka. Finished with fresh basil and grated Parmesan cheese.",
        image: "/images/lunch/image-penne-vodka-desktop.jpeg",
        rating: 0,
      },
    }),
    //5-a
    prisma.products.create({
      data: {
        id: v4(),
        name: "Beef Burger",
        main_category: "Lunch",
        sub_category: "Burger",
        price: 10.0,
        description:
          "A juicy beef patty topped with lettuce, tomato, onion, pickles, and your choice of cheese, served on a toasted bun. Served with a side of fries or a fresh salad for a classic burger experience.",
        image: "/images/lunch/image-beef-burger-desktop.jpeg",
        rating: 0,
      },
    }),
    //5-b
    prisma.products.create({
      data: {
        id: v4(),
        name: "Veggie Burger",
        main_category: "Lunch",
        sub_category: "Burger",
        price: 9.0,
        description:
          "A flavorful veggie patty made with a blend of vegetables, grains, and spices, topped with lettuce, tomato, onion, and your choice of cheese, served on a toasted bun. Served with a side of sweet potato fries or a fresh salad for a satisfying meal.",
        image: "/images/lunch/image-veggie-burger-desktop.jpeg",
        rating: 0,
      },
    }),
    //6-a
    prisma.products.create({
      data: {
        id: v4(),
        name: "Chicken Caesar Wrap",
        main_category: "Lunch",
        sub_category: "Wrap",
        price: 9.5,
        description:
          "A wrap filled with grilled chicken, romaine lettuce, Parmesan cheese, and Caesar dressing, all rolled up in a soft tortilla. Served with a side of potato chips or a fresh salad for a quick and tasty lunch option.",
        image: "/images/lunch/image-chicken-caesar-wrap-desktop.jpeg",
        rating: 0,
      },
    }),
    //6-b
    prisma.products.create({
      data: {
        id: v4(),
        name: "Falafel Wrap",
        main_category: "Lunch",
        sub_category: "Wrap",
        price: 8.5,
        description:
          "A vegetarian wrap filled with crispy falafel balls, hummus, tabbouleh, lettuce, and tahini sauce, all wrapped up in a warm pita. Served with a side of fries or a fresh salad for a flavorful and satisfying meal.",
        image: "/images/lunch/image-falafel-wrap-desktop.jpeg",
        rating: 0,
      },
    }),
    //7-a
    prisma.products.create({
      data: {
        id: v4(),
        name: "Mediterranean Mezze Platter",
        main_category: "Lunch",
        sub_category: "Appetizers",
        price: 14.0,
        description:
          "A colorful assortment of Mediterranean appetizers, including hummus, baba ghanoush, tabbouleh, falafel, olives, and pita bread. Perfect for sharing or as a light and flavorful meal.",
        image: "/images/lunch/image-mezze-platter-desktop.jpeg",
        rating: 0,
      },
    }),
    //7-b
    prisma.products.create({
      data: {
        id: v4(),
        name: "Cheese & Charcuterie Board",
        main_category: "Lunch",
        sub_category: "Appetizers",
        price: 15.0,
        description:
          "An elegant spread of assorted cheeses, cured meats, nuts, fruits, and crackers. Perfect for a light lunch, a pre-dinner appetizer, or a sophisticated snack.",
        image: "/images/lunch/image-charcuterie-board-desktop.jpeg",
        rating: 0,
      },
    }),
    //8-a
    prisma.products.create({
      data: {
        id: v4(),
        name: "Tomato Basil Soup",
        main_category: "Lunch",
        sub_category: "Soup",
        price: 6.0,
        description:
          "A comforting and flavorful soup made with ripe tomatoes, fresh basil, garlic, and a touch of cream. Served with a side of crusty bread or a grilled cheese sandwich for a classic pairing.",
        image: "/images/lunch/image-tomato-soup-desktop.jpeg",
        rating: 0,
      },
    }),
    //8-b
    prisma.products.create({
      data: {
        id: v4(),
        name: "Butternut Squash Soup",
        main_category: "Lunch",
        sub_category: "Soup",
        price: 7.0,
        description:
          "A velvety and rich soup made with roasted butternut squash, onions, garlic, and warming spices. Finished with a swirl of cream and a sprinkle of toasted pumpkin seeds for a touch of crunch.",
        image: "/images/lunch/image-squash-soup-desktop.jpeg",
        rating: 0,
      },
    }),
    //9-a
    prisma.products.create({
      data: {
        id: v4(),
        name: "Classic Beef Stew",
        main_category: "Lunch",
        sub_category: "Stew",
        price: 12.0,
        description:
          "A hearty and comforting stew made with tender chunks of beef, carrots, potatoes, and onions, simmered in a rich and flavorful broth. Served with a side of crusty bread for dipping.",
        image: "/images/lunch/image-beef-stew-desktop.jpeg",
        rating: 0,
      },
    }),
    //9-b
    prisma.products.create({
      data: {
        id: v4(),
        name: "Vegetarian Chili",
        main_category: "Lunch",
        sub_category: "Stew",
        price: 10.0,
        description:
          "A hearty and flavorful vegetarian chili made with beans, tomatoes, bell peppers, onions, and a blend of spices. Served with a dollop of sour cream and a sprinkle of cheddar cheese.",
        image: "/images/lunch/image-vegetarian-chili-desktop.jpeg",
        rating: 0,
      },
    }),
    //10-a
    prisma.products.create({
      data: {
        id: v4(),
        name: "Chicken Tikka Masala",
        main_category: "Lunch",
        sub_category: "Curry",
        price: 13.0,
        description:
          "A classic Indian curry made with tender pieces of chicken simmered in a creamy tomato sauce with aromatic spices. Served with basmati rice, naan bread, and a side of cooling raita.",
        image: "/images/lunch/image-chicken-tikka-masala-desktop.jpeg",
        rating: 0,
      },
    }),
    //10-b
    prisma.products.create({
      data: {
        id: v4(),
        name: "Vegetable Korma",
        main_category: "Lunch",
        sub_category: "Curry",
        price: 11.0,
        description:
          "A flavorful and creamy Indian curry made with a medley of vegetables, simmered in a spiced coconut milk sauce. Served with fragrant basmati rice, naan bread, and a sprinkle of fresh cilantro.",
        image: "/images/lunch/image-vegetable-korma-desktop.jpeg",
        rating: 0,
      },
    }),
    // Add desserts
    //1-a
    prisma.products.create({
      data: {
        id: v4(),
        name: "Waffle with Berries",
        main_category: "Desserts",
        sub_category: "Waffle",
        price: 6.5,
        description:
          "A delicious, golden-brown waffle topped with a mix of fresh berries, including strawberries, blueberries, and raspberries. Perfectly crispy on the outside and fluffy on the inside, served with a drizzle of maple syrup or a dollop of whipped cream.",
        image: "/images/desserts/image-waffle-desktop.jpg",
        rating: 0,
      },
    }),
    //1-b
    prisma.products.create({
      data: {
        id: v4(),
        name: "Chocolate Drizzle Waffle",
        main_category: "Desserts",
        sub_category: "Waffle",
        price: 7.0,
        description:
          "A warm, golden waffle topped with a generous drizzle of rich chocolate sauce, fresh strawberries, and a sprinkle of powdered sugar. Perfectly crispy on the outside, fluffy on the inside, and indulgent in every bite.",
        image: "/images/desserts/image-chocolate-waffle-desktop.jpeg",
        rating: 0,
      },
    }),
    //2-a
    prisma.products.create({
      data: {
        id: v4(),
        name: "Vanilla Bean Crème Brûlée",
        main_category: "Desserts",
        sub_category: "Crème Brûlée",
        price: 7.0,
        description:
          "A classic French dessert featuring a rich and creamy vanilla bean custard base, topped with a perfectly caramelized sugar crust. Each spoonful offers a delightful contrast between the smooth custard and the crisp, golden topping.",
        image: "/images/desserts/image-creme-brulee-desktop.jpg",
        rating: 0,
      },
    }),
    //2-b
    prisma.products.create({
      data: {
        id: v4(),
        name: "Salted Caramel Crème Brûlée",
        main_category: "Desserts",
        sub_category: "Crème Brûlée",
        price: 7.5,
        description:
          "A decadent twist on the classic French dessert, featuring a velvety caramel-infused custard base topped with a perfectly torched sugar crust. The subtle hint of sea salt enhances the rich caramel flavor, creating a perfect balance of sweet and salty.",
        image:
          "/images/desserts/image-salted-caramel-creme-brulee-desktop.jpeg",
        rating: 0,
      },
    }),
    //3-a
    prisma.products.create({
      data: {
        id: v4(),
        name: "Macaron Mix of Five",
        main_category: "Desserts",
        sub_category: "Macaron",
        price: 8.0,
        description:
          "A delightful mix of five colorful macarons, each with a unique flavor. These delicate French treats feature a crisp outer shell and a soft, chewy interior, filled with luscious ganache or buttercream. Flavors may include vanilla, raspberry, pistachio, chocolate, and lemon.",
        image: "/images/desserts/image-macaron-desktop.jpg",
        rating: 0,
      },
    }),
    //3-b
    prisma.products.create({
      data: {
        id: v4(),
        name: "Seasonal Macaron Box",
        main_category: "Desserts",
        sub_category: "Macaron",
        price: 9.0,
        description:
          "A special collection of macarons featuring seasonal flavors. Each box includes a variety of vibrant macarons with fillings inspired by the season, such as pumpkin spice, apple cinnamon, cranberry, peppermint, and gingerbread. Perfect for celebrating the time of year!",
        image: "/images/desserts/image-seasonal-macaron-desktop.jpeg",
        rating: 0,
      },
    }),
    //4-a
    prisma.products.create({
      data: {
        id: v4(),
        name: "Classic Tiramisu",
        main_category: "Desserts",
        sub_category: "Tiramisu",
        price: 5.5,
        description:
          "A timeless Italian dessert made with layers of coffee-soaked ladyfingers, rich mascarpone cream, and a dusting of cocoa powder. Each bite offers a perfect balance of creamy, coffee-infused flavors with a light, airy texture.",
        image: "/images/desserts/image-tiramisu-desktop.jpg",
        rating: 0,
      },
    }),
    //4-b
    prisma.products.create({
      data: {
        id: v4(),
        name: "Chocolate Hazelnut Tiramisu",
        main_category: "Desserts",
        sub_category: "Tiramisu",
        price: 6.0,
        description:
          "A decadent twist on the classic Tiramisu, featuring layers of coffee-soaked ladyfingers, creamy mascarpone cheese, and a rich chocolate hazelnut spread. Topped with a dusting of cocoa powder and chopped hazelnuts for an extra crunch.",
        image:
          "/images/desserts/image-chocolate-hazelnut-tiramisu-desktop.jpeg",
        rating: 0,
      },
    }),
    //5-a
    prisma.products.create({
      data: {
        id: v4(),
        name: "Pistachio Baklava",
        main_category: "Desserts",
        sub_category: "Baklava",
        price: 4.0,
        description:
          "A decadent Middle Eastern pastry made with layers of flaky phyllo dough, filled with finely chopped pistachios, and sweetened with a fragrant honey syrup. Each piece is crisp, nutty, and perfectly balanced with a touch of sweetness.",
        image: "/images/desserts/image-baklava-desktop.jpg",
        rating: 0,
      },
    }),
    //5-b
    prisma.products.create({
      data: {
        id: v4(),
        name: "Walnut Baklava",
        main_category: "Desserts",
        sub_category: "Baklava",
        price: 4.5,
        description:
          "A traditional Middle Eastern pastry made with layers of buttery phyllo dough, filled with finely chopped walnuts, and soaked in a fragrant honey syrup. Each bite offers a delightful crunch and a perfect balance of sweetness and nuttiness.",
        image: "/images/desserts/image-walnut-baklava-desktop.jpeg",
        rating: 0,
      },
    }),
    //6-a
    prisma.products.create({
      data: {
        id: v4(),
        name: "Lemon Meringue Pie",
        main_category: "Desserts",
        sub_category: "Pie",
        price: 5.0,
        description:
          "A tangy and sweet dessert featuring a buttery crust filled with smooth, zesty lemon curd, and topped with a fluffy, golden-brown meringue. The perfect balance of tart and sweet in every bite.",
        image: "/images/desserts/image-meringue-desktop.jpg",
        rating: 0,
      },
    }),
    //6-b
    prisma.products.create({
      data: {
        id: v4(),
        name: "Classic Apple Pie",
        main_category: "Desserts",
        sub_category: "Pie",
        price: 5.5,
        description:
          "A timeless favorite made with a flaky, buttery crust filled with tender, cinnamon-spiced apple slices. Baked to golden perfection and served warm, it’s the ultimate comfort dessert, especially when paired with a scoop of vanilla ice cream.",
        image: "/images/desserts/image-apple-pie-desktop.jpeg",
        rating: 0,
      },
    }),
    //7-a
    prisma.products.create({
      data: {
        id: v4(),
        name: "Red Velvet Cake",
        main_category: "Desserts",
        sub_category: "Cake",
        price: 4.5,
        description:
          "A luxurious and moist red velvet cake with its signature vibrant red color, layered with creamy, tangy cream cheese frosting. Each slice offers a rich, velvety texture and a hint of cocoa flavor, making it a timeless favorite.",
        image: "/images/desserts/image-cake-desktop.jpg",
        rating: 0,
      },
    }),
    //7-b
    prisma.products.create({
      data: {
        id: v4(),
        name: "Chocolate Fudge Cake",
        main_category: "Desserts",
        sub_category: "Cake",
        price: 5.0,
        description:
          "An indulgent chocolate lover’s dream, this cake features layers of rich, moist chocolate fudge cake filled and frosted with smooth, creamy chocolate ganache. Topped with chocolate shavings for an extra touch of decadence.",
        image: "/images/desserts/image-chocolate-fudge-cake-desktop.jpeg",
        rating: 0,
      },
    }),
    //8-a
    prisma.products.create({
      data: {
        id: v4(),
        name: "Salted Caramel Brownie",
        main_category: "Desserts",
        sub_category: "Brownie",
        price: 4.5,
        description:
          "A rich and fudgy chocolate brownie swirled with gooey salted caramel, creating the perfect balance of sweet and salty. Each bite is decadently moist, with a satisfying contrast of textures and flavors.",
        image: "/images/desserts/image-brownie-desktop.jpg",
        rating: 0,
      },
    }),
    //8-b
    prisma.products.create({
      data: {
        id: v4(),
        name: "Double Chocolate Walnut Brownie",
        main_category: "Desserts",
        sub_category: "Brownie",
        price: 5.0,
        description:
          "A chocolate lover’s delight, this brownie is packed with rich, fudgy chocolate and crunchy walnuts. Each bite offers a perfect balance of intense chocolate flavor and a satisfying nutty crunch, making it an irresistible treat.",
        image:
          "/images/desserts/image-double-chocolate-walnut-brownie-desktop.jpeg",
        rating: 0,
      },
    }),
    //9-a
    prisma.products.create({
      data: {
        id: v4(),
        name: "Vanilla Panna Cotta",
        main_category: "Desserts",
        sub_category: "Panna Cotta",
        price: 6.5,
        description:
          "A silky-smooth Italian dessert made with sweetened cream, infused with vanilla, and set to perfection. Served with a drizzle of berry coulis or caramel sauce, it’s a light yet indulgent treat that melts in your mouth.",
        image: "/images/desserts/image-panna-cotta-desktop.jpg",
        rating: 0,
      },
    }),
    //9-b
    prisma.products.create({
      data: {
        id: v4(),
        name: "Mango Coconut Panna Cotta",
        main_category: "Desserts",
        sub_category: "Panna Cotta",
        price: 7.0,
        description:
          "A tropical twist on the classic Italian dessert, this panna cotta combines creamy coconut milk with a vibrant mango puree. Topped with fresh mango slices and a sprinkle of toasted coconut, it’s a refreshing and exotic treat.",
        image: "/images/desserts/image-mango-coconut-panna-cotta-desktop.jpeg",
        rating: 0,
      },
    }),
    //10-a
    prisma.products.create({
      data: {
        id: v4(),
        name: "Raspberry Lemon Sorbet",
        main_category: "Desserts",
        sub_category: "Sorbet",
        price: 4.0,
        description:
          "A refreshing and tangy sorbet made with ripe raspberries and zesty lemon. This dairy-free treat is bursting with fruity flavors and has a smooth, icy texture, perfect for cooling down on a warm day.",
        image: "/images/desserts/image-raspberry-lemon-sorbet-desktop.jpeg",
        rating: 0,
      },
    }),
    //10-b
    prisma.products.create({
      data: {
        id: v4(),
        name: "Mango Passionfruit Sorbet",
        main_category: "Desserts",
        sub_category: "Sorbet",
        price: 4.5,
        description:
          "A tropical delight combining sweet mango and tangy passionfruit. This vibrant, dairy-free sorbet is smooth, refreshing, and packed with exotic flavors, making it a perfect palate cleanser or light dessert.",
        image: "/images/desserts/image-mango-passionfruit-sorbet-desktop.jpeg",
        rating: 0,
      },
    }),
    // Add drinks
    //1-a
    prisma.products.create({
      data: {
        id: v4(),
        name: "Classic Espresso",
        main_category: "Drinks",
        sub_category: "Coffee",
        price: 3.0,
        description:
          "A single shot of rich, intense espresso, made from finely ground coffee beans and hot water. Served in a small cup, it’s the perfect pick-me-up for coffee lovers.",
        image: "/images/drinks/image-espresso-desktop.jpeg",
        rating: 0,
      },
    }),
    //1-b
    prisma.products.create({
      data: {
        id: v4(),
        name: "Cappuccino",
        main_category: "Drinks",
        sub_category: "Coffee",
        price: 4.0,
        description:
          "A classic Italian coffee drink made with equal parts espresso, steamed milk, and milk foam. Topped with a sprinkle of cocoa powder or cinnamon, it’s a creamy and indulgent choice for coffee connoisseurs.",
        image: "/images/drinks/image-cappuccino-desktop.jpeg",
        rating: 0,
      },
    }),
    //2-a
    prisma.products.create({
      data: {
        id: v4(),
        name: "Iced Latte",
        main_category: "Drinks",
        sub_category: "Iced Coffee",
        price: 4.5,
        description:
          "A refreshing and creamy iced coffee made with espresso and cold milk, poured over ice. Sweetened to taste and customizable with flavored syrups, it’s the perfect pick-me-up on a hot day.",
        image: "/images/drinks/image-iced-latte-desktop.jpeg",
        rating: 0,
      },
    }),
    //2-b
    prisma.products.create({
      data: {
        id: v4(),
        name: "Iced Mocha",
        main_category: "Drinks",
        sub_category: "Iced Coffee",
        price: 5.0,
        description:
          "A decadent iced coffee drink made with espresso, chocolate syrup, cold milk, and ice. Topped with whipped cream and chocolate shavings, it’s a sweet and indulgent treat for chocolate and coffee lovers alike.",
        image: "/images/drinks/image-iced-mocha-desktop.jpeg",
        rating: 0,
      },
    }),
    //3-a
    prisma.products.create({
      data: {
        id: v4(),
        name: "Matcha Latte",
        main_category: "Drinks",
        sub_category: "Tea & Matcha",
        price: 5.5,
        description:
          "A vibrant and earthy green tea latte made with high-quality matcha powder, steamed milk, and a touch of sweetener. Served hot or iced, it’s a creamy and energizing drink with a unique, grassy flavor.",
        image: "/images/drinks/image-matcha-latte-desktop.jpeg",
        rating: 0,
      },
    }),
    //3-b
    prisma.products.create({
      data: {
        id: v4(),
        name: "Chai Tea Latte",
        main_category: "Drinks",
        sub_category: "Tea & Matcha",
        price: 5.0,
        description:
          "A spiced and aromatic tea latte made with black tea, steamed milk, and a blend of warm spices such as cinnamon, cardamom, and ginger. Sweetened to taste, it’s a comforting and flavorful drink perfect for chilly days.",
        image: "/images/drinks/image-chai-latte-desktop.jpeg",
        rating: 0,
      },
    }),
    //4-a
    prisma.products.create({
      data: {
        id: v4(),
        name: "Freshly Squeezed Orange Juice",
        main_category: "Drinks",
        sub_category: "Juices",
        price: 4.0,
        description:
          "A refreshing and tangy orange juice made from freshly squeezed oranges. Packed with vitamin C and natural sweetness, it’s a classic and invigorating choice for breakfast or any time of day.",
        image: "/images/drinks/image-orange-juice-desktop.jpeg",
        rating: 0,
      },
    }),
    //4-b
    prisma.products.create({
      data: {
        id: v4(),
        name: "Citrus Sunrise Juice",
        main_category: "Drinks",
        sub_category: "Juices",
        price: 5.5,
        description:
          "A zesty and refreshing juice made with a blend of oranges, grapefruits, carrots, and a hint of ginger. This vibrant drink is bursting with vitamin C and is the perfect way to brighten your day.",
        image: "/images/drinks/image-citrus-sunrise-juice-desktop.jpeg",
        rating: 0,
      },
    }),
    //5-a
    prisma.products.create({
      data: {
        id: v4(),
        name: "Classic Hot Chocolate",
        main_category: "Drinks",
        sub_category: "Hot Chocolate",
        price: 4.5,
        description:
          "A rich and creamy hot chocolate made with premium cocoa powder, steamed milk, and a dollop of whipped cream. Topped with chocolate shavings or a sprinkle of cinnamon, it’s a comforting and indulgent treat for chocolate lovers.",
        image: "/images/drinks/image-hot-chocolate-desktop.jpeg",
        rating: 0,
      },
    }),
    //5-b
    prisma.products.create({
      data: {
        id: v4(),
        name: "Peppermint Mocha",
        main_category: "Drinks",
        sub_category: "Hot Chocolate",
        price: 5.0,
        description:
          "A festive and indulgent hot chocolate drink made with espresso, chocolate syrup, steamed milk, and a hint of peppermint. Topped with whipped cream and crushed candy canes, it’s a sweet and minty treat perfect for the holiday season.",
        image: "/images/drinks/image-peppermint-mocha-desktop.jpeg",
        rating: 0,
      },
    }),
    //6-a
    prisma.products.create({
      data: {
        id: v4(),
        name: "Iced Tea",
        main_category: "Drinks",
        sub_category: "Iced Tea",
        price: 4.0,
        description:
          "A refreshing and thirst-quenching iced tea made with freshly brewed black tea, sweetened to taste, and served over ice. Garnished with a slice of lemon or sprig of mint, it’s a classic and cooling drink for any time of day.",
        image: "/images/drinks/image-iced-tea-desktop.jpeg",
        rating: 0,
      },
    }),
    //6-b
    prisma.products.create({
      data: {
        id: v4(),
        name: "Peach Iced Tea",
        main_category: "Drinks",
        sub_category: "Iced Tea",
        price: 4.5,
        description:
          "A fruity and refreshing iced tea made with freshly brewed black tea, sweet peach syrup, and a splash of lemon juice. Served over ice and garnished with a slice of fresh peach, it’s a sweet and summery drink perfect for warm days.",
        image: "/images/drinks/image-peach-iced-tea-desktop.jpeg",
        rating: 0,
      },
    }),
    //7-a
    prisma.products.create({
      data: {
        id: v4(),
        name: "Sparkling Water",
        main_category: "Drinks",
        sub_category: "Non-Alcoholic",
        price: 2.0,
        description:
          "A refreshing and effervescent drink made with carbonated water. Served chilled with a slice of lemon or lime, it’s a crisp and thirst-quenching option for those looking for a simple and hydrating beverage.",
        image: "/images/drinks/image-sparkling-water-desktop.jpeg",
        rating: 0,
      },
    }),
    //7-b
    prisma.products.create({
      data: {
        id: v4(),
        name: "Virgin Mojito",
        main_category: "Drinks",
        sub_category: "Non-Alcoholic",
        price: 3.0,
        description:
          "A refreshing and minty mocktail made with fresh mint leaves, lime juice, sugar, and soda water. Served over ice and garnished with a sprig of mint and a slice of lime, it’s a zesty and thirst-quenching drink for any occasion.",
        image: "/images/drinks/image-virgin-mojito-desktop.jpeg",
        rating: 0,
      },
    }),
    //Add Menu
    //1-a
    prisma.products.create({
      data: {
        id: v4(),
        name: "Classic Breakfast",
        main_category: "Menu",
        sub_category: "Breakfast",
        price: 12.0,
        description:
          "A classic breakfast featuring two eggs cooked to your liking, crispy bacon or sausage links, golden hash browns, and a side of toast or pancakes. Served with a choice of coffee or orange juice.",
        image: "/images/menu/image-classic-breakfast-desktop.jpeg",
        rating: 0,
      },
    }),
    //1-b
    prisma.products.create({
      data: {
        id: v4(),
        name: "Healthy Start",
        main_category: "Menu",
        sub_category: "Breakfast",
        price: 14.0,
        description:
          "A nutritious and balanced breakfast featuring a Greek yogurt parfait with fresh berries and granola, a side of whole grain toast with avocado, and a green smoothie made with spinach, banana, and almond milk.",
        image: "/images/menu/image-healthy-breakfast-desktop.jpeg",
        rating: 0,
      },
    }),
    //2-a
    prisma.products.create({
      data: {
        id: v4(),
        name: "Classic Brunch",
        main_category: "Menu",
        sub_category: "Brunch",
        price: 16.0,
        description:
          "A leisurely brunch featuring fluffy scrambled eggs, crispy bacon, golden hash browns, and a side of fresh fruit salad. Served with a choice of pancakes or French toast and a mimosa or coffee.",
        image: "/images/menu/image-classic-brunch-desktop.jpeg",
        rating: 0,
      },
    }),
    //2-b
    prisma.products.create({
      data: {
        id: v4(),
        name: "Vegetarian Brunch",
        main_category: "Menu",
        sub_category: "Brunch",
        price: 18.0,
        description:
          "A plant-based brunch featuring a tofu scramble with sautéed vegetables, roasted sweet potatoes, and a side of avocado toast. Served with a fresh fruit smoothie and a choice of herbal tea or coffee.",
        image: "/images/menu/image-vegetarian-brunch-desktop.jpeg",
        rating: 0,
      },
    }),
    //3-a
    prisma.products.create({
      data: {
        id: v4(),
        name: "Classic Lunch",
        main_category: "Menu",
        sub_category: "Lunch",
        price: 20.0,
        description:
          "A satisfying lunch featuring a choice of sandwich or salad, a cup of soup or side of fries, and a refreshing beverage. Options include a turkey club sandwich, Caesar salad, tomato basil soup, and iced tea.",
        image: "/images/menu/image-classic-lunch-desktop.jpeg",
        rating: 0,
      },
    }),
    //3-b
    prisma.products.create({
      data: {
        id: v4(),
        name: "Healthy Lunch",
        main_category: "Menu",
        sub_category: "Lunch",
        price: 22.0,
        description:
          "A wholesome lunch featuring a quinoa and kale salad with grilled chicken, a side of roasted vegetables, and a fresh fruit smoothie. Served with a choice of herbal tea or sparkling water.",
        image: "/images/menu/image-healthy-lunch-desktop.jpeg",
        rating: 0,
      },
    }),
    //4-a
    prisma.products.create({
      data: {
        id: v4(),
        name: "Classic Dinner",
        main_category: "Menu",
        sub_category: "Dinner",
        price: 24.0,
        description:
          "A comforting dinner featuring a choice of entrée, two sides, and a dessert. Options include roast chicken with mashed potatoes and green beans, grilled salmon with quinoa and asparagus, and beef stew with crusty bread.",
        image: "/images/menu/image-classic-dinner-desktop.jpeg",
        rating: 0,
      },
    }),
    //4-b
    prisma.products.create({
      data: {
        id: v4(),
        name: "Vegetarian Dinner",
        main_category: "Menu",
        sub_category: "Dinner",
        price: 26.0,
        description:
          "A plant-based dinner featuring a lentil and vegetable stew with brown rice, a side of roasted Brussels sprouts, and a mixed berry crumble for dessert. Served with a choice of herbal tea or sparkling water.",
        image: "/images/menu/image-vegetarian-dinner-desktop.jpeg",
        rating: 0,
      },
    }),
    //5-a
    prisma.products.create({
      data: {
        id: v4(),
        name: "Classic Afternoon Tea",
        main_category: "Menu",
        sub_category: "Tea",
        price: 18.0,
        description:
          "A traditional afternoon tea service featuring a selection of finger sandwiches, scones with clotted cream and jam, and a variety of sweet treats. Served with a pot of freshly brewed tea or coffee.",
        image: "/images/menu/image-classic-tea-desktop.jpeg",
        rating: 0,
      },
    }),
    //5-b
    prisma.products.create({
      data: {
        id: v4(),
        name: "Champagne Afternoon Tea",
        main_category: "Menu",
        sub_category: "Tea",
        price: 22.0,
        description:
          "A luxurious afternoon tea service featuring a selection of gourmet finger sandwiches, delicate pastries, and freshly baked scones. Served with a glass of champagne or sparkling wine and a pot of premium tea.",
        image: "/images/menu/image-champagne-tea-desktop.jpeg",
        rating: 0,
      },
    }),
    //6-a
    prisma.products.create({
      data: {
        id: v4(),
        name: "Classic Happy Hour",
        main_category: "Menu",
        sub_category: "Drinks",
        price: 16.0,
        description:
          "A classic happy hour featuring a selection of beer, wine, and cocktails, along with a variety of appetizers and small bites. Options include sliders, wings, nachos, and a charcuterie board.",
        image: "/images/menu/image-classic-happy-hour-desktop.jpeg",
        rating: 0,
      },
    }),
    //6-b
    prisma.products.create({
      data: {
        id: v4(),
        name: "Craft Cocktail Hour",
        main_category: "Menu",
        sub_category: "Drinks",
        price: 20.0,
        description:
          "A sophisticated cocktail hour featuring a selection of handcrafted cocktails, premium spirits, and artisanal mixers. Served with a variety of gourmet snacks and small plates for a stylish and elegant experience.",
        image: "/images/menu/image-craft-cocktail-hour-desktop.jpeg",
        rating: 0,
      },
    })
  );

  //Add 6 orders to the database
  // const orderPromises = [];
  // for (let i = 1; i < 7; i++) {
  //   orderPromises.push(
  //     prisma.orders.create({
  //       data: {
  //         id: `${i}`,
  //         paymentId: `${i}`,
  //         userId: `${Math.floor(Math.random() * 3) + 1}`,
  //         productIds: ["1", "2", "3"],
  //         productIdsQuantity: [1, 2, 3],
  //         productIdsPrice: [100, 200, 300],
  //         totalPrice: Math.floor(Math.random() * 900) + 1,
  //       },
  //     })
  //   );
  // }

  // Add 3 feedbacks to the database
  // can create issues need to rework, must match the constraints
  // const feedbackPromises = [];
  // for (let i = 1; i < 4; i++) {
  //   feedbackPromises.push(
  //     prisma.feedbacks.create({
  //       data: {
  //         id: `${i}`,
  //         userId: `${Math.floor(Math.random() * 3) + 1}`,
  //         orderId: `${Math.floor(Math.random() * 3) + 1}`,
  //         title: "Great product",
  //         productId: `${i}`,
  //         comment: "I love this product",
  //         updatedAt: new Date(),
  //       },
  //     })
  //   );

  // Wait for all user and product promises to resolve
  const response = await Promise.all([
    ...userPromises,
    ...productPromises,
    // ...orderPromises,
    // ...feedbackPromises,
  ]);
  console.log(response);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
