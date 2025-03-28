
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import CategoryPage from "@/pages/CategoryPage";
import Profile from "@/pages/Profile";
import ProductDetail from "@/pages/ProductDetail";
import ProductComparison from "@/pages/ProductComparison";
import NotFound from "@/pages/NotFound";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Terms from "@/pages/Terms";
import AffiliateDisclosure from "@/pages/AffiliateDisclosure";
import Admin from "@/pages/Admin";
import Wishlist from "@/pages/Wishlist";
import Search from "@/pages/Search";

import "./styles/global.css";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/blog",
    element: <Blog />,
  },
  {
    path: "/blog/:slug",
    element: <BlogPost />,
  },
  {
    path: "/categories/:slug",
    element: <CategoryPage />,
  },
  {
    path: "/categories/:slug/:subSlug",
    element: <CategoryPage />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/products/:slug",
    element: <ProductDetail />,
  },
  {
    path: "/compare",
    element: <ProductComparison />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicy />,
  },
  {
    path: "/terms",
    element: <Terms />,
  },
  {
    path: "/affiliate-disclosure",
    element: <AffiliateDisclosure />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
  {
    path: "/wishlist",
    element: <Wishlist />,
  },
  {
    path: "/search",
    element: <Search />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
