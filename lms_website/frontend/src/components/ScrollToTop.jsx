import { useEffect } from "react"; // import useEffect to run side effects when route changes
import { useLocation } from "react-router-dom"; // import useLocation to access the current route information

const ScrollToTop = () => { // define a function to automatically scroll the window to top on route change
  const { pathname } = useLocation(); // extract pathname to detect when the route changes

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // scroll the window to the top smoothly for better UX
  }, [pathname]); // re-run the effect on every route change

  return null; // render nothing since this component exists only for side-effect handling
};

export default ScrollToTop