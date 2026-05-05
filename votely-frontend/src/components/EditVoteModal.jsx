import { useState, useEffect } from "react";
import { ICONS } from "../utils/icons";
import { t } from "../utils/i18n";
import { apiFetch, toVoteDetailVm } from "../utils/api";
import { useToast } from "./ToastContext";

export default function EditVoteModal({ voteId, onClose }) {
  const toast = useToast();
  const [vote, setVote] = useState(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [maxChoices, setMaxChoices] = useState(1);
  const [options, setOptions] = useState([]);
  const [weightMain, setWeightMain] = useState(4);
  const [weightSecondary, setWeightSecondary] = useState(2);
  const [weightNormal, setWeightNormal] = useState(1);
  const [rulesText, setRulesText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiFetch(`/api/votes/${encodeURIComponent(voteId)}`);
        const vm = toVoteDetailVm(data);
        setVote(vm);
        setTitle(vm.title);
        setDesc(vm.description || "");
        setMaxChoices(vm.maxChoices || 1);
        setOptions(vm.options.map((o) => ({ id: o.id, text: o.text })));
        if (vm.mode === "tiered") {
          setWeightMain((vm.tierWeights && vm.tierWeights.main) || 4);
          setWeightSecondary((vm.tierWeights && vm.tierWeights.secondary) || 2);
          setWeightNormal((vm.tierWeights && vm.tierWeights.normal) || 1);
          setRulesText(vm.rulesText || "");
        }
      } catch (e) {
        toast(e.message, "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [voteId, toast]);

  const handleSubmit = async () => {
    const opts = options.map((o) => o.text.trim()).filter((v) => v);
    if (!title.trim()) { toast(t("titleRequired"), "error"); return; }
    if (opts.length < 2) { toast(t("atLeast2Options"), "error"); return; }

    setSubmitting(true);
    try {
      const body = {
        title: title.trim(),
        description: desc.trim(),
        maxChoices,
        options: opts,
      };
      if (vote && vote.mode === "tiered") {
        body.rulesText = rulesText;
        body.tierWeights = {
          main: weightMain || 0,
          secondary: weightSecondary || 0,
          normal: weightNormal || 0,
        };
      }
      await apiFetch(`/api/admin/votes/${encodeURIComponent(voteId)}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });
      toast(t("voteUpdated"), "success");
      onClose();
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        <div className="modal" style={{ maxWidth: "400px" }}>
          <div className="modal-body" style={{ textAlign: "center", padding: "40px" }}>
            <div className="spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal-header">
          <h2>{t("editVote")}</h2>
          <button className="btn-ghost" onClick={onClose}>{ICONS.x}</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>{t("title")}</label>
            <input className="form-input" type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="form-group">
            <label>{t("description")}</label>
            <textarea className="form-input" value={desc} onChange={(e) => setDesc(e.target.value)} />
          </div>
          <div className="form-group" style={{ display: !vote || vote.mode === "tiered" ? "none" : "block" }}>
            <label>{t("maxChoicesPerVoter")}</label>
            <input className="form-input" type="number" value={maxChoices} min="1" onChange={(e) => setMaxChoices(parseInt(e.target.value) || 1)} />
          </div>
          {vote && vote.mode === "tiered" && (
            <>
              <div className="form-group">
                <label>{t("tierWeightsLabel")}</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  <input className="form-input" type="number" value={weightMain} min="0" onChange={(e) => setWeightMain(parseInt(e.target.value) || 0)} />
                  <input className="form-input" type="number" value={weightSecondary} min="0" onChange={(e) => setWeightSecondary(parseInt(e.target.value) || 0)} />
                  <input className="form-input" type="number" value={weightNormal} min="0" onChange={(e) => setWeightNormal(parseInt(e.target.value) || 0)} />
                </div>
                <div style={{ marginTop: 6, color: "var(--text-muted)", fontSize: "0.85rem" }}>{t("tierWeightsHint")}</div>
              </div>
              <div className="form-group">
                <label>{t("navRules")}</label>
                <textarea className="form-input" rows="4" value={rulesText} onChange={(e) => setRulesText(e.target.value)} />
              </div>
            </>
          )}
          <div className="form-group">
            <label>{t("options")}</label>
            <div id="edit-option-inputs">
              {options.map((o, i) => (
                <div key={o.id} className="option-input-row" data-idx={i}>
                  <input className="form-input" type="text" value={o.text}
                    onChange={(e) => {
                      const next = [...options];
                      next[i] = { ...next[i], text: e.target.value };
                      setOptions(next);
                    }}
                  />
                  {options.length > 2 && (
                    <button className="btn-remove" type="button" onClick={() => {
                      if (options.length <= 2) return;
                      setOptions((prev) => prev.filter((_, idx) => idx !== i));
                    }}>{ICONS.x}</button>
                  )}
                </div>
              ))}
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => setOptions((prev) => [...prev, { id: `new-${prev.length}`, text: "" }])} style={{ marginTop: 8 }}>
              {ICONS.plus}{t("addOption")}
            </button>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>{t("cancel")}</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? t("loading") : t("save")}
          </button>
        </div>
      </div>
    </div>
  );
}
