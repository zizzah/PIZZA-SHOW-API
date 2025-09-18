import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...')
  
  // Clear old data (optional in dev) - only if tables exist
  try {
    await prisma.orderItemTopping.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.pizzaPrice.deleteMany();
    await prisma.topping.deleteMany();
    await prisma.size.deleteMany();
    await prisma.pizza.deleteMany();
    await prisma.user.deleteMany();
  } catch (error) {
    console.log('ℹ️  Tables not found, will create new data');
  }

  // Create test users
  const passwordHash = await bcrypt.hash("password123", 10);
  const adminPasswordHash = await bcrypt.hash("admin123", 10);
  
  const user = await prisma.user.create({
    data: {
      email: "test@example.com",
      password: passwordHash,
      name: "Test User",
      role: "USER",
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: "admin@pizzashop.com",
      password: adminPasswordHash,
      name: "Admin User",
      role: "ADMIN",
    },
  });

  // Create sizes
  const small = await prisma.size.create({ data: { name: "Small" } });
  const medium = await prisma.size.create({ data: { name: "Medium" } });
  const large = await prisma.size.create({ data: { name: "Large" } });

  // Create pizzas
  const margherita = await prisma.pizza.create({
    data: { name: "Margherita", description: "Classic tomato sauce, mozzarella, and fresh basil" },
  });

  const pepperoni = await prisma.pizza.create({
    data: { name: "Pepperoni", description: "Classic pepperoni with mozzarella cheese" },
  });

  const veggieSupreme = await prisma.pizza.create({
    data: { name: "Veggie Supreme", description: "Mushrooms, onions, bell peppers, and black olives" },
  });

  const meatLovers = await prisma.pizza.create({
    data: { name: "Meat Lovers", description: "Pepperoni, sausage, bacon, and ham" },
  });

  const hawaiian = await prisma.pizza.create({
    data: { name: "Hawaiian", description: "Ham and pineapple with mozzarella cheese" },
  });

  // Add prices for pizzas
  await prisma.pizzaPrice.createMany({
    data: [
      // Margherita prices
      { pizzaId: margherita.id, sizeId: small.id, price: 12.99 },
      { pizzaId: margherita.id, sizeId: medium.id, price: 15.99 },
      { pizzaId: margherita.id, sizeId: large.id, price: 18.99 },
      // Pepperoni prices
      { pizzaId: pepperoni.id, sizeId: small.id, price: 14.99 },
      { pizzaId: pepperoni.id, sizeId: medium.id, price: 17.99 },
      { pizzaId: pepperoni.id, sizeId: large.id, price: 20.99 },
      // Veggie Supreme prices
      { pizzaId: veggieSupreme.id, sizeId: small.id, price: 13.99 },
      { pizzaId: veggieSupreme.id, sizeId: medium.id, price: 16.99 },
      { pizzaId: veggieSupreme.id, sizeId: large.id, price: 19.99 },
      // Meat Lovers prices
      { pizzaId: meatLovers.id, sizeId: small.id, price: 16.99 },
      { pizzaId: meatLovers.id, sizeId: medium.id, price: 19.99 },
      { pizzaId: meatLovers.id, sizeId: large.id, price: 22.99 },
      // Hawaiian prices
      { pizzaId: hawaiian.id, sizeId: small.id, price: 15.99 },
      { pizzaId: hawaiian.id, sizeId: medium.id, price: 18.99 },
      { pizzaId: hawaiian.id, sizeId: large.id, price: 21.99 },
    ],
  });

  // Create toppings
  await prisma.topping.createMany({
    data: [
      { name: "Extra Cheese", isExtraCharge: true },
      { name: "Pepperoni", isExtraCharge: false },
      { name: "Mushrooms", isExtraCharge: false },
      { name: "Onions", isExtraCharge: false },
      { name: "Sausage", isExtraCharge: true },
      { name: "Bacon", isExtraCharge: true },
      { name: "Olives", isExtraCharge: false },
      { name: "Bell Peppers", isExtraCharge: false },
      { name: "Pineapple", isExtraCharge: false },
      { name: "Ham", isExtraCharge: false },
    ],
  });

  console.log("✅ Seed data inserted successfully!");
  console.log("👤 Test User: test@example.com / password123");
  console.log("👑 Admin User: admin@pizzashop.com / admin123");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
