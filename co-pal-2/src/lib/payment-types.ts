export interface PaymentPackage {
  amount: number;
  price: number;
  bonus: number;
}

export const connectPackages: PaymentPackage[] = [
  { amount: 25, price: 2, bonus: 0 },
  { amount: 50, price: 4, bonus: 5 },
  { amount: 100, price: 7, bonus: 20 },
  { amount: 200, price: 10, bonus: 50 },
];
