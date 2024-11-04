import { useTranslation } from "react-i18next";
import "../../common/i18n/index";
import { useNavigate, useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { ExperienceModel, OrderByModel } from "../../types";
import { serviceHandler } from "../../scripts/serviceHandler";
import { experienceService, userService } from "../../services";
import { IconButton } from "@mui/material";
import { useForm } from "react-hook-form";
import Pagination from "../../components/Pagination";
import OrderDropdown from "../../components/OrderDropdown";
import { Close } from "@mui/icons-material";
import DataLoader from "../../components/DataLoader";
import ConfirmDialogModal from "../../components/ConfirmDialogModal";
import { getQueryOrDefault, useQuery } from "../../hooks/useQuery";
import AddPictureModal from "../../components/AddPictureModal";
import { showToast } from "../../scripts/toast";
import UserExperiencesTable from "../../components/UserExperiencesTable/UserExperiencesTable";
// @ts-ignore
import VisibilityIcon from "@mui/icons-material/Visibility";
// @ts-ignore
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ic_lupa from "../../images/ic_lupa.svg";
import ic_no_search from "../../images/ic_no_search.jpeg";
import { validatePage } from "../../scripts/validations";
import { useAuthNew } from "../../context/AuthProvider";
import { AuthService } from "../../services/AuthService";
import { arrayOrdersUser } from "../../common";

type FormUserExperiencesSearch = {
    name: string
};

export default function UserExperiences() {

    const navigate = useNavigate()
    const { t } = useTranslation()

    const AuthContext = useAuthNew();
    const session = AuthService.getSessionFromContext(AuthContext)

    const [searchParams, setSearchParams] = useSearchParams();
    const query = useQuery()

    const [userExperiences, setUserExperiences] = useState<ExperienceModel[]>(new Array(0))
    const experienceId = useState("")

    const [isLoading, setIsLoading] = useState(false)
    const isOpenImage = useState(false)

    const [userName, setUserName] = useState("")

    const [orders, setOrders] = useState<OrderByModel>(arrayOrdersUser)
    const order = useState<string>(getQueryOrDefault(query, "order", "OrderByAZ"))

    const [maxPage, setMaxPage] = useState(0)
    const currentPage = useState<number>(
        !isNaN(parseInt(getQueryOrDefault(query, "page", "1"))) ?
            parseInt(getQueryOrDefault(query, "page", "1")) :
            1
    )
    const pageToShow = useState<number>(1)

    const onEdit = useState(false)

    const { register, handleSubmit, formState: { errors }, reset }
        = useForm<FormUserExperiencesSearch>({ criteriaMode: "all" })

    useEffect(() => {
       document.title = `${t('PageName')} - ${t('PageTitles.userExperiences')}`
    }, [])

    useEffect(() => {
        if (validatePage(maxPage, pageToShow[0], currentPage[0])) {
            setIsLoading(true);
            serviceHandler(
                userService.getUserExperiences(session.id, userName, order[0], currentPage[0] === 0 ? 1 : currentPage[0]),
                navigate, (experiences) => {
                    setUserExperiences(experiences.getContent())
                    setMaxPage(experiences ? experiences.getMaxPage() : 0)
                    searchParams.set("order", order[0])
                    if (currentPage[0] <= 0) {
                        searchParams.set("page", "1")
                        currentPage[1](1)
                    } else if (currentPage[0] > experiences.getMaxPage()) {
                        searchParams.set("page", experiences.getMaxPage().toString())
                        currentPage[1](experiences.getMaxPage())
                    } else {
                        searchParams.set("page", currentPage[0].toString())
                    }
                    setSearchParams(searchParams)
                },
                () => {
                    setIsLoading(false);
                },
                () => {
                    setUserExperiences(new Array(0))
                    setMaxPage(1)
                }
            )
        }
    }, [currentPage[0], userName, order[0], onEdit[0]])

    const onSubmit = handleSubmit((data: FormUserExperiencesSearch) => {
        setUserName(data.name);
    });

    function resetForm() {
        setUserName("")
        reset()
    }

    return (
        <DataLoader spinnerMultiplier={2} isLoading={isLoading}>
            <div className="container-fluid p-0 my-3 d-flex flex-column justify-content-center">
                {(userExperiences.length === 0 && userName.length === 0) ?
                    <div className="d-flex justify-content-center align-content-center">
                        <img src={ic_no_search} className="ic_no_search" alt="Imagen lupa" />
                        <h1 className="d-flex align-self-center">
                            {t('User.noExperiences')}
                        </h1>
                    </div>
                    :
                    <>
                        {/*SEARCH and ORDER*/}
                        <div className="d-flex justify-content-center align-content-center">
                            <div style={{ margin: "0 auto 0 20px", flex: "1" }}>
                                <OrderDropdown orders={orders} order={order} currentPage={currentPage} />
                            </div>

                            <h3 className="title m-0 align-self-center">
                                {t('User.experiencesTitle')}
                            </h3>

                            <div className="d-flex justify-content-center align-content-center"
                                style={{ margin: "0 20px 0 auto", flex: "1" }}>
                                {/* <button className="btn btn-search-navbar p-0" type="submit"
                                    form="searchExperiencePrivateForm" aria-label={t("AriaLabel.search")} title={t("AriaLabel.search")}>
                                    <img src={ic_lupa} alt="Icono lupa" />
                                </button>
                                <form className="my-auto" id="searchExperiencePrivateForm" onSubmit={onSubmit}>
                                    <input type="text" className="form-control" placeholder={t('Navbar.search')}
                                        {...register("name", {
                                            max: 255,
                                            pattern: {
                                                value: /^[A-Za-z0-9àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆŠŽ∂ð ()<>_,'°"·#$%&=:¿?!¡/.-]*$/,
                                                message: t("ExperienceForm.error.name.pattern"),
                                            }
                                        })}
                                        defaultValue={""}
                                    />
                                    {errors.name?.type === "max" && (
                                        <p className="form-control is-invalid form-error-label">
                                            {t("ExperienceForm.error.name.max")}
                                        </p>
                                    )}
                                    {errors.name?.type === "pattern" && (
                                        <p className="form-control is-invalid form-error-label">
                                            {t("Register.error.name.pattern")}
                                        </p>
                                    )}
                                </form>
                                <IconButton onClick={resetForm} aria-label={t("AriaLabel.closeForm")} title={t("AriaLabel.closeForm")}>
                                    <Close />
                                </IconButton> */}
                            </div>
                        </div>

                        <div className="mx-5">
                            {userExperiences.length === 0 ?
                                <div className="my-auto mx-5 px-3 d-flex justify-content-center align-content-center">
                                    <div className="d-flex justify-content-center align-content-center">
                                        <img src={ic_no_search} className="ic_no_search" alt="Imagen lupa" />
                                        <h4 className="d-flex align-self-center">
                                            {t('EmptyResult')}
                                        </h4>
                                    </div>
                                </div>
                                :
                                <>
                                    <UserExperiencesTable experiences={userExperiences}
                                        onEdit={onEdit}
                                        setExperienceId={experienceId[1]}
                                        isOpenImage={isOpenImage}
                                    />
                                    {maxPage > 1 && (
                                        <div className="mt-auto d-flex justify-content-center align-items-center">
                                            <Pagination
                                                currentPage={currentPage}
                                                maxPage={maxPage}
                                                pageToShow={pageToShow}
                                            />
                                        </div>
                                    )}
                                </>
                            }
                        </div>
                    </>
                }
            </div>
            <ConfirmDialogModal />
            <AddPictureModal isOpen={isOpenImage} experienceId={experienceId[0]} />
        </DataLoader>
    );

}