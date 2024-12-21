'use client'

import axios from 'axios';
import { AxiosError } from 'axios';
import { auth } from '../firebase';
import { FirebaseError } from 'firebase/app';
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    sendEmailVerification,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
    User,
} from "firebase/auth";
import React, {
    createContext,
    useContext,
    useState,
    useMemo,
    useCallback,
    ReactNode
} from 'react';

interface AppContextType {
    info: string;
    isLoading: boolean;
    createUserAccount: (email: string, password: string) => Promise<void>;
    logIn: (email: string, password: string) => Promise<void>;
    logInWithGoogle: () => Promise<void>;
    sendPasswordReset: (email: string) => Promise<void>;
    setInfo: (info: string) => void;
    setIsLoading: (isLoading: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const apiUrl = 'https://api.machinename.dev/login';
    const [info, setInfo] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleError = useCallback((error: unknown) => {
        if (error instanceof AxiosError) {
            setInfo('' + error.message);
            return;
        }

        if (error instanceof FirebaseError) {
            switch (error.code) {
                case 'auth/invalid-credential':
                    setInfo('Invalid credentials provided');
                    break;
                case 'auth/email-already-in-use':
                    setInfo('Email already in use');
                    break;
                case 'auth/invalid-email':
                    setInfo('Invalid email address');
                    break;
                case 'auth/operation-not-allowed':
                    setInfo('Operation not allowed');
                    break;
                case 'auth/weak-password':
                    setInfo('The password is too weak');
                    break;
                case 'auth/too-many-requests':
                    setInfo('Access temporarily disabled due to many failed attempts');
                    break;
                default:
                    setInfo('Unknown FirebaseError, error.code: ' + error.code);
            }
            return;
        }
        setInfo('' + error);
    }, []);

    const createUserAccount = useCallback(async (email: string, password: string): Promise<void> => {
        try {
            setIsLoading(true);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await sendEmailVerification(userCredential.user);
            await sendIdTokenToServer(userCredential);
        } catch (error) {
            handleError(error);
            throw error;
        } finally {
            setIsLoading(false);
            await auth.signOut();
        }
    }, [handleError]);

    const logIn = useCallback(async (email: string, password: string): Promise<void> => {
        try {
            setIsLoading(true);
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            await sendIdTokenToServer(userCredential);
            await auth.signOut();
        } catch (error) {
            handleError(error);
            throw error;
        } finally {
            setIsLoading(false);
            await auth.signOut();
        }
    }, [handleError]);

    const logInWithGoogle = useCallback(async (): Promise<void> => {
        try {
            setIsLoading(true);
            const userCredential = await signInWithPopup(auth, new GoogleAuthProvider());
            await sendIdTokenToServer(userCredential);
        } catch (error) {
            handleError(error);
            throw error;
        } finally {
            setIsLoading(false);
            await auth.signOut();
        }
    }, [handleError]);

    const sendIdTokenToServer = async (userCredential: { user: User }
    ) => {
        const idToken = await userCredential.user.getIdToken();
        if (!idToken) {
            throw new Error('No ID token received');
        }
        const response = await axios.post(
            apiUrl,
            { idToken },
            { withCredentials: true }
        );
        if (response.status !== 200) {
            throw new Error(response.data);
        }
    };

    const sendPasswordReset = useCallback(async (email: string): Promise<void> => {
        try {
            setIsLoading(true);
            await sendPasswordResetEmail(auth, email);
        } catch (error) {
            handleError(error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [handleError]);

    const contextValue = useMemo(() => ({
        info,
        isLoading,
        createUserAccount,
        logIn,
        logInWithGoogle,
        sendPasswordReset,
        setInfo,
        setIsLoading,
    }), [
        info,
        isLoading,
        createUserAccount,
        logIn,
        logInWithGoogle,
        sendPasswordReset,
    ]);

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within AuthProvider');
    }
    return context;
};