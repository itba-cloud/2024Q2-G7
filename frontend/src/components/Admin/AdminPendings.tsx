import { useTranslation } from "react-i18next";
import "../../common/i18n/index";
import { AgentModel, ExperienceModel } from "../../types";
import ExperiencesPendingTable from "./ExperiencesPendingTable";
import ic_no_search from "../../images/ic_no_search.jpeg";
import AgentsPendingTable from "./AgentsPendingTable";

export default function AdminPendings(props: { pendingExperiences: ExperienceModel[]; pendingAgents: AgentModel[]; }) {

    const { t } = useTranslation()
    const { pendingExperiences, pendingAgents } = props

    return (
        <>
            <div className="mt-2 d-flex justify-content-center align-content-center">
                <h2 style={{ fontWeight: "600", textDecoration: "underline" }}>
                    {t("Admin.pendingExperiences")}
                </h2>
            </div>

            <div className="mx-5">
                {pendingExperiences.length === 0 ?
                    <div className="my-auto mx-5 px-3 d-flex justify-content-center align-content-center">
                        <div className="d-flex justify-content-center align-content-center">
                            <img src={ic_no_search} className="ic_no_search" alt="Imagen lupa" style={{maxHeight: "300px"}} />
                            <h4 className="d-flex align-self-center">
                                {t('Admin.emptyExperiences')}
                            </h4>
                        </div>
                    </div>
                    :
                    <>
                        <ExperiencesPendingTable experiences={pendingExperiences}/>
                    </>
                }
            </div>

            <div className="d-flex justify-content-center align-content-center">
                <h2 style={{ fontWeight: "600", textDecoration: "underline" }}>
                    {t("Admin.pendingAgents")}
                </h2>
            </div>

            <div className="mx-5">
                {pendingAgents.length === 0 ?
                    <div className="my-auto mx-5 px-3 d-flex justify-content-center align-content-center">
                        <div className="d-flex justify-content-center align-content-center">
                            <h4 className="d-flex align-self-center">
                                <img src={ic_no_search} className="ic_no_search" alt="Imagen lupa" style={{maxHeight: "300px"}} />
                                <h4 className="d-flex align-self-center">
                                    {t('Admin.emptyAgents')}
                                </h4>
                            </h4>
                        </div>
                    </div>
                    :
                    <>
                        <AgentsPendingTable agents={pendingAgents}/>
                    </>
                }
            </div>
        </>
    );
}