'use client'

import React, {
    createContext,
    useContext,
    useState,
    useMemo,
    useCallback,
    ReactNode
} from 'react';

// import { FirebaseError } from 'firebase/app';
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

interface AppContextType {
    info: string;
    createUserAccount: (email: string, password: string) => Promise<void>;
    logIn: (email: string, password: string) => Promise<void>;
    logInWithGoogle: () => Promise<void>;
    sendPasswordReset: (email: string) => Promise<void>;
    setInfo: (info: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [info, setInfo] = useState<string>('');

    // const handleError = useCallback((error: unknown) => {
    //     if (error instanceof FirebaseError) {
    //         switch (error.code) {
    //             case 'auth/invalid-credential':
    //                 setAuthError('Invalid credentials provided');
    //                 break;
    //             case 'auth/email-already-in-use':
    //                 setAuthError('Email already in use');
    //                 break;
    //             case 'auth/invalid-email':
    //                 setAuthError('Invalid email address');
    //                 break;
    //             case 'auth/operation-not-allowed':
    //                 setAuthError('Operation not allowed');
    //                 break;
    //             case 'auth/weak-password':
    //                 setAuthError('The password is too weak');
    //                 break;
    //             case 'auth/too-many-requests':
    //                 setAuthError('Access temporarily disabled due to many failed attempts');
    //                 break;
    //             default:
    //                 setAuthError('Unknown FirebaseError, error.code: ' + error.code);
    //         }
    //     } else {
    //         setAuthError('' + error);
    //     }
    //     throw error;
    // }, []);

    const createUserAccount = useCallback(async (email: string, password: string): Promise<void> => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await sendIdTokenToServer(userCredential);
            await sendEmailVerification(userCredential.user);
        } catch (error) {
            setInfo('Error creating account');
            throw error;
        } finally {
            await auth.signOut();
        }
    }, []);

    const logIn = useCallback(async (email: string, password: string): Promise<void> => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            await sendIdTokenToServer(userCredential);
            await auth.signOut();
        } catch (error) {
            setInfo('Error logging in');
            throw error;
        } finally {
            await auth.signOut();
        }
    }, []);

    const logInWithGoogle = useCallback(async (): Promise<void> => {
        try {
            const userCredential = await signInWithPopup(auth, new GoogleAuthProvider());
            await sendIdTokenToServer(userCredential);
        } catch (error) {
            setInfo('Error logging in with Google');
            throw error;
        } finally {
            await auth.signOut();
        }
    }, []);

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
            setInfo('Error sending password reset email');
            throw error;
        }
    }, []);

    const contextValue = useMemo(() => ({
        info,
        createUserAccount,
        logIn,
        logInWithGoogle,
        sendPasswordReset,
        setInfo,
    }), [
        info,
        createUserAccount,
        logIn,
        logInWithGoogle,
        sendPasswordReset,
        setInfo,
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