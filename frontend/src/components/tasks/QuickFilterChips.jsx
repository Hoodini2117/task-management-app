const chips = [
  { key: 'all', label: 'All' },
  { key: 'today', label: '📅 Due Today' },
  { key: 'overdue', label: '⚠ Overdue' },
  { key: 'high', label: '🔴 High Priority' },
  { key: 'completed-today', label: '✓ Completed Today' },
];

function QuickFilterChips({ activeChip, onChipChange }) {
  return (
    <div className="quick-chips">
      {chips.map((chip) => (
        <button
          key={chip.key}
          className={`chip ${activeChip === chip.key ? 'chip-active' : ''}`}
          onClick={() => onChipChange(chip.key)}
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
}

export default QuickFilterChips;
