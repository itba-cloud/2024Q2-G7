import {useEffect} from "react";
import { AuthService } from "../services/AuthService";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuthNew } from "../context/AuthProvider";
import { showToast } from "../scripts/toast";
import { useTranslation } from "react-i18next";

export default function RequireAuth({children}: { children: JSX.Element }) {

    const { t } = useTranslation()
    const navigate = useNavigate()
    
    const AuthContext = useAuthNew();
    const session = AuthService.getSessionFromContext(AuthContext);
    const isAdmin = AuthService.isAdmin(AuthContext)

    /* useEffect(() => {
        AuthService.getSession()
        .then((session) => {
            console.log("requiereAuth:", session);
            if(session == null) {
                navigate("/login", { replace: true });
            }
        })
        .catch((error) => {
            console.log("use requiereAuth ERROR", error)
        });
        //if (readUser) {
        //    signIn( () => {})
        //} else {
        //    signOut(() => {})
        //}
    }, []) */

    if (!session) {
        showToast(t('User.toast.notSigned'), 'error');
        return <Navigate to="/login" replace />;
    }

    if (isAdmin) {
        showToast(t('Admin.toast.forbidden'), 'error');
        return <Navigate to="/" replace />
    }

    return children;
}