import { useTranslation } from "react-i18next";
import "../../common/i18n/index";
import { useEffect, useState } from "react";
import { ExperienceModel } from "../../types";
import StarRating from "../Review/StarRating";
import categoryImages, { CategoryName, paths } from "../../common";
import DataLoader from "../DataLoader";
import { fetchImageUrl } from "../../scripts/getImage";
import Price from "../Experience/Price";
import { Button } from "react-bootstrap";
import { confirmDialogModal } from "../ConfirmDialogModal";
import { approveExperience } from "../../scripts/adminOperations";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

export default function CardAdminExperienceDetails(props: { 
    experience: ExperienceModel,
}) {

    const { experience } = props
    const { t } = useTranslation()

    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoadingImage, setIsLoadingImage] = useState(false)

    useEffect(() => {
        fetchImageUrl(
            `${paths.API_URL}${paths.EXPERIENCES}/${experience.id}/image`,
            setImageUrl,
            setIsLoadingImage
        )
    }, [])

    return (
        <DataLoader spinnerMultiplier={2} isLoading={isLoadingImage}>
            <div className="card mx-4 p-4" style={{ borderRadius: "15px"}}>
                <div className="d-flex justify-content-center align-items-center mb-4 position-relative">
                    {/* Título de la experiencia */}
                    <h1 className="text-center" style={{ wordBreak: "break-word", flex: 1 }}>
                        {experience.name}
                    </h1>
                </div>
    
                {/* Imagen de la experiencia */}
                <div className="mb-4">
                    <DataLoader spinnerMultiplier={2} isLoading={isLoadingImage}>
                        <img className="container-fluid p-0" alt={`Imagen ${experience.category}`}
                            src={imageUrl ? imageUrl : categoryImages[experience.category as CategoryName]}
                            style={{ height: "fit-content", maxHeight: imageUrl ? "550px" : "450px" }} />
                        {!imageUrl && (
                            <h5 className="mt-3 text-center text-muted">
                                {t('ExperienceDetail.imageDefault')}
                            </h5>
                        )}
                    </DataLoader>
                </div>
    
                {/* Información de la experiencia */}
                <div className="card-body p-0">

                    <div className="d-flex justify-content-between align-items-center mb-3">
                        {/* Categoria */}
                        <div className="m-0">
                            <p className="m-0 fs-6 category-highlight">
                                {t('Categories.' + experience.category)}
                            </p>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <h5 className="information-title">{t('Experience.address')}</h5>
                                <p className="information-text">
                                    {experience.address}, {experience.city}, {experience.province}
                                </p>
                            </div>

                            <div className="mb-3">
                                <h5 className="information-title">{t('Experience.price.name')}</h5>
                                <div className="information-text">
                                    <Price price={experience.price} />
                                </div>
                            </div>

                            <div className="mb-3">
                                <h5 className="information-title">{t('ExperienceDetail.email')}</h5>
                                <p className="information-text">{experience.email}</p>
                            </div>

                            <div className="d-flex align-items-center mb-3">
                                <h6 className="information-title mb-0">
                                    {t('ExperienceDetail.review')}: {experience.reviewCount}
                                </h6>
                                <StarRating score={experience.score} />
                            </div>
                        </div>

                        <div className="col-md-6"> 
                            <div className="mb-3">
                                <h5 className="information-title">{t('ExperienceDetail.description')}</h5>
                                <div className="information-text" id="experienceDescription">
                                    {experience.description ? (
                                        <p>{experience.description}</p>
                                    ) : (
                                        <p>{t('ExperienceDetail.noData')}</p>
                                    )}
                                </div>
                            </div>

                            <div className="mb-3">
                                <h5 className="information-title">{t('ExperienceDetail.url')}</h5>
                                {experience.siteUrl ? (
                                    <a href={experience.siteUrl}>
                                        <p className="information-text text-primary" style={{ wordBreak: "break-all" }}>
                                            {experience.siteUrl}
                                        </p>
                                    </a>
                                ) : (
                                    <p className="information-text">{t('ExperienceDetail.noData')}</p>
                                )}
                            </div> 
                        </div>
                    </div>
                </div>

                <div className="d-flex justify-content-center">
                    <Button 
                        variant="success" 
                        className="action-button me-5" 
                        aria-label={t("Admin.modal.approveExperienceTitle")}
                        title={t("Admin.modal.approveExperienceTitle")}
                        onClick={() =>
                            confirmDialogModal(
                                t('Admin.modal.approveExperienceTitle'),
                                t('Admin.modal.approveExperienceMessage', { experienceName: experience.name }),
                                () => approveExperience(experience, true, t))
                        }
                    >
                        <CheckIcon className="m-0" /> 
                    </Button>
                    <Button 
                        variant="danger" 
                        className="action-button" 
                        aria-label={t("Admin.modal.denyExperienceTitle")}
                        title={t("Admin.modal.denyExperienceTitle")}
                        onClick={() =>
                            confirmDialogModal(
                                t('Admin.modal.denyExperienceTitle'),
                                t('Admin.modal.denyExperienceMessage', { experienceName: experience.name }),
                                () => approveExperience(experience, false, t))
                        }
                    >
                        <CloseIcon className="m-0" />
                    </Button>
                </div>
            </div>
        </DataLoader>
    );
}