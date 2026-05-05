import { useState, useEffect, useCallback } from "react";
import { ICONS } from "../utils/icons";
import { t, formatDateTime, totalVotes } from "../utils/i18n";
import { apiFetch, toVoteDetailVm } from "../utils/api";
import { generateFingerprint } from "../utils/fingerprint";
import { solvePow } from "../utils/pow";
import StatusBadge from "./StatusBadge";
import { useToast } from "./ToastContext";
import TieredVote from "./TieredVote";

export default function VoteDetail({ voteId, onNavigate }) {
  const [vote, setVote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiFetch(`/api/votes/${encodeURIComponent(voteId)}`);
        const vm = toVoteDetailVm(data);
        setVote(vm);
      } catch (e) {
        if (e.status === 404) setError("notfound");
        else setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [voteId]);

  const handleShare = useCallback(() => {
    const url = `${location.origin}${location.pathname}#/vote/${voteId}`;
    navigator.clipboard.writeText(url).then(() => toast(t("linkCopied"), "success"));
  }, [voteId, toast]);

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>{t("loading")}</p>
      </div>
    );
  }

  if (error === "notfound") {
    return (
      <div className="empty-state">
        {ICONS.inbox}
        <p>{t("voteNotFound")}</p>
        <button className="btn btn-outline" style={{ marginTop: 16 }} onClick={() => onNavigate("list")}>
          {t("backToList")}
        </button>
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

  if (vote.mode === "tiered") {
    return <TieredVote vote={vote} onNavigate={onNavigate} />;
  }

  const isEnded = vote.status === "ended";
  const isPending = vote.status === "pending";
  const isActive = vote.status === "active";

  const toggleOption = (oid) => {
    if (!isActive) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (vote.maxChoices === 1) {
        return new Set([oid]);
      }
      if (next.has(oid)) {
        next.delete(oid);
      } else if (next.size < vote.maxChoices) {
        next.add(oid);
      } else {
        toast(t("maxOptionsWarning", { n: vote.maxChoices }), "error");
        return prev;
      }
      return next;
    });
  };

  const handleSubmit = async () => {
    if (selected.size === 0 || submitting) return;
    setSubmitting(true);
    try {
      const fp = await generateFingerprint();
      const powData = await apiFetch("/api/pow/challenge");
      const nonce = await solvePow(powData.challenge, powData.difficulty);
      if (nonce < 0) {
        toast(t("errPowFailed"), "error");
        setSubmitting(false);
        return;
      }
      await apiFetch(`/api/votes/${encodeURIComponent(vote.id)}/submit`, {
        method: "POST",
        body: JSON.stringify({
          choices: Array.from(selected),
          fingerprint: fp,
          powChallenge: powData.challenge,
          powNonce: nonce,
        }),
      });
      toast(t("submitSuccess"), "success");
      onNavigate("result", vote.id);
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewResult = async () => {
    try {
      await apiFetch(`/api/votes/${encodeURIComponent(vote.id)}/results`);
      onNavigate("result", vote.id);
    } catch (e) {
      if (e.status === 403) {
        toast(t("submitToView"), "error");
      } else {
        toast(e.message, "error");
      }
    }
  };

  const handleViewResultDirect = () => {
    onNavigate("result", vote.id);
  };

  return (
    <>
      <div className="detail-header">
        <button className="detail-back" onClick={() => onNavigate("list")}>
          {ICONS.arrowLeft}{t("backToList")}
        </button>
        <div className="detail-title-row">
          <h1 className="detail-title">{vote.title}</h1>
          <button className="btn btn-ghost btn-sm btn-detail-share" onClick={handleShare} title={t("shareLink")}>
            {ICONS.copy}
          </button>
        </div>
        <div className="detail-meta">
          <StatusBadge status={vote.status} />
          <span className="meta-item">{ICONS.clock}{formatDateTime(vote.startTime)} - {formatDateTime(vote.endTime)}</span>
          <span className="meta-item">{ICONS.users}{totalVotes(vote)} {t("votes")}</span>
        </div>
      </div>

      <div className="detail-section">
        <div className="detail-section-title">{t("rules")}</div>
        <div className="rules-card">
          <ul>
            <li>{t("ruleMaxChoices", { n: vote.maxChoices, s: vote.maxChoices > 1 ? "s" : "" })}</li>
            <li>{t("ruleActiveOnly")}</li>
            <li>{t("ruleNoDuplicate")}</li>
            <li>{vote.resultVisibility === "after_end" ? t("ruleResultAfterEnd") : t("ruleResultAfter")}</li>
          </ul>
        </div>
      </div>

      <div className="detail-section">
        <div className="detail-section-title">{t("options")}</div>
        <div className="options-list">
          {vote.options.map((o) => (
            <div
              key={o.id}
              className={`option-item ${selected.has(o.id) ? "selected" : ""}`}
              onClick={() => toggleOption(o.id)}
            >
              <div className="option-radio"><div className="option-radio-inner"></div></div>
              <span className="option-label">{o.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="vote-action">
        {isEnded ? (
          <button className="btn btn-primary" onClick={handleViewResultDirect}>
            {ICONS.barChart}{t("viewResults")}
          </button>
        ) : isPending ? (
          <button className="btn btn-outline" disabled>{t("notStartedYet")}</button>
        ) : (
          <>
            <button className="btn btn-ghost" onClick={handleViewResult}>
              {ICONS.barChart}{t("viewResults")}
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={selected.size === 0 || submitting}
            >
              {submitting ? t("loading") : t("submitVote")}
            </button>
          </>
        )}
      </div>
    </>
  );
}
