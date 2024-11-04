import { useTranslation } from "react-i18next";
import "../../common/i18n/index";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import React, { useEffect, useState } from "react";
import { ExperienceModel, TripModel } from "../../types";
import StarRating from "../Review/StarRating";
import ConfirmDialogModal, { confirmDialogModal } from "../ConfirmDialogModal";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import AddPictureModal from "../AddPictureModal";
import { deleteExperience, editExperience, setExperienceInUserTrip, setFavExperience, setRecommendedExperience, setVisibility } from "../../scripts/experienceOperations";
import Price from "./Price";
// @ts-ignore
import VisibilityIcon from "@mui/icons-material/Visibility";
// @ts-ignore
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { showToast } from "../../scripts/toast";
import categoryImages, { CategoryName, paths } from "../../common";
import { serviceHandler } from "../../scripts/serviceHandler";
import { userService } from "../../services";
import { useAuthNew } from "../../context/AuthProvider";
import { AuthService } from "../../services/AuthService";
import DataLoader from "../DataLoader";
import { fetchImageUrl } from "../../scripts/getImage";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

export default function CardExperienceDetails(props: { 
    experience: ExperienceModel,
}) {

    const { experience } = props
    const { t } = useTranslation()
    const navigate = useNavigate()

    const AuthContext = useAuthNew();
    const session = AuthService.getSessionFromContext(AuthContext);
    const isAgent = AuthService.isAgent(AuthContext);

    const [isEditing, setIsEditing] = useState<boolean | undefined>(session && (experience.user_id === session.id))

    const [trips, setTrips] = useState<TripModel[]>(new Array(0))

    const favsCounter = useState<number>(experience.favs)
    const [isFav, setIsFav] = useState(false)
    const [isRecommended, setIsRecommended] = useState(false)

    const [view, setView] = useState(experience.observable)

    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const isOpenImage = useState(false)

    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingImage, setIsLoadingImage] = useState(false)

    useEffect(() => {
        fetchImageUrl(
            `${paths.API_URL}${paths.EXPERIENCES}/${experience.id}/image`,
            setImageUrl,
            setIsLoadingImage
        )
        if (session !== null) {
            setIsLoading(true)
            if (AuthService.isFavourite(AuthContext, experience.id)) setIsFav(true)
            if (AuthService.isRecommended(AuthContext, experience.id)) setIsRecommended(true)

            serviceHandler(
                userService.getUserTrips(session.id),
                navigate, (trips) => { setTrips(trips) },
                () => { setIsLoading(false); },
                () => { setTrips(new Array(0)) }
            )
        }
    }, [])

    return (
        <DataLoader spinnerMultiplier={2} isLoading={isLoading}>
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
                            style={{ height: "fit-content", maxHeight: imageUrl ? "450px" : "350px" }} />
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

                        {/* Sección de recomendados */}
                        {session && isAgent && (
                            <div className="recommend-section d-flex flex-column align-items-center mt-2 mt-md-0">
                                <button
                                    className={`btn btn-sm d-flex align-items-center ${isRecommended ? 'btn-danger' : 'btn-primary'}`}
                                    aria-label={isRecommended ? t("Agents.unrecommend") : t("Agents.recommend")}
                                    title={isRecommended ? t("Agents.unrecommend") : t("Agents.recommend")}
                                    onClick={() => {
                                        setRecommendedExperience(session.id, experience, !isRecommended, setIsRecommended, t, AuthContext);
                                    }}
                                >
                                    {isRecommended ? (
                                        <>
                                            <ThumbDownIcon className="me-1" />{/* {t("Agents.unrecommend")} */}
                                        </>
                                    ) : (
                                        <>
                                            <ThumbUpIcon className="me-1" /> {/* {t("Agents.recommend")} */}
                                        </>
                                    )}
                                </button>
                                {/* TODO poner esto */}
                                {/* <span className="small-text mt-1">{experience.recommended}</span> */}
                            </div>
                        )}

                        {/* Botón de favoritos */}
                        <div className="d-flex flex-column align-items-center">
                            {session ? (
                                <div>
                                    {isFav ? (
                                        <IconButton onClick={() => setFavExperience(session.id, experience, false, setIsFav, favsCounter, t, AuthContext)} 
                                            aria-label={t("AriaLabel.fav")} title={t("AriaLabel.fav")}
                                            className="p-0"
                                            >
                                            <Favorite className="fa-heart heart-color" />
                                        </IconButton>
                                    ) : (
                                        <IconButton onClick={() => setFavExperience(session.id, experience, true, setIsFav, favsCounter, t, AuthContext)}
                                            aria-label={t("AriaLabel.fav")} title={t("AriaLabel.fav")}
                                            className="p-0"
                                            >
                                            <FavoriteBorder className="fa-heart" />
                                        </IconButton>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <IconButton aria-label={t("AriaLabel.fav")} title={t("AriaLabel.fav")}
                                        className="p-0"
                                        onClick={() => {
                                            //clearNavBar();
                                            navigate("/login", { replace: true });
                                            showToast(t('Experience.toast.favNotSigned'), "error");
                                        }}>
                                        <FavoriteBorder className="fa-heart" />
                                    </IconButton>
                                </div>
                            )}
                            <span className="small-text mt-1">{favsCounter[0]}</span>
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

                            {/* Botón de agregar a trips */}
                            {session && 
                                <div className="dropdown mt-4">
                                    <button
                                        className="btn button-add-to-trips d-flex align-items-center"
                                        type="button"
                                        id="dropdownMenuButton1"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                        aria-label={t("AriaLabel.addToTrip")}
                                        title={t("AriaLabel.addToTrip")}
                                    >
                                        {t("AriaLabel.addToTrip")}
                                    </button>

                                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                        {trips.length > 0 ? (
                                            trips.map((trip) => (
                                                <button
                                                    type="button"
                                                    key={trip.id}
                                                    className="dropdown-item"
                                                    aria-label={`${trip.name}`}
                                                    title={`${trip.name}`}
                                                    onClick={() => {
                                                        // Acción para agregar a trip
                                                        setExperienceInUserTrip(session.id, trip, experience, true, t);
                                                    }}
                                                >
                                                    {trip.name}
                                                </button>
                                            ))
                                        ) : (
                                            <li className="dropdown-item text-muted">
                                                {t("Trips.dropdown.noTrips")}
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            }
                        </div>
                    </div>
                </div>

    
                {/* Visibilidad de la experiencia */}
                {!view && (
                    <div className="mt-3 d-flex justify-content-center">
                        <h6 className="text-warning"> {/* TODO lassName="obs-info" */}
                            {t('ExperienceDetail.notVisible')}
                        </h6>
                    </div>
                )}
    
                {/* Botones de edición cuando se está editando */}
                {isEditing && (
                    <div className="d-flex justify-content-center">
                        {view ? (
                            <IconButton
                                className="icon-button visibility"
                                onClick={() => setVisibility(experience, false, setView, t)}
                                aria-label={t("AriaLabel.visibility")}
                                title={t("AriaLabel.visibility")}
                            >
                                <VisibilityIcon style={{ fontSize: "2rem" }} />
                            </IconButton>
                        ) : (
                            <IconButton
                                className="icon-button visibility"
                                onClick={() => setVisibility(experience, true, setView, t)}
                                aria-label={t("AriaLabel.visibility")}
                                title={t("AriaLabel.visibility")}
                            >
                                <VisibilityOffIcon style={{ fontSize: "2rem" }} />
                            </IconButton>
                        )}
                        
                        <IconButton
                            className="icon-button edit"
                            onClick={() => editExperience(experience.id, navigate)}
                            aria-label={t("AriaLabel.editExperience")}
                            title={t("AriaLabel.editExperience")}
                        >
                            <EditIcon style={{ fontSize: "2rem" }} />
                        </IconButton>

                        <IconButton
                            className="icon-button image"
                            onClick={() => {
                                isOpenImage[1](true);
                            }}
                            aria-label={t("AriaLabel.editImage")}
                            title={t("AriaLabel.editImage")}
                        >
                            <AddPhotoAlternateIcon style={{ fontSize: "2rem" }} />
                        </IconButton>

                        <IconButton
                            className="icon-button delete"
                            onClick={() =>
                                confirmDialogModal(
                                    t('User.experiences.deleteTitle'),
                                    t('User.experiences.confirmDelete', { experienceName: experience.name }),
                                    () => deleteExperience(experience, undefined, true, navigate, t)
                                )
                            }
                            aria-label={t("AriaLabel.deleteExperience")}
                            title={t("AriaLabel.deleteExperience")}
                        >
                            <DeleteIcon style={{ fontSize: "2rem" }} />
                        </IconButton>

                        <AddPictureModal isOpen={isOpenImage} experienceId={experience.id} />
                        <ConfirmDialogModal />
                    </div>
                )}
            </div>
        </DataLoader>
    );
    
    

}