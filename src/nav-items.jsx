import { HomeIcon, MapIcon } from "lucide-react";
import Index from "./pages/Index.jsx";
import MapPage from "./pages/MapPage.jsx";

/**
 * Central place for defining the navigation items. Used for navigation components and routing.
 */
export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Map",
    to: "/map",
    icon: <MapIcon className="h-4 w-4" />,
    page: <MapPage />,
  },
];
