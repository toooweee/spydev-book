import {createTheme} from "@mui/material";

declare module "@mui/material/styles" {
  interface PaletteColor {
    900?: string; // Добавляем поддержку кастомных оттенков
    800?: string; // Добавляем поддержку кастомных оттенков
    700?: string; // Добавляем поддержку кастомных оттенков
    600?: string; // Добавляем поддержку кастомных оттенков
    500?: string; // Добавляем поддержку кастомных оттенков
    400?: string; // Добавляем поддержку кастомных оттенков
    300?: string; // Добавляем поддержку кастомных оттенков
    200?: string; // Добавляем поддержку кастомных оттенков
    100?: string; // Добавляем поддержку кастомных оттенков
  }
}

const AppTheme = createTheme({
    palette: {
        primary: {
            light: "#B22222", // Светлый красный
            main: "#F02D36", // Тёмно-красный (основной)
            dark: "#5A0000", // Очень тёмный красный
            100: "#FFFFFF"
        },
        secondary: {
            light: "#3B5F87", // Светлый синий
            main: "#B22222", // Глубокий синий (основной)
            dark: "#0D243F", // Тёмный синий
        },
        background: {
            default: "#e4e4e4", // Бежевый фон
            paper: "#FFFFFF", // Белый фон для карточек и документов
        },
        text: {
            primary: "#000000", // Чёрный текст
            secondary: "#000000", // Серый текст
            disabled: "#000000", // Отключённый текст
        },
        warning: {
            light: "#E6C76F", // Светлый золотой
            main: "#C9A227", // Золотой (основной)
            dark: "#8A6E1F", // Тёмный золотой
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
            fontSize: "2.5rem",
            fontWeight: 700,
            color: "#000000",
        },
        h2: {
            fontSize: "2rem",
            fontWeight: 600,
            color: "#000000",
        },
        h6: {
            color: '#FFFFFF',
            fontSize: '24px'
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
                    borderRadius: "12px",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    borderRadius: '0'
                }
            }
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    borderRadius: '30px'
                }
            }
        }
    },
});


export default AppTheme;
