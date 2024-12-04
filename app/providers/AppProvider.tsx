'use client'

import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';


interface AppContextType {
    info: string;
    setInfo: React.Dispatch<React.SetStateAction<string>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [info, setInfo] = useState<string>('');

    const contextValue = useMemo(() => ({
        info, setInfo
    }), [
        info
    ]);

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within AppProvider');
    }
    return context;
};