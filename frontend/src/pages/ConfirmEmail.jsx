import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../services/AuthService";
import { showToast } from "../scripts/toast";

const ConfirmEmail = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const codeRef = useRef();
  const [isPending, setIsPending] = useState(false);
  const [code, setCode] = useState("");
  const [email, setEmail] = useState();

  useEffect(() => {
    codeRef.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsPending(true);
    AuthService.confirmEmail(email, code)
      .then(() => {
        showToast(t('ConfirmEmail.toast.confirmedEmail'), 'success')
        navigate("/login");
      })
      .catch((error) => {
        if (error.name === "NotAuthorizedException") {
          // Already confirmed
          showToast(t('ConfirmEmail.toast.alreadyConfirmed'), 'error')
          navigate("/login");
        } else {
          showToast(t('ConfirmEmail.toast.pleaseTryAgain'), 'error')
        } 
      })
      .finally(() => {
        setIsPending(false);
      });
  };

  const resendCode = async () => {
    if (!email) {
        showToast(t('ConfirmEmail.toast.emailRequired'), 'error')
        return
    } 
    await AuthService.resendCode(email)
      .then(() => {
        console.log("Code resent");
        showToast(t('ConfirmEmail.toast.codeResent'), 'success')
      })
      .catch((error) => {
        console.error("resend code ERROR: " + error);
        showToast(t('ConfirmEmail.toast.pleaseTryAgain'), 'error')
      });
  };

  return (
    <div className="container-fluid p-0 my-auto h-auto w-100 d-flex justify-content-center align-items-center">
      <div className="w-100 modalContainer">
          <div className="row w-100 h-100 py-5 px-3 m-0 align-items-center justify-content-center">
              <div className="col-12">
                  <h1 className="text-center title">
                    {t("ConfirmEmail.confirmEmail")}
                  </h1>
              </div>
              <div className="col-12">
                  <div className="container-fluid">
                      <div className="row">
                          <form id="confirmEmail" method="POST" acceptCharset="UTF-8" onSubmit={handleSubmit}>
                              <div className="form-group mt-2 mb-4">
                                  <label htmlFor="email"
                                      className="form-label d-flex justify-content-between">
                                      <div>
                                          {t('ConfirmEmail.email')}
                                          <span className="required-field">*</span>
                                      </div>
                                  </label>
                                  <div className="input-group d-flex justify-content-start align-items-center">
                                      <input
                                          name="email"
                                          className="form-control"
                                          placeholder={t('ConfirmEmail.emailPlaceholder')}
                                          type="text"
                                          id="email"
                                          autoComplete="off"
                                          onChange={(e) => setEmail(e.target.value)}
                                          value={email}
                                          required
                                          pattern="[A-Za-zÑñÁáÉéÍíÓóÚúÜü0-9@.]*"
                                          title={t("ConfirmEmail.email")}
                                      />
                                  </div>
                              </div>

                              <div className="form-group">
                                  <label htmlFor="code" className="form-label">
                                      {t('ConfirmEmail.code')}
                                      <span className="required-field">*</span>
                                  </label>
                                  <div className="input-group d-flex justify-content-start align-items-center">
                                      <input 
                                          name="code"
                                          className="form-control"
                                          placeholder="Code"
                                          type="text"
                                          ref={codeRef}
                                          id="code"
                                          pattern="[0-9]*"
                                          title={t("ConfirmEmail.code")}
                                          onChange={(e) => setCode(e.target.value)}
                                          value={code}
                                          required
                                      />
                                  </div>
                              </div>
                          </form>
                      </div>
                  </div>
              </div>
              <div className="col-12 mt-3 d-flex align-items-center justify-content-around">
                  <button className="btn btn-cancel-form px-3 py-2" id="resendCodeButton"
                          aria-label={t("ConfirmEmail.resendCode")} title={t("ConfirmEmail.resendCode")}
                          onClick={resendCode} type="submit">
                          {t('ConfirmEmail.resendCode')}
                  </button>
                  <button form="confirmEmail" id="confirmEmailButton"
                      type="submit" className="btn button-primary"
                      aria-label={t("ConfirmEmail.checkCode")} 
                      title={t("ConfirmEmail.checkCode")}>
                      {t('ConfirmEmail.checkCode')}
                  </button>
              </div>
          </div>
      </div>
  </div>
  );
};

export default ConfirmEmail;
