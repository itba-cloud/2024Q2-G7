import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import { userService } from "../services";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { showToast } from "../scripts/toast";
// @ts-ignore
import VisibilityIcon from "@mui/icons-material/Visibility";
// @ts-ignore
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useAuthNew } from "../context/AuthProvider";
import { AuthService } from "../services/AuthService";
import { UserService } from "../services/UserService";

type FormDataCreate = {
    name: string
    surname: string
    email: string
    password: string
    confirmPassword: string
};

export default function Register() {

    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()

    const AuthContext = useAuthNew();

    // @ts-ignore
    const from = location.state?.from?.pathname || "/"

    const [seePassword, setSeePassword] = useState(false)
    const [seeRepeatPassword, setSeeRepeatPassword] = useState(false)

    useEffect(() => {
        document.title = `${t('PageName')} - ${t('PageTitles.register')}`
    }, [])

    function showPassword() {
        setSeePassword(!seePassword)
    }

    function showRepeatPassword() {
        setSeeRepeatPassword(!seeRepeatPassword)
    }

    const { register, watch, handleSubmit, formState: { errors }, }
        = useForm<FormDataCreate>({ criteriaMode: "all" })


    const onSubmitCreate = handleSubmit((data: FormDataCreate) => {
        userService.register(data.name, data.surname, data.email, data.password, data.confirmPassword)
        .then(() => {
            showToast(t('Login.toast.verifySent'), 'success')
            navigate("/confirmEmail", { state: { email: data.email } });
        })
        .catch((error) => {
            console.error("Register error:", error);
            let parsedError;
            try {
                parsedError = JSON.parse(error.message);  
            } catch (e) {
                parsedError = error;  
            }
            if (parsedError.name && parsedError.name === "UsernameExistsException") {
                showToast("Register.toast.alreadyExists", 'error')
            } else {
                showToast(t('Register.toast.error'), 'error');
            }
        })
    })

    return (
        <>
            <div className="container-fluid p-0 my-auto h-auto w-100 d-flex justify-content-center align-items-center">
                <div className="container-lg w-100 p-2 modalContainer">
                    <div className="row w-100 m-0 p-4 align-items-center justify-content-center">
                        <div className="col-12">
                            <h1 className="text-center title">
                                {t('Navbar.createAccountPopUp')}
                            </h1>
                            <p className="subtitle text-center">
                                {t('Navbar.createAccountDescription')}
                            </p>
                        </div>
                        <div className="col-12">
                            <div className="container-lg">
                                <div className="row">
                                    <form id="createAccountForm" onSubmit={onSubmitCreate}>
                                        <div className="form-group">
                                            <label className="form-label d-flex justify-content-between"
                                                htmlFor="email">
                                                <div>
                                                    {t('Navbar.email')}
                                                    <span className="required-field">*</span>
                                                </div>
                                                <div className="align-self-center">
                                                    <h6 className="max-input-text">
                                                        {t('Navbar.max', { num: 255 })}
                                                    </h6>
                                                </div>
                                            </label>
                                            <input type="text" id="email"
                                                className="form-control"
                                                placeholder={t('Navbar.emailPlaceholder')}
                                                aria-describedby="email input"
                                                max="255"
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
                                                })} />
                                            {errors.email?.type === "required" && (
                                                <p className="form-control is-invalid form-error-label">
                                                    {t("Register.error.email.isRequired")}
                                                </p>
                                            )}
                                            {errors.email?.type === "length" && (
                                                <p className="form-control is-invalid form-error-label">
                                                    {t("Register.error.email.length")}
                                                </p>
                                            )}
                                            {errors.email?.type === "pattern" && (
                                                <p className="form-control is-invalid form-error-label">
                                                    {t("Register.error.email.pattern")}
                                                </p>
                                            )}
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

                                            <input max="50" type="text" id="name"
                                                className="form-control"
                                                placeholder={t('Navbar.namePlaceholder')}
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
                                                })} />
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
                                            <input max="50" type="text" id="surname"
                                                className="form-control"
                                                placeholder={t('Navbar.surnamePlaceholder')}
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
                                            {errors.surname?.type === "pattern" && (
                                                <p className="form-control is-invalid form-error-label">
                                                    {t("Register.error.surname.pattern")}
                                                </p>
                                            )}
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="password"
                                                className="form-label d-flex justify-content-between">
                                                <div>
                                                    {t('Navbar.password')}
                                                    <span className="required-field">*</span>
                                                </div>
                                                <div className="align-self-center">
                                                    <h6 className="max-input-text">
                                                        {t('Navbar.max', { num: 25 })}
                                                    </h6>
                                                </div>
                                            </label>
                                            <div className="input-group d-flex justify-content-start align-items-center">
                                                <input type={seePassword ? "text" : "password"}
                                                    className="form-control"
                                                    id="password"
                                                    aria-describedby="password input"
                                                    placeholder={t('Navbar.passwordPlaceholder')}
                                                    min="8" max="25"
                                                    {...register("password", {
                                                        required: true,
                                                        validate: {
                                                            length: (password) =>
                                                                password.length >= 8 && password.length <= 25,
                                                        },
                                                        pattern: {
                                                            value: /^(?=.*\d)[A-Za-z0-9@$!%*#?&_]*$/, // Al menos un dígito requerido
                                                            message: t("Register.error.password.pattern"),
                                                        },
                                                    })}
                                                />
                                                <div className="input-group-append">
                                                    <IconButton className="btn btn-eye input-group-text"
                                                        id="passwordEye" type="button" tabIndex={-1} onClick={() => showPassword()}
                                                        aria-label={t("AriaLabel.showPassword")} title={t("AriaLabel.showPassword")}>
                                                        {seePassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                                    </IconButton>
                                                </div>
                                            </div>
                                            {errors.password?.type === "required" && (
                                                <p className="form-control is-invalid form-error-label">
                                                    {t("Register.error.password.isRequired")}
                                                </p>
                                            )}
                                            {errors.password?.type === "length" && (
                                                <p className="form-control is-invalid form-error-label">
                                                    {t("Register.error.password.length")}
                                                </p>
                                            )}
                                            {errors.password?.type === "pattern" && (
                                                <p className="form-control is-invalid form-error-label">
                                                    {t("Register.error.password.pattern")}
                                                </p>
                                            )}
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="confirmPassword" className="form-label">
                                                {t('Navbar.confirmPassword')}
                                                <span className="required-field">*</span>
                                            </label>
                                            <div className="input-group d-flex justify-content-start align-items-center">
                                                <input type={seeRepeatPassword ? "text" : "password"}
                                                    className="form-control"
                                                    id="confirmPassword"
                                                    aria-describedby="password input"
                                                    {...register("confirmPassword", {
                                                        required: true,
                                                        validate: {
                                                            length: (confirmPassword) =>
                                                                confirmPassword.length >= 8 && confirmPassword.length <= 25,
                                                        },
                                                        pattern: {
                                                            value: /^(?=.*\d)[A-Za-z0-9@$!%*#?&_]*$/, // Al menos un dígito requerido
                                                            message: t("Register.error.password.pattern"),
                                                        },
                                                    })} />
                                                <div className="input-group-append">
                                                    <IconButton className="btn btn-eye input-group-text"
                                                        id="passwordEye2" type="button" tabIndex={-1} onClick={() => showRepeatPassword()}
                                                        aria-label={t("AriaLabel.showPassword")} title={t("AriaLabel.showPassword")}>
                                                        {seeRepeatPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                                    </IconButton>
                                                </div>
                                            </div>
                                            {errors.confirmPassword?.type === "required" && (
                                                <p className="form-control is-invalid form-error-label">
                                                    {t("Register.error.password.isRequired")}
                                                </p>
                                            )}
                                            {watch('password') !== watch('confirmPassword') && (
                                                <p className="form-control is-invalid form-error-label">
                                                    {t("Register.error.passwordsMustMatch")}
                                                </p>
                                            )}
                                        </div>
                                    </form>

                                    <div className="col-12 px-0 d-flex align-items-center justify-content-center">
                                        <button form="createAccountForm" type="submit" id="registerFormButton"
                                            aria-label={t("AriaLabel.register")} title={t("AriaLabel.register")}
                                            className="w-100 btn-create-account my-2 ">
                                            {t('Navbar.register')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}