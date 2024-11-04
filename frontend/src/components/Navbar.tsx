import { useTranslation } from "react-i18next"
import "../common/i18n/index"
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
//import { useAuth } from "../hooks/useAuth";
import { serviceHandler } from "../scripts/serviceHandler";
import { agentsService, experienceService } from "../services";
import { useForm } from "react-hook-form";
import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { getQueryOrDefault, useQuery } from "../hooks/useQuery";
import { showToast } from "../scripts/toast";
import ic_getaway from "../images/ic_getaway.png";
import ic_lupa from "../images/ic_lupa.svg";
import ic_user_white from "../images/ic_user_white.svg";
import ic_user_black from "../images/ic_user_black.svg";
import ic_experiences from "../images/ic_experiences.svg";
import ic_briefcase from "../images/ic_briefcase.svg";
import ic_fav from "../images/ic_fav.svg";
import ic_review from "../images/ic_review.svg";
import ic_article from "../images/ic_article.svg";
import ic_recommendation from "../images/ic_recommendation.svg";
import ic_logout from "../images/ic_logout.svg";
import categoryImages, { CategoryName } from "../common";
import { arrCategories } from "../common/mocks";
import { AuthService } from "../services/AuthService";
import { useAuthNew } from "../context/AuthProvider";
import ArticleModalForm, { FormDataArticle } from "./Article/ArticleModalForm";

/* type FormDataSearch = {
    name: string
}; */

export default function Navbar(props: {
    /* nameProp: [string | undefined, Dispatch<SetStateAction<string | undefined>>], */
    categoryProp: [string | undefined, Dispatch<SetStateAction<string | undefined>>] 
}) {

    const { t } = useTranslation()
    const navigate = useNavigate()
    const query = useQuery()

    const { /* nameProp, */ categoryProp } = props
    const [searchParams, setSearchParams] = useSearchParams();

    const AuthContext = useAuthNew();
    const session = AuthService.getSessionFromContext(AuthContext);
    const isLogged = AuthService.isLoggedIn(AuthContext);
    const isAdmin = AuthService.isAdmin(AuthContext);
    const isAgent = AuthService.isAgent(AuthContext)

    const [showModalArticle, setShowModalArticle] = useState(false);

    const [categories, setCategories] = useState<string[]>(arrCategories)
    //const [categoryQuery, setCategoryQuery] =  useState<string>(getQueryOrDefault(query, "category", ""))

    const province = getQueryOrDefault(query, "province", "")
    const city = getQueryOrDefault(query, "city", "")

    const price = !isNaN(parseInt(getQueryOrDefault(query, "price", "-1"))) ?
        parseInt(getQueryOrDefault(query, "price", "-1")) : -1
    const rating = !isNaN(parseInt(getQueryOrDefault(query, "rating", "0"))) ?
        parseInt(getQueryOrDefault(query, "rating", "0")) : 0

    function checkUrlFilters(category: string | undefined,/*  name: string | undefined */): string {
        const filtersArray: string[] = []

        if (category) filtersArray.push(`category=${category}`)
        //if (name) filtersArray.push(`name=${name}`)
        if (province !== "") filtersArray.push(`province=${province}`)
        if (city !== "") filtersArray.push(`city=${city}`)
        if (price !== -1) filtersArray.push(`price=${price}`)
        if (rating !== 0) filtersArray.push(`rating=${rating}`)

        return filtersArray.length > 0 ? '&' + filtersArray.join('&') : ''
    }

    /* const { register, handleSubmit, formState: { errors }, reset, setValue }
        = useForm<FormDataSearch>({ criteriaMode: "all" }) */

    /* useEffect(() => {
        setValue("name", nameProp[0] ? nameProp[0] : "")
    }, [nameProp[0]]) */

    useEffect(() => {
        /* nameProp[1](getQueryOrDefault(query, "name", "")) */
        categoryProp[1](getQueryOrDefault(query, "category", ""))
    }, [])

    /* const onSubmit = handleSubmit((data: FormDataSearch) => {
        nameProp[1](data.name)
        navigate({
            pathname: "/experiences",
            search: `?order=OrderByAZ&page=1${checkUrlFilters(categoryProp[0], data.name)}`
        }, { replace: true })
    }) */

    function clearNavBar() {
        searchParams.delete("category")
        //searchParams.delete("name")
        setSearchParams(searchParams)
        categoryProp[1]("")
        //nameProp[1]("")
        //reset()
    }

    /* function resetForm() {
        nameProp[1]("")
        searchParams.delete("name")
        setSearchParams(searchParams)
        reset()
    } */

    function attemptAccessCreateExperience() {
        clearNavBar();
        if (!isLogged) {
            navigate("/login", { replace: true })
            showToast(t('ExperienceForm.toast.forbidden.noUser'), 'error')
        } else {
            navigate(`/experienceForm`, { replace: true })
        }
    }

    async function signOut(event: any) {
        event.preventDefault();
        clearNavBar();
        await AuthService.logout(AuthContext);
        navigate("/", { replace: true })
    }

    /* function viewAgents() {
        clearNavBar();
        navigate(`/agents`, { replace: true })
    } */

    const handleSaveArticle = (data: FormDataArticle) => {
        //TODO use serviceHandler
        agentsService.createArticle(data.title, data.description, session.id)
            .then((result) => {
                if (!result.hasFailed()) {
                    setShowModalArticle(false);
                    showToast(t('Article.toast.createSuccess', { title: data.title }), 'success')
                }
            })
            .catch(() => {
                showToast(t('Article.toast.createError', { title: data.title }), 'error')
            })
    };

    const handleCancelArticle = () => {
        setShowModalArticle(false); 
    };

    return (
        <div className="navbar container-fluid p-0 d-flex flex-column">
            <div className="container-fluid px-2 pt-2 d-flex">
                <Link to="/" className="logo d-flex" onClick={() => {
                    clearNavBar()
                }}>
                    <img className="logo-img w-auto h-auto" src={ic_getaway} alt="Logo" />
                    <span className="logo-text align-self-center text-uppercase font-weight-bold">
                        {t('PageName')}
                    </span>
                </Link>
                <div className="container-navbar-buttons d-flex justify-content-between align-items-center">
                    {/* <div className="d-flex justify-items-center align-items-center"
                        style={{ marginRight: '40px' }}>
                        <form id="searchExperienceForm" acceptCharset="utf-8"
                            className="d-flex justify-items-center align-items-center my-auto" onSubmit={onSubmit}>
                            <button className="btn btn-search-navbar p-0" type="submit" form="searchExperienceForm"
                                aria-label={t("AriaLabel.search")} title={t("AriaLabel.search")}>
                                <img className="w-auto h-auto" src={ic_lupa} alt="Lupa" />
                            </button>
                            <input max="50" type="text" className="form-control" placeholder={t('Navbar.search')}
                                {...register("name", {
                                    validate: {
                                        length: (name) =>
                                            name.length <= 50,
                                    },
                                    pattern: {
                                        value: /^[A-Za-z0-9àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆŠŽ∂ð ()<>_,'°"·#$%&=:¿?!¡/.-]*$/,
                                        message: t("ExperienceForm.error.name.pattern"),
                                    }
                                })}
                            />
                            {errors.name?.type === "length" && (
                                <p className="form-control is-invalid form-error-label">
                                    {t("Navbar.error")}
                                </p>
                            )}
                            {errors.name?.type === "pattern" && (
                                <p className="form-control is-invalid form-error-label">
                                    {t("ExperienceForm.error.name.pattern")}
                                </p>
                            )}
                        </form>
                        <IconButton onClick={resetForm} aria-label={t("AriaLabel.closeForm")} title={t("AriaLabel.closeForm")}>
                            <Close />
                        </IconButton>
                    </div> */}

                    {/* <button type="button" style={{ marginRight: '40px' }} className='btn button-primary'
                        aria-label={t("AriaLabel.viewAgents")} title={t("AriaLabel.viewAgents")}
                        onClick={() => viewAgents()}>
                        {t('Navbar.viewAgents')}
                    </button> */}

                    <Link to="/agents" 
                        aria-label={t("AriaLabel.viewAgents")} title={t("AriaLabel.viewAgents")}
                        className="agent-link" 
                        style={{ marginRight: '40px' }} 
                        onClick={() => clearNavBar()}
                        >
                        {t('Navbar.viewAgents')}
                    </Link>

                    {isAgent &&
                        <button type="button" style={{ marginRight: '40px' }} className='btn button-primary'
                            aria-label={t("Navbar.createArticle")} title={t("Navbar.createArticle")}
                            onClick={() => setShowModalArticle(true) }>
                            {t('Navbar.createArticle')}
                        </button>
                    }

                    {!isAdmin &&
                        <button type="button" style={{ marginRight: '40px' }} className='btn button-primary'
                            aria-label={t("AriaLabel.createExperience")} title={t("AriaLabel.createExperience")}
                            onClick={() => attemptAccessCreateExperience()}>
                            {t('Navbar.createExperience')}
                        </button>
                    }

                    {!isLogged &&
                        <Link to="/login">
                            <button type="button" className="btn button-primary"
                                aria-label={t("AriaLabel.login")} title={t("AriaLabel.login")}
                                onClick={() => clearNavBar()}
                                >
                                {t('Navbar.login')}
                            </button>
                        </Link>
                    }

                    {isLogged &&
                        <div className="dropdown">
                            <button className="btn button-primary dropdown-toggle d-flex align-items-center" type="button"
                                id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false"
                                aria-label={t("AriaLabel.profileInfo")} title={t("AriaLabel.profileInfo")}>
                                <img src={ic_user_white} alt="Icono usuario" style={{ width: "30px", height: "30px" }} />
                            </button>

                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1" style={{ left: "-70px" }}>
                                {!isAdmin &&
                                    <>
                                        <Link to="/user/profile" className="dropdown-item"
                                            onClick={() => clearNavBar()}
                                            >
                                            <img src={ic_user_black} alt="Icono perfil" className="me-1" />
                                            {t('Navbar.profile')}
                                        </Link>


                                        <Link to="/user/experiences" className="dropdown-item"
                                            onClick={() => clearNavBar()}
                                            >
                                            <img src={ic_experiences} alt="Icono experiencias" className="me-1" />
                                            {t('Navbar.experiences')}
                                        </Link>

                                        <Link to="/user/trips" className="dropdown-item"
                                            onClick={() => clearNavBar()}
                                            >
                                            <img src={ic_briefcase} alt="Icono mis viaje" className="me-1" />
                                            {t('Navbar.trips')}
                                        </Link>

                                        <Link to="/user/favourites" className="dropdown-item"
                                            onClick={() => clearNavBar()}
                                            >
                                            <img src={ic_fav} alt="Icono favoritos" className="me-1" />
                                            {t('Navbar.favourites')}
                                        </Link>

                                        <Link to="/user/reviews" className="dropdown-item"
                                            onClick={() => clearNavBar()}
                                            >
                                            <img src={ic_review} alt="Icono reseñas" className="me-1" />
                                            {t('Navbar.reviews')}
                                        </Link>

                                        {isAgent &&
                                            <> 
                                                <Link to="/user/articles" className="dropdown-item"
                                                    onClick={() => clearNavBar()}
                                                    >
                                                    <img src={ic_article} alt="Icono articulos" className="me-1" />
                                                    {t('Navbar.articles')}
                                                </Link>

                                                <Link to="/user/recommendations" className="dropdown-item"
                                                    onClick={() => clearNavBar()}
                                                    >
                                                    <img src={ic_recommendation} alt="Icono recomendados" className="me-1" />
                                                    {t('Navbar.recommendations')}
                                                </Link>
                                            </>
                                        }
                                    </>
                                }

                                <button className="dropdown-item" aria-label={t("AriaLabel.signOut")} title={t("AriaLabel.signOut")}
                                    onClick={async (event) => {
                                        await signOut(event);
                                      }}>
                                    <img src={ic_logout} alt="Icono cerrar sesion" />
                                    {t('Navbar.logout')}
                                </button>
                            </ul>
                        </div>
                    }
                </div>
            </div>

            <div className="container-types container-fluid pb-2 p-0 d-flex justify-content-center m-0">
                {categories.map((category) => (
                    <button type="button" className={`btn btn-category ${(categoryProp[0] === category) ? 'isActive' : ''}`} key={category}
                        aria-label={t('Categories.' + category)}
                        title={t('Categories.' + category)}
                        onClick={() => {
                            categoryProp[1](category);
                            navigate({
                                pathname: "/experiences",
                                search: `?order=OrderByAZ&page=1${checkUrlFilters(category/* , nameProp[0] */)}`
                            }, { replace: true });
                        }}
                    >
                        <img src={categoryImages[category as CategoryName]} alt={`${category}`} />
                        {t('Categories.' + category)}
                    </button>
                ))}
            </div>

            {showModalArticle && (
                <ArticleModalForm
                    article={undefined} 
                    onSave={handleSaveArticle}
                    onCancel={handleCancelArticle}
                />
            )}
        </div>
    )
}