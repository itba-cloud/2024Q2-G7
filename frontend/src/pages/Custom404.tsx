import { useTranslation } from "react-i18next";
import "../common/i18n/index";
import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function Custom404() {

    const { t } = useTranslation()

    useEffect(() => {
        document.title = `${t('PageName')} - ${t('PageTitles.custom404')}`
    }, [])

    return (
        <div className="container-fluid p-0 h-100 d-flex justify-content-center align-items-center">
            <div className="container-fluid p-0 d-flex flex-column justify-content-center align-items-center"
                style={{ width: "60%" }}>
                <h1 className="font-weight-bold m-0" style={{ fontSize: "15vh" }}>
                    {t('404.title')}
                </h1>
                <h1 className="font-weight-bold text-center" style={{ fontSize: "5vh;" }}>
                    <span style={{ color: "red" }}>{t('Error.whoops')}</span>
                    {' '}{t('404.description')}
                </h1>
                <Link to="/">
                    <button type="button" className="btn btn-error" aria-label={t("AriaLabel.home")} title={t("AriaLabel.home")}>
                        {t('Error.backBtn')}
                    </button>
                </Link>
            </div>
        </div>
    );

}