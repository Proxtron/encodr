import styles from "./App.module.css"
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';

function App() {
  return (
    <main className={styles.main}>
      <MediaPlayer src="http://localhost:3000/videos/master.m3u8">
        <MediaProvider />
        <DefaultVideoLayout icons={defaultLayoutIcons} />
      </MediaPlayer>
    </main>
  )
}

export default App
