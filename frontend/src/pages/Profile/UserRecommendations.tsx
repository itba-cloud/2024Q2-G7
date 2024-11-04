import { useTranslation } from "react-i18next";
import "../../common/i18n/index";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { ExperienceModel } from "../../types";
import { serviceHandler } from "../../scripts/serviceHandler";
import { agentsService } from "../../services";
import Pagination from "../../components/Pagination";
import DataLoader from "../../components/DataLoader";
import { getQueryOrDefault, useQuery } from "../../hooks/useQuery";
import ConfirmDialogModal from "../../components/ConfirmDialogModal";
import { useAuthNew } from "../../context/AuthProvider";
import { AuthService } from "../../services/AuthService";
import ic_no_search from "../../images/ic_no_search.jpeg";
import { showToast } from "../../scripts/toast";
import CardExperience from "../../components/Experience/CardExperience";

export default function UserRecommendations() {

    const navigate = useNavigate()
    const { t } = useTranslation()
    const query = useQuery()

    const AuthContext = useAuthNew();
    const session = AuthService.getSessionFromContext(AuthContext)
    const isAgent = AuthService.isAgent(AuthContext)
    
    const [experienceRecommended, setExperienceRecommended] = useState<ExperienceModel[]>(new Array(0))

    const [searchParams, setSearchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(false)

    /* const [maxPage, setMaxPage] = useState(0)
    const currentPage = useState<number>(
        !isNaN(parseInt(getQueryOrDefault(query, "page", "1"))) ?
            parseInt(getQueryOrDefault(query, "page", "1")) :
            1
    )
    const pageToShow = useState<number>(1) */

    const onEdit = useState(false)

    useEffect(() => {
        document.title = `${t('PageName')} - ${t('PageTitles.userRecommendations')}`
        if (session !== null) {
            setExperienceRecommended(AuthService.getRecommended(AuthContext))
        }
    })

    /* useEffect(() => {
        setIsLoading(true)
        serviceHandler(
            agentsService.getAgentRecommendations(session.id),
            navigate, (recommended) => {
                setExperienceRecommended(recommended)
            },
            () => { setIsLoading(false) },
            () => { setExperienceRecommended(new Array(0)) }
        )
    }, []) */

    if (!isAgent) {
        showToast(t('Article.toast.forbiddenPage'), 'error');
        return <Navigate to="/" replace />
    }

    return (
        <DataLoader spinnerMultiplier={2} isLoading={isLoading}>
            <div className="container-fluid p-0 my-3 d-flex flex-column justify-content-center">
                {experienceRecommended.length === 0 ? (
                    <div className="d-flex justify-content-center align-items-center">
                        <img src={ic_no_search} className="img-fluid me-3" alt="Imagen lupa" style={{ maxWidth: '150px' }} />
                        <h1 className="align-self-center">
                            {t('User.noRecommended')}
                        </h1>
                    </div>
                ) : (
                    <>
                        <div className="d-flex justify-content-center align-items-center mb-4">
                            <h3 className="title">
                                {t('User.recommendedTitle')}
                            </h3>
                        </div>
    
                        <div className="row mx-5 my-2 d-flex justify-content-center">
                            {experienceRecommended.map((experience) => (
                                <div className="col-12 col-md-6 col-lg-4 mb-3 d-flex justify-content-center" key={experience.id}>
                                    <CardExperience experience={experience} key={experience.id} /* categoryProp={dummyCategoryProp} */ /* nameProp={dummyNameProp} */ fav={false} recommended={true} />
                                </div>
                            ))}
                        </div>
    
                        {/* <div className="mt-auto d-flex justify-content-center align-items-center">
                            {maxPage > 1 && (
                                <Pagination
                                    maxPage={maxPage}
                                    currentPage={currentPage}
                                    pageToShow={pageToShow}
                                />
                            )}
                        </div> */}
                    </>
                )}
                <ConfirmDialogModal />
            </div>
        </DataLoader>
    );
}