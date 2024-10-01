import prisma from "../lib/prisma";

async function main() {
  const userPromises = [
    // Add 3 users to the database
    prisma.users.upsert({
      where: { email: "rauchg@vercel.com" },
      update: {},
      create: {
        id: "1",
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
        id: "2",
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
        id: "3",
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
    prisma.products.create({
      data: {
        id: "1",
        name: "Waffle",
        price: 6.5,
        description: "Waffle with Berries",
        image: "/images/image-waffle-desktop.jpg",
        rating: 0,
      },
    }),
    prisma.products.create({
      data: {
        id: "2",
        name: "Vanilla Bean Crème Brûlée",
        price: 7.0,
        description: "Crème Brûlée",
        image: "/images/image-creme-brulee-desktop.jpg",
        rating: 0,
      },
    }),
    prisma.products.create({
      data: {
        id: "3",
        name: "Macaron",
        price: 8.0,
        description: "Macaron Mix of Five",
        image: "/images/image-macaron-desktop.jpg",
        rating: 0,
      },
    }),
    prisma.products.create({
      data: {
        id: "4",
        name: "Classic Tiramisu",
        price: 5.5,
        description: "Tiramisu",
        image: "/images/image-tiramisu-desktop.jpg",
        rating: 0,
      },
    }),
    prisma.products.create({
      data: {
        id: "5",
        name: "Pistachio Baklava",
        price: 4.0,
        description: "Baklava",
        image: "/images/image-baklava-desktop.jpg",
        rating: 0,
      },
    }),
    prisma.products.create({
      data: {
        id: "6",
        name: "Lemon Meringue Pie",
        price: 5.0,
        description: "Pie",
        image: "/images/image-meringue-desktop.jpg",
        rating: 0,
      },
    }),
    prisma.products.create({
      data: {
        id: "7",
        name: "Red Velvet Cake",
        price: 4.5,
        description: "Cake",
        image: "/images/image-cake-desktop.jpg",
        rating: 0,
      },
    }),
    prisma.products.create({
      data: {
        id: "8",
        name: "Salted Caramel Brownie",
        price: 4.5,
        description: "Brownie",
        image: "/images/image-brownie-desktop.jpg",
        rating: 0,
      },
    }),
    prisma.products.create({
      data: {
        id: "9",
        name: "Vanilla Panna Cotta",
        price: 6.5,
        description: "Panna Cotta",
        image: "/images/image-panna-cotta-desktop.jpg",
        rating: 0,
      },
    })
  );

  //Add 6 orders to the database
  const orderPromises = [];
  for (let i = 1; i < 7; i++) {
    orderPromises.push(
      prisma.orders.create({
        data: {
          id: `${i}`,
          userId: `${Math.floor(Math.random() * 3) + 1}`,
          name: "John Doe",
          email: "dummy@gmail.com",
          productIds: ["1", "2", "3"],
          productIdsQuantity: [1, 2, 3],
          productIdsPrice: [100, 200, 300],
          totalPrice: Math.floor(Math.random() * 900) + 1,
        },
      })
    );
  }

  // Add 3 feedbacks to the database
  const feedbackPromises = [];
  for (let i = 1; i < 4; i++) {
    feedbackPromises.push(
      prisma.feedbacks.create({
        data: {
          id: `${i}`,
          userId: `${Math.floor(Math.random() * 3) + 1}`,
          title: "Great product",
          productId: `${i}`,
          comment: "I love this product",
          updatedAt: new Date(),
        },
      })
    );

    // Wait for all user and product promises to resolve
    const response = await Promise.all([
      ...userPromises,
      ...productPromises,
      ...orderPromises,
      ...feedbackPromises,
    ]);
    console.log(response);
  }
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
