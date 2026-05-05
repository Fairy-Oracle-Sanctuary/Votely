import { useState } from "react";
import { t } from "../utils/i18n";

export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  const [closing, setClosing] = useState(false);

  const handleClose = (result) => {
    setClosing(true);
    setTimeout(() => {
      if (result) onConfirm();
      else onCancel();
    }, 150);
  };

  return (
    <div className="modal-overlay" style={{ animation: "none", opacity: closing ? 0 : 1, transition: "150ms ease" }}>
      <div className="modal" style={{ maxWidth: "400px" }}>
        <div className="modal-body" style={{ padding: "24px", textAlign: "center" }}>
          <p style={{ fontSize: "1rem", lineHeight: 1.6, margin: 0 }}>{message}</p>
        </div>
        <div className="modal-footer" style={{ justifyContent: "center", gap: "12px" }}>
          <button className="btn btn-outline" onClick={() => handleClose(false)}>{t("cancel")}</button>
          <button className="btn btn-primary" onClick={() => handleClose(true)}>{t("confirm")}</button>
        </div>
      </div>
    </div>
  );
}
