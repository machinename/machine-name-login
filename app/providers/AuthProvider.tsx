'use client'

import React, {
    createContext,
    useContext,
    useState,
    useMemo,
    useCallback,
    ReactNode,
    useEffect,
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
    createUserAccount: (email: string, password: string) => Promise<boolean>;
    logIn: (email: string, password: string) => Promise<boolean>;
    logInWithGoogle: () => Promise<boolean>;
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
    }, []);

    const createUserAccount = useCallback(async (email: string, password: string): Promise<boolean> => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await sendIdTokenToServer(userCredential);
            await sendEmailVerification(userCredential.user);
            await auth.signOut();
            return true;
        } catch (error) {
            handleError(error);
            return false;
        }
    }, [handleError]);

    const logIn = useCallback(async (email: string, password: string): Promise<boolean> => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            await sendIdTokenToServer(userCredential);
            await auth.signOut();
            return true;
        } catch (error) {
            handleError(error);
            return false;
        }
    }, [handleError]);

    const logInWithGoogle = useCallback(async (): Promise<boolean> => {
        try {
            const userCredential = await signInWithPopup(auth, new GoogleAuthProvider());
            await sendIdTokenToServer(userCredential);
            await auth.signOut();
            return true;
        } catch (error) {
            handleError(error);
            return false;
        }
    }, [handleError]);

    const sendIdTokenToServer = async (userCredential: { user: User }
    ) => {
        const idToken = await userCredential.user.getIdToken();
        if (!idToken) {
            throw new Error('No ID token received');
        }
        const response = await axios.post(
            'https://api.machinename.dev/login',
            { idToken },
            { withCredentials: true }
        );
        if (response.status !== 200) {
            throw new Error('Failed to create login session');
        } 
    };

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

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            console.log('onAuthStateChanged', user);
        });
        return () => unsubscribe();
    }, []);

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