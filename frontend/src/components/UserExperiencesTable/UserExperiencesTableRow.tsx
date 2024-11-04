import { ExperienceModel } from "../../types";
import React, { Dispatch, SetStateAction, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import StarRating from "../Review/StarRating";
import { IconButton } from "@mui/material";
import { deleteExperience, editExperience, setVisibility } from "../../scripts/experienceOperations";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import EditIcon from "@mui/icons-material/Edit";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { confirmDialogModal } from "../ConfirmDialogModal";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";
import Price from "../Experience/Price";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';  
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'; 

export default function UserExperiencesTableRow(props: {
    experience: ExperienceModel,
    onEdit: [boolean, Dispatch<SetStateAction<boolean>>],
    setExperienceId: React.Dispatch<React.SetStateAction<string>>,
    isOpenImage: [boolean, Dispatch<SetStateAction<boolean>>],
}) {

    const { t } = useTranslation()
    const navigate = useNavigate()
    const { experience, onEdit, setExperienceId, isOpenImage } = props
    const [view, setView] = useState(experience.observable)

    return (
        <tr key={experience.id}>
            <td>
                <div className={`status-${experience.status.toLowerCase()}`}>
                    {experience.status.toLowerCase() === 'pending' ? (
                        <>
                            <HourglassEmptyIcon className="status-icon" /> 
                            {t('User.experiences.status.pending')}
                        </>
                    ) : (
                        <>
                            <CheckCircleIcon className="status-icon" />
                            {t('User.experiences.status.verified')}
                        </>
                    )}
                </div>
            </td>
            <td className="title-link" style={{ maxWidth: "200px" }}>
                <Link to={"/experiences/" + experience.id} 
                    className="experience card-title container-fluid p-0"
                    style={{ wordBreak: "break-all" }}
                    state={{ experience }}>
                    {experience.name}
                </Link>
            </td>
            <td>
                {t('Categories.' + experience.category)}
            </td>
            <td>
                <div className="d-flex justify-content-center">
                    <h5 className="mb-0">
                       ({experience.reviewCount})
                    </h5>
                    <StarRating score={experience.score} />
                </div>
            </td>
            <td>
                <Price price={experience.price} />
            </td>
            <td>
                {experience.views}
            </td>
            <td>
                {experience.favs}
            </td>
            <td>
                {view ? (
                    <IconButton
                        className="icon-button visibility"
                        onClick={() => setVisibility(experience, false, setView, t)}
                        aria-label={t("AriaLabel.visibility")}
                        title={t("AriaLabel.visibility")}
                    >
                        <VisibilityIcon />
                    </IconButton>
                ) : (
                    <IconButton
                        className="icon-button visibility"
                        onClick={() => setVisibility(experience, true, setView, t)}
                        aria-label={t("AriaLabel.visibility")}
                        title={t("AriaLabel.visibility")}
                    >
                        <VisibilityOffIcon />
                    </IconButton>
                )}

                <IconButton
                    className="icon-button edit"
                    onClick={() => editExperience(experience.id, navigate)}
                    aria-label={t("AriaLabel.editExperience")}
                    title={t("AriaLabel.editExperience")}
                >
                    <EditIcon />
                </IconButton>

                <IconButton
                    className="icon-button image"
                    onClick={() => {
                        setExperienceId(experience.id);
                        isOpenImage[1](true);
                    }}
                    aria-label={t("AriaLabel.editImage")}
                    title={t("AriaLabel.editImage")}
                >
                    <AddPhotoAlternateIcon />
                </IconButton>

                <IconButton
                    className="icon-button delete"
                    onClick={() =>
                        confirmDialogModal(
                            t('User.experiences.deleteTitle'),
                            t('User.experiences.confirmDelete', { experienceName: experience.name }),
                            () => deleteExperience(experience, onEdit, true, navigate, t)
                        )
                    }
                    aria-label={t("AriaLabel.deleteExperience")}
                    title={t("AriaLabel.deleteExperience")}
                >
                    <DeleteIcon />
                </IconButton>
            </td>
        </tr>
    )
}
