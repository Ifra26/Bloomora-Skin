// The brand's signature visual: every product's ingredient list rendered like a
// formulation ticket from a lab notebook — batch number, pH, and a percentage bar
// per ingredient, instead of a plain bullet list.
export default function FormulationTicket({ product, compact = false }) {
  if (!product) return null;
  const { batch, ph, volume, ingredients = [] } = product;

  return (
    <div className={`ticket ${compact ? 'ticket-compact' : ''}`}>
      <div className="ticket-head">
        <span className="ticket-label">Batch</span>
        <span className="ticket-value mono">{batch || '—'}</span>
        {ph !== null && ph !== undefined && (
          <>
            <span className="ticket-label">pH</span>
            <span className="ticket-value mono">{ph}</span>
          </>
        )}
        <span className="ticket-label">Vol.</span>
        <span className="ticket-value mono">{volume}</span>
      </div>
      <ul className="ticket-list">
        {ingredients.map((ing) => (
          <li key={ing.name}>
            <div className="ticket-row">
              <span className="ticket-ing">{ing.name}</span>
              <span className="ticket-pct mono">{ing.pct}%</span>
            </div>
            <div className="ticket-bar">
              <span style={{ width: `${Math.min(100, ing.pct)}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
