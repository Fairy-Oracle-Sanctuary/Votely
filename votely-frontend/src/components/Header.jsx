import { ICONS } from "../utils/icons";
import { t, getLang, setLang } from "../utils/i18n";

export default function Header({ adminState, onLogin, onLogout, onCreate, onNavigate, onCheckAdmin }) {
  const lang = getLang();

  const handleLangToggle = () => {
    setLang(lang === "zh" ? "en" : "zh");
    onCheckAdmin();
    window.dispatchEvent(new Event("langchange"));
  };

  return (
    <header className="app-header">
      <div className="container">
        <a href="#/" className="logo" onClick={(e) => { e.preventDefault(); onNavigate("list"); }}>
          {ICONS.check}
          <span>Votely</span>
        </a>
        <nav className="nav-actions">
          <button className="btn btn-ghost btn-sm" onClick={handleLangToggle} title="Switch language">
            {lang === "zh" ? t("langEn") : t("langZh")}
          </button>
          {adminState.loggedIn ? (
            <>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => onNavigate("admin")}
                title={t("adminPanel")}
              >
                {ICONS.edit} {adminState.name}
              </button>
              <button className="btn btn-ghost btn-sm" onClick={onLogout} title={t("logout")}>
                {t("logout")}
              </button>
            </>
          ) : (
            <button className="btn btn-ghost btn-sm" onClick={onLogin} title={t("adminLogin")}>
              {t("login")}
            </button>
          )}
          <button className="btn btn-outline" onClick={onCreate} title={t("createVote")}>
            {ICONS.plus} <span>{t("create")}</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
