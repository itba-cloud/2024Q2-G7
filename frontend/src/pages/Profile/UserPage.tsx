import { Location, Navigate, Outlet, To, useLocation, useNavigate } from "react-router-dom"
//import { useAuth } from "../../hooks/useAuth"
import { showToast } from "../../scripts/toast";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AuthService } from "../../services/AuthService";
import { useAuthNew } from "../../context/AuthProvider";

function getCorrectPrivilegeRoute(location: Location): To {
    const startsWithUserOrError = location.pathname.startsWith("/user") || location.pathname.startsWith("/error")
    return startsWithUserOrError ? location : "/";
}

export default function UserPage() {

    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const correctRoute = getCorrectPrivilegeRoute(location)

    const AuthContext = useAuthNew();
    const session = AuthService.getSessionFromContext(AuthContext);
    const isAdmin = AuthService.isAdmin(AuthContext)
    //const [isLogged, setIsLogged] = useState<boolean | null>(null);
    
    /* useEffect(() => {
        AuthService.getSession()
        .then((session) => {
            console.log("userPage:", session);
            if (!session) {
                showToast(t('User.toast.notSigned'), 'error');
                navigate("/login", { replace: true, state: { from: correctRoute } });
                setIsLogged(false);
            } else {
                setIsLogged(true);
            }
        })
        .catch((error) => {
            console.error("userPage ERROR", error);
            setIsLogged(false);
        });
    }, []); */

    /* if (isLogged === null) {
        return null;
    } */

    if (!session) {
        showToast(t('User.toast.notSigned'), 'error');
        return <Navigate to="/login" state={{ from: correctRoute }} replace />
    }

    if (isAdmin) {
        showToast(t('Admin.toast.forbidden'), 'error');
        return <Navigate to="/" replace />
    }

    if (getCorrectPrivilegeRoute(location) !== location) {
        return <Navigate to={correctRoute} />
    }

    return (
        <Outlet />
    )

}

