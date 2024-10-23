import { useTranslation } from "react-i18next";
import "../common/i18n/index";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { showToast } from "../scripts/toast";
import { AuthService } from "../services/AuthService";
import { useAuthNew } from "../context/AuthProvider";

export default function Error() {

    const { t } = useTranslation()
    const location = useLocation();
    const AuthContext = useAuthNew();
    const { code, message } = location.state || {};

    useEffect(() => {
        if (code === 401) {
            //signOut(() => { })
            AuthService.logout(AuthContext)
            showToast(t('User.toast.sessionExpired'), 'error')
        }
        document.title = `${t('PageName')} - ${t('PageTitles.error')}`
    }, [])


    return (
        <div className="container-fluid p-0 h-100 d-flex justify-content-center align-items-center">
            <div className="container-fluid p-0 d-flex flex-column justify-content-center align-items-center"
                style={{ width: "60%" }}>
                <h1 className="font-weight-bold m-0" style={{ fontSize: "15vh" }}>
                    {t('Error.title', { errorCode: code })}
                </h1>
                <h1 className="font-weight-bold text-center" style={{ fontSize: "5vh" }}>
                    <span style={{ color: "red" }}>{t('Error.whoops')}</span>
                    {' '}{message}
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