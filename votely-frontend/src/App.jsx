import { useState, useEffect, useCallback } from "react";
import { t, setLang, getLang } from "./utils/i18n";
import { apiFetch } from "./utils/api";
import { ToastProvider } from "./components/Toast";
import { useToast } from "./components/ToastContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import VoteList from "./components/VoteList";
import VoteDetail from "./components/VoteDetail";
import VoteResult from "./components/VoteResult";
import AdminPanel from "./components/AdminPanel";
import LoginModal from "./components/LoginModal";
import CreateVoteModal from "./components/CreateVoteModal";
import ConfirmDialog from "./components/ConfirmDialog";

function parseHash() {
  const hash = location.hash || "#/";
  if (hash === "#/" || hash === "#") return { page: "list", params: null };
  if (hash === "#/admin") return { page: "admin", params: null };
  if (hash.startsWith("#/vote/")) return { page: "vote", params: hash.replace("#/vote/", "") };
  if (hash.startsWith("#/result/")) return { page: "result", params: hash.replace("#/result/", "") };
  return { page: "list", params: null };
}

function AppContent() {
  const toast = useToast();
  const initialRoute = parseHash();
  const [page, setPage] = useState(initialRoute.page);
  const [pageParams, setPageParams] = useState(initialRoute.params);
  const [adminState, setAdminState] = useState({ loggedIn: false, name: "", role: "" });
  const [showLogin, setShowLogin] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  const checkAdmin = useCallback(async () => {
    try {
      const data = await apiFetch("/api/admin/me");
      if (data && data.ok) {
        setAdminState({ loggedIn: true, name: data.name, role: data.role });
        return;
      }
    } catch {
      // not logged in
    }
    setAdminState({ loggedIn: false, name: "", role: "" });
  }, []);

  const syncHash = useCallback(() => {
    const route = parseHash();
    setPage(route.page);
    setPageParams(route.params);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkAdmin();
    const handler = () => syncHash();
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, [checkAdmin, syncHash]);

  useEffect(() => {
    const handler = () => {
      setLang(getLang());
      checkAdmin();
    };
    window.addEventListener("langchange", handler);
    return () => window.removeEventListener("langchange", handler);
  }, [checkAdmin]);

  const navigate = useCallback((target, param) => {
    if (target === "list") {
      location.hash = "#/";
    } else if (target === "vote") {
      location.hash = `#/vote/${param}`;
    } else if (target === "result") {
      location.hash = `#/result/${param}`;
    } else if (target === "admin") {
      location.hash = "#/admin";
    }
  }, []);

  const handleLogin = useCallback(() => {
    setShowLogin(true);
  }, []);

  const handleLoginSuccess = useCallback((data) => {
    setAdminState({ loggedIn: true, name: data.name, role: data.role });
  }, []);

  const handleLogout = useCallback(() => {
    setLogoutConfirm(true);
  }, []);

  const confirmLogout = useCallback(async () => {
    try {
      await apiFetch("/api/admin/logout", { method: "POST" });
    } catch {
      // ignore
    }
    setAdminState({ loggedIn: false, name: "", role: "" });
    setLogoutConfirm(false);
    toast(t("logoutSuccess"), "info");
    location.hash = "#/";
  }, [toast]);

  const handleCreate = useCallback(() => {
    if (!adminState.loggedIn) {
      setShowLogin(true);
      return;
    }
    setShowCreate(true);
  }, [adminState.loggedIn]);

  const handleCreated = useCallback((vote) => {
    if (vote && vote.id) navigate("vote", vote.id);
  }, [navigate]);

  const renderPage = () => {
    switch (page) {
      case "list":
        return <VoteList onNavigate={navigate} />;
      case "vote":
        return pageParams ? <VoteDetail voteId={pageParams} onNavigate={navigate} /> : null;
      case "result":
        return pageParams ? <VoteResult voteId={pageParams} onNavigate={navigate} /> : null;
      case "admin":
        return <AdminPanel adminState={adminState} onNavigate={navigate} />;
      default:
        return <VoteList onNavigate={navigate} />;
    }
  };

  return (
    <>
      <Header
        adminState={adminState}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onCreate={handleCreate}
        onNavigate={navigate}
        onCheckAdmin={checkAdmin}
      />
      <main className="app-main container" id="app">
        {renderPage()}
      </main>
      <Footer />

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {showCreate && (
        <CreateVoteModal
          onClose={() => setShowCreate(false)}
          onCreated={handleCreated}
        />
      )}

      {logoutConfirm && (
        <ConfirmDialog
          message={t("confirmLogout")}
          onConfirm={confirmLogout}
          onCancel={() => setLogoutConfirm(false)}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
