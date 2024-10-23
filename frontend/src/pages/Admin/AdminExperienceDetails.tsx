import { useTranslation } from "react-i18next";
import "../../common/i18n/index";
import { ExperienceModel } from "../../types";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { serviceHandler } from "../../scripts/serviceHandler";
import { adminService } from "../../services";
import DataLoader from "../../components/DataLoader";
import Map from "../../components/Experience/Map";
import CardAdminExperienceDetails from "../../components/Admin/CardAdminExperienceDetails";
import ConfirmDialogModal from "../../components/ConfirmDialogModal";

export default function AdminExperienceDetails() {

    const { t } = useTranslation()
    const navigate = useNavigate()

    const location = useLocation();
    const experienceFromState = location.state?.experience; 

    const [experience, setExperience] = useState<ExperienceModel | undefined>(undefined)
    const { experienceId } = useParams<{experienceId: string}>()
    let parsedExperienceId = ""
    if (typeof experienceId === "string" ) {
        parsedExperienceId = experienceId;
    } 

    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        if (experienceFromState) {
            setExperience(experienceFromState);
            document.title = `${t('PageName')} - ${t('PageTitles.experienceDetails', { experienceName: experienceFromState.name })}`;
            setIsLoading(false); 
        } else {
            serviceHandler(
                adminService.getPendingExperienceById(parsedExperienceId),
                navigate, (experience) => {
                    setExperience(experience)
                    document.title = `${t('PageName')} - ${t('PageTitles.experienceDetails', { experienceName: experience.name })}`
                },
                () => { setIsLoading(false) },
                () => { setExperience(undefined) }
            )
        }
    }, [experienceFromState])

    return (
        <>
            {isLoading ? 
                <DataLoader spinnerMultiplier={2} isLoading={isLoading}>
                    <div/>
                </DataLoader>
             : 
                <>
                    <div className="container-fluid px-5 d-flex flex-column">
                        <div className="d-flex flex-column flex-md-row flex-fill" style={{ overflow: 'hidden' }}>
                            <div className="d-flex flex-column my-4" style={{ flex: "1 1 50%", maxWidth: "100%" }}>
                                {experience !== undefined && (
                                    <CardAdminExperienceDetails experience={experience} />
                                )}
                            </div>
                            <div className="d-flex flex-column my-4" style={{ flex: "1 1 50%", maxWidth: "100%", overflowY: 'auto' }}>
                                {experience !== undefined &&
                                    <Map experience={experience}/>
                                }
                            </div>
                        </div>
                    </div>
                    <ConfirmDialogModal />
                </>
            }
        </>
    );
}