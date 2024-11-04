import { useTranslation } from "react-i18next";
import "../../common/i18n/index";
import { ExperienceModel, ReviewModel, UserModel } from "../../types";
import { Link, useNavigate } from 'react-router-dom'
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import StarRating from "./StarRating";
import { experienceService, reviewService, userService } from "../../services";
import { showToast } from "../../scripts/toast";
import { confirmDialogModal } from "../ConfirmDialogModal";
import ic_user_no_image from "../../images/ic_user_no_image.png";
import { serviceHandler } from "../../scripts/serviceHandler";
import { fetchImageUrl } from "../../scripts/getImage";
import { paths } from "../../common";
import DataLoader from "../DataLoader";

export default function CardReview(props: {
    reviewModel: ReviewModel,
    isEditing: boolean,
    onEdit?: [boolean, Dispatch<SetStateAction<boolean>>],
}) {

    const { t } = useTranslation()
    const navigate = useNavigate()
    const { reviewModel, isEditing, onEdit } = props

    const [experience, setExperience] = useState<ExperienceModel | undefined>(undefined)
    const [user, setUser] = useState<UserModel | undefined>(undefined)

    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoadingImage, setIsLoadingImage] = useState(false)

    useEffect(() => {
        fetchImageUrl(
            `${paths.API_URL}${paths.USERS}/${reviewModel.user_id}/image`,
            setImageUrl,
            setIsLoadingImage
        )

        serviceHandler(
            userService.getUserById(reviewModel.user_id),
            navigate, (user) => { setUser(user) },
            () => { },
            () => { }
        ) 
        if (isEditing && reviewModel.experience_id) {
            serviceHandler(
                experienceService.getExperienceById(reviewModel.experience_id),
                navigate, (experience) => { setExperience(experience) },
                () => { },
                () => { }
            )
        }
    }, [])

    function editReview(reviewId: string) {
        //TODO
    }

    function deleteReview(reviewId: string) {
        reviewService.deleteReviewById(reviewId)
            .then(() => {
                if (onEdit) {
                    onEdit[1](!onEdit[0])
                }
                showToast(t('Review.toast.deleteSuccess', { reviewTitle: reviewModel.title }), "success")
            })
            .catch(() => {
                showToast(t('Review.toast.deleteError', { reviewTitle: reviewModel.title }), "error")
            });
    }

    return (
        <div className="card m-2" style={{ height: isEditing ? "310px" : "fit-content" }}>
            {isEditing && (
                <div className="card-title m-2 d-flex justify-content-center align-items-center">
                    <Link to={"/experiences/" + experience?.id}>
                        <h4 className="text-center"
                            style={{
                                fontWeight: "bold",
                                textDecoration: "underline",
                                wordBreak: "break-all",
                                color: "black"
                            }}>
                            {experience?.name}
                        </h4>
                    </Link>
                </div>
            )}
    
            <div className="card-title m-2 d-flex justify-content-between">
                <div className="d-flex">
                    <DataLoader spinnerMultiplier={2} isLoading={isLoadingImage}>
                        {user && imageUrl ? (
                            <img className="me-2" src={imageUrl} alt="Imagen" style={{ borderRadius: "50%", width: "60px", height: "60px" }} />
                        ) : (
                            <img src={ic_user_no_image} alt="Imagen" style={{ borderRadius: "50%", width: "60px", height: "60px" }} />
                        )}
                        <div className="d-flex flex-column justify-content-center align-items-start">
                            <h5 className="my-1">{user?.name} {user?.surname}</h5>
                            <h6 className="my-1" style={{ fontSize: "small" }}>{reviewModel.date}</h6>
                        </div>
                    </DataLoader>
                </div>
                <div className="my-2 d-flex">
                    <StarRating score={reviewModel.score} />
                </div>
            </div>
    
            <div className="card-body m-2 p-0">
                <div className="card-text">
                    <h2 className="m-0 align-self-center" style={{ fontSize: "x-large" }}>{reviewModel.title}</h2>
                    <h6 className="m-0" style={{ fontSize: "medium" }} id="reviewDescription">{reviewModel.description}</h6>
                </div>
            </div>
    
            {isEditing && (
                <div className="btn-group card-body container-fluid p-1 d-flex justify-content-center align-items-end" role="group">
                    <IconButton onClick={() => editReview(reviewModel.id)}
                        aria-label={t("AriaLabel.editReview")} title={t("AriaLabel.editReview")}
                        component="span" style={{ fontSize: "xx-large" }}>
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => {
                            confirmDialogModal(
                                t('Review.deleteModal.title'), t('Review.deleteModal.confirmDelete', { reviewTitle: reviewModel.title }),
                                () => deleteReview(reviewModel.id)
                            )
                        }}
                        aria-label={t("AriaLabel.deleteReview")} title={t("AriaLabel.deleteReview")}
                        component="span" style={{ fontSize: "xx-large" }}>
                        <DeleteIcon />
                    </IconButton>
                </div>
            )}
        </div>
    );
}