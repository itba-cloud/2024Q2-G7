import axios, { AxiosInstance } from 'axios';
import { paths } from "../common";

const apiClient: AxiosInstance = axios.create({
    baseURL: paths.API_URL
});

export default apiClient; 