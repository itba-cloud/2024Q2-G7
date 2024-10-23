import { useTranslation } from "react-i18next";
import "../../common/i18n/index";
import { useNavigate, useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { ReviewModel } from "../../types";
import { serviceHandler } from "../../scripts/serviceHandler";
import { reviewService } from "../../services";
import CardReview from "../../components/Review/CardReview";
import Pagination from "../../components/Pagination";
import DataLoader from "../../components/DataLoader";
import { getQueryOrDefault, useQuery } from "../../hooks/useQuery";
import { showToast } from "../../scripts/toast";
import ConfirmDialogModal from "../../components/ConfirmDialogModal";
import { validatePage } from "../../scripts/validations";
import { useAuthNew } from "../../context/AuthProvider";
import { AuthService } from "../../services/AuthService";
import ic_no_search from "../../images/ic_no_search.jpeg";

export default function UserReviews() {

    const navigate = useNavigate()
    const { t } = useTranslation()
    const query = useQuery()

    const AuthContext = useAuthNew();
    const session = AuthService.getSessionFromContext(AuthContext)
    
    const [reviews, setReviews] = useState<ReviewModel[]>(new Array(0))

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
        document.title = `${t('PageName')} - ${t('PageTitles.userReviews')}`
    })

    useEffect(() => {
        if (validatePage(maxPage, pageToShow[0], currentPage[0])) {
            setIsLoading(true)
            serviceHandler(
                reviewService .getUserReviews(session.id, currentPage[0] === 0 ? 1 : currentPage[0]),
                navigate, (reviews) => {
                    setReviews(reviews.getContent())
                    setMaxPage(reviews ? reviews.getMaxPage() : 0)
                    if (currentPage[0] <= 0) {
                        pageToShow[1](currentPage[0])
                        searchParams.set("page", "1")
                        currentPage[1](1)
                    } else if (currentPage[0] > reviews.getMaxPage()) {
                        pageToShow[1](currentPage[0])
                        searchParams.set("page", reviews.getMaxPage().toString())
                        currentPage[1](reviews.getMaxPage())
                    } else {
                        pageToShow[1](currentPage[0])
                        searchParams.set("page", currentPage[0].toString())
                    }
                    setSearchParams(searchParams)
                },
                () => {
                    setIsLoading(false)
                },
                () => {
                    setReviews(new Array(0))
                    setMaxPage(1)
                }
            )
        }
    }, [currentPage[0], onEdit[0]])

    return (
        <DataLoader spinnerMultiplier={2} isLoading={isLoading}>
            <div className="container-fluid p-0 my-3 d-flex flex-column justify-content-center">
                {reviews.length === 0 ? (
                    <div className="d-flex justify-content-center align-items-center">
                        <img src={ic_no_search} className="img-fluid me-3" alt="Imagen lupa" style={{ maxWidth: '150px' }} />
                        <h1 className="align-self-center">
                            {t('User.noReviews')}
                        </h1>
                    </div>
                ) : (
                    <>
                        <div className="d-flex justify-content-center align-items-center mb-4">
                            <h3 className="title">
                                {t('User.reviewsTitle')}
                            </h3>
                        </div>
    
                        <div className="row mx-5 my-2 d-flex justify-content-center">
                            {reviews.map((review) => (
                                <div className="col-12 col-md-6 col-lg-4 mb-3 d-flex justify-content-center" key={review.id}>
                                    <CardReview reviewModel={review} isEditing={true} onEdit={onEdit} />
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