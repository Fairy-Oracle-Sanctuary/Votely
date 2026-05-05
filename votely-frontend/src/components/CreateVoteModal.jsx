import { useState } from "react";
import { ICONS } from "../utils/icons";
import { t } from "../utils/i18n";
import { apiFetch } from "../utils/api";
import { useToast } from "./ToastContext";
import DateTimePicker from "./DateTimePicker";

export default function CreateVoteModal({ onClose, onCreated }) {
  const toast = useToast();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [startStr, setStartStr] = useState("");
  const [startIso, setStartIso] = useState("");
  const [endStr, setEndStr] = useState("");
  const [endIso, setEndIso] = useState("");
  const [maxChoices, setMaxChoices] = useState(1);
  const [mode, setMode] = useState("normal");
  const [resultVis, setResultVis] = useState("after_vote");
  const [options, setOptions] = useState([{ id: "opt-1", val: "" }, { id: "opt-2", val: "" }]);
  const [tierMain, setTierMain] = useState(1);
  const [tierSecondary, setTierSecondary] = useState(2);
  const [tierNormal, setTierNormal] = useState(4);
  const [weightMain, setWeightMain] = useState(4);
  const [weightSecondary, setWeightSecondary] = useState(2);
  const [weightNormal, setWeightNormal] = useState(1);
  const [rulesText, setRulesText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showModeMenu, setShowModeMenu] = useState(false);
  const [showVisMenu, setShowVisMenu] = useState(false);

  const handleAddOption = () => {
    setOptions((prev) => [...prev, { id: `opt-${prev.length + 1}`, val: "" }]);
  };

  const handleRemoveOption = (idx) => {
    if (options.length <= 2) return;
    setOptions((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    const opts = options.map((o) => o.val.trim()).filter((v) => v);
    if (!title.trim()) { toast(t("titleRequired"), "error"); return; }
    if (opts.length < 2) { toast(t("atLeast2Options"), "error"); return; }
    if (!startIso || !endIso) { toast(t("startEndRequired"), "error"); return; }
    if (new Date(endIso) <= new Date(startIso)) { toast(t("endAfterStart"), "error"); return; }

    setSubmitting(true);
    try {
      let tierConfig = null;
      let tierWeights = null;
      if (mode === "tiered") {
        tierConfig = { main: tierMain, secondary: tierSecondary, normal: tierNormal };
        tierWeights = { main: weightMain, secondary: weightSecondary, normal: weightNormal };
      }

      const payload = {
        title: title.trim(),
        description: desc.trim(),
        startAt: startIso,
        endAt: endIso,
        mode,
        tierConfig,
        tierWeights,
        rulesText: mode === "tiered" ? rulesText : "",
        maxChoices: mode === "normal" ? maxChoices : 1,
        resultVisibility: resultVis,
        options: opts,
      };

      const created = await apiFetch("/api/admin/votes", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      toast(t("voteCreated"), "success");
      onCreated(created);
      onClose();
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal-header">
          <h2>{t("createVote")}</h2>
          <button className="btn-ghost" onClick={onClose}>{ICONS.x}</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label>{t("title")}</label>
            <input className="form-input" type="text" placeholder={t("enterVoteTitle")} value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="form-group">
            <label>{t("description")}</label>
            <textarea className="form-input" placeholder={t("describeVote")} value={desc} onChange={(e) => setDesc(e.target.value)} />
          </div>
          <div className="form-group">
            <label>{t("startTime")}</label>
            <input className="form-input" type="text" readOnly placeholder="YYYY-MM-DD HH:mm" value={startStr} onClick={() => setShowStartPicker(true)} />
          </div>
          <div className="form-group">
            <label>{t("endTime")}</label>
            <input className="form-input" type="text" readOnly placeholder="YYYY-MM-DD HH:mm" value={endStr} onClick={() => setShowEndPicker(true)} />
          </div>
          <div className="form-group" style={{ display: mode === "normal" ? "block" : "none" }}>
            <label>{t("maxChoicesPerVoter")}</label>
            <input className="form-input" type="number" value={maxChoices} min="1" onChange={(e) => setMaxChoices(parseInt(e.target.value) || 1)} />
          </div>
          <div className="form-group">
            <label>{t("voteMode")}</label>
            <div className={`select ${showModeMenu ? "open" : ""}`}>
              <button type="button" className="select-trigger" onClick={() => setShowModeMenu(!showModeMenu)}>
                <span className="select-trigger-text">{mode === "tiered" ? t("modeTiered") : t("modeNormal")}</span>
              </button>
              <div className="select-menu" style={{ display: showModeMenu ? "block" : "none" }}>
                <button type="button" className="select-option" onClick={() => { setMode("normal"); setShowModeMenu(false); }}>{t("modeNormal")}</button>
                <button type="button" className="select-option" onClick={() => { setMode("tiered"); setShowModeMenu(false); }}>{t("modeTiered")}</button>
              </div>
            </div>
          </div>
          <div className="form-group" style={{ display: mode === "tiered" ? "block" : "none" }}>
            <label>{t("tierConfigLabel")}</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              <input className="form-input" type="number" value={tierMain} min="0" onChange={(e) => setTierMain(parseInt(e.target.value) || 0)} />
              <input className="form-input" type="number" value={tierSecondary} min="0" onChange={(e) => setTierSecondary(parseInt(e.target.value) || 0)} />
              <input className="form-input" type="number" value={tierNormal} min="0" onChange={(e) => setTierNormal(parseInt(e.target.value) || 0)} />
            </div>
            <div style={{ marginTop: 6, color: "var(--text-muted)", fontSize: "0.85rem" }}>{t("tierConfigHint")}</div>
          </div>
          <div className="form-group" style={{ display: mode === "tiered" ? "block" : "none" }}>
            <label>{t("tierWeightsLabel")}</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              <input className="form-input" type="number" value={weightMain} min="0" onChange={(e) => setWeightMain(parseInt(e.target.value) || 0)} />
              <input className="form-input" type="number" value={weightSecondary} min="0" onChange={(e) => setWeightSecondary(parseInt(e.target.value) || 0)} />
              <input className="form-input" type="number" value={weightNormal} min="0" onChange={(e) => setWeightNormal(parseInt(e.target.value) || 0)} />
            </div>
            <div style={{ marginTop: 6, color: "var(--text-muted)", fontSize: "0.85rem" }}>{t("tierWeightsHint")}</div>
          </div>
          <div className="form-group" style={{ display: mode === "tiered" ? "block" : "none" }}>
            <label>{t("navRules")}</label>
            <textarea className="form-input" rows="4" value={rulesText} onChange={(e) => setRulesText(e.target.value)} placeholder={t("defaultRules")} />
          </div>
          <div className="form-group">
            <label>{t("resultVisibility")}</label>
            <div className={`select ${showVisMenu ? "open" : ""}`}>
              <button type="button" className="select-trigger" onClick={() => setShowVisMenu(!showVisMenu)}>
                <span className="select-trigger-text">{resultVis === "after_end" ? t("afterEnd") : t("afterVote")}</span>
              </button>
              <div className="select-menu" style={{ display: showVisMenu ? "block" : "none" }}>
                <button type="button" className="select-option" onClick={() => { setResultVis("after_vote"); setShowVisMenu(false); }}>{t("afterVote")}</button>
                <button type="button" className="select-option" onClick={() => { setResultVis("after_end"); setShowVisMenu(false); }}>{t("afterEnd")}</button>
              </div>
            </div>
          </div>
          <div className="form-group">
            <label>{t("options")}</label>
            <div className="option-inputs" id="option-inputs">
              {options.map((opt, idx) => (
                <div key={opt.id} className="option-input-row" data-idx={idx}>
                  <input className="form-input" type="text" placeholder={t("optionN", { n: idx + 1 })} value={opt.val} onChange={(e) => {
                    const next = [...options];
                    next[idx] = { ...next[idx], val: e.target.value };
                    setOptions(next);
                  }} />
                  {options.length > 2 && (
                    <button className="btn-remove" type="button" onClick={() => handleRemoveOption(idx)}>{ICONS.x}</button>
                  )}
                </div>
              ))}
            </div>
            <button className="btn btn-ghost btn-sm" onClick={handleAddOption} style={{ marginTop: 8 }}>
              {ICONS.plus}{t("addOption")}
            </button>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>{t("cancel")}</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? t("loading") : t("createBtn")}
          </button>
        </div>
      </div>

      {showStartPicker && (
        <DateTimePicker
          initialDate={startIso ? new Date(startIso) : new Date()}
          onConfirm={(d) => {
            setStartIso(d.toISOString());
            const y = d.getFullYear();
            const mo = String(d.getMonth() + 1).padStart(2, "0");
            const da = String(d.getDate()).padStart(2, "0");
            const hh = String(d.getHours()).padStart(2, "0");
            const mm = String(d.getMinutes()).padStart(2, "0");
            setStartStr(`${y}-${mo}-${da} ${hh}:${mm}`);
            setShowStartPicker(false);
          }}
          onCancel={() => setShowStartPicker(false)}
        />
      )}
      {showEndPicker && (
        <DateTimePicker
          initialDate={endIso ? new Date(endIso) : new Date()}
          onConfirm={(d) => {
            setEndIso(d.toISOString());
            const y = d.getFullYear();
            const mo = String(d.getMonth() + 1).padStart(2, "0");
            const da = String(d.getDate()).padStart(2, "0");
            const hh = String(d.getHours()).padStart(2, "0");
            const mm = String(d.getMinutes()).padStart(2, "0");
            setEndStr(`${y}-${mo}-${da} ${hh}:${mm}`);
            setShowEndPicker(false);
          }}
          onCancel={() => setShowEndPicker(false)}
        />
      )}
    </div>
  );
}
