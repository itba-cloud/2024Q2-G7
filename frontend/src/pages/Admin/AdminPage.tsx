import { Navigate, Outlet } from "react-router-dom"
import { showToast } from "../../scripts/toast";
import { useTranslation } from "react-i18next";
import { AuthService } from "../../services/AuthService";
import { useAuthNew } from "../../context/AuthProvider";

export default function AdminPage() {

    const { t } = useTranslation()

    const AuthContext = useAuthNew();
    const session = AuthService.getSessionFromContext(AuthContext);
    const isAdmin = AuthService.isAdmin(AuthContext)

    if (!session) {
        showToast(t('User.toast.notSigned'), 'error');
        return <Navigate to="/login" replace />
    }

    if (!isAdmin) {
        showToast(t('Admin.toast.forbidden'), 'error');
        return <Navigate to="/" replace />
    }

    return (
        <Outlet />
    )

}

