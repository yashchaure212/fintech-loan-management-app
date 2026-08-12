import prisma from "./src/config/prisma.js";

const loanTypes = await prisma.loanType.findMany({
  where: {
    code: "EDUCATION_LOAN",
  },
});

console.log(loanTypes);

await prisma.$disconnect();