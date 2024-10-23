import { useTranslation } from "react-i18next";
import "../../common/i18n/index";
import { AgentModel, ExperienceModel, ReviewModel, UserModel } from "../../types";
import { Link, useNavigate } from 'react-router-dom'
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import StarRating from "./StarRating";
import { agentsService, reviewService, userService } from "../../services";
import { showToast } from "../../scripts/toast";
import ic_user_no_image from "../../images/ic_user_no_image.png";
import { serviceHandler } from "../../scripts/serviceHandler";
import { fetchImageUrl } from "../../scripts/getImage";
import { paths } from "../../common";

export default function CardReviewAgent(props: {
    reviewModel: ReviewModel,
    isEditing: boolean,
    onEdit?: [boolean, Dispatch<SetStateAction<boolean>>],
}) {

    const { t } = useTranslation()
    const navigate = useNavigate()
    const { reviewModel, isEditing, onEdit } = props

    const [agent, setAgent] = useState<AgentModel | undefined>(undefined)
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
        if (isEditing && reviewModel.agent_id) {
            serviceHandler(
                agentsService.getAgentById(reviewModel.agent_id),
                navigate, (agent) => { setAgent(agent) },
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
                showToast(t('Testimonial.toast.deleteSuccess', { title: reviewModel.title }), "success")
            })
            .catch(() => {
                showToast(t('Testimonial.toast.deleteError', { title: reviewModel.title }), "error")
            });
    }

    //TODO dejar mas fachero el testimonio

    return (
        <>
            <blockquote className="blockquote">
                {reviewModel.description}
                <footer>- {user?.name} {user?.surname}</footer>
            </blockquote>
        </>
        
    );
}