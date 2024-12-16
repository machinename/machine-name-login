import { Button, IconButton, styled, TextField } from "@mui/material";
import { Circle } from "@mui/icons-material";

const defaultBorderRadius = '0px';
const defaultFontWeight = 'regular';

interface BackgroundCircleProps {
    selected?: boolean;
    bgcolor?: string;
    color?: string;
}

export const BackgroundCircle = styled(Circle)<BackgroundCircleProps>(({ selected }) => ({
    fontSize: '2rem',
    backgroundColor: '#ffffff',
    color: '#ffffff',
    border: `2px solid ${selected ? 'purple' : 'lightgray'}`,
    borderRadius: '50%',
    '&:hover': {
        borderColor: 'inherit',
    },
    '@media (prefers-color-scheme: dark)': {
        backgroundColor: '#121212',
        color: 'transparent',
        border: `2px solid ${selected ? 'purple' : 'lightgray'}`,
    },
}));

export const BackgroundCircleChalk = styled(Circle)<BackgroundCircleProps>(({ selected }) => ({
    fontSize: '2rem',
    backgroundColor: 'lightgray',
    color: 'transparent',
    border: `2px solid ${selected ? 'purple' : 'lightgray'}`,
    borderRadius: '50%',
    '&:hover': {
        borderColor: 'inherit',
    },
    '@media (prefers-color-scheme: dark)': {
        backgroundColor: '#8a8a8a',
        color: 'transparent',
        border: `2px solid ${selected ? 'purple' : '#8a8a8a'}`,
    },
}
));

export const BackgroundCircleYellow = styled(Circle)<BackgroundCircleProps>(({ selected }) => ({
    fontSize: '2rem',
    backgroundColor: '#fff59c',
    color: 'transparent',
    border: `2px solid ${selected ? 'purple' : '#fff59c'}`,
    borderRadius: '50%',
    '&:hover': {
        borderColor: 'inherit',
    },
    '@media (prefers-color-scheme: dark)': {
        backgroundColor: '#9c955c',
        color: 'transparent',
        border: `2px solid ${selected ? 'purple' : '#9c955c'}`,
    },
}));

export const BackgroundCircleMintyGreen = styled(Circle)<BackgroundCircleProps>(({ selected }) => ({
    fontSize: '2rem',
    backgroundColor: '#aaf0d1',
    color: 'transparent',
    border: `2px solid ${selected ? 'purple' : '#aaf0d1'}`,
    borderRadius: '50%',
    '&:hover': {
        borderColor: 'inherit',
    },
    '@media (prefers-color-scheme: dark)': {
        backgroundColor: '#5f8775',
        color: 'transparent',
        border: `2px solid ${selected ? 'purple' : '#5f8775'}`,
    },
}));

export const BackgroundCircleTeal = styled(Circle)<BackgroundCircleProps>(({ selected }) => ({
    fontSize: '2rem',
    backgroundColor: '#B2DFDB',
    color: 'transparent',
    border: `2px solid ${selected ? 'purple' : '#B2DFDB'}`,
    borderRadius: '50%',
    '&:hover': {
        borderColor: 'inherit',
    },
    '@media (prefers-color-scheme: dark)': {
        backgroundColor: '#005c5a',
        color: 'transparent',
        border: `2px solid ${selected ? 'purple' : '#005c5a'}`,
    },
}
));

interface BackgroundIconButtonProps {
    selected?: boolean;
}

export const BackgroundIconButton = styled(IconButton)<BackgroundIconButtonProps>(({ selected }) => ({
    padding: '0.25rem',
    '&:hover': {
        backgroundColor: 'transparent',
        '& .MuiSvgIcon-root': {
            borderColor: selected ? 'purple' : '#222',
        },
    },
    '@media (prefers-color-scheme: dark)': {
        '&:hover': {
            backgroundColor: 'transparent',
            '& .MuiSvgIcon-root': {
                borderColor: selected ? 'purple' : '#f9fafb',
            },
        },
    },
}));

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