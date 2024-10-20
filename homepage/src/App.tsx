import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { router } from "./Router";
import { HomepageCard } from "./components/homepage-card";

export default function App() {
    return (
        <ThemeProvider>
            <HomepageCard />
        </ThemeProvider>
    )
}
