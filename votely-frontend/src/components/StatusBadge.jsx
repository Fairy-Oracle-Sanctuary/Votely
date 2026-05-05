import { statusLabel } from "../utils/i18n";

export default function StatusBadge({ status }) {
  return (
    <span className={`badge badge-${status}`}>
      <span className="badge-dot"></span>
      {statusLabel(status)}
    </span>
  );
}
