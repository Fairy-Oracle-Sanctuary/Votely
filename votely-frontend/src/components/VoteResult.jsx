import { useState, useEffect } from "react";
import { ICONS } from "../utils/icons";
import { t } from "../utils/i18n";
import { apiFetch, toVoteDetailVm } from "../utils/api";
import StatusBadge from "./StatusBadge";
import { useToast } from "./ToastContext";

export default function VoteResult({ voteId, onNavigate }) {
  const [vote, setVote] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const v = await apiFetch(`/api/votes/${encodeURIComponent(voteId)}`);
        const vm = toVoteDetailVm(v);
        setVote(vm);

        const r = await apiFetch(`/api/votes/${encodeURIComponent(voteId)}/results`);
        setResults(r);
      } catch (e) {
        if (e.status === 403) {
          toast(t("submitToView"), "error");
          onNavigate("vote", voteId);
          return;
        }
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [voteId, onNavigate, toast]);

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>{t("loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state">
        {ICONS.inbox}
        <p>{error}</p>
      </div>
    );
  }

  if (!results || !vote) return null;

  const total = results.total;
  const maxVotes = Math.max(...results.items.map((o) => o.votes), 0);

  return (
    <>
      <div className="detail-header">
        <button className="detail-back" onClick={() => onNavigate("list")}>
          {ICONS.arrowLeft}{t("backToList")}
        </button>
        <h1 className="detail-title">{vote.title}</h1>
        <div className="detail-meta">
          <StatusBadge status={vote.status} />
          <span className="meta-item">{ICONS.users}{total} {t("votesTotal")}</span>
        </div>
      </div>

      <div className="detail-section">
        <div className="detail-section-title">{t("results")}</div>
        <div className="result-bars">
          {results.items.map((o) => {
            const pct = o.percent;
            const isWinner = o.votes === maxVotes && maxVotes > 0;
            return (
              <div key={o.text} className="result-item">
                <div className="result-item-header">
                  <span className="result-item-label">{o.text}</span>
                  <span className="result-item-stats">{o.votes} {t("votes")} ({pct.toFixed(1)}%)</span>
                </div>
                <div className="result-bar-track">
                  <div className={`result-bar-fill ${isWinner ? "winner" : ""}`} style={{ width: `${pct}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="result-summary">
        <div className="result-summary-stat">
          <div className="stat-value">{total}</div>
          <div className="stat-label">{t("totalVotes")}</div>
        </div>
        <div className="result-summary-stat">
          <div className="stat-value">{vote.options.length}</div>
          <div className="stat-label">{t("optionsCount")}</div>
        </div>
        <div className="result-summary-stat">
          <div className="stat-value">{vote.maxChoices}</div>
          <div className="stat-label">{t("maxChoices")}</div>
        </div>
      </div>
    </>
  );
}
