import { createBrowserRouter } from 'react-router'
import RootLayout from './RootLayout';
import HomePage from "./site/HomePage";
import VideoPage from './site/video/VideoPage';
import LoginPage from './site/LoginPage';
import ProtectedRoute from './ProtectedRoute';

const router = createBrowserRouter([
    //Unprotected: login page
    {
        index: true,
        element: <LoginPage/>
    },
    //Protected: video pages
    {
        path: "/video",
        element: <ProtectedRoute><RootLayout/></ProtectedRoute>,
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