const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
require('dotenv').config();

const prisma = new PrismaClient({
  log: ['info', 'warn', 'error'],
});

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Test connection first
    await prisma.$connect();
    console.log('✅ Database connected');

    // Check if we can access tables (this will fail if tables don't exist)
    try {
      const userCount = await prisma.user.count();
      console.log(`📊 Current users: ${userCount}`);
    } catch (tableError) {
      console.log('⚠️ Tables might not exist yet. Error:', tableError.message);
      console.log('💡 You need to create the tables in your Supabase dashboard first!');
      console.log('🔗 Go to: https://supabase.com/dashboard');
      console.log('📝 Find your project and run the SQL schema in SQL Editor');
      return;
    }

    // Clear old data
    console.log('🧹 Clearing existing data...');
    await prisma.orderItemTopping.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.pizzaPrice.deleteMany();
    await prisma.topping.deleteMany();
    await prisma.size.deleteMany();
    await prisma.pizza.deleteMany();
    await prisma.user.deleteMany();
    console.log('✅ Cleared existing data');

    // Create test user
    console.log('👤 Creating test user...');
    const passwordHash = await bcrypt.hash("password123", 10);
    const user = await prisma.user.create({
      data: {
        email: "test@example.com",
        password: passwordHash,
        name: "Test User",
        role: "USER",
      },
    });
    console.log(`✅ Created user: ${user.email}`);

    // Create sizes
    console.log('📏 Creating sizes...');
    const small = await prisma.size.create({ data: { name: "Small" } });
    const medium = await prisma.size.create({ data: { name: "Medium" } });
    const large = await prisma.size.create({ data: { name: "Large" } });
    console.log('✅ Created sizes');

    // Create pizzas
    console.log('🍕 Creating pizzas...');
    const margherita = await prisma.pizza.create({
      data: { name: "Margherita", description: "Classic cheese & tomato" },
    });

    const pepperoni = await prisma.pizza.create({
      data: { name: "Pepperoni", description: "Cheesy pepperoni pizza" },
    });
    console.log('✅ Created pizzas');

    // Add prices for pizzas
    console.log('💰 Adding pizza prices...');
    await prisma.pizzaPrice.createMany({
      data: [
        { pizzaId: margherita.id, sizeId: small.id, price: 6 },
        { pizzaId: margherita.id, sizeId: medium.id, price: 8 },
        { pizzaId: margherita.id, sizeId: large.id, price: 10 },
        { pizzaId: pepperoni.id, sizeId: small.id, price: 7 },
        { pizzaId: pepperoni.id, sizeId: medium.id, price: 9 },
        { pizzaId: pepperoni.id, sizeId: large.id, price: 12 },
      ],
    });
    console.log('✅ Added pizza prices');

    // Create toppings
    console.log('🧄 Creating toppings...');
    await prisma.topping.createMany({
      data: [
        { name: "Extra Cheese", isExtraCharge: true },
        { name: "Olives", isExtraCharge: false },
        { name: "Mushrooms", isExtraCharge: false },
      ],
    });
    console.log('✅ Created toppings');

    console.log('🎉 Seed data inserted successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    console.error('Error message:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
  }
}

main()
  .catch((e) => {
    console.error('💥 Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });