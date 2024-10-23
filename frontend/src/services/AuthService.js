import axios from "../api/axios";
import jwtDecode from "jwt-decode";
import { toast } from "react-toastify";
import { authenticate } from "./Auth/authenticate.js";
import { confirmEmail } from "./Auth/confirmEmail.js";
import { resendCode } from "./Auth/resendCode.js";
import { signUpUser } from "./Auth/signUpUser";
import { getSession } from "./Auth/getSession.js";
import { signOut } from "./Auth/signOut.js";
import { paths } from "../common";
import { authedFetch } from "../scripts/authedFetch";

export class AuthService {
    static tempUserData = {};

    static async _isAgent(id) {
        try {
            const agent = await authedFetch(paths.API_URL + paths.AGENTS + `/${id}`, { method: "GET" })
            console.log("isAgent", await agent.json())
            return agent.status === 200
        } catch (error) {
            console.log("isAgent - ERROR: ", error)
            return false
        } 
    }

    static async _getFavourites(id) {
        try {
            const response  = await authedFetch(paths.API_URL + paths.USERS + `/${id}/favourites`, { method: "GET" })
            if (response.status === 200) {
                const data = await response.json();
                return data.favourite_experiences || [];
            } 
            return [];
        } catch (error) {
            console.log("_getFavourites - ERROR: ", error)
            return false
        } 
    }

    static async _createSessionFromCognitoSession(session) {
        const id = session["idToken"]["payload"]["sub"]
        let isAgent = false
        let favourites = []
        if (session["idToken"]["payload"]["custom:role"] !== 'admin') {
            isAgent = await this._isAgent(id)
            favourites = await this._getFavourites(id)
        }
        return {
            idToken: session["idToken"]["jwtToken"],
            accessToken: session["accessToken"]["jwtToken"],
            refreshToken: session["refreshToken"]["token"],
            id: id,
            role: session["idToken"]["payload"]["custom:role"],
            email: session["idToken"]["payload"]["email"],
            isAgent: isAgent,
            favourites: favourites
        };
    }

    static async getSession() {
        try {
            const session = await getSession();
            return await this._createSessionFromCognitoSession(session);
        } catch (error) {
            console.log("AuthService.getSession ERROR:", error);
            return null;
        }
    }

    static getSessionFromContext(AuthContext) {
        try {
            console.log("getSessionFromContext", AuthContext.session)
            return AuthContext.session;
        } catch (e) {
            return null;
        }
    }

    static async confirmEmail(email, code) {
        const { name, surname } = this.tempUserData;
        try {
            const data = await confirmEmail(email, code, name, surname);
            return data;
        } catch (error) {
            console.log("authService:", error);
            throw error;
        }
    }

    static async resendCode(email) {
        try {
            const data = await resendCode(email);
            return data;
        } catch (error) {
            console.error("authService resendCode:", error);
            throw error;
        }
    }

    static async registerUser(email, name, surname, password) {
        try {
            this.tempUserData.name = name;
            this.tempUserData.surname = surname;
            return signUpUser(email, name, surname, password);
        } catch (error) {
            console.error("authService: FALLE REGISTER", error);
            throw error;
        }
    }

    static async login(email, password, AuthContext) {
        try {
            const data = await authenticate(email, password);
            if (data) {
                const session = await this._createSessionFromCognitoSession(data);
                AuthContext.setSession(session);
                localStorage.setItem('getawayIdToken', session.idToken)
                localStorage.setItem('getawayAccessToken', session.accessToken)
                localStorage.setItem('getawayRefreshToken', session.refreshToken)
                return session;
            }
        } catch (error) {
            console.error("authService: FALLE LOGIN", error);
            throw error;
        }
    }

    static async logout(AuthContext) {
        axios.defaults.headers.common["Authorization"] = null;
        AuthContext.setSession(null);
        localStorage.removeItem('getawayRefreshToken')
        localStorage.removeItem('getawayAccessToken')
        localStorage.removeItem('getawayIdToken')
        signOut();
    }

    static getRole(AuthContext) {
        try {
            return AuthContext.role;
        } catch (e) {
            return null;
        }
    }

    static isLoggedIn(AuthContext) {
        return !(AuthContext.session === null);
    }

    static isUser(AuthContext) {
        return this.roleEquals("user", AuthContext);
    }

    static isAgent(AuthContext) {
        return AuthContext.session ? AuthContext.session.isAgent : false;
    }

    static isAdmin(AuthContext) {
        return this.roleEquals("admin", AuthContext);
    }

    static isAnonymous(AuthContext) {
        return AuthContext.session === null;
    }

    static roleEquals(role, AuthContext) {
        return !!(
            AuthContext.session &&
            AuthContext.session.role.toLowerCase() === role.toLowerCase()
        );
    }

    static editUserInfo(name, surname) {
        this.tempUserData.name = name;
        this.tempUserData.surname = surname;
    }

    static getFavourites(AuthContext) {
        return AuthContext.session ? AuthContext.session.favourites : [];
    }

    static updateFavourites(AuthContext, experience, set) {
        if (!AuthContext.session) return;
        const currentFavourites = AuthContext.session.favourites || [];
        let updatedFavourites;
        const experienceId = experience.id;

        if (set) {
            if (!currentFavourites.some(fav => fav.id ===  experienceId)) {
                updatedFavourites = [...currentFavourites, experience];
            } else {
                updatedFavourites = currentFavourites;
            }
        } else {
            updatedFavourites = currentFavourites.filter(fav => fav.id !== experienceId);
        }

        AuthContext.setSession({
            ...AuthContext.session,
            favourites: updatedFavourites,
        });
    }

    static isFavourite(AuthContext, experienceId) {
        if (!AuthContext.session || !AuthContext.session.favourites) {
            return false;
        }
        return AuthContext.session.favourites.some(fav => fav.id === experienceId);
    }


    /* static setAuth(AuthContext) {
        if (AuthContext && AuthContext.auth) {
            axios.defaults.headers.common["Authorization"] = "Bearer " + AuthContext.auth;
        } else {
            axios.defaults.headers.common["Authorization"] = null;
        }
    }

    static _getItem(name) {
        const aux = sessionStorage.getItem(name);
        return aux ? aux : localStorage.getItem(name);
    }

    static _deduceRememberMe() {
        const aux = sessionStorage.getItem("token");
        return !aux;
    }

    static getInterceptor(axiosInterceptor, setAuth, setDecodedAuth, t) {
        if (!!axiosInterceptor || axiosInterceptor === 0) {
            axios.interceptors.response.eject(axiosInterceptor);
        }

        return axios.interceptors.response.use(
            function (response) {
                if (response.config._retry) {
                    if (response.headers.authorization) {
                        let rememberMe = AuthService._deduceRememberMe();
                        try {
                            const token = response.headers.authorization.slice(7);
                            let decodedAuth = jwtDecode(token);
                            let storage = rememberMe ? localStorage : sessionStorage;
                            storage.setItem("token", token);
                            storage.setItem("decodedAuth", JSON.stringify(decodedAuth));
                            setAuth(token);
                            setDecodedAuth(decodedAuth);
                        } catch {
                            console.log("Invalid token");
                        }
                    }
                }
                return response;
            },
            function (error) {
                if (error.response && error.response.status === 401) {
                    if (error.config._retry) {
                        AuthService.logout({
                            setAuth: setAuth,
                            setDecodedAuth: setDecodedAuth,
                        }).then();
                        toast.error(t("error.sessionExpired"));
                    } else {
                        const refreshToken = AuthService._getItem("refresh");
                        error.config.headers.authorization = "Bearer " + refreshToken;
                        error.config._retry = true;
                        return axios(error.config);
                    }
                }
                return Promise.reject(error);
            }
        );
    } */
}
