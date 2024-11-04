import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { showToast } from "../../scripts/toast";
import { userService } from "../../services";
import { AuthService } from "../../services/AuthService";
import { UserModel } from "../../types";

type FormDataEditProfile = {
    name: string;
    surname: string;
};

interface EditProfileFormProps {
    user: UserModel;
    setUser: (user: UserModel) => void;
    isEditing: boolean;
    setIsEditing: (value: boolean) => void;
    setIsLoading: (value: boolean) => void;
}

export default function EditProfileForm({ user, setUser, isEditing, setIsEditing, setIsLoading }: EditProfileFormProps) {
    const { t } = useTranslation();
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormDataEditProfile>({
        defaultValues: {
            name: user.name,
            surname: user.surname,
        }
    });

    const handleCancelEdit = () => {
        reset({
            name: user.name,
            surname: user.surname,
        });
        setIsEditing(false);
    };

    const onSubmitEdit = handleSubmit((data: FormDataEditProfile) => {
        setIsLoading(true);
        userService.updateUserInfoById(user.id, data.name, data.surname)
            .then((result) => {
                if (!result.hasFailed()) {
                    AuthService.editUserInfo(data.name, data.surname);
                    setUser({ ...user, name: data.name, surname: data.surname });
                    showToast(t('User.toast.editProfile.success'), 'success');
                }
            })
            .catch(() => {
                showToast(t('User.toast.editProfile.error'), 'error');
            })
            .finally(() => {
                setIsEditing(false);
                setIsLoading(false);
            });
    });

    return (
        <form id="editProfileForm" onSubmit={onSubmitEdit} method="post" className="w-100">

            <div className="form-group">
                <label htmlFor="email" className="form-label d-flex justify-content-between">
                    <div>
                        {t('Navbar.email')}
                        <span className="required-field">*</span>
                    </div>
                </label>
                <input
                    type="text"
                    id="email"
                    className="form-control"
                    disabled
                    value={user.email}
                    style={{ color: "grey" }}
                    aria-describedby="email input"
                />
            </div>

            <div className="form-group">
                <label htmlFor="name"
                    className="form-label d-flex justify-content-between">
                    <div>
                        {t('Navbar.name')}
                        <span className="required-field">*</span>
                    </div>
                    <div className="align-self-center">
                        <h6 className="max-input-text">
                            {t('Navbar.max', { num: 50 })}
                        </h6>
                    </div>
                </label>
                <input
                    type="text"
                    id="name"
                    className="form-control"
                    max="50"
                    disabled={!isEditing}
                    {...register("name", {
                        required: true,
                        validate: {
                            length: (name) =>
                                name.length >= 0 && name.length <= 50,
                        },
                        pattern: {
                            value: /^[A-Za-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆŠŽ∂ð' ]*$/,
                            message: t("Register.error.name.pattern"),
                        },
                    })}
                />
                {errors.name?.type === "required" && (
                    <p className="form-control is-invalid form-error-label">
                        {t("Register.error.name.isRequired")}
                    </p>
                )}
                {errors.name?.type === "length" && (
                    <p className="form-control is-invalid form-error-label">
                        {t("Register.error.name.length")}
                    </p>
                )}
                {errors.name?.type === "pattern" && (
                    <p className="form-control is-invalid form-error-label">
                        {t("Register.error.name.pattern")}
                    </p>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="surname"
                    className="form-label d-flex justify-content-between">
                    <div>
                        {t('Navbar.surname')}
                        <span className="required-field">*</span>
                    </div>
                    <div className="align-self-center">
                        <h6 className="max-input-text">
                            {t('Navbar.max', { num: 50 })}
                        </h6>
                    </div>
                </label>
                <input
                    type="text"
                    id="surname"
                    className="form-control"
                    max="50"
                    disabled={!isEditing}
                    {...register("surname", {
                        required: true,
                        validate: {
                            length: (surname) =>
                                surname.length >= 0 && surname.length <= 50,
                        },
                        pattern: {
                            value: /^[A-Za-zàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆŠŽ∂ð' ]*$/,
                            message: t("Register.error.surname.pattern"),
                        },
                    })}
                />
                {errors.surname?.type === "required" && (
                    <p className="form-control is-invalid form-error-label">
                        {t("Register.error.surname.isRequired")}
                    </p>
                )}
                {errors.surname?.type === "length" && (
                    <p className="form-control is-invalid form-error-label">
                        {t("Register.error.surname.length")}
                    </p>
                )}
                {errors.name?.type === "pattern" && (
                    <p className="form-control is-invalid form-error-label">
                        {t("Register.error.surname.pattern")}
                    </p>
                )}
            </div>

            {isEditing && (
                <div className="d-flex align-items-center justify-content-around">
                    <button
                        type="button"
                        className="btn btn-cancel-form px-3 py-2" id="cancelFormButton"
                        aria-label={t("AriaLabel.cancel")} title={t("AriaLabel.cancel")}
                        onClick={handleCancelEdit}
                    >
                        {t('Button.cancel')}
                    </button>
                    <button
                        form="editProfileForm" id="editProfileFormButton"
                        className="btn btn-submit-form px-3 py-2" type="submit"
                        aria-label={t("AriaLabel.save")} title={t("AriaLabel.save")}
                    >
                        {t('Button.create')}
                    </button>
                </div>
            )}
        </form>
    );
}
