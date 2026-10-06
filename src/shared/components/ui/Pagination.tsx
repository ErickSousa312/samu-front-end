export const Pagination = ({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) => (
  <nav className="pagination" aria-label="Paginação">
    <button
      className="button button-secondary"
      disabled={page <= 1}
      onClick={() => onChange(page - 1)}
    >
      Anterior
    </button>
    <span className="muted" aria-live="polite">
      Página {page} de {Math.max(1, totalPages)}
    </span>
    <button
      className="button button-secondary"
      disabled={page >= totalPages}
      onClick={() => onChange(page + 1)}
    >
      Próxima
    </button>
  </nav>
);
