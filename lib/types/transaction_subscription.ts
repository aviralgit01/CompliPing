export interface SubscriptionPlan {
  price: string;
  name: string;
  amount: number;
}

export interface Subscription {
  subscriberUsers: unknown;
  plan: SubscriptionPlan;
}

export interface Card {
  id: string;
  emi: boolean;
  name: string;
  type: 'credit' | 'debit';
  color: string;
  last4: string;
  entity: string;
  issuer: string;
  number: string;
  network: string;
  sub_type: string;
  expiry_year: string;
  expiry_month: string;
  international: boolean;
}

export interface Transaction {
  subscription: Subscription;
  subscriberUsers: unknown;
  transaction_id: string;
  amount: string;
  price_per_user: string;
  card_email: string;
  card_phone_number: string;
  customer_id: string;
  description: string;
  error_description: string | null;
  currency: string;
  payment_date: string;
  user_count: number;
  status: 'success' | 'failed';
  card: Card;
}
