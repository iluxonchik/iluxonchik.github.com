import { createContext, useEffect, useState } from "react"

type ThemeProviderProps = {
    children: React.ReactNode
    defaultTheme?: string
    storageKey?: string
}

export type ThemeProviderState = {
    theme: string
    setTheme: (theme: string) => void
}

const initialState = {
    theme: "light",
    setTheme: () => null,
}

export const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
    children,
    defaultTheme = "light",
    storageKey = "vite-ui-theme",
    ...props
}: ThemeProviderProps) {
    const [theme, setTheme] = useState(
        () => localStorage.getItem(storageKey) || defaultTheme
    )

    useEffect(() => {
        const root = window.document.documentElement
        root.classList.remove("dark")
        root.classList.add("light")
    }, [])

    return (
        <ThemeProviderContext.Provider
            {...props}
            value={{
                theme,
                setTheme: () => {
                    // Always set to 'light'
                    setTheme('light')
                    localStorage.setItem(storageKey, 'light')
                },
            }}
        >
            {children}
        </ThemeProviderContext.Provider>
    )
}
