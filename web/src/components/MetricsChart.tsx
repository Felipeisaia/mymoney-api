import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTransactions } from '../hooks/TransactionsContext';

export function MetricsChart() {
  const { transactions } = useTransactions();

  const summary = transactions.reduce((acc, transaction) => {
    if (transaction.type === 'credit') {
      acc.credit += transaction.amount;
    } else {
      acc.debit += transaction.amount;
    }
    return acc;
  }, {
    credit: 0,
    debit: 0,
  });

  const data = [
    { name: 'Entradas', value: summary.credit },
    { name: 'Saídas', value: summary.debit },
  ];

  const COLORS = ['#33CC95', '#E52E4D'];

  if (summary.credit === 0 && summary.debit === 0) {
    return null;
  }

  return (
    <div className="container" style={{ marginTop: '2rem', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={120}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip
            formatter={(value: number | undefined) => {
              if (typeof value !== 'number') return ''
              return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
            }}
          />

          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}