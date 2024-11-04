import { useTranslation } from "react-i18next";
import "../../common/i18n/index";
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { AgentModel } from "../../types";
import DataLoader from "../DataLoader";
import { paths } from "../../common";
import { fetchImageUrl } from "../../scripts/getImage";
import ic_user_no_image from "../../images/ic_user_no_image.png";

export default function CardAgent(props: { agent: AgentModel }) {
    
    const { t } = useTranslation();
    const { agent } = props;

    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoadingImage, setIsLoadingImage] = useState(false)

    useEffect(() => {
        fetchImageUrl(
            `${paths.API_URL}${paths.AGENTS}/${agent.id}/image`,
            setImageUrl,
            setIsLoadingImage
        )
    }, [])

    return (
        <div key={agent.id} className="card agent-card">
            <DataLoader spinnerMultiplier={2} isLoading={isLoadingImage}>
                {imageUrl ? (
                    <img className="mb-2" src={imageUrl} alt={`${agent.name} avatar`} style={{ borderRadius: "50%", width: "150px", height: "150px" }} />
                ) : (
                    <img className="mb-2" src={ic_user_no_image} alt={`${agent.name} avatar`} style={{ borderRadius: "50%", width: "150px", height: "150px" }} />
                )}
            </DataLoader>
            <div>
                <h3 className="mb-2 fs-3 text-decoration-underline">{agent.name}</h3>
                <p><strong>{agent?.experience} {t('Agents.form.experience')}</strong></p>
                <p><strong>{t('Agents.form.languages')}: {agent?.languages}</strong></p>
                <p><strong>{t('Agents.rating')}: {agent?.score} / 5</strong></p>
                <p><strong>{t('Agents.form.phone')}: {agent?.phone}</strong></p>
                <div className="d-flex justify-content-center mt-0">
                    <Link to={`/agents/${agent.id}`} className="btn btn-agent-detail" state={{ agent }}>
                        {t('Agents.viewProfile')}
                    </Link>
                </div>
            </div>
        </div>
    );
}
