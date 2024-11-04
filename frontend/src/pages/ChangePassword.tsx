import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { userService } from "../services";
import { getQueryOrDefault, useQuery } from "../hooks/useQuery";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
//import { useAuth } from "../hooks/useAuth";
import { showToast } from "../scripts/toast";
// @ts-ignore
import VisibilityIcon from "@mui/icons-material/Visibility";
// @ts-ignore
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

type FormDataResetPassword = {
    password: string,
    confirmPassword: string,
};

/* export default function ChangePassword() {
    //const { isLogged } = useAuth()
    //const isLoggedValue = isLogged()

    const { t } = useTranslation()
    const query = useQuery();
    const navigate = useNavigate()
    const passwordToken = getQueryOrDefault(query, "passwordToken", "")

    const [seePassword, setSeePassword] = useState(false)
    const [seeRepeatPassword, setSeeRepeatPassword] = useState(false)

    function showPassword() {
        setSeePassword(!seePassword)
    }

    function showRepeatPassword() {
        setSeeRepeatPassword(!seeRepeatPassword)
    }

    useEffect(() => {
        //if (isLoggedValue) {
        //    navigate("/", { replace: true })
        //    showToast(t('ChangePassword.toast.forbidden'), 'error')
        //} else if (passwordToken === "" || passwordToken === undefined) {
        //    navigate("/", { replace: true })
        //    showToast(t('ChangePassword.toast.missPasswordToken'), 'error')
        //}
        document.title = `${t('PageName')} - ${t('PageTitles.changePassword')}`
    }, [])

    const { register, watch, handleSubmit, formState: { errors }, } = useForm<FormDataResetPassword>({
        criteriaMode: "all",
    });

    const onSubmit = handleSubmit((data: FormDataResetPassword) => {
        userService.resetPassword(passwordToken, data.password)
            .then((res) => {
                if (!res.hasFailed()) {
                    navigate("/login", { replace: true })
                    showToast(t('ChangePassword.toast.success'), 'success')
                }
            }
            )
            .catch(() => {
                showToast(t('ChangePassword.toast.error'), 'success')
            })
    }
    )

    return (
        <div className="container-fluid p-0 my-auto h-auto w-100 d-flex justify-content-center align-items-center">
            <div className="w-100 modalContainer">
                <div className="row w-100 h-100 py-5 px-3 m-0 align-items-center justify-content-center">
                    <div className="col-12">
                        <h1 className="text-center title">
                            {t('ChangePassword.title')}
                        </h1>
                    </div>
                    <div className="col-12">
                        <div className="container-fluid">
                            <div className="row">
                                <form id="passwordReset" method="POST" acceptCharset="UTF-8" onSubmit={onSubmit}>
                                    <div className="form-group mt-2 mb-4">
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
                                                        value: /^[A-Za-z0-9@$!%*#?&_]*$/,
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
                                                        value: /^[A-Za-z0-9@$!%*#?&_]*$/,
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
                                                {t("Register.error.isRequired")}
                                            </p>
                                        )}
                                        {errors.confirmPassword?.type === "pattern" && (
                                            <p className="form-control is-invalid form-error-label">
                                                {t("Register.error.password.pattern")}
                                            </p>
                                        )}
                                        {watch('password') !== watch('confirmPassword') && (
                                            <p className="form-control is-invalid form-error-label">
                                                {t("Register.error.passwordsMustMatch")}
                                            </p>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 mt-3 d-flex align-items-center justify-content-center">
                        <button form="passwordReset" id="passwordResetButton" type="submit" className="btn btn-continue"
                            aria-label={t("AriaLabel.confirm")} title={t("AriaLabel.confirm")}>
                            {t('Button.confirm')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} */