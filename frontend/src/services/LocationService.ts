import { paths } from "../common";
import { Result } from "../types";
import { resultFetch } from "../scripts/resultFetch";

export class LocationService {
    private readonly basePath = paths.API_URL + paths.LOCATION;

    public async getProvinces(): Promise<Result<string[]>> {
        return resultFetch<string[]>(this.basePath, {
            method: "GET",
        });
    }

    public async getCitiesByProvince(province: string): Promise<Result<string[]>> {
        return resultFetch<string[]>(this.basePath + `/${province}/cities`, {
            method: "GET",
        });
    }
}