import { useTransactions } from '../hooks/TransactionsContext'; // Importe o hook

export function Summary() {
  // Pegamos a lista direto do contexto
  const { transactions } = useTransactions();

  // O Frontend faz a matemática (igual fizemos no backend antes)
  const summary = transactions.reduce((acc, transaction) => {
    if (transaction.type === 'credit') {
      acc.credit += transaction.amount;
      acc.total += transaction.amount;
    } else {
      acc.debit += transaction.amount;
      acc.total -= transaction.amount;
    }
    return acc;
  }, {
    credit: 0,
    debit: 0,
    total: 0
  });

  return (
    <div className="container summary-container">
      <div className="summary-card">
        <header>
          <span>Entradas</span>
        </header>
        <strong style={{ display: 'block', marginTop: '1rem', fontSize: '2rem' }}>
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(summary.credit)}
        </strong>
      </div>

      <div className="summary-card">
        <header>
          <span>Saídas</span>
        </header>
        <strong style={{ display: 'block', marginTop: '1rem', fontSize: '2rem', color: 'var(--red)' }}>
          - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(summary.debit)}
        </strong>
      </div>
      
      <div className="summary-card" style={{ background: 'var(--green)', color: '#FFF' }}>
        <header>
          <span>Total</span>
        </header>
        <strong style={{ display: 'block', marginTop: '1rem', fontSize: '2rem' }}>
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(summary.total)}
        </strong>
      </div>
    </div>
  )
}