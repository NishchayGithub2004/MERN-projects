import { createContext, useContext, useEffect, useState } from "react"; // import React hooks and createContext to manage state, side effects, and context

const initialState = { // define initialState object to provide default values for ThemeProviderContext
    theme: "system", // default theme value as "system"
    setTheme: () => null, // placeholder function for setTheme that does nothing initially
};

const ThemeProviderContext = createContext(initialState); // create a context with initialState to provide theme data globally

export function ThemeProvider({ // define a function ThemeProvider to wrap app components with theme context
    children, // children prop represents nested components
    defaultTheme = "system", // defaultTheme argument sets default theme if not provided, defaulting to "system"
    storageKey = "react-ui-theme", // storageKey argument defines localStorage key, defaulting to "react-ui-theme"
    ...props // rest props to pass additional attributes to context provider
}) {
    const [theme, setTheme] = useState(() => { // define state variable theme and its setter setTheme, initialized lazily
        const storedTheme = localStorage.getItem(storageKey); // get previously stored theme from localStorage using storageKey
        return storedTheme || defaultTheme; // return storedTheme if exists, otherwise defaultTheme
    });

    useEffect(() => { // define effect to run whenever theme changes
        const root = window.document.documentElement; // get reference to root HTML element

        root.classList.remove("light", "dark"); // remove any existing theme classes from root element

        if (theme === "system") { // check if current theme is "system"
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light"; // determine system preference for dark or light mode
            root.classList.add(systemTheme); // add system theme class to root element
            return; // exit early since system theme is applied
        }

        root.classList.add(theme); // add user-selected theme class to root element
    }, [theme]); // dependency array ensures effect runs whenever theme state changes

    const value = { // define value object to pass via context provider
        theme, // current theme state
        setTheme: (newTheme) => { // define function to update theme, taking newTheme as argument
            localStorage.setItem(storageKey, newTheme); // store new theme in localStorage using storageKey
            setTheme(newTheme); // update theme state to trigger re-render and effect
        },
    };

    return (
        <ThemeProviderContext.Provider value={value} {...props}> {/* provide context value to children */}
            {children} 
        </ThemeProviderContext.Provider>
    );
}

export const useTheme = () => { // define a function useTheme to access ThemeProviderContext
    const context = useContext(ThemeProviderContext); // get current context value using useContext

    if (context === undefined) // check if context is used outside a ThemeProvider
        throw new Error("useTheme must be used within a ThemeProvider"); // throw error to enforce correct usage

    return context; // return context object containing theme and setTheme
};
