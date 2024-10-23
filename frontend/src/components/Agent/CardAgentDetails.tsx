import { useTranslation } from "react-i18next";
import "../../common/i18n/index";
import { AgentModel, ExperienceModel } from "../../types";
import DataLoader from "../DataLoader";
import { fetchImageUrl } from "../../scripts/getImage";
import { useEffect, useState } from "react";
import { paths } from "../../common";
import ic_user_no_image from "../../images/ic_user_no_image.png";
import { Link } from "react-router-dom";

export default function CardAgentDetails(props: { 
    agent: AgentModel,
}) {

    const { agent } = props
    const { t } = useTranslation()

    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoadingImage, setIsLoadingImage] = useState(false)

    const [recommendedExperiences, setRecommendedExperiences] = useState<ExperienceModel[]>(new Array(0));

    useEffect(() => {
        fetchImageUrl(
            `${paths.API_URL}${paths.AGENTS}/${agent.id}/image`,
            setImageUrl,
            setIsLoadingImage
        )
        //TODO obtener recommendedExperiences 
    }, [])

    return (
        <div className="card p-4 shadow-sm h-100" style={{ borderRadius: "15px" }}>
            <div className="d-flex flex-wrap align-items-start mb-3">
                <DataLoader spinnerMultiplier={2} isLoading={isLoadingImage}>
                    {imageUrl ? (
                        <img className="me-2" src={imageUrl} alt="Imagen" style={{ borderRadius: "50%", width: "150px", height: "150px" }} />
                    ) : (
                        <img className="me-2" src={ic_user_no_image} alt="Imagen" style={{ borderRadius: "50%", width: "150px", height: "150px" }} />
                    )}
                </DataLoader>
                
                <div className="profile-info flex-grow-1">
                    <h1 className="fs-3 mb-2 text-center">{agent?.name}</h1>

                    <p><strong>{agent?.experience} {t('Agents.form.experience')}</strong></p>
                    <p><strong>{t('Agents.form.languages')}: {agent?.languages}</strong></p>
                    <p><strong>{t('Agents.rating')}: {agent?.score} / 5</strong></p>

                    <div className="d-flex justify-content-between">
                        {agent?.agency && (
                            <p className="m-0">
                                <strong>{t('Agents.form.agency')}: </strong>{agent.agency}
                            </p>
                        )}
                        {agent?.specialization && (
                            <p className="m-0">
                                <strong>{t('Agents.form.specialization')}: </strong>{agent.specialization}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="mb-3 row">
                <div className="col-12 col-md-6 mb-3">
                    <h2 className="fs-5 text-decoration-underline">{t('Agents.form.bio')}</h2>
                    <p>{agent?.bio}</p>
                </div>

                <div className="col-12 col-md-6 mb-3">
                    <h2 className="fs-5 text-decoration-underline">{t('Agents.contactInfo')}</h2>
                    <ul className="list-unstyled">
                        <li><strong>{t('Agents.form.email')}: </strong><a href={`${agent?.email}`}>{agent?.email}</a></li>
                        <li><strong>{t('Agents.form.phone')}: </strong>{agent?.phone}</li>
                        <li><strong>{t('Agents.form.address')}: </strong>{agent?.address}</li>
                        {agent?.twitter && <li><strong>{t('Agents.form.twitter')}: </strong><a href={agent.twitter}>{agent.twitter}</a></li>}
                        {agent?.instagram && <li><strong>{t('Agents.form.instagram')}: </strong><a href={agent.instagram}>{agent.instagram}</a></li>}
                    </ul>
                </div>
            </div>

            {recommendedExperiences.length !== 0 &&
                <div className="mb-3">
                    <h2 className="fs-5 text-decoration-underline">{t('Agents.tours')}</h2>
                    <ul className="list-group">
                        {recommendedExperiences.map((experience: ExperienceModel) => (
                            <Link to={"/experiences/" + experience.id} state={{ experience }}>
                                <li className="list-group-item">
                                    {experience.name}
                                </li>
                            </Link>
                        ))}
                    </ul>
                </div>
            }

            {/* TODO SACAR */}
            <div className="mb-3">
                <h2 className="fs-5 text-decoration-underline">{t('Agents.tours')}</h2>
                <ul className="list-group">
                    <li className="list-group-item">Tour a la Patagonia</li>
                    <li className="list-group-item">Tour por los glaciares</li>
                    <li className="list-group-item">Tour por la ciudad</li>
                </ul>
            </div>
        </div>
    );
}