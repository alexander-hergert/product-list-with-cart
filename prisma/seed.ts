import prisma from "../lib/prisma";

async function main() {
  const userPromises = [
    // Add 3 users to the database
    prisma.users.upsert({
      where: { email: "rauchg@vercel.com" },
      update: {},
      create: {
        id: "1",
        name: "Guillermo Rauch",
        email: "rauchg@vercel.com",
        image:
          "https://images.ctfassets.net/e5382hct74si/2P1iOve0LZJRZWUzfXpi9r/9d4d27765764fb1ad7379d7cbe5f1043/ucxb4lHy_400x400.jpg",
      },
    }),
    prisma.users.upsert({
      where: { email: "lee@vercel.com" },
      update: {},
      create: {
        id: "2",
        name: "Lee Robinson",
        email: "lee@vercel.com",
        image:
          "https://images.ctfassets.net/e5382hct74si/4BtM41PDNrx4z1ml643tdc/7aa88bdde8b5b7809174ea5b764c80fa/adWRdqQ6_400x400.jpg",
      },
    }),
    prisma.users.upsert({
      where: { email: "stey@vercel.com" },
      update: {},
      create: {
        id: "3",
        name: "Steven Tey",
        email: "stey@vercel.com",
        image:
          "https://images.ctfassets.net/e5382hct74si/4QEuVLNyZUg5X6X4cW4pVH/eb7cd219e21b29ae976277871cd5ca4b/profile.jpg",
      },
    }),
  ];

  // Add 3 products to the database
  const productPromises = [];
  for (let i = 1; i < 4; i++) {
    productPromises.push(
      prisma.products.create({
        data: {
          id: `${i}`,
          name: `Vercel ${i}`,
          price: i * 100,
          description: "Develop. Preview. Ship.",
          image:
            "https://images.ctfassets.net/e5382hct74si/2P1iOve0LZJRZWUzfXpi9r/9d4d27765764fb1ad7379d7cbe5f1043/ucxb4lHy_400x400.jpg",
          rating: 5,
        },
      })
    );
  }
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
