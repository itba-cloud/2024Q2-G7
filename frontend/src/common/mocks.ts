import {
    ExperienceModel,
    OrderByModel,
    ReviewModel,
    UserModel,
    CurrentUserModel,
    TripModel,
    AgentModel
} from "../types"

export const userModel: UserModel = {
    id: "1",
    name: "Lucas",
    surname: "Ferreiro",
    email: "lferreiro@itba.edu.ar",
    /* isVerified: true,
    isProvider: true, */
    hasImage: false,
    /* self: "http://localhost:8080/api/users/1",
    profileImageUrl: "http://localhost:8080/api/users/1/profileImage",
    experiencesUrl: "http://localhost:8080/api/experiences?userId=1&filter=PROVIDER",
    reviewsUrl: "http://localhost:8080/api/reviews?userId=1",
    favsUrl: "http://localhost:8080/api/experiences?userId=1&filter=FAVS",
    viewedUrl: "http://localhost:8080/api/experiences?userId=1&filter=VIEWED",
    recommendationsByFavsUrl: "http://localhost:8080/api/experiences?userId=1&filter=RECOMMENDED_BY_FAVS",
    recommendationsByReviewsUrl: "http://localhost:8080/api/experiences?userId=1&filter=RECOMMENDED_BY_REVIEWS", */
};

/* export const currentUserModel: CurrentUserModel = {
    userId: "1",
    name: "Lucas",
    surname: "Ferreiro",
    sub: "lferreiro@itba.edu.ar",
    isVerified: true,
    isProvider: true,
    hasImage: false,
    profileImageUrl: "http://localhost:8080/api/users/1/profileImage",
}; */

export const experienceModelNoFav: ExperienceModel = {
    id: "1",
    name: "Experiencia comun",
    description: "Esto es una descripcion",
    address: "Av 9 de Julio",
    email: "example@example.com",
    price: 100,
    score: 4,
    views: 100,
    siteUrl: "https://google.com",
    observable: true,
    hasImage: false,
    reviewCount: 8,
    city: "Avellaneda",
    province: "Buenos Aires",
    category: "aventura",
    user_id: "1",
    favs: 1,
    recommended: 1,
    status: "VERIFIED"
};

export const experienceModelFav: ExperienceModel = {
    id: "2",
    name: "Experiencia fav",
    description: "Esto es una descripcion",
    address: "Av 9 de Julio",
    email: "example@example.com",
    price: 1000,
    score: 4,
    views: 100,
    siteUrl: "https://google.com",
    observable: true,
    hasImage: false,
    reviewCount: 8,
    city: "Avellaneda",
    province: "Buenos Aires",
    category: "aventura",
    user_id: "1",
    favs: 1,
    recommended: 1,
    status: "VERIFIED"
};

export const experienceModelCategory: ExperienceModel = {
    id: "3",
    name: "Experiencia de categoria 2",
    description: "Esto es una descripcion",
    address: "Av 9 de Julio",
    email: "example@example.com",
    price: 500,
    score: 4,
    views: 100,
    siteUrl: "https://google.com",
    observable: true,
    hasImage: false,
    reviewCount: 8,
    city: "Avellaneda",
    province: "Buenos Aires",
    category: "aventura",
    user_id: "1",
    favs: 1,
    recommended: 1,
    status: "VERIFIED"
};

export const experienceModelMaxPrice: ExperienceModel = {
    id: "4",
    name: "Experiencia de mayor precio",
    description: "Esto es la descripcion",
    address: "Av 9 de Julio",
    email: "example@example.com",
    price: 100000,
    score: 3,
    views: 100,
    siteUrl: "https://google.com",
    observable: true,
    hasImage: false,
    reviewCount: 8,
    city: "Avellaneda",
    province: "Buenos Aires",
    category: "aventura",
    user_id: "1",
    favs: 1,
    recommended: 1,
    status: "VERIFIED"
};

export const reviewModel1: ReviewModel = {
    id: "1",
    title: "Titulo de reseña",
    description: "Esta es mi descripcion de reseña",
    score: 4,
    date: "2023-02-02",
    user_id: "1",
    experience_id: "1",
};

export const reviewModel2: ReviewModel = {
    id: "2",
    title: "Titulo de reseña 2",
    description: "Esta es mi descripcion de reseña",
    score: 2,
    date: "2023-02-02",
    user_id: "1",
    experience_id: "1",
};

export const trip: TripModel = {
    id: "1",
    name: "Viaje a Bariloche, Argentina",
    startDate: "2024-12-15",
    endDate: "2024-12-22",
    description: "Un viaje para explorar la Patagonia."
}

export const agentModel: AgentModel = {
    id: "1",
    name: "Juan Pérez",
    email: "example@example.com",
    phone: "1163584274",
    address: "Av. 9 de Julio",
    languages: "Español, Ingles y Frances",
    experience: 5,
    score: 4.5,
    reviewCount: 1,
    bio:  "Guía turístico con 10 años de experiencia en tours por la Patagonia.",
    agency: "",
    specialization: "",
    twitter: "agent",
    instagram: "agent;"
}

export const arrCategories: string[] = ['aventura', 'gastronomia', 'hoteleria', 'relax', 'historico', 'nocturno']

export const arrExp: ExperienceModel[] = [
    experienceModelNoFav, experienceModelNoFav, experienceModelNoFav,
    experienceModelNoFav, experienceModelNoFav, experienceModelNoFav,
    experienceModelNoFav, experienceModelNoFav, experienceModelNoFav
]

export const arrReviews: ReviewModel[] = [
    reviewModel1, reviewModel1, reviewModel1,
    reviewModel1, reviewModel1, reviewModel1
]

export const arrAgents: AgentModel[] = [
    agentModel
]

export const arrTrips: TripModel[] = [
    trip, trip, trip, trip
]


export const arrOrders: OrderByModel = {
    orders: ["OrderByRankAsc", "OrderByRankDesc", "OrderByAZ", "OrderByZA", "OrderByLowPrice", "OrderByHighPrice", 'OrderByNewest', 'OrderByOldest'],
};
