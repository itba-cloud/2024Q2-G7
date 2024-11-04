import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { showToast } from "../scripts/toast";
import { useTranslation } from "react-i18next";
import { useAuthNew } from "../context/AuthProvider";
import { AuthService } from "../services/AuthService";

export default function RequireNoAuth({ children }: { children: JSX.Element }) {

    const { t } = useTranslation()
    const navigate = useNavigate()

    const AuthContext = useAuthNew();
    const session = AuthService.getSessionFromContext(AuthContext);

    /* useEffect(() => {
        AuthService.getSession()
        .then((session) => {
            console.log("requiereNoAuth:", session);
            if (session != null) {
                navigate("/", { replace: true });
                showToast(t('User.toast.alreadySigned'), 'error')
            }
        })
        .catch((error) => {
            console.log("use requiereNoAuth ERROR", error)
        });
        //if (readUser) {
        //    navigate("/", { replace: true });
        //    showToast(t('User.toast.alreadySigned'), 'error')
        //} 
    }, []) */

    if (session) {
        console.log("RequiereNoAuth - HAY SESSION - BIEN :)")
        showToast(t('User.toast.alreadySigned'), 'error')
        return <Navigate to="/" replace />;
    }

    return children;
}