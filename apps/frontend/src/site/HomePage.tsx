import styles from "./HomePage.module.css"
import { Link } from "react-router";

const VIDEOS = [
  {
    id: 1,
    title: "Building a Modern Web App",
    thumbnail: "https://images.unsplash.com/photo-1580894894513-541e068a3e2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwY29kaW5nJTIwd29ya3NwYWNlfGVufDF8fHx8MTc3OTkwMDA0MHww&ixlib=rb-4.1.0&q=80&w=1080",
    duration: "12:34",
    uploadDate: "2 days ago",
    views: "1.2K",
  },
  {
    id: 2,
    title: "Advanced TypeScript Patterns",
    thumbnail: "https://images.unsplash.com/photo-1611924707078-da8777fc99cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHx0ZWNobm9sb2d5JTIwY29kaW5nJTIwd29ya3NwYWNlfGVufDF8fHx8MTc3OTkwMDA0MHww&ixlib=rb-4.1.0&q=80&w=1080",
    duration: "18:45",
    uploadDate: "5 days ago",
    views: "3.4K",
  },
  {
    id: 3,
    title: "Setting Up Your Dev Environment",
    thumbnail: "https://images.unsplash.com/photo-1683813479742-4730f91fa3ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHx0ZWNobm9sb2d5JTIwY29kaW5nJTIwd29ya3NwYWNlfGVufDF8fHx8MTc3OTkwMDA0MHww&ixlib=rb-4.1.0&q=80&w=1080",
    duration: "24:12",
    uploadDate: "1 week ago",
    views: "5.8K",
  },
  {
    id: 4,
    title: "React Performance Optimization",
    thumbnail: "https://images.unsplash.com/photo-1778146476147-5f8d4bd03c79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHx0ZWNobm9sb2d5JTIwY29kaW5nJTIwd29ya3NwYWNlfGVufDF8fHx8MTc3OTkwMDA0MHww&ixlib=rb-4.1.0&q=80&w=1080",
    duration: "15:27",
    uploadDate: "1 week ago",
    views: "2.1K",
  },
  {
    id: 5,
    title: "Understanding Async JavaScript",
    thumbnail: "https://images.unsplash.com/photo-1777861845854-4f35ab170680?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHx0ZWNobm9sb2d5JTIwY29kaW5nJTIwd29ya3NwYWNlfGVufDF8fHx8MTc3OTkwMDA0MHww&ixlib=rb-4.1.0&q=80&w=1080",
    duration: "21:09",
    uploadDate: "2 weeks ago",
    views: "4.3K",
  },
  {
    id: 6,
    title: "Building APIs with Node.js",
    thumbnail: "https://images.unsplash.com/photo-1745789888513-e9b4a2e1be6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHx0ZWNobm9sb2d5JTIwY29kaW5nJTIwd29ya3NwYWNlfGVufDF8fHx8MTc3OTkwMDA0MHww&ixlib=rb-4.1.0&q=80&w=1080",
    duration: "32:45",
    uploadDate: "2 weeks ago",
    views: "6.7K",
  },
];

function HomePage() {



  return (
    <div className={styles.homePageContainer}>
      {
        VIDEOS.map((video) => 
          <Link to={`/video/${video.id}`} className={styles.videoContainer} key={video.id}>
            <img className={styles.videoThumbnail} src={video.thumbnail}></img>
            <h2 className={styles.videoTitle}>{video.title}</h2>
          </Link>
        )
      }
    </div>
  )
}

export default HomePage
