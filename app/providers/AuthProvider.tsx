'use client'

import React, {
    createContext,
    useContext,
    useState,
    useMemo,
    useCallback,
    ReactNode
} from 'react';

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
import { auth } from '../firebase';
import axios from 'axios';

interface AuthContextType {
    authError: string;
    createUserAccount: (email: string, password: string) => Promise<void>;
    logIn: (email: string, password: string) => Promise<void>;
    logInWithGoogle: () => Promise<void>;
    sendPasswordReset: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [authError, setAuthError] = useState<string>('');

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
        throw error;
    }, []);

    const createUserAccount = useCallback(async (email: string, password: string): Promise<void> => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await sendIdTokenToServer(userCredential);
            await sendEmailVerification(userCredential.user);
        } catch (error) {
            handleError(error);
        } finally {
            await auth.signOut();
        }
    }, [handleError]);

    const logIn = useCallback(async (email: string, password: string): Promise<void> => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            await sendIdTokenToServer(userCredential);
            await auth.signOut();
        } catch (error) {
            handleError(error);
        } finally {
            await auth.signOut();
        }
    }, [handleError]);

    const logInWithGoogle = useCallback(async (): Promise<void> => {
        try {
            const userCredential = await signInWithPopup(auth, new GoogleAuthProvider());
            await sendIdTokenToServer(userCredential);
        } catch (error) {
            handleError(error);
        } finally {
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
            'https://machinename.dev/login',
            { idToken },
            { withCredentials: true }
        );
        if (response.status !== 200) {
            throw new Error(response.data);
        }
    };

    const sendPasswordReset = useCallback(async (email: string): Promise<void> => {
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (error) {
            handleError(error);
        }
    }, [handleError]);

    const contextValue = useMemo(() => ({
        authError,
        createUserAccount,
        logIn,
        logInWithGoogle,
        sendPasswordReset,
    }), [
        authError,
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