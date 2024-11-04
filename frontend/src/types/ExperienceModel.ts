export default interface ExperienceModel {
    id: string;
    name: string;
    description?: string;
    address: string;
    email: string;
    price?: number;
    score: number;
    views: number;
    siteUrl?: string;
    observable: boolean;
    hasImage: boolean;  //TODO VER
    reviewCount: number;
    city: string;
    province: string;
    category: string;
    user_id: string;
    favs: number;
    recommended: number;
    status: string;
}