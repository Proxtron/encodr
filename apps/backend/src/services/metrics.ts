import { Histogram, Counter, Gauge } from 'prom-client';

export const transcodeDuration = new Histogram({
  name: 'transcode_duration_seconds',
  help: 'Time to transcode a video',
  labelNames: ['resolution']
});

export const uploadDuration = new Histogram({
  name: 'upload_duration_seconds',
  help: 'Time to upload to S3'
});

export const jobsCompleted = new Counter({
  name: 'jobs_completed_total',
  help: 'Total completed jobs',
  labelNames: ['status']
});

export const queueDepth = new Gauge({
  name: 'queue_depth',
  help: 'Number of jobs waiting in queue',
  labelNames: ['queue']
});

export const activeWorkers = new Gauge({
  name: 'active_workers',
  help: 'Number of workers currently processing',
  labelNames: ['queue']
});