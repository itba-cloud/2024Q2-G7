import { APPLICATION_JSON_TYPE, paths } from "../common";
import {
    ErrorResponse, ExperienceModel, FavouriteModel,
    PagedContent, PostResponse,
    PutResponse, Result,
    ReviewModel, TripModel, UserModel,
} from "../types";
import { getPagedFetch } from "../scripts/getPagedFetch";
import { resultFetch } from "../scripts/resultFetch";
import { checkValidJWT } from "../scripts/checkError";
import { AuthService } from "./AuthService";

export class UserService {
    private readonly userBasePath = paths.API_URL + paths.USERS;
    private readonly tripsBasePath = paths.API_URL + paths.TRIPS;

    public async register(
        name: string,
        surname: string,
        email: string,
        password: string,
        confirmPassword: string
    ) {
        if (confirmPassword !== password) {
            return Result.failed(
                new ErrorResponse(409, "Conflict", "Confirm password must match with password")
            );
        }
        return await AuthService.registerUser(email, name, surname, password);
    }

    public async getUserById(userId: string): Promise<Result<UserModel>> {
        return resultFetch<UserModel>(this.userBasePath + `/${userId}`, {
            method: "GET",
        });
    }

    public async getUserByLink(url: string): Promise<Result<UserModel>> {
        return resultFetch<UserModel>(url, {
            method: "GET",
        });
    }

    public async updateUserInfoById(
        userId?: string,
        name?: string,
        surname?: string
    ): Promise<Result<PutResponse>> {
        const userToUpdate = JSON.stringify({
            name: name,
            surname: surname
        });
        return resultFetch<PutResponse>(this.userBasePath + `/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": APPLICATION_JSON_TYPE,
            },
            body: userToUpdate,
        });
    }

    public async updateUserProfileImage(
        userId: string,
        file: File
    ): Promise<Result<PutResponse>> {
        const reader = new FileReader();
    
        return new Promise((resolve, reject) => {
            reader.onloadend = async () => {
                const base64data = reader.result; 
                const contentType = file.type;
    
                try {
                    const response = await resultFetch<PutResponse>(this.userBasePath + `/${userId}/image`, {
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

    public async getUserExperiences(
        userId: string,
        name?: string,
        order?: string,
        page?: number,
    ): Promise<Result<PagedContent<ExperienceModel[]>>> {
        const url = new URL(this.userBasePath + `/${userId}/experiences`);
        //url.searchParams.append("filter", 'PROVIDER');
        //url.searchParams.append("userId", userId.toString());
        /* if (typeof name === "string" && name !== "") {
            url.searchParams.append("name", name);
        } */
        if (typeof order === "string") {
            url.searchParams.append("order", order);
        }
        return getPagedFetch<ExperienceModel[]>(url.toString(), page);
    }

    //------------------------------------------------------------------
    //-------------------FAVORITOS--------------------------------------
    //------------------------------------------------------------------

    public async getUserFavExperiences(
        userId: string,
        order?: string,
        page?: number
    ): Promise<Result<PagedContent<ExperienceModel[]>>> {
        const url = new URL(this.userBasePath + `/${userId}/favourites`);
        //url.searchParams.append("filter", 'FAVS');
        //url.searchParams.append("userId", userId);
        if (typeof order === "string") {
            url.searchParams.append("order", order);
        }
        return getPagedFetch<ExperienceModel[]>(url.toString(), page);
    }

    public async setExperienceFav(
        userId: string,
        experienceId: string,
        set?: boolean
    ) {
        const url = new URL(this.userBasePath + `/${userId}/favourites/${experienceId}`);
        const favouriteBody = JSON.stringify({
            favourite: set
        });

        return resultFetch(url.toString(), {
            method: "PUT",
            headers: {
                "Content-Type": APPLICATION_JSON_TYPE,
            },
            body: favouriteBody,
        });
    }

     /* public async isExperienceFav(
        userId: string,
        experienceId: string,
    ): Promise<Result<FavouriteModel>> {
        const url = new URL(this.userBasePath + `/${userId}/favourites/${experienceId}`);

        return resultFetch<FavouriteModel>(url.toString(), {
            method: "GET"
        });
    } */

    //------------------------------------------------------------------
    //-------------------RECOMENDACIONES--------------------------------
    //------------------------------------------------------------------

    public async getUserViewedExperiences(userId: string | undefined): Promise<Result<ExperienceModel[]>> {
        const url = new URL(this.userBasePath + `/${userId}/experiences`);
        url.searchParams.append("filter", 'VIEWED');
        // @ts-ignore
        url.searchParams.append("userId", userId);
        return resultFetch<ExperienceModel[]>(url.toString(), {
            method: "GET"
        })
    }

    public async getUserRecommendationsByFavs(userId: string | undefined): Promise<Result<ExperienceModel[]>> {
        const url = new URL(this.userBasePath + `/${userId}/experiences`);
        url.searchParams.append("filter", 'RECOMMENDED_BY_FAVS');
        // @ts-ignore
        url.searchParams.append("userId", userId);
        return resultFetch<ExperienceModel[]>(url.toString(), {
            method: "GET"
        })
    }

    public async getUserRecommendationsByReviews(userId: string | undefined): Promise<Result<ExperienceModel[]>> {
        const url = new URL(this.userBasePath + `/${userId}/experiences`);
        url.searchParams.append("filter", 'RECOMMENDED_BY_REVIEWS');
        // @ts-ignore
        url.searchParams.append("userId", userId);
        return resultFetch<ExperienceModel[]>(url.toString(), {
            method: "GET"
        })
    }

    public async createUserTrip(
        userId: string,
        name: string,
        startDate: string,
        endDate: string,
        description: string
    ) {
        const url = new URL(this.tripsBasePath);
        const tripBody = JSON.stringify({
            name: name,
            startDate: startDate,
            endDate: endDate,
            description: description
        });

        return resultFetch(url.toString(), {
            method: "POST",
            headers: {
                "Content-Type": APPLICATION_JSON_TYPE,
            },
            body: tripBody,
        });
    }


    public async getUserTrips(
        userId: string,
    ): Promise<Result<TripModel[]>> {
        const url = new URL(this.tripsBasePath);
        return resultFetch<TripModel[]>(url.toString(), {
            method: "GET",
        });
    }

    public async getUserTripById(
        userId: string,
        tripId: string,
    ) {
        const url = new URL(this.tripsBasePath + `/${tripId}`);
        return resultFetch<TripModel>(url.toString(), {
            method: "GET",
        });
    }

    public async editUserTripById(
        userId: string,
        tripId: string,
        name: string,
        startDate: string,
        endDate: string,
        description: string
    ): Promise<Result<PutResponse>> {
        const url = new URL(this.tripsBasePath + `/${tripId}`);
        const tripBody = JSON.stringify({
            name: name,
            startDate: startDate,
            endDate: endDate,
            description: description
        });

        return resultFetch<PutResponse>(url.toString(), {
            method: "PUT",
            headers: {
                "Content-Type": APPLICATION_JSON_TYPE,
            },
            body: tripBody,
        });
    }

    public async deleteUserTripById(
        userId: string,
        tripId: string,
    ) {
        const url = new URL(this.tripsBasePath + `/${tripId}`);
        return resultFetch(url.toString(), {
            method: "DELETE",
        });
    }

    public async setExperienceInUserTrip(
        userId: string,
        tripId: string,
        experienceId: string,
        set?: boolean
    ) {
        const url = new URL(this.tripsBasePath + `/${tripId}/experiences/${experienceId}`);
        const setBody = JSON.stringify({
            set: set
        });

        return resultFetch(url.toString(), {
            method: "PUT",
            headers: {
                "Content-Type": APPLICATION_JSON_TYPE,
            },
            body: setBody,
        });
    }
}
