import { createBrowserRouter } from 'react-router'
import RootLayout from './RootLayout';
import HomePage from "./site/HomePage";
import VideoPage from './site/video/VideoPage';
import LoginPage from './site/LoginPage';

const router = createBrowserRouter([
    {
        index: true,
        element: <LoginPage/>
    },
    {
        path: "/video",
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