import { useState, useEffect } from "react";
import { ICONS } from "../utils/icons";
import { t, formatDate } from "../utils/i18n";
import { apiFetch, toVoteListVm } from "../utils/api";
import StatusBadge from "./StatusBadge";
import { useToast } from "./ToastContext";
import EditVoteModal from "./EditVoteModal";

export default function AdminPanel({ adminState, onNavigate }) {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const toast = useToast();

  useEffect(() => {
    (async () => {
      setItems(null);
      setError(null);
      try {
        const data = await apiFetch("/api/admin/votes");
        setItems(data.map(toVoteListVm));
      } catch (e) {
        setError(e.message);
      }
    })();
  }, []);

  const loadVotes = async () => {
    setItems(null);
    setError(null);
    try {
      const data = await apiFetch("/api/admin/votes");
      setItems(data.map(toVoteListVm));
    } catch (e) {
      setError(e.message);
    }
  };

  const handleShare = (vid) => {
    const url = `${location.origin}${location.pathname}#/vote/${vid}`;
    navigator.clipboard.writeText(url).then(() => toast(t("linkCopied"), "success"));
  };

  const handleEnd = async (vid) => {
    try {
      await apiFetch(`/api/admin/votes/${encodeURIComponent(vid)}/status`, {
        method: "POST",
        body: JSON.stringify({ status: "ended" }),
      });
      toast(t("voteEnded"), "success");
      loadVotes();
    } catch (e) {
      toast(e.message, "error");
    }
  };

  const handleDelete = async (vid) => {
    try {
      await apiFetch(`/api/admin/votes/${encodeURIComponent(vid)}`, { method: "DELETE" });
      toast(t("voteDeleted"), "success");
      loadVotes();
    } catch (e) {
      toast(e.message, "error");
    }
  };

  return (
    <>
      <div className="admin-header">
        <h2>{t("adminPanel")}</h2>
        <span className="admin-role-badge">{adminState.name} ({adminState.role})</span>
      </div>

      <div className="admin-votes">
        {items === null ? (
          <div className="empty-state">
            {ICONS.inbox}
            <p>{t("loading")}</p>
          </div>
        ) : error ? (
          <div className="empty-state">
            {ICONS.inbox}
            <p>{error}</p>
          </div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            {ICONS.inbox}
            <p>{t("noVotesFound")}</p>
          </div>
        ) : (
          items.map((v) => (
            <div key={v.id} className="admin-vote-card">
              <div className="admin-vote-info">
                <button className="vote-link" onClick={() => onNavigate("vote", v.id)}>
                  {v.title}
                </button>
                <div className="admin-vote-meta">
                  <StatusBadge status={v.status} />
                  <span>{v.totalVotes} {t("votesTotal")}</span>
                  <span>{formatDate(v.startTime)} → {formatDate(v.endTime)}</span>
                </div>
              </div>
              <div className="admin-vote-actions">
                <button className="btn btn-ghost btn-sm" onClick={() => handleShare(v.id)} title={t("shareLink")}>
                  {ICONS.share}
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => setEditingId(v.id)} title={t("edit")}>
                  {ICONS.edit}
                </button>
                {v.status !== "ended" && (
                  <button className="btn btn-ghost btn-sm" onClick={() => handleEnd(v.id)} title={t("endVote")}>
                    {ICONS.stop}
                  </button>
                )}
                <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(v.id)} title={t("deleteVote")}>
                  {ICONS.trash}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {editingId && (
        <EditVoteModal
          voteId={editingId}
          onClose={() => { setEditingId(null); loadVotes(); }}
          onNavigate={onNavigate}
        />
      )}
    </>
  );
}
