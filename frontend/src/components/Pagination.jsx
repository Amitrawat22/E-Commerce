import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ pagination, onPageChange }) {
  const { pageNumber, totalPages } = pagination;

  if (totalPages <= 1) return null;

  const pages = [];
  const start = Math.max(0, pageNumber - 2);
  const end = Math.min(totalPages - 1, pageNumber + 2);

  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="pagination">
      <button
        className="pagination-btn"
        onClick={() => onPageChange(pageNumber - 1)}
        disabled={pageNumber === 0}
      >
        <ChevronLeft size={16} />
      </button>

      {start > 0 && (
        <>
          <button className="pagination-btn" onClick={() => onPageChange(0)}>1</button>
          {start > 1 && <span style={{ color: 'var(--color-text-muted)', padding: '0 4px' }}>…</span>}
        </>
      )}

      {pages.map(p => (
        <button
          key={p}
          className={`pagination-btn ${p === pageNumber ? 'active' : ''}`}
          onClick={() => onPageChange(p)}
        >
          {p + 1}
        </button>
      ))}

      {end < totalPages - 1 && (
        <>
          {end < totalPages - 2 && <span style={{ color: 'var(--color-text-muted)', padding: '0 4px' }}>…</span>}
          <button className="pagination-btn" onClick={() => onPageChange(totalPages - 1)}>{totalPages}</button>
        </>
      )}

      <button
        className="pagination-btn"
        onClick={() => onPageChange(pageNumber + 1)}
        disabled={pageNumber === totalPages - 1}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
