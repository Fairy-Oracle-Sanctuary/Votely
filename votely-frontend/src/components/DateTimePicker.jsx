import { useState } from "react";
import { ICONS } from "../utils/icons";
import { t, getLang } from "../utils/i18n";

function startOfMonth(d) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function daysInMonth(d) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

export default function DateTimePicker({ initialDate, onConfirm, onCancel }) {
  const lang = getLang();
  const [selected, setSelected] = useState(initialDate ? new Date(initialDate.getTime()) : new Date());
  const [view, setView] = useState(startOfMonth(initialDate || new Date()));
  const [hour, setHour] = useState(selected.getHours());
  const [minute, setMinute] = useState(selected.getMinutes());

  const first = startOfMonth(view);
  const startWeekday = (first.getDay() + 6) % 7;
  const dim = daysInMonth(view);

  const monthLabel = view.toLocaleString(lang === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "long",
  });

  const days = [];
  for (let i = 0; i < startWeekday; i++) days.push(null);
  for (let day = 1; day <= dim; day++) days.push(day);
  while (days.length % 7 !== 0) days.push(null);

  const weekdays = lang === "zh"
    ? ["\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D", "\u65E5"]
    : ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  const handleDayClick = (day) => {
    const newDate = new Date(selected);
    newDate.setFullYear(view.getFullYear(), view.getMonth(), day);
    setSelected(newDate);
  };

  const handlePrevMonth = () => {
    setView(new Date(view.getFullYear(), view.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setView(new Date(view.getFullYear(), view.getMonth() + 1, 1));
  };

  const handleOk = () => {
    const h = clamp(hour, 0, 23);
    const m = clamp(minute, 0, 59);
    const d = new Date(selected);
    d.setHours(h, m, 0, 0);
    onConfirm(d);
  };

  const isSelected = (day) =>
    selected.getFullYear() === view.getFullYear() &&
    selected.getMonth() === view.getMonth() &&
    selected.getDate() === day;

  return (
    <div className="dtp-overlay">
      <div className="dtp-backdrop" onClick={onCancel}></div>
      <div className="dtp-panel" role="dialog" aria-modal="true">
        <div className="dtp-header">
          <button type="button" className="btn btn-ghost btn-sm" onClick={handlePrevMonth}>
            {ICONS.arrowLeft}
          </button>
          <div className="dtp-title">{monthLabel}</div>
          <button type="button" className="btn btn-ghost btn-sm" onClick={handleNextMonth}
            style={{ transform: "rotate(180deg)" }}>
            {ICONS.arrowLeft}
          </button>
        </div>

        <div className="dtp-week">
          {weekdays.map((w) => (
            <div key={w} className="dtp-weekday">{w}</div>
          ))}
        </div>

        <div className="dtp-grid">
          {days.map((day, i) => {
            if (!day) return <div key={`e${i}`} className="dtp-day empty"></div>;
            return (
              <button
                key={day}
                type="button"
                className={`dtp-day ${isSelected(day) ? "selected" : ""}`}
                onClick={() => handleDayClick(day)}
              >
                {day}
              </button>
            );
          })}
        </div>

        <div className="dtp-time">
          <div className="dtp-time-col">
            <label className="dtp-time-label">{lang === "zh" ? "\u65F6" : "Hour"}</label>
            <input
              className="form-input"
              type="number"
              min="0"
              max="23"
              value={hour}
              onChange={(e) => setHour(clamp(parseInt(e.target.value || "0"), 0, 23))}
            />
          </div>
          <div className="dtp-time-col">
            <label className="dtp-time-label">{lang === "zh" ? "\u5206" : "Minute"}</label>
            <input
              className="form-input"
              type="number"
              min="0"
              max="59"
              value={minute}
              onChange={(e) => setMinute(clamp(parseInt(e.target.value || "0"), 0, 59))}
            />
          </div>
        </div>

        <div className="dtp-footer">
          <button type="button" className="btn btn-outline" onClick={onCancel}>{t("cancel")}</button>
          <button type="button" className="btn btn-primary" onClick={handleOk}>OK</button>
        </div>
      </div>
    </div>
  );
}
