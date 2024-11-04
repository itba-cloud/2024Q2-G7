export default interface AgentModel {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    languages: string;
    experience: number;
    score: number;
    reviewCount: number;
    bio: string;
    agency?: string;
    specialization?: string;
    twitter?: string;
    instagram?: string;
}