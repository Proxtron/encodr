import { useState } from "react";
import { Outlet } from "react-router";
import styles from "./RootLayout.module.css";
import UploadVideoModal from "./site/upload-video/UploadVideoModal";

const RootLayout = () => {
    const [showUpload, setShowUpload] = useState(false);

    return (
        <div>
            <header className={styles.header}>
                <button className={styles.uploadButton} onClick={() => setShowUpload(true)}>
                    Upload Video
                </button>
            </header>
            <main className={styles.main}>
                <Outlet/>
            </main>
            {showUpload && (
                <UploadVideoModal
                    onClose={() => setShowUpload(false)}
                    onUploaded={() => window.location.reload()}
                />
            )}
        </div>
    );
}

export default RootLayout;
