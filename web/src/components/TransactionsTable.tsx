import { useTransactions } from "../hooks/TransactionsContext"; 

interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: string;
  category: string;
  date: string;
}

interface TransactionsTableProps {
  onEditTransaction: (transaction: Transaction) => void;
}

export function TransactionsTable({ onEditTransaction }: TransactionsTableProps) {
  const { transactions, deleteTransaction } = useTransactions();

  return (
    <div className="container table-container">
      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Valor</th>
            <th>Categoria</th>
            <th>Data</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {transactions.map(transaction => {
            return (
              <tr key={transaction.id}>
                <td width="40%">{transaction.title}</td>

                <td style={{ color: transaction.type === 'debit' ? 'var(--red)' : 'var(--green)' }}>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(transaction.amount)}
                </td>

                <td>{transaction.category}</td>

                <td>
                  {new Intl.DateTimeFormat('pt-BR').format(new Date(transaction.date))}
                </td>

                <td>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => onEditTransaction(transaction)}
                      style={{ background: 'transparent', border: 0, fontSize: '1.2rem' }}
                    >
                      ✏️
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteTransaction(transaction.id)}
                      style={{ background: 'transparent', border: 0, fontSize: '1.2rem' }}
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}