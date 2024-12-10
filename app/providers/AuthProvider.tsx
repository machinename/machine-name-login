'use client'

import React, {
    createContext,
    useContext,
    useState,
    useMemo,
    useCallback,
    ReactNode,
} from 'react';
import { FirebaseError } from 'firebase/app';
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    sendEmailVerification,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signInWithPopup,
} from "firebase/auth";
import { auth } from '../firebase';
import axios from 'axios';

interface AuthContextType {
    authError: string;
    isAuthLoading: boolean;
    createUserAccount: (email: string, password: string) => Promise<void>;
    logIn: (email: string, password: string) => Promise<boolean>;
    logInWithGoogle: () => Promise<boolean>;
    sendPasswordReset: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [authError, setAuthError] = useState<string>('');
    const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);

    const handleError = useCallback((error: unknown) => {
        if (error instanceof FirebaseError) {
            switch (error.code) {
                case 'auth/invalid-credential':
                    setAuthError('Invalid credentials provided');
                    break;
                case 'auth/email-already-in-use':
                    setAuthError('Email already in use');
                    break;
                case 'auth/invalid-email':
                    setAuthError('Invalid email address');
                    break;
                case 'auth/operation-not-allowed':
                    setAuthError('Operation not allowed');
                    break;
                case 'auth/weak-password':
                    setAuthError('The password is too weak');
                    break;
                case 'auth/too-many-requests':
                    setAuthError('Access temporarily disabled due to many failed attempts');
                    break;
                default:
                    setAuthError('Unknown FirebaseError, error.code: ' + error.code);
            }
        } else {
            setAuthError('' + error);
        }
    }, []);

    const createUserAccount = useCallback(async (email: string, password: string): Promise<void> => {
        setIsAuthLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await sendEmailVerification(userCredential.user);
        } catch (error) {
            handleError(error);
        } finally {
            setIsAuthLoading(false);
        }
    }, [handleError]);



    const logIn = useCallback(async (email: string, password: string): Promise<boolean> => {
        setIsAuthLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const idToken = await userCredential.user.getIdToken();

            if (!idToken) {
                throw new Error('No ID token received');
            }

            const response = await axios.post(
                'https://auth.machinename.dev/login',
                { idToken },
                { withCredentials: true }
            );

            if (response.status === 200) {
                console.log(response.data.message);
                return true;
            } else {
                throw new Error('Failed to create session');
            }
        } catch (error) {
            handleError(error);
            return false;
        } finally {
            setIsAuthLoading(false);
        }
    }, [handleError]); 

    const logInWithGoogle = useCallback(async (): Promise<boolean> => {
        setIsAuthLoading(true);
        try {
            const userCredential = await signInWithPopup(auth, new GoogleAuthProvider());
            const idToken = await userCredential.user.getIdToken();

            if (!idToken) {
                throw new Error('No ID token');
            }

            const response = await axios.post(
                'https://auth.machinename.dev/login',
                { idToken },
                { withCredentials: true }
            );

            if (response.status === 200) {
                console.log(response.data.message);
                return true;
            } else {
                throw new Error('Failed to create session');
            }
        } catch (error) {
            handleError(error);
            return false;
        } finally {
            setIsAuthLoading(false);
        }
    }, [handleError]);

    const sendPasswordReset = useCallback(async (email: string): Promise<void> => {
        if (auth === null) {
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (error) {
            handleError(error);
            throw error;
        }
    }, [handleError]);

    const contextValue = useMemo(() => ({
        authError,
        isAuthLoading,
        createUserAccount,
        logIn,
        logInWithGoogle,
        sendPasswordReset,
    }), [
        authError,
        isAuthLoading,
        createUserAccount,
        logIn,
        logInWithGoogle,
        sendPasswordReset,
    ]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within AuthProvider');
    }
    return context;
};