import { useTranslation } from "react-i18next"
import "../../common/i18n/index"
import OrderDropdown from "../../components/OrderDropdown"
import CardExperience from "../../components/Experience/CardExperience"
import { IconButton, Slider, Typography } from '@mui/material'
import React, { Dispatch, SetStateAction, SyntheticEvent, useEffect, useState } from "react"
import { ExperienceModel, OrderByModel } from "../../types"
import { useNavigate, useSearchParams } from "react-router-dom"
import { experienceService, locationService } from "../../services"
import { serviceHandler } from "../../scripts/serviceHandler"
import Pagination from "../../components/Pagination"
import DataLoader from "../../components/DataLoader"
import { getQueryOrDefault, useQuery } from "../../hooks/useQuery"
import StarRoundedIcon from "@mui/icons-material/StarRounded"
import ic_no_search from "../../images/ic_no_search.jpeg";
import { validatePage } from "../../scripts/validations"
import { arrayOrders } from "../../common"

export default function Experiences(props: { 
    /* nameProp: [string | undefined, Dispatch<SetStateAction<string | undefined>>], */
    categoryProp: [string | undefined, Dispatch<SetStateAction<string | undefined>>] 
}) {

    const { t } = useTranslation()
    const navigate = useNavigate()
    const query = useQuery()

    const { /* nameProp, */ categoryProp } = props

    const [searchParams, setSearchParams] = useSearchParams()

    const [experiences, setExperiences] = useState<ExperienceModel[]>(new Array(0))
    const [isLoading, setIsLoading] = useState(false)

    //------------FILTERS----------
    //Location
    const [provinces, setProvinces] = useState<string[]>(new Array(0))
    const [province, setProvince] = useState<string>(getQueryOrDefault(query, "province", ""))
    const [cities, setCities] = useState<string[]>(new Array(0))
    const [city, setCity] = useState<string>(getQueryOrDefault(query, "city", ""))
    //Price
    const [maxPrice, setMaxPrice] = useState<number>(0)
    const [price, setPrice] = useState<number>(
        !isNaN(parseInt(getQueryOrDefault(query, "price", "-1"))) ?
            parseInt(getQueryOrDefault(query, "price", "-1")) :
            -1
    )
    const [onPriceChange, setOnPriceChange] = useState<boolean>(false)
    //Score
    const [rating, setRating] = useState(
        !isNaN(parseInt(getQueryOrDefault(query, "rating", "0"))) ?
            parseInt(getQueryOrDefault(query, "rating", "0")) :
            0
    )
    const [hover, setHover] = useState(
        !isNaN(-parseInt(getQueryOrDefault(query, "rating", "0"))) ?
            -parseInt(getQueryOrDefault(query, "rating", "0")) :
            0
    )
    //Order
    const [orders, setOrders] = useState<OrderByModel>(arrayOrders)
    const order = useState<string>(getQueryOrDefault(query, "order", "OrderByAZ"))
    //Page
    const [maxPage, setMaxPage] = useState(0)
    const currentPage = useState<number>(
        !isNaN(parseInt(getQueryOrDefault(query, "page", "1"))) ?
            parseInt(getQueryOrDefault(query, "page", "1")) :
            1
    )
    const pageToShow = useState<number>(1)

    useEffect(() => {
        document.title = `${t('PageName')} - ${t('PageTitles.experiences')}`
        
        serviceHandler(
            locationService.getProvinces(),
            navigate, (province) => { setProvinces(province) },
            () => { },
            () => { setProvinces(new Array(0)) }
        )
        if (province !== "") {
            serviceHandler(
                locationService.getCitiesByProvince(province),
                navigate, (cities) => { setCities(cities) },
                () => { },
                () => {
                    setCities(new Array(0))
                    setCity("")
                }
            )
        }
    }, [])

    useEffect(() => {
        if (/* nameProp[0] !== undefined && */ categoryProp[0] !== undefined) {
            serviceHandler(
                experienceService.getFilterMaxPrice(categoryProp[0]/* , nameProp[0] */),
                navigate, (experiences) => {
                    const maxPrice = experiences.getContent()[0].price ?? 0;
                    setMaxPrice(maxPrice)
                    if ((price !== maxPrice && price === -1) || (price < -1 || price > maxPrice)) {
                        setPrice(maxPrice)
                        const priceUrl = parseInt(getQueryOrDefault(query, "price", "-1"))
                        if (!isNaN(priceUrl) && priceUrl !== -1) {
                            searchParams.set("price", String(maxPrice))
                            setSearchParams(searchParams)
                        }
                    }
                },
                () => { },
                () => { setMaxPrice(0) }
            )
        }
    }, [categoryProp[0] /*, nameProp[0] */])

    useEffect(() => {
        if (/* nameProp[0] !== undefined && */ categoryProp[0] !== undefined) {
            if (validatePage(maxPage, pageToShow[0], currentPage[0])) {
                setIsLoading(true)
                serviceHandler(
                    experienceService.getExperiences(categoryProp[0], /* nameProp[0], */ order[0], price, Math.abs(rating), province, city, currentPage[0] === 0 ? 1 : currentPage[0]),
                    navigate, (experiences) => {
                        setExperiences(experiences.getContent())
                        setMaxPage(experiences ? experiences.getMaxPage() : 0)
                        if (currentPage[0] <= 0) {
                            pageToShow[1](currentPage[0])
                            searchParams.set("page", "1")
                            currentPage[1](1)
                        } else if (currentPage[0] > experiences.getMaxPage()) {
                            pageToShow[1](currentPage[0])
                            searchParams.set("page", experiences.getMaxPage().toString())
                            currentPage[1](experiences.getMaxPage())
                        } else {
                            pageToShow[1](currentPage[0])
                            searchParams.set("page", currentPage[0].toString())
                        }
                        searchParams.set("order", order[0])
                        //if (nameProp[0]) searchParams.set("name", nameProp[0])
                        setSearchParams(searchParams)
                    },
                    () => {
                        setIsLoading(false)
                    },
                    () => {
                        setExperiences(new Array(0))
                        setMaxPage(0)
                        setPrice(-1)
                        setIsLoading(false)
                    }
                )
            }
        }
    }, [categoryProp[0], /* , nameProp[0],*/ rating, province, city, order[0], currentPage[0], onPriceChange])


    function handleProvinceChange(province: string) {
        setProvince(province)
        setCity("")
        searchParams.set("province", province)
        setSearchParams(searchParams)
        serviceHandler(
            locationService.getCitiesByProvince(province),
            navigate, (cities) => { setCities(cities) },
            () => { },
            () => {
                setCities(new Array(0))
                setCity("")
            }
        )
    }

    function handleCityChange(city: string) {
        searchParams.set("city", city)
        setSearchParams(searchParams)
        setCity(city)
    }

    const handlePriceChange = (event: Event, newValue: number | number[]) => {
        if (typeof newValue === 'number') {
            setPrice(newValue)
        }
    }

    const handlePriceChangeCommitted = (event: Event | SyntheticEvent<Element, Event>, newValue: number | number[]) => {
        if (typeof newValue === 'number') {
            searchParams.set("price", newValue.toString())
            setSearchParams(searchParams)
            setPrice(newValue)
            setOnPriceChange(!onPriceChange)
        }
    }

    function handleRatingChange(index: number) {
        searchParams.set("rating", (-index).toString())
        setSearchParams(searchParams)
        setRating(-index)
    }

    function cleanForm() {
        searchParams.delete("price")
        searchParams.delete("province")
        searchParams.delete("city")
        searchParams.delete("rating")
        searchParams.set("page", "1")
        setSearchParams(searchParams)

        setOnPriceChange(!onPriceChange)
        setCities(new Array(0))
        setProvince("")
        setCity("")
        setRating(0)
        setHover(0)
        setPrice(maxPrice)
        currentPage[1](1)
    }

    /* function cleanQueryForName() {
        //nameProp[1]("")
        searchParams.delete("name")
        searchParams.set("page", "1")
        setSearchParams(searchParams)
        currentPage[1](1)
    } */

    /* function cleanQueryForCategory() {
        categoryProp[1]("")
        searchParams.delete("category")
        searchParams.set("page", "1")
        setSearchParams(searchParams)
        currentPage[1](1)
    } */

    return (
        <div className="container-fluid p-0 mt-3 d-flex">
            <div className="container-filters container-fluid px-2 py-0 mx-2 my-0 d-flex flex-column justify-content-start align-items-center border-end">
                {/*FILTERS*/}
                <p className="filters-title m-0">
                    {t('Filters.title')}
                </p>

                <div className="filter-form w-100">
                    <div>
                        <label className="form-label" htmlFor="province">
                            {t('Experience.province')}
                        </label>
                        <select id="experienceFormProvinceInput" className="form-select"
                            title={t("AriaLabel.selectProvince")}
                            onChange={(e) => handleProvinceChange(e.target.value)}
                            value={province}
                        >
                            {province === "" && (
                                <option hidden value="">{t("Experience.placeholder")}</option>
                            )}
                            {provinces.map((province) => (
                                <option key={province} value={province}>
                                    {province}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mt-2">
                        <label className="form-label" htmlFor="city">
                            {t('Filters.city.field')}
                        </label>
                        <select id="experienceFormCityInput" className="form-select"
                            disabled={province === ""} 
                            title={t("AriaLabel.selectCity")}
                            onChange={e => handleCityChange(e.target.value)}
                            value={city}
                        >
                            {city === "" &&
                                <option hidden value="">{t('Experience.placeholder')}</option>
                            }
                            {cities.map((city) => (
                                <option key={city} value={city}>
                                    {city}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="container-slider-price">
                        <Typography id="non-linear-slider" gutterBottom className="form-label">
                            {t('Filters.price.title')}: {price === -1 ? '0' : price}
                        </Typography>

                        <div className="slider-price">
                            <div className="value left">
                                {t('Filters.price.min')}
                            </div>
                            <Slider
                                style={{ color: "var(--primary-color)", margin: "0 10px" }}
                                value={price}
                                min={0}
                                step={1}
                                max={maxPrice}
                                onChange={handlePriceChange}
                                onChangeCommitted={handlePriceChangeCommitted}
                                valueLabelDisplay="auto"
                            />
                            <div className="value right">
                                {maxPrice}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="form-label">
                            {t('Filters.scoreAssign')}
                        </label>
                        <div className="star-rating">
                            {[...Array(5)].map((star, index) => {
                                index -= 5
                                return (
                                    <button
                                        type="button"
                                        key={index}
                                        title="starButton"
                                        className={index >= ((-rating && hover) || hover) ? "on" : "off"}
                                        onClick={() => handleRatingChange(index)}
                                        onMouseEnter={() => setHover(index)}
                                        onMouseLeave={() => setHover(-rating)}
                                    >
                                        <StarRoundedIcon className="star" />
                                    </button>
                                )
                            })}
                        </div>
                        <input type="hidden" className="form-control" id="scoreInput" />
                    </div>
                </div>

                <button className="btn btn-clean-filter px-3 py-2 my-2" type="reset" id="cleanFilterFormButton"
                    aria-label={t("AriaLabel.cleanFilter")} title={t("AriaLabel.cleanFilter")}
                    onClick={cleanForm}>
                    {t('Filters.btn.clear')}
                </button>
            </div>


            <div className="container-experiences container-fluid p-0 mx-2 mt-0 mb-3 d-flex
                            flex-column justify-content-center align-content-center"
                style={{ minHeight: "650px" }}>
                <DataLoader spinnerMultiplier={2} isLoading={isLoading}>

                    <div className="d-flex justify-content-center align-content-center">
                        <div style={{ margin: "0 auto 0 20px", flex: "1" }}>
                            <OrderDropdown orders={orders} order={order} currentPage={currentPage} />
                        </div>

                        {/* <div className="d-flex flex-column justify-content-center align-content-center"
                            style={{ fontSize: "x-large", maxWidth: "400px" }}>
                            {categoryProp[0] !== undefined && categoryProp[0].length > 0 &&
                                <div className="justify-self-center align-self-center flex-wrap text-center" style={{
                                    maxWidth: "400px",
                                    wordWrap: "break-word"
                                }}>
                                    {t('Experiences.search.search') + t('Experiences.search.category') + t('Categories.' + categoryProp[0])}
                                    <IconButton className="justify-content-center" onClick={cleanQueryForCategory}
                                        aria-label={t("AriaLabel.closeForm")} title={t("AriaLabel.closeForm")}>
                                        <Close />
                                    </IconButton>
                                </div>
                            }
                            {nameProp[0] !== undefined && nameProp[0].length > 0 &&
                                <div className="justify-self-center align-self-center flex-wrap text-center" style={{
                                    maxWidth: "400px",
                                    wordWrap: "break-word"
                                }}>
                                    {t('Experiences.search.search') + t('Experiences.search.name', { name: nameProp[0] })}
                                    <IconButton className="justify-content-center" onClick={cleanQueryForName}
                                        aria-label={t("AriaLabel.closeForm")} title={t("AriaLabel.closeForm")}>
                                        <Close />
                                    </IconButton>
                                </div>

                            }
                        </div> */}

                        <div style={{ margin: "0 20px 0 auto", flex: "1" }} />
                    </div>

                    {experiences.length === 0 ?
                        <div className="my-auto mx-5 px-3 d-flex justify-content-center align-content-center">
                            <div className="d-flex justify-content-center align-content-center">
                                <img src={ic_no_search} className="ic_no_search" alt="Imagen lupa" />
                                <h1 className="d-flex align-self-center">
                                    {t('EmptyResult')}
                                </h1>
                            </div>
                        </div>
                        :
                        <div>
                            <div className="d-flex flex-wrap justify-content-center">
                                {experiences.map((experience) => (
                                    <CardExperience experience={experience} /* nameProp={nameProp} */ categoryProp={categoryProp} key={experience.id} fav={false} />
                                ))}
                            </div>
                        </div>
                    }

                    <div className="mt-auto d-flex justify-content-center align-items-center">
                        {maxPage > 1 && (
                            <Pagination
                                maxPage={maxPage}
                                currentPage={currentPage}
                                pageToShow={pageToShow}
                            />
                        )}
                    </div>
                </DataLoader>

            </div>
        </div>
    )
}