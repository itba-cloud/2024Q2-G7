import { useTranslation } from "react-i18next";
import "../../common/i18n/index";
import { ExperienceModel, ReviewModel } from "../../types";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import CardExperienceDetails from "../../components/Experience/CardExperienceDetails";
import CardReview from "../../components/Review/CardReview";
import { serviceHandler } from "../../scripts/serviceHandler";
import { experienceService, reviewService } from "../../services";
import Pagination from "../../components/Pagination";
import DataLoader from "../../components/DataLoader";
import { getQueryOrDefault, useQuery } from "../../hooks/useQuery";
import { showToast } from "../../scripts/toast";
import Map from "../../components/Experience/Map";
import { validatePage } from "../../scripts/validations";
import { useAuthNew } from "../../context/AuthProvider";
import { AuthService } from "../../services/AuthService";
import ReviewModalForm, { FormDataReview } from "../../components/Review/ReviewModalForm";

export default function ExperienceDetails() {

    const { t } = useTranslation()
    const navigate = useNavigate()
    const query = useQuery()
    const [searchParams, setSearchParams] = useSearchParams();

    const AuthContext = useAuthNew();
    const isLogged = AuthService.isLoggedIn(AuthContext)

    const location = useLocation();
    const experienceFromState = location.state?.experience; 

    const [experience, setExperience] = useState<ExperienceModel | undefined>(undefined)
    const { experienceId } = useParams<{experienceId: string}>()
    let parsedExperienceId = ""
    if (typeof experienceId === "string" ) {
        parsedExperienceId = experienceId;
    } 

    const [reviews, setReviews] = useState<ReviewModel[]>(new Array(0))

    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingReviews, setIsLoadingReviews] = useState(false)
    const [showModalReview, setShowModalReview] = useState(false);

    const [maxPage, setMaxPage] = useState(0)
    const currentPage = useState<number>(
        !isNaN(parseInt(getQueryOrDefault(query, "page", "1"))) ?
            parseInt(getQueryOrDefault(query, "page", "1")) :
            1
    )
    const pageToShow = useState<number>(1)

    useEffect(() => {
        setIsLoading(true);
        if (experienceFromState) {
            setExperience(experienceFromState);
            document.title = `${t('PageName')} - ${t('PageTitles.experienceDetails', { experienceName: experienceFromState.name })}`;
            setIsLoading(false); 
        } else {
            serviceHandler(
                experienceService.getExperienceById(parsedExperienceId, true),
                navigate, (experience) => {
                    setExperience(experience);
                    document.title = `${t('PageName')} - ${t('PageTitles.experienceDetails', { experienceName: experience.name })}`;
                },
                () => { setIsLoading(false); },
                () => { setExperience(undefined); }
            );
        }
    }, []);

    useEffect(() => {
        if (experience?.reviewCount !== 0) {
            setIsLoadingReviews(true);
            if (validatePage(maxPage, pageToShow[0], currentPage[0])) {
                serviceHandler(
                    reviewService.getExperienceReviews(parsedExperienceId, currentPage[0] === 0 ? 1 : currentPage[0]),
                    navigate, (fetchedExperienceReviews) => {
                        setReviews(fetchedExperienceReviews.getContent())
                        setMaxPage(fetchedExperienceReviews ? fetchedExperienceReviews.getMaxPage() : 0)
                        if (currentPage[0] <= 0) {
                            pageToShow[1](currentPage[0])
                            searchParams.set("page", "1")
                            currentPage[1](1)
                        } else if (currentPage[0] > fetchedExperienceReviews.getMaxPage()) {
                            pageToShow[1](currentPage[0])
                            searchParams.set("page", fetchedExperienceReviews.getMaxPage().toString())
                            currentPage[1](fetchedExperienceReviews.getMaxPage())
                        } else {
                            pageToShow[1](currentPage[0])
                            searchParams.set("page", currentPage[0].toString())
                        }
                        setSearchParams(searchParams)
                    },
                    () => { setIsLoadingReviews(false); },
                    () => {
                        setReviews(new Array(0))
                        setMaxPage(0)
                    }
                )
            }
        }
    }, [currentPage[0]])

    function attemptAccessCreateReview() {
        if (!isLogged) {
            navigate("/login", { replace: true })
            showToast(t('Review.toast.forbidden.noUser'), 'error')
        } else {
            setShowModalReview(true);
        } 
    }

    const handleCreateReview = (data: FormDataReview) => {
        //TODO use serviceHandler
        reviewService.postNewReview(data.title, data.description, data.score, parsedExperienceId, undefined)
            .then((result) => {
                if (!result.hasFailed()) {
                    setShowModalReview(false);
                    navigate(`/experiences/${parsedExperienceId}`, { replace: true })
                    showToast(t('Review.toast.createSuccess', { reviewTitle: data.title }), 'success')
                }
                if (result.getStatusCode() === 400) showToast(t('Review.toast.alreadyCreate'), 'error')
            })
            .catch(() => {
                showToast(t('Review.toast.createError', { reviewTitle: data.title }), 'error')
            })
    };

    const handleCancelReview = () => {
        setShowModalReview(false);
    };

    return (
        <>
            {isLoading ? 
                <DataLoader spinnerMultiplier={2} isLoading={isLoading && isLoadingReviews}>
                    <div></div>
                </DataLoader>
            : 
                <div className={`container-fluid px-5 d-flex flex-column ${showModalReview ? 'modal-open' : ''}`}>
                    <div className="content-blur d-flex flex-column flex-md-row flex-fill" style={{ overflow: 'hidden' }}>
                        
                        {/* Tarjeta de experiencia */}
                        <div className="d-flex flex-column my-4" style={{ flex: "1 1 50%", maxWidth: "100%" }}>
                            {experience !== undefined && (
                                <CardExperienceDetails 
                                    experience={experience} 
                                />
                            )}
                        </div>

                        {/* Reseñas y mapa */}
                        <div className="d-flex flex-column my-4" style={{ flex: "1 1 50%", maxWidth: "100%", overflowY: 'auto' }}>
                            {experience !== undefined &&
                                <Map experience={experience}
                            />}
    
                            <div className="d-flex flex-column flex-fill pt-4 px-3" style={{ overflowY: 'hidden', flexGrow: 1 }}>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h2 className="m-0">
                                        {t('ExperienceDetail.review')}
                                    </h2>
                                    <button 
                                        type="button" 
                                        className="btn button-primary" 
                                        aria-label={t("AriaLabel.writeReview")} 
                                        title={t("AriaLabel.writeReview")}
                                        onClick={() => attemptAccessCreateReview()}
                                    >
                                        {t('ExperienceDetail.writeReview')}
                                    </button>
                                </div>

                                <div className="d-flex flex-column" style={{ flexGrow: 1, overflowY: 'auto', maxHeight: "500px" }}>
                                    {reviews.length === 0 ? (
                                        <div className="d-flex justify-content-center mb-2" style={{ fontSize: "x-large" }}>
                                            {t('ExperienceDetail.noReviews')}
                                        </div>
                                    ) : (
                                        <div className="d-flex flex-wrap justify-content-start">
                                            {reviews.map((review) => (
                                                <div 
                                                    className="review-card p-2" 
                                                    key={review.id} 
                                                    style={{ flex: "1 1 calc(50% - 16px)", minWidth: "300px", margin: "8px" }}
                                                >
                                                    <CardReview reviewModel={review} isEditing={false} />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Paginación */}
                                {/* {experience?.reviewCount !== 0 && reviews.length !== 0 && maxPage > 1 && (
                                    <div className="d-flex justify-content-center align-items-center mt-3">
                                        <Pagination
                                            maxPage={maxPage}
                                            currentPage={currentPage}
                                            pageToShow={pageToShow}
                                        />
                                    </div>
                                )} */}
                            </div>
                        </div>
                    </div>

                    {showModalReview && (
                        <ReviewModalForm
                            review={undefined}
                            onSave={handleCreateReview}
                            onCancel={handleCancelReview}
                            experience={experience}
                        />
                    )}
                </div>
            }
        </>
    );
}