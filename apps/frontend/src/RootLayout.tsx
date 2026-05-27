import { Outlet } from "react-router";
import styles from "./RootLayout.module.css";

const RootLayout = () => {
    return (
        <div>
            <header>
            </header>
            <main className={styles.main}>
                <Outlet/>
            </main>
        </div>
    )
}

export default RootLayout;