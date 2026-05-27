import { createBrowserRouter } from 'react-router'
import RootLayout from './RootLayout';
import HomePage from "./site/HomePage";
import VideoPage from './site/video/VideoPage';

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout/>,
        children: [
            {
                index: true,
                element: <HomePage/>
            },
            {
                path: "/video/:id",
                element: <VideoPage/>
            }
        ]
    }
])

export default router;