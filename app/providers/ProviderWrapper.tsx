import React, { ReactNode } from 'react';
import { AppProvider } from './AppProvider';

interface ProviderWrapperProps {
    children: ReactNode;
}

const ProviderWrapper: React.FC<ProviderWrapperProps> = ({ children }) => {
    return (
        <AppProvider>
            {children}
        </AppProvider>
    );
};

export default ProviderWrapper;