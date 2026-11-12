import { Link, useLocation } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  Route as RouteIcon,
  Network,
  FolderOpen,
  UserRound,
  Sparkles,
  Settings,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  Menu,
  Bell,
  ArrowUpRight,
  X,
  Send,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import symbol from "@/assets/luedal-symbol.png.asset.json";
import { useCareer } from "@/lib/career-context";
import { useAssistant } from "./conversational-assistant";
export function Brand() {
  return (
    <Link to="/" className="brand">
      <img src={symbol.url} alt="" />
      <span>Luedal</span>
      <small>BETA</small>
    </Link>
  );
}
const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/minha-rota", label: "Minha Rota", icon: RouteIcon },
  { to: "/competencias", label: "Competências", icon: Network },
  { to: "/evidencias", label: "Evidências", icon: FolderOpen },
] as const;
export function Shell({ children, title }: { children: ReactNode; title: string }) {
  const { data, demo, loading } = useCareer();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);
  const { open: openAssistant } = useAssistant();
  return (
    <div className={`app-shell ${collapsed ? "is-collapsed" : ""}`}>
      <aside className={`sidebar ${collapsed ? "collapsed" : ""} ${mobile ? "mobile-open" : ""}`}>
        <Brand />
        <p className="nav-heading">PRINCIPAL</p>
        {nav.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setMobile(false)}
            className={`nav-item ${location.pathname === item.to ? "active" : ""}`}
          >
            <item.icon />
            <span>{item.label}</span>
          </Link>
        ))}
        <p className="nav-heading">MINHA CARREIRA</p>
        <Link
          to="/perfil"
          className={`nav-item ${location.pathname === "/perfil" ? "active" : ""}`}
        >
          <UserRound />
          <span>Perfil profissional</span>
        </Link>
        <p className="nav-heading">ASSISTÊNCIA</p>
        <Button variant="ghost" className="nav-item" onClick={() => openAssistant()}>
          <Sparkles />
          <span>Luedal AI</span>
          <span className="tag tag-purple">BETA</span>
        </Button>
        <div className="sidebar-bottom">
          <div className="beta-note">
            <strong>
              Seu futuro, um passo por vez <ArrowUpRight size={12} />
            </strong>
            Você está na versão beta da Luedal. Vamos evoluir juntos.
          </div>
          <Link to="/configuracoes" className="nav-item">
            <Settings />
            <span>Configurações</span>
          </Link>
          <div className="user">
            <div className="avatar">
              {(data.name || "Meu perfil")
                .split(" ")
                .slice(0, 2)
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="user-copy">
              <strong className="text-xs font-medium">{data.name || "Meu perfil"}</strong>
              <p className="muted text-[10px] mt-1">
                {demo ? "Perfil demonstrativo" : "Minha conta"}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto"
              title="Recolher menu"
              onClick={() => setCollapsed(!collapsed)}
            >
              <PanelLeftClose />
            </Button>
          </div>
        </div>
      </aside>
      <header className="topbar">
        <div className="topbar-left">
          <Button
            className="mobile-menu"
            variant="ghost"
            size="icon"
            aria-label="Abrir menu"
            onClick={() => setMobile(!mobile)}
          >
            <Menu />
          </Button>
          <span>Meu espaço</span>
          <ChevronRight size={12} />
          <strong className="text-foreground font-medium">{title}</strong>
        </div>
        <div className="topbar-right">
          {demo && <span className="demo-badge">Ambiente demonstrativo</span>}
          <Button variant="ghost" size="icon" title="Notificações" onClick={() => openAssistant()}>
            <Bell size={16} />
          </Button>
          <Button variant="outline" onClick={() => openAssistant()}>
            <Sparkles className="text-primary" />
            Luedal AI
          </Button>
        </div>
      </header>
      {loading ? (
        <div className="loading-page">
          <div className="skeleton" />
          <div className="skeleton" />
        </div>
      ) : (
        children
      )}
    </div>
  );
}
export function PageHeading({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children}
    </div>
  );
}
export function PublicHeader() {
  const { userId, data, logout } = useCareer();
  return (
    <header className="public-header">
      <Brand />
      <nav className="public-nav">
        <Link to="/sobre">Conhecer a Luedal</Link>
        {userId ? <><Link to={data.onboarded ? "/dashboard" : "/onboarding"}>Minha conta</Link><Button variant="ghost" onClick={() => void logout()}>Sair</Button></> : <Link to="/login">Entrar</Link>}
        <Button asChild>
          <Link to="/onboarding">
            Começar minha evolução <ArrowUpRight />
          </Link>
        </Button>
      </nav>
    </header>
  );
}
export function ThemeControl() {
  const [light, setLight] = useState(false);
  return (
    <Button
      variant="outline"
      onClick={() => {
        setLight(!light);
        document.documentElement.dataset["theme"] = light ? "dark" : "light";
      }}
    >
      {light ? <Moon /> : <Sun />}
      {light ? "Tema escuro" : "Tema claro"}
    </Button>
  );
}
