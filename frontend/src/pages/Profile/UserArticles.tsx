import { useTranslation } from "react-i18next";
import "../../common/i18n/index";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { ArticleModel } from "../../types";
import { serviceHandler } from "../../scripts/serviceHandler";
import { agentsService } from "../../services";
import Pagination from "../../components/Pagination";
import DataLoader from "../../components/DataLoader";
import { getQueryOrDefault, useQuery } from "../../hooks/useQuery";
import ConfirmDialogModal from "../../components/ConfirmDialogModal";
import { useAuthNew } from "../../context/AuthProvider";
import { AuthService } from "../../services/AuthService";
import ic_no_search from "../../images/ic_no_search.jpeg";
import CardArticle from "../../components/Article/CardArticle";
import { showToast } from "../../scripts/toast";

export default function UserArticles() {

    const navigate = useNavigate()
    const { t } = useTranslation()
    const query = useQuery()

    const AuthContext = useAuthNew();
    const session = AuthService.getSessionFromContext(AuthContext)
    const isAgent = AuthService.isAgent(AuthContext)
    
    const [articles, setArticles] = useState<ArticleModel[]>(new Array(0))

    const [searchParams, setSearchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(false)

    const [maxPage, setMaxPage] = useState(0)
    const currentPage = useState<number>(
        !isNaN(parseInt(getQueryOrDefault(query, "page", "1"))) ?
            parseInt(getQueryOrDefault(query, "page", "1")) :
            1
    )
    const pageToShow = useState<number>(1)

    const onEdit = useState(false)

    useEffect(() => {
        document.title = `${t('PageName')} - ${t('PageTitles.userArticles')}`
    })

    useEffect(() => {
        setIsLoading(true)
        serviceHandler(
            agentsService.getArticles(session.id),
            navigate, (articles) => {
                setArticles(articles)
            },
            () => { setIsLoading(false) },
            () => { setArticles(new Array(0)) }
        )
    }, [])

    if (!isAgent) {
        showToast(t('Article.toast.forbiddenPage'), 'error');
        return <Navigate to="/" replace />
    }

    return (
        <DataLoader spinnerMultiplier={2} isLoading={isLoading}>
            <div className="container-fluid p-0 my-3 d-flex flex-column justify-content-center">
                {articles.length === 0 ? (
                    <div className="d-flex justify-content-center align-items-center">
                        <img src={ic_no_search} className="img-fluid me-3" alt="Imagen lupa" style={{ maxWidth: '150px' }} />
                        <h1 className="align-self-center">
                            {t('User.noArticles')}
                        </h1>
                    </div>
                ) : (
                    <>
                        <div className="d-flex justify-content-center align-items-center mb-4">
                            <h3 className="title">
                                {t('User.articlesTitle')}
                            </h3>
                        </div>
    
                        <div className="row mx-5 my-2 d-flex justify-content-center">
                            {articles.map((article) => (
                                <div className="col-12 col-md-6 col-lg-4 mb-3 d-flex justify-content-center" key={article.id}>
                                    <CardArticle article={article} isEditing={true} onEdit={onEdit} />
                                </div>
                            ))}
                        </div>
    
                        <div className="mt-auto d-flex justify-content-center align-items-center">
                            {maxPage > 1 && (
                                <Pagination
                                    maxPage={maxPage}
                                    currentPage={currentPage}
                                    pageToShow={pageToShow}
                                />
                            )}
                        </div>
                    </>
                )}
                <ConfirmDialogModal />
            </div>
        </DataLoader>
    );
}