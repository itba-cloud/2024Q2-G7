import React, { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react"
import { internalAuthProvider } from "../scripts/auth"
import { CurrentUserModel, UserModel } from "../types"

/* interface AuthContextType {
    user: CurrentUserModel | null
    setUser: Dispatch<SetStateAction<CurrentUserModel | null>>
    signIn: (callback: VoidFunction) => CurrentUserModel
    signOut: (callback: VoidFunction) => void
    verifyUser: (callback: VoidFunction) => void
    makeProvider: (callback: VoidFunction) => void
    setHasImage: () => void
    editUserInfo: (name: string, surname: string, callback: VoidFunction) => void
    isLogged: () => boolean
    isVerified: () => boolean
    isProvider: () => boolean
    getUser: () => CurrentUserModel | null
}

export const AuthContext = createContext<AuthContextType>(null!)

export function AuthProvider({ children }: { children: ReactNode }) {

    // TODO 
    const [user, setUser] = useState<CurrentUserModel | null>(currentUserModel)
    //const [user, setUser] = useState<CurrentUserModel | null>(null)

    useEffect(() => {
        const accessToken = localStorage.getItem("getawayAccessToken");
        if (accessToken) {
            const loggedUser: CurrentUserModel = JSON.parse(atob(accessToken.split(".")[1])) as CurrentUserModel;
            setUser(loggedUser);
            localStorage.setItem('getawayUser', JSON.stringify(loggedUser))
        }
    }, []);

    const signIn = (callback: VoidFunction) => {
        internalAuthProvider.signIn(() => {
            const token = localStorage.getItem('getawayAccessToken')
            if (token) {
                const loggedUser: CurrentUserModel = JSON.parse(atob(token.split('.')[1])) as CurrentUserModel
                setUser(loggedUser)
                localStorage.setItem('getawayUser', JSON.stringify(loggedUser))
            }
            callback()
        })
        return getUser()
    }

    const signOut = (callback: VoidFunction) => {
        return internalAuthProvider.signOut(() => {
            localStorage.removeItem('getawayAccessToken')
            localStorage.removeItem('getawayRefreshToken')
            localStorage.removeItem('getawayUser')
            setUser(null)
            callback()
        })
    }

    const getUser = () => {
        // TODO
        // const userStorage = localStorage.getItem('getawayUser')
        // if (userStorage !== null)
        //     return JSON.parse(userStorage)
        // return null
        //return currentUserModel
        return null

    }

    const verifyUser = (callback: VoidFunction) => {
        const userStorage = localStorage.getItem('getawayUser')
        if (userStorage !== null) {
            const parsedUser = JSON.parse(userStorage)
            parsedUser.isVerified = true
            setUser(parsedUser)
            localStorage.setItem('getawayUser', JSON.stringify(parsedUser))
        }
        callback()
    }

    const makeProvider = (callback: VoidFunction) => {
        const userStorage = localStorage.getItem('getawayUser')
        if (userStorage !== null) {
            const parsedUser = JSON.parse(userStorage)
            parsedUser.isProvider = true
            setUser(parsedUser)
            localStorage.setItem('getawayUser', JSON.stringify(parsedUser))
        }
        callback()
    }

    const setHasImage = () => {
        const userStorage = localStorage.getItem('getawayUser')
        if (userStorage !== null) {
            const parsedUser = JSON.parse(userStorage)
            parsedUser.hasImage = true
            setUser(parsedUser)
            localStorage.setItem('getawayUser', JSON.stringify(parsedUser))
        }
    }

    const editUserInfo = (name: string, surname: string, callback: VoidFunction) => {
        const userStorage = localStorage.getItem('getawayUser')
        if (userStorage !== null) {
            const parsedUser = JSON.parse(userStorage)
            parsedUser.name = name
            parsedUser.surname = surname
            setUser(parsedUser)
            localStorage.setItem('getawayUser', JSON.stringify(parsedUser))
        }
        callback()
    }

    const isLogged = () => {
        // TODO
        //return localStorage.getItem("getawayUser") !== null
        return false
    }

    const isVerified = () => {
        const userStorage = localStorage.getItem('getawayUser')
        if (userStorage !== null) {
            const parsedUser = JSON.parse(userStorage)
            return parsedUser.isVerified
        }
        // TODO
        // return false
        return true
    }

    const isProvider = () => {
        const userStorage = localStorage.getItem('getawayUser')
        if (userStorage !== null) {
            const parsedUser = JSON.parse(userStorage)
            return parsedUser.isProvider
        }
        // TODO
        // return false
        return true
    }

    const value = { user, setUser, signIn, signOut, verifyUser, makeProvider, setHasImage, editUserInfo, isLogged, isVerified, isProvider, getUser }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
 */