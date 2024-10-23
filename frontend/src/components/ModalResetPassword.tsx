import { useTranslation } from "react-i18next";
import "../common/i18n/index";
import Modal from "react-modal";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { userService } from "../services";
import { showToast } from "../scripts/toast";
import ic_user_black from "../images/ic_user_black.svg";

type FormDataPasswordResetEmail = {
    email: string;
};

/* export default function ModalResetPassword(props: { isOpen: [boolean, Dispatch<SetStateAction<boolean>>] }) {

    const { t } = useTranslation()
    const { isOpen } = props
    const [invalidEmail, setInvalidEmail] = useState(false)

    const { register, reset, handleSubmit, formState: { errors }, } = useForm<FormDataPasswordResetEmail>({
        criteriaMode: "all",
    })

    const onSubmit = handleSubmit((data: FormDataPasswordResetEmail) => {
        setInvalidEmail(false)
        userService.sendPasswordResetEmail(data.email)
            .then((user) => {
                if (!user.hasFailed()) {
                    isOpen[1](false)
                    reset()
                    showToast(t('User.toast.passwordResetEmailSuccess'), 'success')
                } else {
                    setInvalidEmail(true)
                }
            }
            )
            .catch(() => {
                showToast(t('User.toast.passwordResetEmailError'), 'error')
            })
    }
    )

    return (
        <Modal style={{ overlay: { zIndex: 100 } }}
            className="modal-pop-up"
            isOpen={isOpen[0]}
            contentLabel="PopUpPassword"
            onRequestClose={() => {
                isOpen[1](false);
                reset()
            }}
        >
            <div className="container-fluid p-0 my-auto h-auto w-100 d-flex justify-content-center align-items-center">
                <div className="row w-100 h-100 py-5 px-3 m-0 align-items-center justify-content-center">
                    <div className="col-12">
                        <h1 className="text-center title">
                            {t('Navbar.resetPasswordTitle')}
                        </h1>
                    </div>
                    <div className="col-12">
                        <div className="container-fluid">
                            <div className="row">
                                <form id="passResetRequestEmail" acceptCharset="utf-8"
                                    onSubmit={onSubmit} method="post">
                                    <label className="form-label d-flex align-items-center"
                                        htmlFor="email">
                                        <img src={ic_user_black}
                                            alt="Imagen perfil"
                                            style={{ marginRight: "5px" }} />
                                        {t('Navbar.email')}
                                        <span className="required-field">*</span>

                                    </label>
                                    <input type="text" id="email"
                                        className="form-control"
                                        placeholder={t('Navbar.emailPlaceholder')}
                                        aria-describedby="Email input"
                                        {...register("email", { required: true, })} />

                                    {errors.email?.type === "required" && (
                                        <p className="form-control is-invalid form-error-label">
                                            {t("Register.error.email.isRequired")}
                                        </p>
                                    )}
                                    {invalidEmail &&
                                        <p className="form-control is-invalid form-error-label">
                                            {t("ChangePassword.invalidEmail")}
                                        </p>
                                    }
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 mt-3 d-flex align-items-center justify-content-center">
                        <button form="passResetRequestEmail" type="submit" id="passResetEmailButton" className='btn button-primary'
                            aria-label={t("AriaLabel.send")} title={t("AriaLabel.send")}>
                            {t('Navbar.resetPasswordButton')}
                        </button>
                    </div>

                </div>
            </div>
        </Modal>
    );
} */