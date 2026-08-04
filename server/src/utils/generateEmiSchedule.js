export const generateEmiSchedule = ({
  principal,
  annualInterestRate,
  tenureMonths,
  disbursedAt = new Date(),
}) => {
  const monthlyRate = annualInterestRate / 12 / 100;

  let emi = 0;

  if (monthlyRate === 0) {
    emi = principal / tenureMonths;
  } else {
    emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
      (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  }

  emi = Number(emi.toFixed(2));

  let balance = principal;

  const schedule = [];

  for (let installment = 1; installment <= tenureMonths; installment++) {
    const openingPrincipal = Number(balance.toFixed(2));

    const interestAmount = Number((balance * monthlyRate).toFixed(2));

    let principalAmount = Number((emi - interestAmount).toFixed(2));

    let closingPrincipal = Number((balance - principalAmount).toFixed(2));

    // Last EMI Adjustment
    if (installment === tenureMonths) {
      principalAmount = Number(balance.toFixed(2));

      closingPrincipal = 0;
    }

    const dueDate = new Date(disbursedAt);

    dueDate.setMonth(dueDate.getMonth() + installment);

    schedule.push({
      installmentNumber: installment,

      dueDate,

      openingPrincipal,

      principalAmount,

      interestAmount,

      emiAmount: emi,

      closingPrincipal,

      paidAmount: 0,

      status: "PENDING",
    });

    balance = closingPrincipal;
  }

  return schedule;
};
