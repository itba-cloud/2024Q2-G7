import {useTranslation} from "react-i18next"
import "../common/i18n/index"
import {useEffect} from "react"
import { useAuthNew } from "../context/AuthProvider"
import ConfirmDialogModal from "../components/ConfirmDialogModal"
import { AuthService } from "../services/AuthService"
import HomeAdmin from "../components/Home/HomeAdmin"
import HomeTurist from "../components/Home/HomeTurist"
import HomeAnonymous from "../components/Home/HomeAnonymous"

export default function Home() {

    const {t} = useTranslation()

    const AuthContext = useAuthNew();
    const session = AuthService.getSessionFromContext(AuthContext);
    const isLogged = AuthService.isLoggedIn(AuthContext);
    const isAdmin = AuthService.isAdmin(AuthContext);

    useEffect(() => {
        document.title = `${t('PageName')}`
    }, [])

    return (
        <>
            <div className="my-2">
                {(isLogged || session) ?
                    <>
                        {isAdmin ?
                            <HomeAdmin/>
                            :
                            /* TODO poner esto cuando tengamos recomendados */
                            /* <HomeTurist/> */
                            <HomeAnonymous/>
                        }
                    </>
                    :
                    <HomeAnonymous/>
                }
            </div>
            <ConfirmDialogModal />
        </>
    )
}