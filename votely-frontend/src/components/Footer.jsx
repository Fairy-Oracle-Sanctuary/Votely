import { t } from "../utils/i18n";

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="container">
        <p>{t("footerText")}</p>
      </div>
    </footer>
  );
}
