import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Header } from './components/Header';
import { Summary } from './components/Summary';
import { TransactionsTable } from './components/TransactionsTable';
import { NewTransactionModal } from './components/NewTransactionModal';
import { TransactionsProvider } from './hooks/TransactionsContext';
import { MetricsChart } from './components/MetricsChart';

interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: string;
  category: string;
  date: string;
}

export default function App() {
  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState(false);
  
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);

  function handleOpenNewTransactionModal() {
    setTransactionToEdit(null);
    setIsNewTransactionModalOpen(true);
  }

  function handleOpenEditTransactionModal(transaction: Transaction) {
    setTransactionToEdit(transaction);
    setIsNewTransactionModalOpen(true);
  }

  function handleCloseNewTransactionModal() {
    setIsNewTransactionModalOpen(false);
    setTransactionToEdit(null);
  }

  return (
    <TransactionsProvider>
      <Header onOpenNewTransactionModal={handleOpenNewTransactionModal} />
      <Summary />
      <MetricsChart />
      <TransactionsTable onEditTransaction={handleOpenEditTransactionModal} />
      
      <NewTransactionModal 
        isOpen={isNewTransactionModalOpen}
        onRequestClose={handleCloseNewTransactionModal}
        editingTransaction={transactionToEdit}
      />

      <ToastContainer autoClose={3000} />
    </TransactionsProvider>
  )
}