import { APPLICATION_JSON_TYPE, paths } from "../common";
import { PagedContent, PostResponse, PutResponse, Result, ReviewModel } from "../types";
import { resultFetch } from "../scripts/resultFetch";
import { authedFetch } from "../scripts/authedFetch";
import { getPagedFetch } from "../scripts/getPagedFetch";

export class ReviewService {
    private readonly basePath = paths.API_URL + paths.REVIEWS;

    public async postNewReview(
        title: string,
        description: string,
        score: number,
        experienceId?: string,
        agentId?: string,
    ): Promise<Result<PostResponse>> {
        const reviewToUpdate = JSON.stringify({
            title: title,
            description: description,
            score: score,
            ...(experienceId && { experience_id: experienceId }),
            ...(agentId && { agent_id: agentId })
        });

        return resultFetch<PostResponse>(this.basePath, {
            method: "POST",
            headers: {
                "Content-Type": APPLICATION_JSON_TYPE,
            },
            body: reviewToUpdate,
        });
    }

    public async getReviewById(reviewId: string): Promise<Result<ReviewModel>> {
        return resultFetch<ReviewModel>(this.basePath + `/${reviewId}`, {
            method: "GET",
        });
    }

    public async updateReviewById(
        reviewId: string,
        title: string,
        description: string,
        score: number
    ): Promise<Result<PutResponse>> {
        const reviewToUpdate = JSON.stringify({
            title: title,
            description: description,
            score: score
        });
        return resultFetch(this.basePath + `/${reviewId}`, {
            method: "PUT",
            headers: {
                "Content-Type": APPLICATION_JSON_TYPE,
            },
            body: reviewToUpdate,
        });
    }

    public async deleteReviewById(reviewId: string) {
        return authedFetch(this.basePath + `/${reviewId}`, {
            method: "DELETE",
        });
    }

    public async getExperienceReviews(
        experienceId: string,
        page?: number
    ): Promise<Result<PagedContent<ReviewModel[]>>> {
        const url = new URL(this.basePath);
        url.searchParams.append("experience_id", experienceId);
        return getPagedFetch<ReviewModel[]>(url.toString(), page);
    }

    public async getUserReviews(
        userId: string,
        page?: number
    ): Promise<Result<PagedContent<ReviewModel[]>>> {
        const url = new URL(this.basePath);
        url.searchParams.append("user_id", userId.toString());
        return getPagedFetch<ReviewModel[]>(url.toString(), page);
    }

    public async getAgentReviews(
        agentId: string,
        page?: number
    ): Promise<Result<PagedContent<ReviewModel[]>>> {
        const url = new URL(this.basePath);
        url.searchParams.append("agent_id", agentId.toString());
        return getPagedFetch<ReviewModel[]>(url.toString(), page);
    }
}