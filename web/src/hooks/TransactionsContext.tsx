import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'; 
import { toast } from 'react-toastify';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: string;
  category: string;
  date: string;
}

type TransactionInput = Omit<Transaction, 'id' | 'date'>;

type TransactionUpdateInput = TransactionInput & { id: string };

interface TransactionsContextData {
  transactions: Transaction[];
  createTransaction: (transaction: TransactionInput) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  updateTransaction: (transaction: TransactionUpdateInput) => Promise<void>;
}

interface TransactionsProviderProps {
  children: ReactNode;
}

const TransactionsContext = createContext<TransactionsContextData>(
  {} as TransactionsContextData
);

export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetch('https://mymoney-api-zeu0.onrender.com/transactions')
      .then(response => response.json())
      .then(data => setTransactions(data));
  }, []);

  async function createTransaction(transactionInput: TransactionInput) {
    try {
      const response = await fetch('https://mymoney-api-zeu0.onrender.com/transactions', {
        method: 'POST',
        body: JSON.stringify(transactionInput),
        headers: { 'Content-Type': 'application/json' },
      });
      
      const newTransaction = await response.json();
      setTransactions(state => [newTransaction, ...state]);
      toast.success('Transação cadastrada com sucesso!'); 
    } catch (error) {
      toast.error('Erro ao cadastrar transação');
    }
  }

  async function updateTransaction(transactionUpdate: TransactionUpdateInput) {
    try {
      const response = await fetch(`https://mymoney-api-zeu0.onrender.com/transactions/${transactionUpdate.id}`, {
        method: 'PUT',
        body: JSON.stringify(transactionUpdate),
        headers: { 'Content-Type': 'application/json' },
      });

      // trava de segurança
      if (!response.ok) {
        throw new Error('Erro na atualização'); 
      }


      const updatedTransaction = await response.json();

      const newTransactions = transactions.map(transaction => 
        transaction.id === updatedTransaction.id ? updatedTransaction : transaction
      );

      setTransactions(newTransactions);
      toast.success('Transação atualizada!');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao atualizar: Verifique o console ou reinicie o servidor');
    }
  }

  async function deleteTransaction(id: string) {
    try {
        const response = await fetch(`https://mymoney-api-zeu0.onrender.com/transactions/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            toast.error('Erro ao deletar transação');
            return;
        }

        const newTransactions = transactions.filter(transaction => transaction.id !== id);
        setTransactions(newTransactions);
        toast.success('Transação removida!');
    } catch (error) {
        toast.error('Erro de conexão com o servidor');
    }
  }

  return (
    <TransactionsContext.Provider value={{ transactions, createTransaction, deleteTransaction, updateTransaction }}>
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  return useContext(TransactionsContext);
}