import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { AgentModel } from "../../types";
import { agentsService } from "../../services";
import { showToast } from "../../scripts/toast";

type AgentFormData = {
    name: string
    email: string
    phone: string
    agency: string
    address: string
    specialization: string
    languages: string
    experience: number
    bio: string
    twitter: string
    instagram: string
};

interface EditAgentFormProps {
    agent: AgentModel | undefined;
    setAgent: (agent: AgentModel) => void;
    isCreating: boolean;
    setIsCreating: (value: boolean) => void;
    isEditing: boolean;
    setIsEditing: (value: boolean) => void;
    setIsLoading: (value: boolean) => void;
};

const AgentForm = ({ agent, setAgent, isCreating, setIsCreating, isEditing, setIsEditing, setIsLoading }: EditAgentFormProps) => {
    
    const { t } = useTranslation();

    const { register, handleSubmit, formState: { errors }, reset } = useForm<AgentFormData>({
        defaultValues: agent || {}
    });

    const handleCancelEdit = () => {
        reset(agent);
        setIsEditing(false);
        setIsCreating(false);
    };

    const checkIfDisable = () => {
        return (!isEditing && isCreating && agent !== undefined) || (isEditing && !isCreating && agent === undefined) || (!isEditing && !isCreating && agent !== undefined)
    }

    useEffect(() => {
        console.log("agent", agent)
        console.log("creating", isCreating)
        console.log("editing", isEditing)
    }, [isEditing])

    const onSubmit = handleSubmit((data: AgentFormData) => {
        setIsLoading(true)
        if (agent === undefined) {
            agentsService.createAgent(
                data.name, data.email, data.phone,
                data.address, data.languages, Number(data.experience),
                data.bio, data.agency, data.specialization,
                data.twitter, data.instagram
            )
                .then((result) => {
                    if (!result.hasFailed()) {
                        showToast(t('Agents.toast.createAgent.success'), 'success')
                    }
                })
                .catch(() => {
                    showToast(t('Agents.toast.createAgent.error'), 'error')
                })
                .finally(() => {
                    setIsCreating(false);
                    setIsLoading(false);
                });
        } else {
            agentsService.updateAgentById(
                agent.id,
                data.name, data.email, data.phone,
                data.address, data.languages, Number(data.experience),
                data.bio, data.agency, data.specialization,
                data.twitter, data.instagram
            )
                .then((result) => {
                    if (!result.hasFailed()) {
                        showToast(t('Agents.toast.updateAgent.success'), 'success')
                    }
                })
                .catch(() => {
                    showToast(t('Agents.toast.updateAgent.error'), 'error')
                })
                .finally(() => {
                    setIsEditing(false);
                    setIsLoading(false);
                });
        }
    });

    return (
        <form onSubmit={onSubmit} method="post" className="row g-3" id="agentForm">
            {/* Nombre */}
            <div className="col-md-6">
                <label htmlFor="name" className="form-label d-flex justify-content-between">
                    <div>
                        {t('Agents.form.name')}
                        <span className="required-field">*</span>
                    </div>
                    <div className="align-self-center">
                        <h6 className="max-input-text">
                            {t('Navbar.max', { num: 50 })}
                        </h6>
                    </div>
                </label>
                <input max="50" type="text" id="name"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`} 
                    disabled={checkIfDisable()}
                    {...register("name", { required: true, maxLength: 50 })} 
                />
                {errors.name && <p className="invalid-feedback">{t('Agents.form.error.name')}</p>}
            </div>

            {/* Email */}
            <div className="col-md-6">
                <label htmlFor="email" className="form-label d-flex justify-content-between">
                    <div>
                        {t('Agents.form.email')}
                        <span className="required-field">*</span>
                    </div>
                    <div className="align-self-center">
                        <h6 className="max-input-text">
                            {t('Navbar.max', { num: 255 })}
                        </h6>
                    </div>
                </label>
                <input type="text" id="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`} 
                    disabled={checkIfDisable()}
                    {...register("email", {
                        required: true,
                        validate: {
                            length: (email) =>
                                email.length >= 0 && email.length <= 255,
                        },
                        pattern: {
                            value: /^([a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+)*$/,
                            message: t("Register.error.email.pattern"),
                        },
                    })}
                />
                {errors.email && <p className="invalid-feedback">{t('Agents.form.error.email')}</p>}
            </div>

            {/* Teléfono */}
            <div className="col-md-6">
                <label htmlFor="phone" className="form-label d-flex justify-content-between">
                    <div>
                        {t('Agents.form.phone')}
                        <span className="required-field">*</span>
                    </div>
                    <div className="align-self-center">
                        <h6 className="max-input-text">
                            {t('Navbar.max', { num: 12 })}
                        </h6>
                    </div>
                </label>
                <input 
                    type="tel" 
                    id="phone" 
                    disabled={checkIfDisable()}
                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`} 
                    {...register("phone", { required: true, maxLength: 15 })} 
                />
                {errors.phone && <p className="invalid-feedback">{t('Agents.form.error.phone')}</p>}
            </div>

            {/* Dirección */}
            <div className="col-md-6">
                <label htmlFor="address" className="form-label d-flex justify-content-between">
                    <div>
                        {t('Agents.form.address')}
                        <span className="required-field">*</span>
                    </div>
                    <div className="align-self-center">
                        <h6 className="max-input-text">
                            {t('Navbar.max', { num: 100 })}
                        </h6>
                    </div>
                </label>
                <input 
                    type="text" 
                    id="address" 
                    disabled={checkIfDisable()}
                    className={`form-control ${errors.address ? 'is-invalid' : ''}`} 
                    {...register("address", { required: true })} 
                />
                {errors.address && <p className="invalid-feedback">{t('Agents.form.error.address')}</p>}
            </div>

            {/* Agencia */}
            <div className="col-md-6">
                <label htmlFor="agency" className="form-label">{t('Agents.form.agency')}</label>
                <input 
                    type="text" 
                    id="agency" 
                    disabled={checkIfDisable()}
                    className={`form-control ${errors.agency ? 'is-invalid' : ''}`} 
                    {...register("agency", { })} 
                />
                {errors.agency && <p className="invalid-feedback">{t('Agents.form.error.agency')}</p>}
            </div>

            {/* Áreas de especialización */}
            <div className="col-md-6">
                <label htmlFor="specialization" className="form-label">{t('Agents.form.specialization')}</label>
                <input 
                    type="text" 
                    id="specialization" 
                    disabled={checkIfDisable()}
                    className={`form-control ${errors.specialization ? 'is-invalid' : ''}`} 
                    {...register("specialization", { })} 
                />
                {errors.specialization && <p className="invalid-feedback">{t('Agents.form.error.specialization')}</p>}
            </div>

            {/* Idiomas */}
            <div className="col-md-6">
                <label htmlFor="languages" className="form-label d-flex justify-content-between">
                    <div>
                        {t('Agents.form.languages')}
                        <span className="required-field">*</span>
                    </div>
                </label>
                <input 
                    type="text" 
                    id="languages" 
                    disabled={checkIfDisable()}
                    className={`form-control ${errors.languages ? 'is-invalid' : ''}`} 
                    {...register("languages", { required: true })} 
                />
                {errors.languages && <p className="invalid-feedback">{t('Agents.form.error.languages')}</p>}
            </div>

            {/* Nivel de experiencia */}
            <div className="col-md-6">
                <label htmlFor="experience" className="form-label d-flex justify-content-between">
                    <div>
                        {t('Agents.form.experience')}
                        <span className="required-field">*</span>
                    </div>
                </label>
                <input 
                    type="number" max="200"
                    id="experience" 
                    placeholder="0"
                    disabled={checkIfDisable()}
                    className={`form-control ${errors.experience ? 'is-invalid' : ''}`} 
                    {...register("experience", { 
                        required: true,
                        validate: {
                            isNotGreater: (experience) => {
                                return (!experience) || experience <= 200
                            },
                        }
                    })} 
                />
                {errors.experience && <p className="invalid-feedback">{t('Agents.form.error.experience')}</p>}
            </div>

            {/* Biografía */}
            <div className="col-md-12">
                <label htmlFor="bio" className="form-label d-flex justify-content-between">
                    <div>
                        {t('Agents.form.bio')}
                        <span className="required-field">*</span>
                    </div>
                    <div className="align-self-center">
                        <h6 className="max-input-text">
                            {t('Navbar.max', { num: 500 })}
                        </h6>
                    </div>
                </label>
                <textarea 
                    id="bio" 
                    disabled={checkIfDisable()}
                    className={`form-control ${errors.bio ? 'is-invalid' : ''}`} 
                    {...register("bio", { required: true, maxLength: 500 })} 
                />
                {errors.bio && <p className="invalid-feedback">{t('Agents.form.error.bio')}</p>}
            </div>

            {/* twitter */}
            <div className="col-md-6">
                <label htmlFor="twitter" className="form-label">{t('Agents.form.twitter')}</label>
                <input 
                    type="text" 
                    id="twitter" 
                    disabled={checkIfDisable()}
                    className="form-control" 
                    {...register("twitter")} 
                />
            </div>

            {/* instagram */}
            <div className="col-md-6">
                <label htmlFor="instagram" className="form-label">{t('Agents.form.instagram')}</label>
                <input 
                    type="text" 
                    id="instagram" 
                    disabled={checkIfDisable()}
                    className="form-control" 
                    {...register("instagram")} 
                />
            </div>

            {(isEditing || isCreating) && (
                <div className="mb-2 d-flex align-items-center justify-content-around">
                    <button 
                        type="button"
                        className="btn btn-cancel-form px-3 py-2" id="cancelFormButton"
                        aria-label={t("AriaLabel.cancel")} title={t("AriaLabel.cancel")}
                        onClick={handleCancelEdit}
                    >
                        {t('Button.cancel')}
                    </button>
                    <button 
                        form="agentForm" id="agentFormButton"
                        className="btn btn-submit-form px-3 py-2" type="submit"
                        aria-label={t("AriaLabel.save")} title={t("AriaLabel.save")}
                    >
                        {t('Button.create')}
                    </button>
                </div>
            )}
        </form>
    );
};

export default AgentForm;
