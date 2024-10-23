import { ExperienceModel, TripModel } from "../types";
import { userService, experienceService } from "../services";
import { showToast } from "./toast";
import { NavigateFunction } from "react-router-dom";
import { Dispatch, SetStateAction } from "react";
import { TFunction } from "react-i18next";
import { AuthService } from "../services/AuthService";
import { serviceHandler } from "./serviceHandler";

export function setVisibility(
    experience: ExperienceModel,
    visibility: boolean,
    setView: Dispatch<SetStateAction<boolean>>,
    t: TFunction
) {
    //TODO en realidad habria que usar el serviceHandler para catcher los errores
    experienceService.setExperienceObservable(experience.id, visibility)
        .then(() => {
            if (visibility) {
                showToast(t('Experience.toast.visibilitySuccess', { experienceName: experience.name }), "success")
            } else {
                showToast(t('Experience.toast.noVisibilitySuccess', { experienceName: experience.name }), "success")
            }
            setView(visibility)
        })
        .catch(() => {
            showToast(t('Experience.toast.visibilityError', { experienceName: experience.name }), "error")
        });
}

export function setFavExperience(
    userId: string,
    experience: ExperienceModel,
    fav: boolean,
    setFav: Dispatch<SetStateAction<boolean>>,
    t: TFunction,
    AuthContext: any
) {
    //TODO en realidad habria que usar el serviceHandler para catcher los errores
    userService.setExperienceFav(userId, experience.id, fav)
        .then(() => {
            AuthService.updateFavourites(AuthContext, experience, fav)
            if (fav) {
                showToast(t('Experience.toast.favSuccess', { experienceName: experience.name }), "success")
            } else {
                showToast(t('Experience.toast.noFavSuccess', { experienceName: experience.name }), "success")
            }
            setFav(fav)
        })
        .catch(() => {
            if (fav) {
                showToast(t('Experience.toast.favError', { experienceName: experience.name }), "error")
            } else {
                showToast(t('Experience.toast.noFavError', { experienceName: experience.name }), "error")
            }
        });
}


export function deleteExperience(
    experience: ExperienceModel,
    onEdit: [boolean, Dispatch<SetStateAction<boolean>>] | undefined,
    isOnEdit: boolean,
    navigate: NavigateFunction,
    t: TFunction
) {
    //TODO en realidad habria que usar el serviceHandler para catcher los errores
    experienceService.deleteExperienceById(experience.id)
        .then(() => {
            if (!isOnEdit) {
                navigate('/user/experiences', { replace: true })
            }
            if (isOnEdit && onEdit) {
                onEdit[1](!onEdit[0])
            }
            showToast(t('Experience.toast.deleteSuccess', { experienceName: experience.name }), "success")
        })
        .catch(() => {
            showToast(t('Experience.toast.deleteError', { experienceName: experience.name }), "error")
        });
}

export function editExperience(
    experienceId: string,
    navigate: NavigateFunction
) {
    navigate({ pathname: "/experienceForm", search: `?id=${experienceId}` }, { replace: true });
}

export function setExperienceInUserTrip(
    userId: string,
    trip: TripModel,
    experience: ExperienceModel,
    set: boolean,
    t: TFunction
) {
    //TODO en realidad habria que usar el serviceHandler para catcher los errores
    userService.setExperienceInUserTrip(userId, trip.id, experience.id, set)
        .then(() => {
            if (set) {
                showToast(t('Experience.toast.addTripSuccess', { experienceName: experience.name, tripName: trip.name }), "success")
            } else {
                showToast(t('Experience.toast.removeTripSuccess', { experienceName: experience.name, tripName: trip.name }), "success")
            }
        })
        .catch(() => {
            if (set) {
                showToast(t('Experience.toast.addTripError', { experienceName: experience.name, tripName: trip.name }), "error")
            } else {
                showToast(t('Experience.toast.removeTripError', { experienceName: experience.name, tripName: trip.name }), "error")
            }
        });
}