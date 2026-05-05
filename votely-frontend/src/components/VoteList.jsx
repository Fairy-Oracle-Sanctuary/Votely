import { useState, useEffect, useRef } from "react";
import { ICONS } from "../utils/icons";
import { t, formatDate, totalVotes } from "../utils/i18n";
import { apiFetch, toVoteListVm } from "../utils/api";
import StatusBadge from "./StatusBadge";

export default function VoteList({ onNavigate }) {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const lastReq = useRef(0);

  useEffect(() => {
    const reqId = ++lastReq.current;
    (async () => {
      setItems(null);
      setError(null);
      try {
        const qv = query.trim();
        const data = await apiFetch(`/api/votes?q=${encodeURIComponent(qv)}&limit=50&offset=0`);
        if (reqId !== lastReq.current) return;
        setItems(data.map(toVoteListVm));
      } catch (e) {
        if (reqId !== lastReq.current) return;
        setError(e.message);
      }
    })();
  }, [query]);

  return (
    <>
      <div className="search-bar">
        {ICONS.search}
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="vote-list">
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
            <div
              key={v.id}
              className="vote-card"
              onClick={() => onNavigate("vote", v.id)}
            >
              <div className="vote-card-header">
                <span className="vote-card-title">{v.title}</span>
                <StatusBadge status={v.status} />
              </div>
              <div className="vote-card-meta">
                <span className="meta-item">
                  {ICONS.clock}
                  {formatDate(v.startTime)} - {formatDate(v.endTime)}
                </span>
                <span className="meta-item">
                  {ICONS.users}
                  {totalVotes(v)} {t("votes")}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
