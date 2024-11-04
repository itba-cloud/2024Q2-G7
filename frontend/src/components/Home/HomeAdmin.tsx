import {useTranslation} from "react-i18next"
import "../../common/i18n/index"
import {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom"
import { AgentModel, ExperienceModel } from "../../types"
import { serviceHandler } from "../../scripts/serviceHandler"
import { adminService } from "../../services"
import DataLoader from "../DataLoader"
import AdminPendings from "../Admin/AdminPendings"

export default function HomeAdmin() {

    const {t} = useTranslation()
    const navigate = useNavigate()

    const [prendingExperiences, setPendingExperiences] = useState<ExperienceModel[]>(new Array(0))
    const [pendingAgents, setPendingAgents] = useState<AgentModel[]>(new Array(0))
    
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        serviceHandler(
            adminService.getPendingExperiences(),
            navigate, (prendingExperiences) => { setPendingExperiences(prendingExperiences) },
            () => { },
            () => setPendingExperiences(new Array(0))
        )
        serviceHandler(
            adminService.getPendingAgents(),
            navigate, (pendingAgents) => { setPendingAgents(pendingAgents) },
            () => { setIsLoading(false) },
            () => setPendingAgents(new Array(0))
        )
    }, [])

    return (
        <DataLoader spinnerMultiplier={2} isLoading={isLoading}>
            <AdminPendings
                pendingExperiences={prendingExperiences} 
                pendingAgents={pendingAgents}
            />
        </DataLoader>
    )
}