'use client';

import React, {createContext, useEffect, useReducer, ReactNode, useContext} from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { v4 as uuidv4 } from 'uuid';
import {toast} from "react-toastify";

export const UserContext = createContext<ContextType | undefined>(undefined);

interface UserState {
    id: string | null;
    name: string | null;
    email: string | null;
    role: string | null;
    uuid: string | null;
}

type Action =
    | { type: "LOGIN"; payload: { id: string; name: string; email: string; role: string } }
    | { type: "LOGOUT" }
    | { type: "SET_UUID"; payload: { uuid: string } };

interface CustomJwtPayload extends JwtPayload {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface ContextType {
    state: UserState;
    dispatch: React.Dispatch<Action>;
}

interface ContextProviderProps {
    children: ReactNode;
}

const initialState: UserState = {
    id: null,
    name: null,
    email: null,
    role: null,
    uuid: null,
};

const reducer = (state: UserState, action: Action): UserState => {
    switch (action.type) {
        case "LOGIN":
            return {
                ...state,
                id: action.payload.id,
                name: action.payload.name,
                email: action.payload.email,
                role: action.payload.role,
            };
        case "LOGOUT":
            localStorage.removeItem('accessToken');
            return { ...initialState };
        case "SET_UUID":
            return {
                ...state,
                uuid: action.payload.uuid,
            };
        default:
            return state;
    }
};

const ContextProvider: React.FC<ContextProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');

        if (token) {
            try {
                const decoded = jwtDecode<CustomJwtPayload>(token);
                dispatch({
                    type: "LOGIN",
                    payload: {
                        id: decoded.id,
                        name: decoded.name,
                        email: decoded.email,
                        role: decoded.role,
                    },
                });
            } catch (error) {
                console.error("Invalid Token", error);
            }
        }

        const existingUUID = localStorage.getItem('uuid') || uuidv4();
        if (!existingUUID) {

            fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/device`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                body: JSON.stringify({
                    device_id: existingUUID,
                }),
            })
                .then((response) => {
                    if (!response.ok) {
                        return Promise.reject(response);
                    }
                    return response.json();
                })
                .then(() => {
                    localStorage.setItem('uuid', existingUUID);
                })
                .catch((error) => {
                    if (error instanceof Response) {
                        error.json().then((data) => {
                            toast.error(data.message);
                        });
                    } else {
                        toast.error("Internal Server Error", error);
                    }
                });
        } else {
            localStorage.setItem('uuid', existingUUID);
        }

        dispatch({ type: "SET_UUID", payload: { uuid: existingUUID } });
    }, []);

    return (
        <UserContext.Provider value={{ state, dispatch }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};

export default ContextProvider;
