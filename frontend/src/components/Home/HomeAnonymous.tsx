import {useTranslation} from "react-i18next"
import "../../common/i18n/index"
import {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom"
import { ExperienceModel } from "../../types"
import { serviceHandler } from "../../scripts/serviceHandler"
import { experienceService } from "../../services"
import DataLoader from "../DataLoader"
import Carousel from "../Carousel"

export default function HomeAnonymous() {

    const {t} = useTranslation()
    const navigate = useNavigate()

    const [experiencesLastAdded, setExperiencesLastAdded] = useState<ExperienceModel[]>(new Array(0))
    const [experiencesAdventure, setExperiencesAdventure] = useState<ExperienceModel[]>(new Array(0))
    const [experiencesGastronomy, setExperiencesGastronomy] = useState<ExperienceModel[]>(new Array(0))
    const [experiencesHotels, setExperiencesHotels] = useState<ExperienceModel[]>(new Array(0))
    const [experiencesRelax, setExperiencesRelax] = useState<ExperienceModel[]>(new Array(0))
    const [experiencesNight, setExperiencesNight] = useState<ExperienceModel[]>(new Array(0))
    const [experiencesHistoric, setExperiencesHistoric] = useState<ExperienceModel[]>(new Array(0))
    
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        /* serviceHandler(
            experienceService.getExperiencesLastAdded(),
            navigate, (experiences) => { setExperiencesLastAdded(experiences) },
            () => { },
            () => { setExperiencesLastAdded(new Array(0)) }
        ) */
        serviceHandler(
            experienceService.getExperiencesBestCategory("aventura"),
            navigate, (experiences) => { setExperiencesAdventure(experiences) },
            () => { },
            () => { setExperiencesAdventure(new Array(0)) }
        )
        serviceHandler(
            experienceService.getExperiencesBestCategory("gastronomia"),
            navigate, (experiences) => { setExperiencesGastronomy(experiences) },
            () => { },
            () => { setExperiencesGastronomy(new Array(0)) }
        )
        serviceHandler(
            experienceService.getExperiencesBestCategory("hoteleria"),
            navigate, (experiences) => { setExperiencesHotels(experiences) },
            () => { },
            () => { setExperiencesHotels(new Array(0)) }
        )
        serviceHandler(
            experienceService.getExperiencesBestCategory("relax"),
            navigate, (experiences) => { setExperiencesRelax(experiences) },
            () => { },
            () => { setExperiencesRelax(new Array(0)) }
        )
        serviceHandler(
            experienceService.getExperiencesBestCategory("nocturno"),
            navigate, (experiences) => { setExperiencesNight(experiences) },
            () => { },
            () => { setExperiencesNight(new Array(0)) }
        )
        serviceHandler(
            experienceService.getExperiencesBestCategory("historico"),
            navigate, (experiences) => { setExperiencesHistoric(experiences) },
            () => { setIsLoading(false) },
            () => { setExperiencesHistoric(new Array(0)) }
        )
    }, [])

    return (
        <DataLoader spinnerMultiplier={2} isLoading={isLoading}>
            <>
                {/* <Carousel title={t('Landing.anonymous.lastAdded')} experiences={experiencesLastAdded} show={3}/> */}
                <Carousel title={t('Landing.anonymous.aventura')} experiences={experiencesAdventure} show={3}/>
                <Carousel title={t('Landing.anonymous.gastronomia')} experiences={experiencesGastronomy} show={3}/>
                <Carousel title={t('Landing.anonymous.hoteleria')} experiences={experiencesHotels} show={3}/>
                <Carousel title={t('Landing.anonymous.relax')} experiences={experiencesRelax} show={3}/>
                <Carousel title={t('Landing.anonymous.vida_nocturna')} experiences={experiencesNight} show={3}/>
                <Carousel title={t('Landing.anonymous.historico')} experiences={experiencesHistoric} show={3}/>
            </>
        </DataLoader>
    )
}