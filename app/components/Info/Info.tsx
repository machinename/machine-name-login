'use client'

import React from 'react';
import styles from './Info.module.css';
import { Close } from '@mui/icons-material';
import { useAppContext } from '../../providers/AppProvider';
import { StyledIconButton } from '../Styled';

const Info: React.FC = () => {
    const { info, setInfo } = useAppContext();

    return (
        info && (
            <div className={styles.wrapper}>
                <div className={styles.info}>
                    <p>{info}</p>
                    <StyledIconButton
                        onClick={() => setInfo('')}
                        sx={{ color: 'gray' }}
                    >
                        <Close />
                    </StyledIconButton>
                </div>
            </div>
        ));
}

export default Info;