import { AgentModel, ExperienceModel, UserModel } from "../types";
import { adminService } from "../services";
import { showToast } from "./toast";
import { NavigateFunction } from "react-router-dom";
import { Dispatch, SetStateAction } from "react";
import { TFunction } from "react-i18next";

export function approveExperience(
    experience: ExperienceModel,
    approve: boolean,
    t: TFunction
) {
    //TODO en realidad habria que usar el serviceHandler para catcher los errores
    adminService.approveExperience(experience.id, approve)
        .then(() => {
            if (approve) {
                showToast(t('Admin.toast.approveExperience', { experienceName: experience.name }), "success")  
            } else {
                showToast(t('Admin.toast.denyExperience', { experienceName: experience.name }), "success")   
            }
        })
        .catch(() => {
            if (approve) {
                showToast(t('Admin.toast.approveExperienceError', { experienceName: experience.name }), "error")
            } else {
                showToast(t('Admin.toast.denyExperienceError', { experienceName: experience.name }), "error")    
            }
        });
}

export function approveAgent(
    agent: AgentModel,
    approve: boolean,
    t: TFunction
) {
    //TODO en realidad habria que usar el serviceHandler para catcher los errores
    adminService.approveAgent(agent.id, approve)
        .then(() => {
            if (approve) {
                showToast(t('Admin.toast.approveAgent', { name: agent.name }), "success")
            } else {
                showToast(t('Admin.toast.denyAgent', { name: agent.name }), "success")
            }
        })
        .catch(() => {
            if (approve) {
                showToast(t('Admin.toast.approveAgentError', { name: agent.name }), "error")
            } else {
                showToast(t('Admin.toast.denyAgentError', { name: agent.name }), "error")
            }
        });
}