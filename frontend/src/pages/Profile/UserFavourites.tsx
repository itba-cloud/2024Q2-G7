import { useTranslation } from "react-i18next"
import "../../common/i18n/index"
import { useEffect, useState } from "react"
import { ExperienceModel, OrderByModel } from "../../types"
import { serviceHandler } from "../../scripts/serviceHandler"
import { experienceService, userService } from "../../services"
import { useNavigate, useSearchParams } from "react-router-dom"
import CardExperience from "../../components/Experience/CardExperience"
import Pagination from "../../components/Pagination"
import OrderDropdown from "../../components/OrderDropdown"
import DataLoader from "../../components/DataLoader"
import { getQueryOrDefault, useQuery } from "../../hooks/useQuery"
import { validatePage } from "../../scripts/validations"
import { useAuthNew } from "../../context/AuthProvider"
import { AuthService } from "../../services/AuthService"
import ic_no_search from "../../images/ic_no_search.jpeg";
import { arrayOrders } from "../../common"

export default function UserFavourites() {

    const { t } = useTranslation()
    const navigate = useNavigate()
    const query = useQuery()

    const AuthContext = useAuthNew();
    const session = AuthService.getSessionFromContext(AuthContext)

    const [searchParams, setSearchParams] = useSearchParams();

    const [favExperiences, setFavExperiences] = useState<ExperienceModel[]>(new Array(0))
    const [isLoading, setIsLoading] = useState(false)

    const [orders, setOrders] = useState<OrderByModel>(arrayOrders)
    const order = useState<string>(getQueryOrDefault(query, "order", "OrderByAZ"))

    const [maxPage, setMaxPage] = useState(0)
    const currentPage = useState<number>(
        !isNaN(parseInt(getQueryOrDefault(query, "page", "1"))) ?
            parseInt(getQueryOrDefault(query, "page", "1")) :
            1
    )
    const pageToShow = useState<number>(1)

    //const dummyCategoryProp = useState<string | undefined>(undefined)
    //const dummyNameProp = useState<string | undefined>(undefined)

    useEffect(() => {
        document.title = `${t('PageName')} - ${t('PageTitles.userFavourites')}`
        if (session !== null) {
            setFavExperiences(AuthService.getFavourites(AuthContext))
        }
    }, [])


    /* useEffect(() => {
        if (validatePage(maxPage, pageToShow[0], currentPage[0])) {
            setIsLoading(true)
            serviceHandler(
                userService.getUserFavExperiences(session.id, order[0], currentPage[0] === 0 ? 1 : currentPage[0]),
                navigate, (experiences) => {
                    setFavExperiences(experiences.getContent())
                    setMaxPage(experiences ? experiences.getMaxPage() : 0)
                    searchParams.set("order", order[0])
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
                    setSearchParams(searchParams)
                },
                () => {
                    setIsLoading(false)
                },
                () => {
                    setFavExperiences(new Array(0))
                    setMaxPage(1)
                }
            )
        }
    }, [currentPage[0], order[0]]) */

    return (
        <DataLoader spinnerMultiplier={2} isLoading={isLoading}>
            <div className="container-fluid p-0 my-3 d-flex flex-column justify-content-center">
                {favExperiences.length === 0 ?
                    <div className="d-flex justify-content-center align-content-center">
                        <img src={ic_no_search} className="ic_no_search" alt="Imagen lupa" />
                        <h1 className="d-flex align-self-center">
                            {t('User.noFavs')}
                        </h1>
                    </div>
                    :
                    <>
                        <div className="d-flex justify-content-center align-content-center">
                            <div style={{ margin: "0 auto 0 20px", flex: "1" }}>
                                <OrderDropdown orders={orders} order={order} currentPage={currentPage} />
                            </div>
                            <h3 className="title m-0">
                                {t('User.favsTitle')}
                            </h3>
                            <div style={{ margin: "0 20px 0 auto", flex: "1" }} />
                        </div>

                        <div className="container-fluid my-3 d-flex flex-wrap justify-content-center">
                            {favExperiences.map((experience) => (
                                <CardExperience experience={experience} key={experience.id} /* categoryProp={dummyCategoryProp} */ /* nameProp={dummyNameProp} */ fav={true} />
                            ))}
                        </div>

                        <div className="mt-auto d-flex justify-content-center align-items-center">
                            {maxPage > 1 && (
                                <Pagination
                                    maxPage={maxPage}
                                    currentPage={currentPage}
                                    pageToShow={pageToShow}
                                />
                            )}
                        </div>

                    </>
                }
            </div>
        </DataLoader>
    );

}