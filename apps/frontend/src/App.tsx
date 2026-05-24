import { useEffect, useRef } from 'react'
import styles from "./App.module.css"
import Hls from 'hls.js';


function App() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if(Hls.isSupported()) {
      const video = videoRef.current;
      const hls = new Hls();

      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        console.log("video attached to hls.js")
      });

      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        console.log(`manifest loaded, found ${data.levels.length} quality level`);
      });

      hls.on(Hls.Events.ERROR, function (event, data) {
          console.log(data);
      });

      hls.loadSource("http://localhost:3000/videos/master.m3u8");
      hls.attachMedia(video);

      return () => {
        hls.destroy();
      }
    }
  }, []);

  return (
    <main className={styles.main}>
      <video className={styles.video} ref={videoRef} controls={true}></video>
    </main>
  )
}

export default App
