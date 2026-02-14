interface HeaderProps {
  onOpenNewTransactionModal: () => void;
}

export function Header({ onOpenNewTransactionModal }: HeaderProps) {
  return (
    <header className="global-header">
      <div className="header-content">
        <h2>MyMoney</h2>

        <button type="button" onClick={onOpenNewTransactionModal}>
          Nova transação
        </button>
      </div>
    </header>
  )
}