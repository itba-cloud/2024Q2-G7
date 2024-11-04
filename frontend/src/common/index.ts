import Aventura from "../images/Aventura.svg";
import Gastronomia from "../images/Gastronomia.svg";
import Historico from "../images/Historico.svg";
import Hoteleria from "../images/Hoteleria.svg";
import Relax from "../images/Relax.svg";
import Vida_nocturna from "../images/Vida_nocturna.svg";
import { OrderByModel } from "../types";

export const cognito = {
    USER_POOL_ID: process.env.REACT_APP_USER_POOL_ID!,
    CLIENT_ID: process.env.REACT_APP_CLIENT_ID!
};

export const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY!;

export const paths = {
    LOCAL_BASE_URL : '/',
    API_URL: process.env.REACT_APP_API_URL!,
    EXPERIENCES: '/experiences',
    LOCATION: '/provinces',
    REVIEWS: '/reviews',
    USERS: '/users',
    TRIPS: '/trips',
    AGENTS: '/agents',
    ADMIN: '/admin'
};

export const APPLICATION_JSON_TYPE = 'application/json';
/*
export const ERROR_V1 = "application/vnd.getaway.error.v1+json";
export const USER_V1 = "application/vnd.getaway.user.v1+json";
export const USER_INFO_V1 = "application/vnd.getaway.userInfo.v1+json";
export const USER_PASSWORD_V1 = "application/vnd.getaway.patch.password.v1+json";
export const USER_PASSWORD_EMAIL_V1 = "application/vnd.getaway.passwordEmail.v1+json";
export const USER_FAVOURITE_V1 = "application/vnd.getaway.user.favourite.v1+json";
export const EXPERIENCE_V1 = "application/vnd.getaway.experience.v1+json";
export const EXPERIENCE_VISIBILITY_V1 = "application/vnd.getaway.experience.patch.visibility.v1+json";
export const EXPERIENCE_LIST_V1 = "application/vnd.getaway.experienceList.v1+json";
export const REVIEW_V1 = "application/vnd.getaway.review.v1+json";
export const REVIEW_LIST_V1 = "application/vnd.getaway.reviewList.v1+json";
export const PROVINCE_V1 = "application/vnd.getaway.province.v1+json";
export const PROVINCE_LIST_V1 = "application/vnd.getaway.provinceList.v1+json";
export const CITY_V1 = "application/vnd.getaway.city.v1+json";
export const CITY_LIST_V1 = "application/vnd.getaway.cityList.v1+json";
export const CATEGORY_V1 = "application/vnd.getaway.category.v1+json";
export const CATEGORY_LIST_V1 = "application/vnd.getaway.categoryList.v1+json";
export const ORDER_LIST_V1 = "application/vnd.getaway.orderList.v1+json"; */

export type CategoryName = "aventura" | "gastronomia" | "historico" | "hoteleria" | "relax" | "nocturno";

const categoryImages: Record<CategoryName, any> = {
    aventura: Aventura,
    gastronomia: Gastronomia,
    historico: Historico,
    hoteleria: Hoteleria,
    relax: Relax,
    nocturno: Vida_nocturna
};

export default categoryImages;

export const arrayOrders: OrderByModel = {
    orders: [
        "OrderByRankAsc", 
        "OrderByRankDesc", 
        "OrderByAZ", 
        "OrderByZA", 
        "OrderByLowPrice", 
        "OrderByHighPrice", 
        "OrderByNewest", 
        "OrderByOldest"
    ],
};

export const arrayOrdersUser: OrderByModel = {
    orders: [
        'OrderByAZ',
        'OrderByZA',
        'OrderByLowPrice', 
        'OrderByHighPrice', 
        'OrderByNewest', 
        'OrderByOldest', 
        'OrderByFavsAsc',
        'OrderByFavsDesc',
        'OrderByViewsAsc',
        'OrderByViewsDesc',
        'OrderByPendings',
        'OrderByApproved',
    ],
};
