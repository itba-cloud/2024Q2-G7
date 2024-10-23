import { useTranslation } from "react-i18next";
import "../../common/i18n/index"
import { Link, useNavigate } from 'react-router-dom'
import { ExperienceModel } from "../../types";
import StarRating from "../Review/StarRating";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { setFavExperience } from "../../scripts/experienceOperations";
import Price from "./Price";
import DataLoader from "../DataLoader";
import { showToast } from "../../scripts/toast";
import categoryImages, { CategoryName, paths } from "../../common";
import { serviceHandler } from "../../scripts/serviceHandler";
import { userService } from "../../services";
import { useAuthNew } from "../../context/AuthProvider";
import { AuthService } from "../../services/AuthService";
import { fetchImageUrl } from "../../scripts/getImage";

export default function CardExperience(props: { 
    experience: ExperienceModel, 
    /* nameProp: [string | undefined, Dispatch<SetStateAction<string | undefined>>], */ 
    categoryProp?: [string | undefined, Dispatch<SetStateAction<string | undefined>>],
    fav: boolean 
}) {
    
    const { t } = useTranslation()
    const { experience, /* nameProp, */ categoryProp, fav } = props
    const navigate = useNavigate()

    const AuthContext = useAuthNew();
    const session = AuthService.getSessionFromContext(AuthContext)

    const [isFav, setIsFav] = useState(false)

    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoadingImage, setIsLoadingImage] = useState(false)

    useEffect(() => {
        fetchImageUrl(
            `${paths.API_URL}${paths.EXPERIENCES}/${experience.id}/image`,
            setImageUrl,
            setIsLoadingImage
        )
        if (session !== null) {
            if (fav) {
                setIsFav(true)
            } else {
                if (AuthService.isFavourite(AuthContext, experience.id)) setIsFav(true)
                /* serviceHandler(
                    userService.isExperienceFav(session.id, experience.id),
                    navigate, (isFavResponse) => { setIsFav(isFavResponse.favourite)},
                    () => { },
                    () => { setIsFav(false) }
                ) */
            }
        }
    }, [])

    const clearNavbar = () => {
        //searchParams.delete("category")
        //searchParams.delete("name")
        //setSearchParams(searchParams)
        if (categoryProp) {
            categoryProp[1]("");
        }
        //nameProp[1]("")
    }

    return (

        <div className="card card-experience mx-3 my-2 p-0">

            <div className="card-link h-100 d-flex flex-column">
                <div>
                    <div className="mw-100">
                        <DataLoader spinnerMultiplier={2} isLoading={isLoadingImage}>
                            <img className={`card-img-top container-fluid ${imageUrl ? "p-0" : "p-4"} mw-100`}
                                alt={`Imagen ${experience.category}`}
                                src={imageUrl ? imageUrl : categoryImages[experience.category as CategoryName]} 
                                />
                        </DataLoader>
                    </div>

                    <div className="card-body container-fluid p-2">
                        <div className="title-link">
                            <Link to={"/experiences/" + experience.id} onClick={clearNavbar} state={{ experience }}>
                                <h2 className="experience card-title container-fluid p-0 text-truncate text-center">
                                    {experience.name}
                                </h2>
                            </Link>
                        </div>
                        <div className="card-text container-fluid p-0">
                            <h5 className="fs-6 text-truncate">
                                {experience.city}, {experience.province} 
                            </h5>
                            <div className="d-flex justify-content-between">
                                <Price price={experience.price} />
                                <div className="align-self-center category-highlight">
                                    <p className="m-0 fs-6"> 
                                        {t('Categories.' + experience.category)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container-fluid d-flex p-2 mb-1 align-items-end">
                    <h5 className="mb-0">
                        {t('Experience.reviews', { reviewCount: experience.reviewCount })}
                    </h5>
                    
                    <StarRating score={experience.score} />

                    <div className="btn-fav">
                        {session ?
                            <div>
                                {isFav ?
                                    <IconButton onClick={() => setFavExperience(session.id, experience, false, setIsFav, t, AuthContext)} aria-label={t("AriaLabel.fav")} title={t("AriaLabel.fav")}>
                                        <Favorite className="fa-heart heart-color" />
                                    </IconButton>
                                    :
                                    <IconButton onClick={() => setFavExperience(session.id, experience, true, setIsFav, t, AuthContext)} aria-label={t("AriaLabel.fav")} title={t("AriaLabel.fav")}>
                                        <FavoriteBorder className="fa-heart" />
                                    </IconButton>
                                }
                            </div>
                            :
                            <div>
                                <IconButton aria-label={t("AriaLabel.fav")} title={t("AriaLabel.fav")}
                                    onClick={() => {
                                        clearNavbar();
                                        navigate("/login", { replace: true });
                                        showToast(t('Experience.toast.favNotSigned'), "error")
                                    }}>
                                    <FavoriteBorder className="fa-heart" />
                                </IconButton>
                            </div>
                        }
                    </div>
                </div>

               
                {/* {!experience.observable &&
                    <div className="card-body p-0 d-flex justify-content-center">
                        <h5 className="obs-info align-self-center" style={{ fontSize: "small" }}>
                            {t('Experience.notVisible')}
                        </h5>
                    </div>
                } */}
            </div>
        </div>
    )
}