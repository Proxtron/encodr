import styles from "./VideoPage.module.css"
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { apiRequest } from "../../utils/client";

function VideoPage() {
  const [ link, setLink ] = useState<string>();
  const { id } = useParams<{id: string}>();

  useEffect(() => {
    apiRequest<{
      link: string
    }>(`/video/${id}`)
    .then((body) => {
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
