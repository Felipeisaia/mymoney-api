import { FormEvent, useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useTransactions } from '../hooks/TransactionsContext';
import { toast } from 'react-toastify';

interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: string;
  category: string;
  date: string;
}

interface NewTransactionModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  editingTransaction: Transaction | null;
}

Modal.setAppElement('#root');

export function NewTransactionModal({ isOpen, onRequestClose, editingTransaction }: NewTransactionModalProps) {
  const { createTransaction, updateTransaction } = useTransactions();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState('');
  const [type, setType] = useState('credit');

  useEffect(() => {
    if (editingTransaction) {
      setTitle(editingTransaction.title);
      setAmount(editingTransaction.amount);
      setCategory(editingTransaction.category);
      setType(editingTransaction.type);
    } else {
      setTitle('');
      setAmount(0);
      setCategory('');
      setType('credit');
    }
  }, [editingTransaction, isOpen]);

  async function handleCreateOrUpdateTransaction(event: FormEvent) {
    event.preventDefault();

    if (title.trim() === '' || amount <= 0 || category.trim() === '') {
      toast.warning('Por favor, preencha todos os campos!');
      return;
    }

    if (editingTransaction) {
      await updateTransaction({
        id: editingTransaction.id,
        title,
        amount,
        category,
        type,
      });
    } else {
      await createTransaction({
        title,
        amount,
        category,
        type,
      });
    }

    setTitle('');
    setAmount(0);
    setCategory('');
    setType('credit');
    onRequestClose();
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={onRequestClose}
      overlayClassName="react-modal-overlay"
      className="react-modal-content"
    >
      <button 
        type="button" 
        onClick={onRequestClose} 
        className="react-modal-close"
      >
        <span style={{ fontSize: '1.5rem', color: '#A8A8B3' }}>✕</span>
      </button>

      <form onSubmit={handleCreateOrUpdateTransaction}>
        <h2>{editingTransaction ? 'Editar Transação' : 'Cadastrar Transação'}</h2>
        
        <input 
          placeholder="Título" 
          value={title}
          onChange={event => setTitle(event.target.value)}
        />

        <input 
          type="number" 
          placeholder="Valor"
          value={amount === 0 ? '' : amount}
          onChange={event => setAmount(Number(event.target.value))}
        />

        <div className="transaction-type-container">
          <button
            type="button"
            onClick={() => setType('credit')}
            className={`radio-box ${type === 'credit' ? 'deposit-active' : ''}`}
          >
            <img src="https://img.icons8.com/ios-filled/50/33cc95/up--v1.png" alt="Entrada" />
            <span>Entrada</span>
          </button>

          <button
            type="button"
            onClick={() => setType('debit')}
            className={`radio-box ${type === 'debit' ? 'withdraw-active' : ''}`}
          >
            <img src="https://img.icons8.com/ios-filled/50/e52e4d/down--v1.png" alt="Saída" />
            <span>Saída</span>
          </button>
        </div>

        <input 
          placeholder="Categoria" 
          value={category}
          onChange={event => setCategory(event.target.value)}
        />
        
        <button type="submit">
          {editingTransaction ? 'Salvar Alterações' : 'Cadastrar'}
        </button>
      </form>
    </Modal>
  );
}