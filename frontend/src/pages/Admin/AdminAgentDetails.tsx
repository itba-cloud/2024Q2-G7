import "../../common/i18n/index";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { serviceHandler } from "../../scripts/serviceHandler";
import DataLoader from "../../components/DataLoader";
import { AgentModel } from "../../types";
import { adminService } from "../../services";
import CardAdminAgentDetails from "../../components/Admin/CardAdminAgentDetails";
import ConfirmDialogModal from "../../components/ConfirmDialogModal";

export default function AdminAgentDetails() {

    const { t } = useTranslation()
    const navigate = useNavigate()

    const location = useLocation();
    const agentFromState = location.state?.agent; 

    const [agent, setAgent] = useState<AgentModel | undefined>(undefined)
    const { agentId } = useParams<{ agentId: string }>()
    let parsedAgentId = ""
    if (typeof agentId === "string") {
        parsedAgentId = agentId;
    }

    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        if (agentFromState) {
            setAgent(agentFromState);
            document.title = `${t('PageName')} - ${t('PageTitles.agentDetails', { agentName: agentFromState?.name })}`
            setIsLoading(false); 
        } else {
            serviceHandler(
                adminService.getPendingAgentById(parsedAgentId),
                navigate, (agent) => {
                    setAgent(agent)
                    document.title = `${t('PageName')} - ${t('PageTitles.agentDetails', { agentName: agent?.name })}`
                },
                () => { setIsLoading(false) },
                () => { setAgent(undefined) }
            )
        }
    }, [agentFromState]) 

    return (
        <DataLoader spinnerMultiplier={2} isLoading={isLoading}>
            <div className="container my-4">
                <div className="d-flex justify-content-center align-items-stretch">
                    <div className="col-12 col-lg-7 mb-4">
                        {agent !== undefined && (
                            <CardAdminAgentDetails agent={agent} />
                        )}
                    </div>
                </div>
            </div>
            <ConfirmDialogModal />
        </DataLoader>
    );
}
