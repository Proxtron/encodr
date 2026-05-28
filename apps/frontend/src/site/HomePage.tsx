import { useEffect, useState } from "react";
import { apiRequest } from "../utils/client";
import styles from "./HomePage.module.css"
import { Link } from "react-router";
import DefaultThumbnail from "../../public/default_thumbnail.png"

interface Video {
  id: number;
  uuidName: string;
  uploadName: string;
  extension: string;
}

function HomePage() {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    apiRequest<{videos: Video[]}>("/video")
    .then((body) => {
      setVideos(body.videos)
    });
  }, []);

  return (
    <div className={styles.homePageContainer}>
      {
        videos.map((video) => 
          <Link to={`/video/${video.id}`} className={styles.videoContainer} key={video.id}>
            <img className={styles.videoThumbnail} src={DefaultThumbnail}></img>
            <h2 className={styles.videoTitle}>{video.uploadName}</h2>
          </Link>
        )
      }
    </div>
  )
}

export default HomePage
