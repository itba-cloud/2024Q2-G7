import {useTranslation} from "react-i18next"
import "../../common/i18n/index"
import {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom"
import { ExperienceModel } from "../../types"
import { serviceHandler } from "../../scripts/serviceHandler"
import { userService } from "../../services"
import DataLoader from "../DataLoader"
import { useAuthNew } from "../../context/AuthProvider"
import { AuthService } from "../../services/AuthService"
import Carousel from "../Carousel"

export default function HomeTurist() {

    const {t} = useTranslation()
    const navigate = useNavigate()

    const AuthContext = useAuthNew();
    const session = AuthService.getSessionFromContext(AuthContext);

    const [experiencesViewed, setExperiencesViewed] = useState<ExperienceModel[]>(new Array(0))
    const [experiencesByFavs, setExperiencesByFavs] = useState<ExperienceModel[]>(new Array(0))
    const [experiencesByReviews, setExperiencesByReviews] = useState<ExperienceModel[]>(new Array(0))
    
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        serviceHandler(
            userService.getUserViewedExperiences(session.id),
            navigate, (experiencesViewed) => { setExperiencesViewed(experiencesViewed) },
            () => {},
            () => setExperiencesViewed(new Array(0))
        )
        serviceHandler(
            userService.getUserRecommendationsByFavs(session.id),
            navigate, (experiencesByFavs) => { setExperiencesByFavs(experiencesByFavs) },
            () => { },
            () => setExperiencesByFavs(new Array(0))
        )
        serviceHandler(
            userService.getUserRecommendationsByReviews(session.id),
            navigate, (experiencesByReviews) => { setExperiencesByReviews(experiencesByReviews) },
            () => { setIsLoading(false) },
            () => setExperiencesByReviews(new Array(0))
        )
    }, [])

    return (
        <DataLoader spinnerMultiplier={2} isLoading={isLoading}>
            <>
                <Carousel title={t('Landing.user.viewed')} experiences={experiencesViewed} show={3}/>
                <Carousel title={t('Landing.user.recommendedByFavs')} experiences={experiencesByFavs} show={3}/>
                <Carousel title={t('Landing.user.recommendedByReviews')} experiences={experiencesByReviews} show={3}/>
            </>
        </DataLoader>
    )
}