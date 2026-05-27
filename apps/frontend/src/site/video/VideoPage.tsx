import styles from "./VideoPage.module.css"
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
import { useEffect, useState } from "react";

function VideoPage() {
  const [link, setLink] = useState<string>();

  useEffect(() => {
    fetch("http://localhost:3000/video/2")
    .then(async (response) => {
      const body = await response.json();
      setLink(body.link);
    });
  }, []);


  return (
    <main className={styles.main}>
      <MediaPlayer src={link}>
        <MediaProvider />
        <DefaultVideoLayout icons={defaultLayoutIcons} />
      </MediaPlayer>
    </main>
  )
}

export default VideoPage;
