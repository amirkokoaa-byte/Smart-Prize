
export type Theme = 'modern-blue' | 'deep-dark' | 'nature-green' | 'royal-purple';

export interface User {
  id: string;
  username: string;
  password: string;
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
  date: string;
  monthId: string;
}

export interface Obligation {
  id: string;
  type: string;
  value: number;
  installmentsCount: number;
  paidAmount: number;
  duration: string;
  date: string;
  isCompleted: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
}

export interface FinancialData {
  salary: number;
  expenses: Expense[];
  obligations: Obligation[];
  history: {
    monthName: string;
    salary: number;
    totalExpenses: number;
    expenses: Expense[];
  }[];
}

export interface AppState {
  currentUser: User | null;
  users: User[];
  financialData: Record<string, FinancialData>; // userId -> data
  messages: ChatMessage[];
  theme: Theme;
}
