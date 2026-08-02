const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    console.log("Mencoba koneksi ke database...");
    const users = await prisma.user.findMany();
    console.log("Koneksi sukses! Jumlah user:", users.length);
    console.log(users);
  } catch (err) {
    console.error("Koneksi GAGAL!");
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
