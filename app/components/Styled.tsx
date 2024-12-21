import { Button, IconButton, styled, TextField } from "@mui/material";

const defaultBorderRadius = '0px';
const defaultFontWeight = 'regular';

export const FormTextField = styled(TextField)({
    width: '100%',
    '& .MuiFilledInput-root': {
        backgroundColor: 'transparent',
    },
    '& .MuiInputBase-input': {
        fontFamily: 'inherit',
        fontWeight: defaultFontWeight,
        color: 'inherit',
        transition: 'color 0.3s ease',
    },
    '& label': {
        fontFamily: 'inherit',
        fontWeight: defaultFontWeight,
        transition: 'color 0.3s ease',
    },
    '& label.Mui-focused': {
        fontFamily: 'inherit',
        fontWeight: defaultFontWeight,
        color: 'inherit',
    },
    '@media (prefers-color-scheme: dark)': {
        '& .MuiInput-underline': {
            '&:before': {
                borderBottom: '1px solid gray',
            },
            '&:hover:before': {
                borderBottom: '2px solid gray',
            },
        },
        '& .MuiFilledInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
        },
        '& .MuiInputBase-input': {
            color: 'lightgray',
        },
        '& label': {
            color: 'gray',
        },
        '& label.Mui-focused': {
            color: 'gray',
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                border: '1px solid gray',
            },
        },
    },
});

export const StyledButton = styled(Button)({
    backgroundColor: 'black',
    borderRadius: defaultBorderRadius,
    color: '#f9fafb',
    fontFamily: 'inherit',
    fontWeight: defaultFontWeight,
    width: '100%',
    '&:disabled': {
        backgroundColor: '#f0f0f0',
        color: 'gray',
        border: 'none',
        cursor: 'not-allowed'
    },
    '@media (prefers-color-scheme: dark)': {
        color: 'black',
        backgroundColor: '#ededed',
    },
});

export const StyledIconButtonInfo = styled(IconButton)({
    color: 'gray',
    '@media (prefers-color-scheme: dark)': {
        color: '#171717',
        '&.Mui-disabled': {
            color: 'gray'
        }
    }
});

export const StyledTextButton = styled(Button)({
    color: 'inherit',
    backgroundColor: 'transparent',
    borderRadius: defaultBorderRadius,
    fontFamily: 'inherit',
    fontWeight: defaultFontWeight,
    padding: '0',
    '@media (prefers-color-scheme: dark)': {
        color: '#ededed',
    }
});