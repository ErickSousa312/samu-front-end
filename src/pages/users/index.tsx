import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  CheckCircle2, Edit3, KeyRound, LoaderCircle, Plus, RefreshCw,
  Search, ShieldCheck, UserCog, UserRound, Users,
} from "lucide-react";
import api from "@/shared/services/api";
import { Dialog } from "@/shared/components/ui/Dialog";
import { Pagination } from "@/shared/components/ui/Pagination";
import { useAuth } from "@/shared/context/AuthContext/AuthProvider";
import { useToast } from "@/shared/context/ToastContext";

interface ManagedUser {
  _id: number;
  userName: string;
  role: "admin" | "user";
}

interface UserForm {
  userName: string;
  role: ManagedUser["role"];
  password: string;
  confirmPassword: string;
}

const PAGE_SIZE = 8;
const emptyForm: UserForm = { userName: "", role: "user", password: "", confirmPassword: "" };
const roleLabels: Record<ManagedUser["role"], string> = {
  admin: "Administrador",
  user: "Usuário interno",
};
const roleDescriptions: Record<ManagedUser["role"], string> = {
  admin: "Acesso completo à gestão do sistema",
  user: "Acesso aos painéis e consultas operacionais",
};

const getInitials = (name: string) =>
  name.split(/[\s.@_-]+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

const UsersPage = () => {
  const { user: signedUser } = useAuth();
  const { addToast } = useToast();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<ManagedUser["role"] | "all">("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<UserForm>(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    api.get<ManagedUser[]>("/users", { signal: controller.signal })
      .then(({ data }) => {
        if (!Array.isArray(data)) throw new Error("Resposta inválida");
        if (!controller.signal.aborted) {
          setUsers([...data].sort((a, b) => a.userName.localeCompare(b.userName, "pt-BR")));
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setError("Não foi possível carregar os usuários.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [retry]);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("pt-BR");
    return users.filter((item) =>
      (roleFilter === "all" || item.role === roleFilter) &&
      (!term || item.userName.toLocaleLowerCase("pt-BR").includes(term) || String(item._id).includes(term)),
    );
  }, [roleFilter, search, users]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleUsers = filteredUsers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const adminCount = users.filter((item) => item.role === "admin").length;
  const userCount = users.length - adminCount;
  const modalOpen = creating || Boolean(editingUser);

  const openCreate = () => {
    setEditingUser(null);
    setForm(emptyForm);
    setFormError("");
    setCreating(true);
  };

  const openEdit = (item: ManagedUser) => {
    setCreating(false);
    setEditingUser(item);
    setForm({ userName: item.userName, role: item.role, password: "", confirmPassword: "" });
    setFormError("");
  };

  const closeModal = () => {
    if (saving) return;
    setCreating(false);
    setEditingUser(null);
    setForm(emptyForm);
    setFormError("");
  };

  const submitUser = async (event: FormEvent) => {
    event.preventDefault();
    const userName = form.userName.trim();
    const isEditing = Boolean(editingUser);
    if (userName.length < 5) return setFormError("O nome do usuário deve ter pelo menos 5 caracteres.");
    if (!isEditing && form.password.length < 6) return setFormError("A senha deve ter pelo menos 6 caracteres.");
    if (form.password && form.password.length < 6) return setFormError("A nova senha deve ter pelo menos 6 caracteres.");
    if (form.password !== form.confirmPassword) return setFormError("As senhas informadas não coincidem.");

    setSaving(true);
    setFormError("");
    try {
      const payload = { userName, role: form.role, ...(form.password ? { password: form.password } : {}) };
      const response = isEditing
        ? await api.patch<ManagedUser>(`/users/${editingUser?._id}`, payload)
        : await api.post<ManagedUser>("/users/create", payload);
      setUsers((current) => {
        const next = isEditing
          ? current.map((item) => item._id === response.data._id ? response.data : item)
          : [...current, response.data];
        return next.sort((a, b) => a.userName.localeCompare(b.userName, "pt-BR"));
      });
      addToast({ type: "success", message: isEditing ? "Usuário atualizado com sucesso." : "Usuário criado com sucesso." });
      setCreating(false);
      setEditingUser(null);
      setForm(emptyForm);
    } catch {
      setFormError("Não foi possível salvar. Verifique se o nome já está em uso.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="stack users-page">
      <section className="users-hero">
        <div className="users-hero-copy">
          <span className="users-hero-icon"><UserCog size={24} /></span>
          <div><p className="eyebrow">Administração de acessos</p><h2>Equipe e permissões</h2><p className="muted">Organize quem pode acessar a central e defina o nível de permissão de cada conta.</p></div>
        </div>
        <button type="button" className="button button-primary users-create-button" onClick={openCreate}><Plus size={18} /> Novo usuário</button>
      </section>

      <section className="users-metrics" aria-label="Resumo de usuários">
        <article><span><Users size={20} /></span><div><small>Total de contas</small><strong>{users.length}</strong><p>usuários cadastrados</p></div></article>
        <article><span><ShieldCheck size={20} /></span><div><small>Administradores</small><strong>{adminCount}</strong><p>com acesso completo</p></div></article>
        <article><span><UserRound size={20} /></span><div><small>Usuários internos</small><strong>{userCount}</strong><p>com acesso operacional</p></div></article>
      </section>

      <section className="panel users-directory">
        <div className="users-directory-heading">
          <div><p className="eyebrow">Diretório</p><h2>Usuários cadastrados</h2><p className="muted">Consulte contas e ajuste os perfis de acesso.</p></div>
          <button type="button" className="button button-secondary" onClick={() => setRetry((value) => value + 1)} disabled={loading}><RefreshCw className={loading ? "consultation-spinner" : ""} size={16} /> Atualizar</button>
        </div>

        <div className="users-filters">
          <label className="users-search" htmlFor="user-search"><Search size={18} /><input id="user-search" type="search" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Buscar por nome ou código" /></label>
          <label className="users-role-filter" htmlFor="role-filter"><span>Perfil</span><select id="role-filter" value={roleFilter} onChange={(event) => { setRoleFilter(event.target.value as ManagedUser["role"] | "all"); setPage(1); }}><option value="all">Todos os perfis</option><option value="admin">Administradores</option><option value="user">Usuários internos</option></select></label>
        </div>

        {loading ? (
          <div className="users-state" role="status"><LoaderCircle className="consultation-spinner" size={28} /><strong>Carregando usuários...</strong></div>
        ) : error ? (
          <div className="users-state users-state-error" role="alert"><UserCog size={30} /><strong>{error}</strong><button className="button button-secondary" onClick={() => setRetry((value) => value + 1)}>Tentar novamente</button></div>
        ) : visibleUsers.length ? (
          <>
            <div className="users-table-summary"><span><strong>{filteredUsers.length}</strong> conta{filteredUsers.length === 1 ? "" : "s"} encontrada{filteredUsers.length === 1 ? "" : "s"}</span>{(search || roleFilter !== "all") && <span className="table-pill">Filtros ativos</span>}</div>
            <div className="table-scroll"><table className="data-table users-table">
              <caption className="sr-only">Usuários cadastrados no sistema</caption>
              <thead><tr><th>Usuário</th><th>Código</th><th>Perfil</th><th>Permissões</th><th><span className="sr-only">Ações</span></th></tr></thead>
              <tbody>{visibleUsers.map((item) => <tr key={item._id}>
                <td><div className="users-identity"><span className={`users-avatar role-${item.role}`}>{getInitials(item.userName)}</span><div><strong>{item.userName}</strong>{item._id === signedUser?._id && <small>Você</small>}</div></div></td>
                <td><span className="users-id">#{String(item._id).padStart(3, "0")}</span></td>
                <td><span className={`users-role-badge role-${item.role}`}><i />{roleLabels[item.role]}</span></td>
                <td><span className="users-permission-copy">{roleDescriptions[item.role]}</span></td>
                <td className="users-actions"><button type="button" className="button button-secondary details-button" onClick={() => openEdit(item)}><Edit3 size={15} /> Editar</button></td>
              </tr>)}</tbody>
            </table></div>
            <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />
          </>
        ) : <div className="users-state"><Users size={30} /><strong>Nenhum usuário encontrado</strong><p>Ajuste os filtros ou cadastre uma nova conta.</p></div>}
      </section>

      {modalOpen && <Dialog title={editingUser ? "Editar usuário" : "Cadastrar usuário"} onClose={closeModal}>
        <form className="user-form" onSubmit={submitUser}>
          <div className="user-form-intro"><span><UserCog size={24} /></span><div><h3>{editingUser ? "Atualize os dados da conta" : "Adicione uma pessoa à equipe"}</h3><p>{editingUser ? "Altere o nome, o perfil ou defina uma nova senha." : "Defina as credenciais e o nível de acesso inicial."}</p></div></div>
          <div className="user-form-grid">
            <label className="field user-form-wide"><span>Nome de usuário</span><input className="input" value={form.userName} onChange={(event) => setForm((current) => ({ ...current, userName: event.target.value }))} placeholder="ex.: nome.sobrenome" autoComplete="username" disabled={saving} required /></label>
            <fieldset className="user-role-options user-form-wide"><legend>Perfil de acesso</legend>{(["user", "admin"] as const).map((role) => <label className={form.role === role ? "selected" : ""} key={role}>
              <input type="radio" name="role" value={role} checked={form.role === role} onChange={() => setForm((current) => ({ ...current, role }))} disabled={saving} />
              <span className={`users-avatar role-${role}`}><ShieldCheck size={18} /></span><span><strong>{roleLabels[role]}</strong><small>{roleDescriptions[role]}</small></span>{form.role === role && <CheckCircle2 className="role-option-check" size={18} />}
            </label>)}</fieldset>
            <label className="field"><span>{editingUser ? "Nova senha" : "Senha"}</span><div className="user-password-input"><KeyRound size={17} /><input className="input" type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} placeholder={editingUser ? "Deixe vazio para manter" : "Mínimo de 6 caracteres"} autoComplete="new-password" disabled={saving} required={!editingUser} /></div></label>
            <label className="field"><span>Confirmar senha</span><div className="user-password-input"><KeyRound size={17} /><input className="input" type="password" value={form.confirmPassword} onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))} placeholder="Repita a senha" autoComplete="new-password" disabled={saving} required={!editingUser || Boolean(form.password)} /></div></label>
          </div>
          {formError && <div className="notice notice-error" role="alert">{formError}</div>}
          <div className="user-form-actions"><button type="button" className="button button-ghost" onClick={closeModal} disabled={saving}>Cancelar</button><button type="submit" className="button button-primary" disabled={saving}>{saving ? <LoaderCircle className="consultation-spinner" size={17} /> : editingUser ? <CheckCircle2 size={17} /> : <Plus size={17} />}{saving ? "Salvando..." : editingUser ? "Salvar alterações" : "Criar usuário"}</button></div>
        </form>
      </Dialog>}
    </div>
  );
};

export default UsersPage;
