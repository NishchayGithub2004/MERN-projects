import { LoaderIcon } from "lucide-react";

function PageLoader() { // create a functional component named 'PageLoader' to render a loading UI
    return (
        <div className="flex items-center justify-center h-screen">
            <LoaderIcon className="size-10 animate-spin" />
        </div>
    );
}

export default PageLoader;