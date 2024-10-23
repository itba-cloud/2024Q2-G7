import { useTranslation } from "react-i18next"
import "../../common/i18n/index"
import React, { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom";
import CardAgent from "../../components/Agent/CardAgent";
import { serviceHandler } from "../../scripts/serviceHandler";
import { agentsService } from "../../services";
import { AgentModel } from "../../types";
import { getQueryOrDefault, useQuery } from "../../hooks/useQuery";
import { validatePage } from "../../scripts/validations";
import ic_no_search from "../../images/ic_no_search.jpeg";
import DataLoader from "../../components/DataLoader";

export default function Agents() {

    const { t } = useTranslation()
    const navigate = useNavigate()

    const query = useQuery()
    const [searchParams, setSearchParams] = useSearchParams()

    const [agents, setAgents] = useState<AgentModel[]>(new Array(0))
    const [isLoading, setIsLoading] = useState(false)

    //Page
    const [maxPage, setMaxPage] = useState(0)
    const currentPage = useState<number>(
        !isNaN(parseInt(getQueryOrDefault(query, "page", "1"))) ?
            parseInt(getQueryOrDefault(query, "page", "1")) :
            1
    )
    const pageToShow = useState<number>(1)

    useEffect(() => {
        document.title = `${t('PageName')} - ${t('PageTitles.agents')}`
        setIsLoading(true)
        if (validatePage(maxPage, pageToShow[0], currentPage[0])) {
            serviceHandler(
                agentsService.getAgents(currentPage[0] === 0 ? 1 : currentPage[0]),
                navigate, 
                (agents) => {
                    setAgents(agents.getContent())
                    setMaxPage(agents ? agents.getMaxPage() : 0)
                    if (currentPage[0] <= 0) {
                        pageToShow[1](currentPage[0])
                        searchParams.set("page", "1")
                        currentPage[1](1)
                    } else if (currentPage[0] > agents.getMaxPage()) {
                        pageToShow[1](currentPage[0])
                        searchParams.set("page", agents.getMaxPage().toString())
                        currentPage[1](agents.getMaxPage())
                    } else {
                        pageToShow[1](currentPage[0])
                        searchParams.set("page", currentPage[0].toString())
                    }
                    setSearchParams(searchParams)
                },
                () => { setIsLoading(false) },
                () => {
                    setAgents(new Array(0))
                    setMaxPage(0)
                }
            )
        }
    }, [])

    return (
        <DataLoader spinnerMultiplier={2} isLoading={isLoading}>
            <div className="dashboard-container">
                {agents.length === 0 ? 
                    <div className="my-auto mx-5 px-3 d-flex justify-content-center align-content-center">
                        <div className="d-flex justify-content-center align-content-center">
                            <img src={ic_no_search} className="ic_no_search" alt="Imagen lupa" />
                            <h1 className="d-flex align-self-center">
                                {t('Agents.noAgents')}
                            </h1>
                        </div>
                    </div>
                    :
                    <>
                        <h4 className="title m-0">
                            {t('Agents.title')}
                        </h4>
                        <div className="agent-grid">
                            {agents.map(agent => (
                                <CardAgent agent={agent} key={agent.id}/>
                            ))}
                        </div>
                    </>
                }
            </div>
        </DataLoader>
    );

}