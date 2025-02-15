import { createTheme } from "@mui/material";

const AppTheme = createTheme({
    palette: {
        primary: {
            light: "#B22222",
            main: "#F02D36",
            dark: "#5A0000",
            100: "#FFFFFF",
        },
        secondary: {
            light: "#3B5F87",
            main: "#B22222",
            dark: "#0D243F",
        },
        background: {
            default: "#e4e4e4",
            paper: "#FFFFFF",
        },
        text: {
            primary: "#000000",
            secondary: "#000000",
            disabled: "#000000",
        },
        warning: {
            light: "#E6C76F",
            main: "#C9A227",
            dark: "#8A6E1F",
        },
        grey: {
            100: "#F5F5F5",
            200: "#EEEEEE",
            300: "#E0E0E0",
            400: "#BDBDBD",
            500: "#9E9E9E",
            600: "#757575",
            700: "#616161",
            800: "#424242",
            900: "#212121",
        },
    },
    typography: {
        fontFamily: `"Montserrat", sans-serif`,
        h1: {
            fontSize: "2rem",
            fontWeight: 700,
            color: "#000000",
            "@media (max-width:600px)": {
                fontSize: "1.5rem",
            },
        },
        h2: {
            fontSize: "1.75rem",
            fontWeight: 600,
            color: "#000000",
            "@media (max-width:600px)": {
                fontSize: "1.25rem",
            },
        },
        h6: {
            color: "#FFFFFF",
            fontSize: "24px",
        },
        body1: {
            fontSize: "1rem",
            color: "#000000",
        },
        body2: {
            fontSize: "0.875rem",
            color: "#000000",
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    padding: "16px",
                    borderRadius: "0px",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    borderRadius: "0",
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    borderRadius: "30px",
                    "@media (max-width:600px)": {
                        width: "100%",
                    },
                },
            },
        },
        MuiContainer: {
            styleOverrides: {
                root: {
                    "@media (max-width:600px)": {
                        padding: "10px",
                    },
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                root: {
                    boxSizing: "border-box",
                }
            }
        }
    },
});

export default AppTheme;
