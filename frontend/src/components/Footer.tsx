import { useTranslation } from "react-i18next";
import "../common/i18n/index";

export default function Footer() {

    const { t } = useTranslation()
    const date = new Date().getFullYear()

    return (
        <div className="footer container-fluid p-0 mt-auto d-flex justify-content-center align-items-center font-weight-bold">
            <p className="align-self-center m-0">{t('Copyright', { year: date })}</p>
        </div>
    );
}