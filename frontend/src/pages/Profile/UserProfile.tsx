import { useTranslation } from "react-i18next"
import "../../common/i18n/index"
import React, { useEffect, useState } from "react"
import { userService } from "../../services"
import { useNavigate } from "react-router-dom"
import DataLoader from "../../components/DataLoader"
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate"
import { IconButton } from "@mui/material"
import AddPictureModal from "../../components/AddPictureModal"
import ic_user_no_image from "../../images/ic_user_no_image.png"
import EditIcon from "@mui/icons-material/Edit";
import { useAuthNew } from "../../context/AuthProvider"
import { AuthService } from "../../services/AuthService"
import { serviceHandler } from "../../scripts/serviceHandler"
import { AgentModel, UserModel } from "../../types"
import EditProfileForm from "../../components/User/EditProfileForm"
import AgentForm from "../../components/Agent/AgentForm"
import { authedFetch } from "../../scripts/authedFetch"
import { paths } from "../../common"
import { fetchImageUrl } from "../../scripts/getImage"

export default function UserProfile() {

    const { t } = useTranslation()
    const navigate = useNavigate()

    const AuthContext = useAuthNew();
    const session = AuthService.getSessionFromContext(AuthContext);
    const isAgent = AuthService.isAgent(AuthContext);  //TODO usar esto ?

    const [user, setUser] = useState<UserModel|undefined>(undefined)

    const [hasAgent, setHasAgent] = useState(false); 
    const [agent, setAgent] = useState<AgentModel|undefined>(undefined)

    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isCreatingAgent, setIsCreatingAgent] = useState(false);
    const [isEditingAgent, setIsEditingAgent] = useState(false);

    const [isLoading, setIsLoading] = useState(false)

    const isOpenImage = useState(false)
    const isOpenImageAgent = useState(false)

    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoadingImage, setIsLoadingImage] = useState(false)

    const [imageAgentUrl, setImageAgentUrl] = useState<string | null>(null);
    const [isLoadingImageAgent, setIsLoadingImageAgent] = useState(false)

    const handleEditClick = () => {
        setIsEditingProfile(true);
    };

    const handleEditAgentClick = () => {
        setIsEditingAgent(true);
        setIsCreatingAgent(false);
    };

    const handleAgentForm = () => {
        if (!hasAgent) {
            setIsCreatingAgent(true);
            setIsEditingAgent(false);
        } else {
            setIsCreatingAgent(false);
            setIsEditingAgent(true);
        }
    };

    const getAgentIfExists = async (agentId: string) => {
        try {
            const url = `${paths.API_URL}${paths.AGENTS}/${agentId}`
            const agent = await authedFetch(url, { method: "GET" })
            if (agent.status !== 200) {
                throw new Error();
            }
            const parsedAgent = await agent.json();
            setAgent(parsedAgent); 
            setHasAgent(true);
            fetchImageUrl(
                `${url}/image`,
                setImageAgentUrl,
                setIsLoadingImageAgent
            )
        } catch (error) {
            setAgent(undefined)
            setHasAgent(false);
        } finally {
            setIsLoading(false);
            setIsCreatingAgent(false);
            setIsEditingAgent(false);
        }
    };

    useEffect(() => {
        document.title = `${t('PageName')} - ${t('PageTitles.userProfile')}`
        setIsLoading(true) 
        fetchImageUrl(
            `${paths.API_URL}${paths.USERS}/${session.id}/image`,
            setImageUrl,
            setIsLoadingImage
        )
        const userPromise = serviceHandler(
            userService.getUserById(session.id),
            navigate,
            (user) => { setUser(user) },
            () => { },
            () => { setUser(undefined) }
        );

        const agentPromise = getAgentIfExists(session.id);

        Promise.all([userPromise, agentPromise])
            .then(() => { setIsLoading(false); })
            .catch(() => { setIsLoading(false); });
    }, []);

    return (
        <>
            <DataLoader spinnerMultiplier={2} isLoading={isLoading}>
                <div className="container-fluid p-0 my-auto h-auto w-100 d-flex justify-content-center align-items-center">
                    <div className="container-lg w-100 pb-3 modalContainer d-flex flex-column justify-content-center align-items-center">
                        <div className="m-2 w-100 d-flex justify-content-between align-items-center">
                            <IconButton
                                onClick={() => { isOpenImage[1](true) }}
                                aria-label={t("AriaLabel.editImage")} title={t("AriaLabel.editImage")}
                                component="span" >
                                <AddPhotoAlternateIcon style={{ fontSize: "xx-large" }} />
                            </IconButton>
                            <h1 className="text-center">
                                {t('User.profile.description')}
                            </h1>
                            <IconButton 
                                onClick={handleEditClick}
                                aria-label={t("AriaLabel.editProfile")} title={t("AriaLabel.editProfile")}
                                component="span">
                                <EditIcon style={{ fontSize: "xx-large" }} />
                            </IconButton>
                        </div>

                        <div className="m-2" style={{ maxWidth: "200px" }}>
                            <DataLoader spinnerMultiplier={2} isLoading={isLoadingImage}>
                                <img className="container-fluid p-0" style={{ height: "fit-content" }} alt="Imagen usuario"
                                    src={imageUrl ? imageUrl : ic_user_no_image}/>
                            </DataLoader>
                        </div>

                        {user && (
                            <EditProfileForm 
                                user={user} 
                                setUser={setUser} 
                                isEditing={isEditingProfile} 
                                setIsEditing={setIsEditingProfile} 
                                setIsLoading={setIsLoading}
                            />
                        )}

                        {!hasAgent && (
                            <div className="d-flex justify-content-center align-items-center">
                                <button 
                                    onClick={handleAgentForm} 
                                    type="button" className="btn btn-error"
                                    aria-label={t("AriaLabel.beAgent")} title={t("AriaLabel.beAgent")}>
                                    {t('User.profile.beAgent')}
                                </button>
                                {/* <button onClick={() => navigate({ pathname: "/experienceForm" }, { replace: true })}
                                    type="button" className="btn btn-error"
                                    aria-label={t("AriaLabel.beProvider")} title={t("AriaLabel.beProvider")}>
                                    {t('User.profile.beProvider')}
                                </button> */}
                            </div>
                        )}
                    </div>
                </div>

                {(hasAgent || isCreatingAgent) && (
                    <div className="container-fluid p-0 my-auto h-auto w-100 d-flex justify-content-center align-items-center">
                        <div className="container-lg w-100 pb-3 modalContainer d-flex flex-column justify-content-center align-items-center">
                            <div className="m-2 w-100 d-flex align-items-center"
                                style={{ justifyContent: isCreatingAgent ? 'center' : 'space-between' }}>
                                {!isCreatingAgent && (
                                    <IconButton
                                        onClick={() => { isOpenImageAgent[1](true) }}
                                        aria-label={t("AriaLabel.editImage")} title={t("AriaLabel.editImage")}
                                        component="span" >
                                        <AddPhotoAlternateIcon style={{ fontSize: "xx-large" }} />
                                    </IconButton>
                                )}

                                <h1 className="text-center">
                                    {t('Agents.form.title')}
                                </h1>

                                {!isCreatingAgent && (
                                    <IconButton 
                                        onClick={handleEditAgentClick}
                                        aria-label={t("AriaLabel.editAgent")} title={t("AriaLabel.editAgent")}
                                        component="span">
                                        <EditIcon style={{ fontSize: "xx-large" }} />
                                    </IconButton>
                                )}
                            </div>

                            <div className="m-2" style={{ maxWidth: "200px" }}>
                                <DataLoader spinnerMultiplier={2} isLoading={isLoadingImageAgent}>
                                    <img className="container-fluid p-0" style={{ height: "fit-content" }} alt="Imagen agente"
                                        src={imageAgentUrl ? imageAgentUrl : ic_user_no_image}
                                    />
                                </DataLoader>
                            </div>

                            <AgentForm
                                agent={agent} 
                                setAgent={setAgent} 
                                isCreating={isCreatingAgent}
                                setIsCreating={setIsCreatingAgent}
                                isEditing={isEditingAgent} 
                                setIsEditing={setIsEditingAgent} 
                                setIsLoading={setIsLoading}
                            />
                        </div>
                    </div>
                )}

            </DataLoader>
            <AddPictureModal isOpen={isOpenImage} userId={session.id} />
            <AddPictureModal isOpen={isOpenImageAgent} agentId={session.id} />
        </>
    );
}