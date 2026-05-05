import { useState, useCallback, useMemo } from "react";
import { ICONS } from "../utils/icons";
import { t, formatDateTime, totalVotes } from "../utils/i18n";
import { apiFetch } from "../utils/api";
import { generateFingerprint } from "../utils/fingerprint";
import { solvePow } from "../utils/pow";
import StatusBadge from "./StatusBadge";
import { useToast } from "./ToastContext";

export default function TieredVote({ vote, onNavigate }) {
  const toast = useToast();
  const isEnded = vote.status === "ended";
  const isActive = vote.status === "active";

  const cfg = vote.tierConfig || { main: 1, secondary: 2, normal: 4 };
  const limits = useMemo(() => ({
    main: Math.max(0, parseInt(cfg.main || 0)),
    secondary: Math.max(0, parseInt(cfg.secondary || 0)),
    normal: Math.max(0, parseInt(cfg.normal || 0)),
  }), [cfg.main, cfg.secondary, cfg.normal]);

  const [tab, setTab] = useState("rules");
  const [main, setMain] = useState([]);
  const [secondary, setSecondary] = useState([]);
  const [normal, setNormal] = useState([]);
  const [selectedSet, setSelectedSet] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resultsData, setResultsData] = useState(null);
  const [resultsSearchTotal, setResultsSearchTotal] = useState("");
  const [resultsSearchMain, setResultsSearchMain] = useState("");

  const tierOf = useCallback((id) => {
    if (main.includes(id)) return "main";
    if (secondary.includes(id)) return "secondary";
    if (normal.includes(id)) return "normal";
    return "";
  }, [main, secondary, normal]);

  const removeId = useCallback((id) => {
    const t0 = tierOf(id);
    if (!t0) return;
    const arr = t0 === "main" ? main : t0 === "secondary" ? secondary : normal;
    const idx = arr.indexOf(id);
    if (idx >= 0) {
      const newArr = [...arr];
      newArr.splice(idx, 1);
      if (t0 === "main") setMain(newArr);
      else if (t0 === "secondary") setSecondary(newArr);
      else setNormal(newArr);
    }
    setSelectedSet((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, [tierOf, main, secondary, normal]);

  const nextTier = useCallback(() => {
    if (main.length < limits.main) return "main";
    if (secondary.length < limits.secondary) return "secondary";
    if (normal.length < limits.normal) return "normal";
    return "";
  }, [main.length, secondary.length, normal.length, limits]);

  const addId = useCallback((id) => {
    if (selectedSet.has(id)) return;
    const t0 = nextTier();
    if (!t0) return;
    setSelectedSet((prev) => new Set(prev).add(id));
    if (t0 === "main") setMain((prev) => [...prev, id]);
    else if (t0 === "secondary") setSecondary((prev) => [...prev, id]);
    else setNormal((prev) => [...prev, id]);
  }, [selectedSet, nextTier]);

  const choicesInOrder = useCallback(() => {
    return [...main, ...secondary, ...normal];
  }, [main, secondary, normal]);

  const optionText = useCallback((id) => {
    const o = vote.options.find((x) => x.id === id);
    return o ? o.text : id;
  }, [vote.options]);

  const handleShare = useCallback(() => {
    const url = `${location.origin}${location.pathname}#/vote/${vote.id}`;
    navigator.clipboard.writeText(url).then(() => toast(t("linkCopied"), "success"));
  }, [vote.id, toast]);

  const handleSubmit = async () => {
    if (submitting) return;
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
          choices: choicesInOrder(),
          fingerprint: fp,
          powChallenge: powData.challenge,
          powNonce: nonce,
        }),
      });
      toast(t("voteSubmitted"), "success");
      loadResults();
      setTab("results");
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const loadResults = async () => {
    try {
      const data = await apiFetch(`/api/votes/${encodeURIComponent(vote.id)}/results`);
      setResultsData(data);
    } catch (e) {
      toast(e.message, "error");
    }
  };

  const handleViewResult = async () => {
    if (!resultsData) {
      await loadResults();
    }
    setTab("results");
  };

  const renderRulesPage = () => {
    const rulesContent = vote.rulesText
      ? `<div class="rules-custom-text">${vote.rulesText.replace(/\n/g, "<br>")}</div>`
      : `<div class="rules-card"><ul>
          <li>${t("tierMain")}: ${limits.main} &nbsp; ${t("tierSecondary")}: ${limits.secondary} &nbsp; ${t("tierNormal")}: ${limits.normal}</li>
          <li>${t("defaultRules")}</li>
        </ul></div>`;
    return (
      <>
        <h2 className="tier-page-title">{t("navRules")}</h2>
        <div className="tier-page-body" dangerouslySetInnerHTML={{ __html: rulesContent }} />
      </>
    );
  };

  const renderVotePage = () => {
    const q = searchQuery.trim().toLowerCase();
    const filteredOptions = vote.options.filter(
      (o) => !q || (o.text || "").toLowerCase().includes(q)
    );

    const renderPills = (arr) =>
      arr.length > 0
        ? arr.map((id) => (
            <button
              key={id}
              className="tier-pill"
              onClick={() => { if (isActive) removeId(id); }}
              type="button"
            >
              {optionText(id)}{ICONS.x}
            </button>
          ))
        : [<div key="empty" className="tier-empty">-</div>];

    return (
      <>
        <h2 className="tier-page-title">{t("navVote")}</h2>
        <div className="tier-page-body">
          <div className="tiered-vote-layout">
            <div className="tiered-vote-roles">
              <div className="search-bar" style={{ marginBottom: 12 }}>
                {ICONS.search}
                <input
                  type="text"
                  placeholder={t("searchRole")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="options-list">
                {filteredOptions.map((o) => {
                  const isSelected = selectedSet.has(o.id);
                  return (
                    <div
                      key={o.id}
                      className={`option-item ${isSelected ? "disabled" : ""}`}
                      onClick={() => { if (isActive) { if (isSelected) removeId(o.id); else addId(o.id); } }}
                    >
                      <div className="option-radio"><div className="option-radio-inner"></div></div>
                      <span className="option-label">{o.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="tiered-vote-buckets">
              <div className="tier-box">
                <div className="tier-title">{t("tierMain")} ({limits.main})</div>
                <div className="tier-items">{renderPills(main)}</div>
              </div>
              <div className="tier-box">
                <div className="tier-title">{t("tierSecondary")} ({limits.secondary})</div>
                <div className="tier-items">{renderPills(secondary)}</div>
              </div>
              <div className="tier-box">
                <div className="tier-title">{t("tierNormal")} ({limits.normal})</div>
                <div className="tier-items">{renderPills(normal)}</div>
              </div>
              <div className="vote-action" style={{ marginTop: 16 }}>
                {isEnded ? (
                  <span className="badge badge-ended">{t("ended")}</span>
                ) : isActive ? (
                  <button
                    className="btn btn-primary"
                    onClick={handleSubmit}
                    disabled={choicesInOrder().length === 0 || submitting}
                  >
                    {submitting ? t("loading") : t("submitVote")}
                  </button>
                ) : (
                  <button className="btn btn-outline" disabled>{t("notStartedYet")}</button>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderResultsPage = () => {
    if (!resultsData) {
      return (
        <>
          <h2 className="tier-page-title">{t("navResults")}</h2>
          <div className="tier-page-body">
            <div className="loading-state">
              <div className="spinner"></div>
              <p>{t("loading")}</p>
            </div>
          </div>
        </>
      );
    }

    const tiered = resultsData.tieredItems || [];
    const totalSorted = [...tiered].sort((a, b) => (b.weightedScore || 0) - (a.weightedScore || 0));
    const mainSorted = [...tiered].sort((a, b) => b.mainVotes - a.mainVotes);

    const filterBy = (items, q) =>
      q ? items.filter((it) => (it.text || "").toLowerCase().includes(q.toLowerCase())) : items;

    const filteredTotal = filterBy(totalSorted, resultsSearchTotal);
    const filteredMain = filterBy(mainSorted, resultsSearchMain);

    return (
      <>
        <h2 className="tier-page-title">{t("navResults")}</h2>
        <div className="tier-page-body">
          <div className="ranking-section">
            <div className="ranking-header">
              <h3>{t("totalRanking")}</h3>
              <div className="search-bar" style={{ marginBottom: 8, maxWidth: 240 }}>
                {ICONS.search}
                <input
                  type="text"
                  placeholder={t("searchRole")}
                  value={resultsSearchTotal}
                  onChange={(e) => setResultsSearchTotal(e.target.value)}
                />
              </div>
            </div>
            <div className="ranking-list">
              {filteredTotal.map((item, i) => (
                <div key={item.text} className="ranking-row">
                  <span className="ranking-rank">{i + 1}</span>
                  <span className="ranking-name">{item.text}</span>
                  <span className="ranking-dots"></span>
                  <span className="ranking-votes">
                    {item.weightedScore != null ? item.weightedScore : item.totalVotes} {t("weightedScore")}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="ranking-section">
            <div className="ranking-header">
              <h3>{t("mainRanking")}</h3>
              <div className="search-bar" style={{ marginBottom: 8, maxWidth: 240 }}>
                {ICONS.search}
                <input
                  type="text"
                  placeholder={t("searchRole")}
                  value={resultsSearchMain}
                  onChange={(e) => setResultsSearchMain(e.target.value)}
                />
              </div>
            </div>
            <div className="ranking-list">
              {filteredMain.map((item, i) => (
                <div key={item.text} className="ranking-row">
                  <span className="ranking-rank">{i + 1}</span>
                  <span className="ranking-name">{item.text}</span>
                  <span className="ranking-dots"></span>
                  <span className="ranking-votes">{item.mainVotes} {t("votesUnit")}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
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

      <div className="tiered-container">
        <nav className="tiered-nav">
          {["rules", "vote", "results"].map((t) => (
            <button
              key={t}
              className={`tiered-nav-item ${tab === t ? "active" : ""}`}
              onClick={() => {
                if (t === "results") handleViewResult();
                else setTab(t);
              }}
            >
              {t === "rules" ? t("navRules") : t === "vote" ? t("navVote") : t("navResults")}
            </button>
          ))}
        </nav>
        <div className="tiered-content">
          {tab === "rules" && renderRulesPage()}
          {tab === "vote" && renderVotePage()}
          {tab === "results" && renderResultsPage()}
        </div>
      </div>
    </>
  );
}
