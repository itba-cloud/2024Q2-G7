import "../../common/i18n/index";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { serviceHandler } from "../../scripts/serviceHandler";
import DataLoader from "../../components/DataLoader";
import { AgentModel, ArticleModel, ReviewModel } from "../../types";
import { agentsService, reviewService } from "../../services";
import { useAuthNew } from "../../context/AuthProvider";
import { AuthService } from "../../services/AuthService";
import { showToast } from "../../scripts/toast";
import { getQueryOrDefault, useQuery } from "../../hooks/useQuery";
import CardAgentDetails from "../../components/Agent/CardAgentDetails";
import ReviewModalForm, { FormDataReview } from "../../components/Review/ReviewModalForm";
import { validatePage } from "../../scripts/validations";
import CardReviewAgent from "../../components/Review/CardReviewAgent";

export default function AgentDetails() {

    const { t } = useTranslation()
    const navigate = useNavigate()
    const query = useQuery()
    const [searchParams, setSearchParams] = useSearchParams();

    const AuthContext = useAuthNew();
    const isLogged = AuthService.isLoggedIn(AuthContext)

    const location = useLocation();
    const agentFromState = location.state?.agent; 

    const [agent, setAgent] = useState<AgentModel | undefined>(undefined)
    const { agentId } = useParams<{ agentId: string }>()
    let parsedAgentId = ""
    if (typeof agentId === "string") {
        parsedAgentId = agentId;
    }

    const [reviews, setReviews] = useState<ReviewModel[]>(new Array(0))
    const [articles, setArticles] = useState<ArticleModel[]>(new Array(0))

    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingReviews, setIsLoadingReviews] = useState(false)
    const [showModalReviewAgent, setShowModalReviewAgent] = useState(false);

    const [maxPage, setMaxPage] = useState(0)
    const currentPage = useState<number>(
        !isNaN(parseInt(getQueryOrDefault(query, "page", "1"))) ?
            parseInt(getQueryOrDefault(query, "page", "1")) :
            1
    )
    const pageToShow = useState<number>(1)

    function attemptAccessCreateTestimonial() {
        if (!isLogged) {
            navigate("/login", { replace: true })
            showToast(t('Testimonial.toast.forbidden.noUser'), 'error')
        } else {
            setShowModalReviewAgent(true);
        } 
    }

    const handleCreateReviewAgent = (data: FormDataReview) => {
        //TODO use serviceHandler
        reviewService.postNewReview(data.title, data.description, data.score, undefined, parsedAgentId)
            .then((result) => {
                if (!result.hasFailed()) {
                    setShowModalReviewAgent(false);
                    navigate(`/agents/${parsedAgentId}`, { replace: true })
                    showToast(t('Testimonial.toast.createSuccess', { title: data.title }), 'success')
                }
                if (result.getStatusCode() === 400) showToast(t('Testimonial.toast.alreadyCreate'), 'error')
            })
            .catch(() => {
                showToast(t('Testimonial.toast.createError', { title: data.title }), 'error')
            })
    };

    const handleCancelReviewAgent = () => {
        setShowModalReviewAgent(false);
    };

    useEffect(() => {
        setIsLoading(true)
        if (agentFromState) {
            setAgent(agentFromState);
            document.title = `${t('PageName')} - ${t('PageTitles.agentDetails', { agentName: agentFromState?.name })}`
            setIsLoading(false); 
        } else {
            serviceHandler(
                agentsService.getAgentById(parsedAgentId),
                navigate, (agent) => {
                    setAgent(agent)
                    document.title = `${t('PageName')} - ${t('PageTitles.agentDetails', { agentName: agent?.name })}`
                },
                () => {  },
                () => { setAgent(undefined) }
            )
            serviceHandler(
                agentsService.getArticles(parsedAgentId),
                navigate, (articles) => {
                    setArticles(articles)
                },
                () => { setIsLoading(false) },
                () => { setArticles(new Array(0)) }
            )
        }
    }, []) 
 
    useEffect(() => {
        if (agent?.reviewCount !== 0) {
            setIsLoadingReviews(true);
            if (validatePage(maxPage, pageToShow[0], currentPage[0])) {
                serviceHandler(
                    reviewService.getAgentReviews(parsedAgentId, currentPage[0] === 0 ? 1 : currentPage[0]),
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

    return (
        <>
            {isLoading ? 
                <DataLoader spinnerMultiplier={2} isLoading={isLoading && isLoadingReviews}>
                    <div></div>
                </DataLoader>
            : 
                <div className={`container my-4 h-100 ${showModalReviewAgent ? 'modal-open' : ''}`}>
                    <div className="content-blur">
                        <div className="row" style={{ display: "flex", alignItems: "stretch" }}>
                            {/* Columna izquierda: Información del agente */}
                            <div className="col-12 col-lg-7 mb-4">
                                {agent !== undefined && (
                                    <CardAgentDetails agent={agent} />
                                )}
                            </div>
                
                            {/* Columna derecha: Testimonios */}
                            <div className="col-12 col-lg-5 mb-4" style={{ display: "flex", flexDirection: "column" }}>
                                <div className="card profile-reviews p-4 shadow-sm h-100" style={{ borderRadius: "15px", flexGrow: 1, minHeight: "100%", maxHeight: "400px", overflowY: "auto" }}>
                                    <div className="d-flex justify-items-center w-100">
                                        <button type="button" className='btn button-primary mb-3 mx-auto w-100' style={{maxWidth: "fit-content"}}
                                            aria-label={t("Agents.writeTestimonial")} title={t("Agents.writeTestimonial")}
                                            onClick={() => attemptAccessCreateTestimonial()}>
                                            {t('Agents.writeTestimonial')}
                                        </button>
                                    </div>

                                    {reviews.length === 0 ? (
                                        <div className="d-flex justify-content-center mb-2" style={{ fontSize: "x-large" }}>
                                            {t('Agents.noTestimonials')}
                                        </div>
                                    ) : (
                                        <>
                                            {reviews.map((review) => (
                                                <CardReviewAgent reviewModel={review} isEditing={false}/>
                                            ))}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {showModalReviewAgent && (
                            <ReviewModalForm
                                review={undefined}
                                onSave={handleCreateReviewAgent}
                                onCancel={handleCancelReviewAgent}
                                agent={agent}
                            />
                        )}
                </div>
            }
        </>
    );
}
