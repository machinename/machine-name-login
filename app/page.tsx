'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import {
  InputAdornment,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Google,
  PersonOutline,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from '@mui/icons-material';
import styles from './page.module.css';
import { FormTextField, StyledButton, StyledTextButton } from './components/Styled';
import React from 'react';
import { useAuthContext } from './providers/AuthProvider';
import { useAppContext } from './providers/AppProvider';

export default function Login() {
  const { isAuthLoading, createUserAccount, logIn, logInWithGoogle, sendPasswordReset } = useAuthContext();
  const { setInfo } = useAppContext();

  const router = useRouter();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isHelp, setIsHelp] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState<boolean>(true);

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleClickShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  const isButtonEnabled = () => {
    if (isHelp) {
      return email.trim() !== '';
    } else if (isLogin) {
      return email.trim() !== '' && password.trim() !== '' && password.length > 0;
    } else {
      return email.trim() !== '' && password.trim() !== '' && confirmPassword.trim() !== '' && password.length > 7;
    }
  };

  const clearValues = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword(''); setConfirmPassword('');
    setErrors({ email: '', password: '', confirmPassword: '' });
  };

  const handleContinueAsGuest = async (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    router.push('/');
  };

  const handleContinueWithGoogle = async (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      await logInWithGoogle();
    } catch (error) {
      console.log(error);
    } finally {
      clearValues();
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({ email: '', password: '', confirmPassword: '' });
    try {
      if (isHelp) {
        if (!email) {
          setErrors({ ...errors, email: 'Email is required' });
          return;
        }
        await sendPasswordReset(email);
        setInfo('If the email address is registered, a password reset link will be sent to it.');
        setEmail('');
      } else if (isLogin) {
        if (!password.trim()) {
          setErrors({ ...errors, password: 'Password is required' });
          return;
        }
        await logIn(email, password);
        router.push('/');
      } else if (!isLogin && !isHelp) {
        if (!email.trim()) {
          setErrors({ ...errors, email: 'Email is required' });
          return;
        }
        if (!password.trim()) {
          setErrors({ ...errors, password: 'Password is required' });
          return;
        }
        if (confirmPassword.trim()) {
          setErrors({ ...errors, confirmPassword: 'Confirm Password is required' });
          return;
        }
        if (password !== confirmPassword) {
          setErrors({ ...errors, confirmPassword: 'Passwords do not match' });
          return;
        }
        await createUserAccount(email, password);
        router.push('/');
      }
    } catch (error) {
      console.log('Error:', error);
    } finally {
      clearValues();
    }
  };

  const toggleLoginHelp = () => {
    setIsHelp(prev => !prev);
    clearValues();
  };

  const handleSwitch = () => {
    setIsLogin(prev => !prev);
    setIsHelp(false);
    clearValues();
  };

  if (isAuthLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.wrapper}>
          <CircularProgress />
        </div>
      </div>
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.switchContainer}>
        <StyledTextButton
          disableRipple={true}
          type="button"
          onClick={handleSwitch}>
          {isLogin ? 'Create an account' : 'Already have an account?'}
        </StyledTextButton>
      </div>
      <div className={styles.wrapper}>
        <h1>{isHelp ? 'Log in help' : (isLogin ? 'Log in' : 'Create an account')}</h1>
        <div className={isHelp ? styles.loginHelp : styles.login}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <FormTextField
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="standard"
              label="Email"
              sx={{ width: '100%' }}
              autoComplete='off'
            />
            {errors.email && (<p aria-live="polite" className={styles.textError}>{errors.email}</p>)}
            {!isHelp && (
              <FormTextField
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="standard"
                label="Password"
                autoComplete='off'
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        {showPassword ? <VisibilityOffOutlined
                          sx={{
                            color: 'gray',
                            cursor: 'pointer'
                          }}
                          onClick={handleClickShowPassword} /> : <VisibilityOutlined
                          sx={{
                            color: 'gray',
                            cursor: 'pointer'
                          }}
                          onClick={handleClickShowPassword} />}
                      </InputAdornment>
                    )
                  },
                }}
              />
            )}
            {errors.password && (<p aria-live="polite" className={styles.textError}>{errors.password}</p>)}
            {(!isLogin && !isHelp) && (
              <FormTextField
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                variant="standard"
                label="Confirm Password"
                sx={{
                  width: '100%',
                  color: 'inherit',
                }}
              />
            )}
            {errors.confirmPassword && (<p aria-live="polite" className={styles.textError}>{errors.confirmPassword}</p>)}
            <StyledButton disabled={!isButtonEnabled()} type="submit">
              {isHelp ? 'Send' : (isLogin ? 'Log in' : 'Create Account')}
            </StyledButton>
          </form>
          {!isHelp && (
            <React.Fragment>
              <div className={styles.divider}>
                <Divider orientation='vertical'>OR</Divider>
              </div>
              <div className={styles.dividerMobile}>
                <Divider orientation='horizontal'>OR</Divider>
              </div>
              <div className={styles.form}>
                <StyledButton onClick={handleContinueWithGoogle} startIcon={<Google />}>
                  Continue with Google
                </StyledButton>
                <StyledButton onClick={handleContinueAsGuest} startIcon={<PersonOutline />}>
                  Continue as Guest
                </StyledButton>
              </div>
            </React.Fragment>
          )}
        </div>
        {(!isLogin && !isHelp) && (
          <p>By creating an account, you agree to our <Link href={'/'} className={styles.textTerms} target="_blank" rel="noopener noreferrer">Terms of Service</Link> & <Link href={'/'} className={styles.textTerms} target="_blank" rel="noopener noreferrer">Privacy Policy</Link></p>
        )}
        {isHelp ? (
          <React.Fragment>
            <p className={styles.textTerms}>
              Enter your email to receive a password reset link
            </p>
            <p className={styles.textTerms}>
              For any other issues, please contact <Link href="" className={styles.textTerms}>support</Link>
            </p>
          </React.Fragment>
        ) :
          <React.Fragment>
            <p>Secure Login with reCAPTCHA subject to Google <Link href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className={styles.textTerms}>Terms</Link> & <Link href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className={styles.textTerms}>Privacy</Link></p>
          </React.Fragment>
        }
        <StyledTextButton type="button"
          disableRipple={true}
          onClick={toggleLoginHelp}>
          {isHelp ? 'Back' : 'Log in help'}
        </StyledTextButton>
      </div>
    </div>
  );
};