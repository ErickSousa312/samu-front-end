import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import api from "@/shared/services/api";
import { Pagination } from "../ui/Pagination";

interface User {
  _id: number;
  userName: string;
  role: "admin" | "user";
}

const roleLabels: Record<User["role"], string> = {
  admin: "Administrador",
  user: "Usuário",
};

const Table = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [roleFilter, setRoleFilter] = useState<User["role"] | "all">("all");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    api
      .get<User[]>("/users", { signal: controller.signal })
      .then((response) => {
        if (!Array.isArray(response.data)) throw new Error("Invalid response");
        if (!controller.signal.aborted) setUsers(response.data);
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setError("Não foi possível carregar os usuários.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [retry]);

  const filtered = users.filter(
    (item) =>
      (roleFilter === "all" || item.role === roleFilter) &&
      item.userName.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / 5));
  const currentPage = Math.min(page, totalPages);
  const rows = filtered.slice((currentPage - 1) * 5, currentPage * 5);

  return (
    <section className="panel">
      <div className="toolbar">
        <div className="field">
          <label htmlFor="user-search">Buscar por usuário</label>
          <input
            id="user-search"
            type="search"
            className="input"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Digite o nome do usuário"
          />
        </div>
      </div>
      <div className="filter-row">
        <div className="field">
          <label htmlFor="role-filter">Perfil de acesso</label>
          <select
            id="role-filter"
            className="input"
            value={roleFilter}
            onChange={(event) => {
              setRoleFilter(event.target.value as User["role"] | "all");
              setPage(1);
            }}
          >
            <option value="all">Todos os perfis</option>
            {Object.entries(roleLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p role="status" className="notice">
          Carregando usuários...
        </p>
      ) : error ? (
        <div role="alert" className="notice notice-error">
          {error}{" "}
          <button
            className="button button-secondary"
            onClick={() => setRetry((value) => value + 1)}
          >
            Tentar novamente
          </button>
        </div>
      ) : rows.length ? (
        <>
          <div className="table-summary">
            <span>Mostrando</span>
            <strong>{filtered.length}</strong>
            <span>registros</span>
            {search && <span className="table-pill">Busca ativa</span>}
          </div>
          <div className="table-scroll">
            <table className="data-table">
              <caption className="sr-only">Usuários cadastrados</caption>
              <thead>
                <tr>
                  <th scope="col">Usuário</th>
                  <th scope="col">Perfil</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((item) => (
                  <tr key={item._id}>
                    <td>{item.userName}</td>
                    <td>
                      <span className="role-badge">{roleLabels[item.role]}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onChange={setPage}
          />
        </>
      ) : (
        <div className="empty-state">
          <Users size={32} aria-hidden="true" />
          <h2>Nenhum usuário encontrado</h2>
          <p className="muted">
            {search
              ? "Tente buscar por outro nome."
              : "Os usuários cadastrados aparecerão aqui."}
          </p>
        </div>
      )}
    </section>
  );
};

export default Table;
