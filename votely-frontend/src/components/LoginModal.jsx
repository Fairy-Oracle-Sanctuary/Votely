import { useState, useRef } from "react";
import { ICONS } from "../utils/icons";
import { t } from "../utils/i18n";
import { apiFetch } from "../utils/api";
import { useToast } from "./ToastContext";

export default function LoginModal({ onClose, onLoginSuccess }) {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const inputRef = useRef(null);

  const handleSubmit = async () => {
    if (!token.trim()) {
      toast(t("adminTokenRequired"), "error");
      return;
    }
    setLoading(true);
    try {
      const data = await apiFetch("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ token: token.trim() }),
      });
      if (data && data.ok) {
        toast(t("loginSuccess", { name: data.name }), "success");
        onLoginSuccess(data);
        onClose();
      }
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" style={{ maxWidth: "400px" }}>
        <div className="modal-header">
          <h2>{t("adminLogin")}</h2>
          <button className="btn-ghost" onClick={onClose}>{ICONS.x}</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>{t("adminToken")}</label>
            <input
              className="form-input"
              type="password"
              placeholder={t("enterToken")}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
              ref={inputRef}
              autoFocus
            />
            <div className="form-hint">{t("adminTokenHint")}</div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>{t("cancel")}</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? t("loading") : t("login")}
          </button>
        </div>
      </div>
    </div>
  );
}
