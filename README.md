Encodr

An event-driven, scalable video transcoding pipeline that ingests video, transcodes it into multiple resolutions 
and serves HLS segments through a CDN. Video transcoding is a compute-intensive process which places great importance on building
a pipeline that is scalable. I built this as a from-scratch implementation of the core pattern behind services like Netflix or Mux.

Live demo + link — the deployed URL and a link to your architecture walkthrough video. Put this near the top so people can see it working immediately.
Visit the [Live Site](https://encodr.pavelbratan.com/) 
Credentials are needed to access the live site. Contact pavelbratan2@gmail.com for access.

Architecture — your diagram, then a prose walk through the flow: client requests a presigned URL, uploads directly to S3, S3 fires an event to SQS, the backend consumes it and enqueues transcode jobs to BullMQ, workers probe the source and generate an adaptive bitrate ladder, transcode to HLS, upload renditions back to S3, and CloudFront serves them to an HLS.js player.

Key engineering decisions — this is the section that shows your thinking. A few subsections:

Dynamic bitrate ladder (FFprobe inspection, only encoding sensible resolutions)
Event-driven ingestion (why SQS decouples uploads from processing)
CPU-bound vs IO-bound worker separation (independently scalable pools)
Horizontal scaling with the benchmark results table

Benchmark — your scaling table and the saturation analysis. The chart image. This is your proof the architecture delivers.

Tech stack: TypeScript, Express, BullMQ/Redis, Postgres, FFmpeg, S3, SQS, EC2, CloudFront, Docker.
