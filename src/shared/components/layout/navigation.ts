import { FileSpreadsheet, LayoutDashboard, Radio, Search, Users } from "lucide-react";

export const navigation = [
  {
    path: "/dashboard",
    title: "Visão geral",
    description: "Indicadores de atendimento do SAMU",
    icon: LayoutDashboard,
    section: "Gestão",
    roles: ["admin", "user"],
  },
  {
    path: "/consultas",
    title: "Consultas",
    description: "Painel de consultas e relatórios",
    icon: Search,
    section: "Gestão",
    roles: ["admin", "user"],
  },
  {
    path: "/recentes",
    title: "Ocorrências recentes",
    description: "Acompanhe os registros mais novos da central",
    icon: Radio,
    section: "Operação",
    roles: ["admin", "user"],
  },
  {
    path: "/exportacoes",
    title: "Central de exportações",
    description: "Extraia os dados dos endpoints em arquivos Excel",
    icon: FileSpreadsheet,
    section: "Relatórios",
    roles: ["admin"],
  },
  {
    path: "/users",
    title: "Gestão de usuários",
    description: "Gerencie contas, perfis e permissões internas",
    icon: Users,
    section: "Gestão",
    roles: ["admin"],
  },
];
