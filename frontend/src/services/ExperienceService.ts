import { APPLICATION_JSON_TYPE, paths } from "../common";
import { ExperienceModel, PagedContent, PostResponse, PutResponse, Result, ReviewModel } from "../types";
import { resultFetch } from "../scripts/resultFetch";
import { getPagedFetch } from "../scripts/getPagedFetch";
import { authedFetch } from "../scripts/authedFetch";

export class ExperienceService {
    private readonly experienceBasePath = paths.API_URL + paths.EXPERIENCES;

    public async createExperience(
        name: string,
        category: string,
        province: string,
        city: string,
        address: string,
        mail: string,
        price?: number,
        url?: string,
        description?: string
    ): Promise<Result<PostResponse>> {
        const newExperience = JSON.stringify({
            name: name,
            category: category,
            province: province,
            city: city,
            address: address,
            email: mail,
            price: price ? price : null,
            siteUrl: url ? url : "",
            description: description ? description : ""
        });

        return resultFetch<PostResponse>(this.experienceBasePath, {
            method: "POST",
            headers: {
                "Content-Type": APPLICATION_JSON_TYPE,
            },
            body: newExperience,
        });
    }

    public async getExperiences(
        category?: string,
        /* name?: string, */
        order?: string,
        price?: number,
        score?: number,
        province?: string,
        city?: string,
        page?: number
    ): Promise<Result<PagedContent<ExperienceModel[]>>> {
        const url = new URL(this.experienceBasePath);
        if (typeof category === "string" && category !== "") {
            url.searchParams.append("category", category);
        }
        /* if (typeof name === "string" && name !== "") {
            url.searchParams.append("name", name);
        } */
        if (typeof order === "string") {
            url.searchParams.append("order", order);
        }
        if ((price || price === 0) && price !== -1) {
            url.searchParams.append("price", price.toString());
        }
        if (score && score !== 0) {
            url.searchParams.append("score", score.toString());
        }
        if (typeof province === "string" && province !== "") {
            url.searchParams.append("province", province);
        }
        if (typeof city === "string" && city !== "") {
            url.searchParams.append("city", city);
        }
        return getPagedFetch<ExperienceModel[]>(url.toString(), page);
    }

    public async getFilterMaxPrice(
        category?: string,
        /* name?: string, */
    ): Promise<Result<PagedContent<ExperienceModel[]>>> {
        const url = new URL(this.experienceBasePath);
        if (typeof category === "string" && category !== "") {
            url.searchParams.append("category", category);
        }
        /* if (typeof name === "string" && name !== "") {
            url.searchParams.append("name", name);
        } */
        url.searchParams.append("order", "OrderByHighPrice");
        return getPagedFetch<ExperienceModel[]>(url.toString(), 1);
    }

    public async getExperienceById(
        experienceId: string,
        view?: boolean
    ): Promise<Result<ExperienceModel>> {
        const url = new URL(this.experienceBasePath + `/${experienceId}`);
        if (typeof view === "boolean") {
            url.searchParams.append("view", view.toString());
        }

        return resultFetch<ExperienceModel>(url.toString(), {
            method: "GET"
        });
    }

    public async getExperienceByLink(url: string): Promise<Result<ExperienceModel>> {
        return resultFetch(url, {
            method: "GET"
        });
    }

    public async getExperienceNameById(experienceId: string): Promise<Result<ExperienceModel>> {
        const url = new URL(this.experienceBasePath + `/${experienceId}`);
        return resultFetch(url.toString(), {
            method: "GET"
        });
    }

    public async updateExperienceById(
        experienceId: string,
        name: string,
        category: string,
        province: string,
        city: string,
        address: string,
        mail: string,
        price?: number,
        url?: string,
        description?: string
    ): Promise<Result<PutResponse>> {
        const experienceToUpdate = JSON.stringify({
            name: name,
            category: category,
            province: province,
            city: city,
            address: address,
            email: mail,
            price: price ? price : null,
            siteUrl: url ? url : "",
            description: description ? description : ""
        });
        return resultFetch(this.experienceBasePath + `/${experienceId}`, {
            method: "PUT",
            headers: {
                "Content-Type": APPLICATION_JSON_TYPE,
            },
            body: experienceToUpdate,
        });
    }

    public async deleteExperienceById(experienceId: string) {
        return authedFetch(this.experienceBasePath + `/${experienceId}`, {
            method: "DELETE",
        });
    }

    public async updateExperienceImage(
        experienceId: string,
        file: File
    ): Promise<Result<PutResponse>> {
        const reader = new FileReader();
    
        return new Promise((resolve, reject) => {
            reader.onloadend = async () => {
                const base64data = reader.result; 
                const contentType = file.type; 
    
                try {
                    const response = await resultFetch<PutResponse>(this.experienceBasePath + `/${experienceId}/image`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": APPLICATION_JSON_TYPE,
                        },
                        body: JSON.stringify({
                            image: base64data, 
                            content_type: contentType,
                        }),
                    });
    
                    resolve(response);
                } catch (error) {
                    reject(error);
                }
            };
    
            reader.onerror = (error) => {
                reject(error);
            };
    
            reader.readAsDataURL(file);
        });
    }

    public async setExperienceObservable(
        experienceId: string,
        set?: boolean
    ) {
        const url = new URL(this.experienceBasePath + `/${experienceId}`);

        const body = JSON.stringify({
            visibility: set,
        });

        return resultFetch(url.toString(), {
            method: "PATCH",
            headers: {
                "Content-Type": APPLICATION_JSON_TYPE,
            },
            body: body,
        });
    }

    public async getExperiencesBestCategory(category: string): Promise<Result<ExperienceModel[]>> {
        const url = new URL(this.experienceBasePath);
        //url.searchParams.append("filter", 'BEST_CATEGORY');
        url.searchParams.append("order", "OrderByRankDesc");
        url.searchParams.append("category", category);
        return resultFetch<ExperienceModel[]>(url.toString(), {
            method: "GET"
        })
    }

    public async getExperiencesLastAdded(): Promise<Result<ExperienceModel[]>> {
        const url = new URL(this.experienceBasePath);
        //TODO si no mandas la categoria falla
        url.searchParams.append("order", "OrderByNewest");
        return resultFetch<ExperienceModel[]>(url.toString(), {
            method: "GET"
        })
    }
}