import {
  creditsBalanceSchema,
  creditsTransactionSchema,
} from "@/lib/schemas/billing";
import {
  createMockBalance,
  createMockTransaction,
} from "@/server/mock-db/factories";

const balanceStore = new Map([
  [
    "0ed7596f-f5e7-470e-9d3a-d9e1085ed267",
    creditsBalanceSchema.parse({
      userId: "0ed7596f-f5e7-470e-9d3a-d9e1085ed267",
      availableCredits: 88,
      reservedCredits: 0,
      lifetimeUsedCredits: 22,
    }),
  ],
]);

const transactionStore = [
  creditsTransactionSchema.parse({
    id: "942c2549-52c0-48ba-88e6-f975e1a3392c",
    userId: "0ed7596f-f5e7-470e-9d3a-d9e1085ed267",
    generationId: "b7f0f707-d3ff-448b-b3e2-e43011d1fb95",
    amount: -11,
    type: "usage",
    reason: "Q2 Skincare Launch Reel completed",
    createdAt: "2026-03-11T05:00:42.000Z",
  }),
];

export class CreditsRepository {
  async getBalanceByUserId(userId: string) {
    const existing = balanceStore.get(userId);

    if (existing) {
      return existing;
    }

    const balance = createMockBalance(userId);
    balanceStore.set(userId, balance);
    transactionStore.unshift(createMockTransaction(userId));
    return balance;
  }

  async listTransactionsByUserId(userId: string) {
    return transactionStore.filter((transaction) => transaction.userId === userId);
  }

  async consumeCredits(input: {
    userId: string;
    amount: number;
    generationId: string | null;
    reason: string;
  }) {
    const balance = await this.getBalanceByUserId(input.userId);

    if (!balance) {
      return null;
    }

    balance.availableCredits = Math.max(
      balance.availableCredits - input.amount,
      0,
    );
    balance.lifetimeUsedCredits += input.amount;

    const transaction = creditsTransactionSchema.parse({
      id: crypto.randomUUID(),
      userId: input.userId,
      generationId: input.generationId,
      amount: -input.amount,
      type: "usage",
      reason: input.reason,
      createdAt: new Date().toISOString(),
    });

    transactionStore.unshift(transaction);
    return transaction;
  }

  async refundCredits(input: {
    userId: string;
    amount: number;
    generationId: string | null;
    reason: string;
  }) {
    const balance = await this.getBalanceByUserId(input.userId);

    if (!balance) {
      return null;
    }

    balance.availableCredits += input.amount;

    const transaction = creditsTransactionSchema.parse({
      id: crypto.randomUUID(),
      userId: input.userId,
      generationId: input.generationId,
      amount: input.amount,
      type: "refund",
      reason: input.reason,
      createdAt: new Date().toISOString(),
    });

    transactionStore.unshift(transaction);
    return transaction;
  }

  async ensurePlanAllowance(input: {
    userId: string;
    targetCredits: number;
    reason: string;
  }) {
    const balance = await this.getBalanceByUserId(input.userId);

    if (!balance) {
      return null;
    }

    const topUpAmount = Math.max(input.targetCredits - balance.availableCredits, 0);

    if (topUpAmount === 0) {
      return null;
    }

    balance.availableCredits += topUpAmount;

    const transaction = creditsTransactionSchema.parse({
      id: crypto.randomUUID(),
      userId: input.userId,
      generationId: null,
      amount: topUpAmount,
      type: "grant",
      reason: input.reason,
      createdAt: new Date().toISOString(),
    });

    transactionStore.unshift(transaction);
    return transaction;
  }
}

export const creditsRepository = new CreditsRepository();
