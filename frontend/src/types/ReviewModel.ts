export default interface ReviewModel {
    id: string;
    title: string;
    description: string;
    score: number;
    date: string;
    user_id: string;
    experience_id?: string;
    agent_id?: string;
}
