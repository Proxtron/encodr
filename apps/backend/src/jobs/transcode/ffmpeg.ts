import util from "node:util";
import { exec } from "node:child_process";
const execAsync = util.promisify(exec);

type Rung = { height: number, bitrate: string };

interface CraftCommandResult {
    rungCount: number
    splitVariables: string
    scaleFilter: string
    mapOptions: string
    mapAudioOptions: string
    varStreamMapArg: string
}

const LADDER: Rung[] = [
    { height: 1080, bitrate: "3600k"},
    { height: 720, bitrate: "2800k" },
    { height: 480, bitrate: "1400k" }
];

const probeHeight = async (path: string) => {
    const { stdout } = await execAsync(`ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 ${path}`);
    const stdoutTrimmed = stdout.trim();
    const stdoutParsed = parseInt(stdoutTrimmed);
    if(isNaN(stdoutParsed)) throw new Error(`Unable to probe height for path: ${path}`);
    return stdoutParsed
}

const pickRungs = (uploadHeight: number) => {
    const rungs = LADDER.filter((rung) => uploadHeight >= rung.height);
    return rungs;
}

/**
 * Takes an input .mp4 file and transcodes it into smaller resolutions in the ladder.
 * It also generates HLS segments and playlists for each resolution and a master playlist referencing
 * sub playlists.
 * 
 * @param {string} inputPath - The path to the input .mp4 file
 * @param {string} outputDirectory - The directory where HLS segments and playlists will be generated
 */
export const transcode = async (
    inputPath: string, 
    outputDirectory: string, 
) => {
    const height = await probeHeight(inputPath);
    const rungs = pickRungs(height);

    const { rungCount, splitVariables, scaleFilter, mapOptions, mapAudioOptions, varStreamMapArg  } = craftCommandComponents(rungs);

    await execAsync(`
        ffmpeg -threads 1 \
            -i ${inputPath} \
            -filter_threads 1 \
            -x264-params threads=1 \
            -filter_complex \
                "[0:v]split=${rungCount}${splitVariables}; \
                ${scaleFilter}" \
            ${mapOptions}
            ${mapAudioOptions}
            -f hls \
            -hls_time 6 \
            -hls_playlist_type vod \
            -hls_segment_filename "${outputDirectory}stream_%v/seg_%03d.ts" \
            -var_stream_map "${varStreamMapArg}" \
            -master_pl_name master.m3u8 \
            "${outputDirectory}stream_%v/playlist.m3u8"
    `);
}

// Crafts command options and args based on the rungs selected for an input video
const craftCommandComponents = (rungs: Rung[]): CraftCommandResult => {
    const rungCount = rungs.length;
    let splitVariables = "";
    let scaleFilter = "";
    let mapOptions = "";
    let mapAudioOptions = "";
    let varStreamMapArg = "";

    for(let i = 0; i < rungs.length; i++) {
        const rung = rungs[i];
        if(!rung) throw new Error(`Unable to craft command for rung: ${rung}`);

        const versionVariable = `[v${i + 1}]`;
        const versionOutVariable = `[v${i + 1}out]`;

        if(i == rungs.length - 1) {
            scaleFilter += `${versionVariable}scale=-2:${rung.height}${versionOutVariable}`
        } else {
            scaleFilter += `${versionVariable}scale=-2:${rung.height}${versionOutVariable};`;
        }

        splitVariables += versionVariable;
        mapOptions += `-map "${versionOutVariable}" -c:v:${i} libx264 -b:v:${i} ${rung.bitrate} \\`;
        mapAudioOptions += `-map 0:a -c:a:${i} aac -b:a:${i} 128k -ar 48000 \\`;
        varStreamMapArg += `v:${i},a:${i},name:${rung.height}p `;
    }
    varStreamMapArg = varStreamMapArg.trim();
    return { rungCount, splitVariables, scaleFilter, mapOptions, mapAudioOptions, varStreamMapArg }
}

/*
ffmpeg -i input.mp4 \
  -filter_complex \
    "[0:v]split=3[v1][v2][v3]; \
     [v1]scale=w=1920:h=1080[v1out]; \
     [v2]scale=w=1280:h=720[v2out]; \
     [v3]scale=w=854:h=480[v3out]" \
  -map "[v1out]" -c:v:0 libx264 -b:v:0 5000k -maxrate:v:0 5350k -bufsize:v:0 7500k \
  -map "[v2out]" -c:v:1 libx264 -b:v:1 2800k -maxrate:v:1 3000k -bufsize:v:1 4200k \
  -map "[v3out]" -c:v:2 libx264 -b:v:2 1400k -maxrate:v:2 1500k -bufsize:v:2 2100k \
  -map 0:a -c:a:0 aac -b:a:0 128k -ar 48000 \
  -map 0:a -c:a:1 aac -b:a:1 128k -ar 48000 \
  -map 0:a -c:a:2 aac -b:a:2 96k -ar 48000 \
  -f hls \
  -hls_time 4 \
  -hls_playlist_type vod \
  -hls_segment_filename "stream_%v/seg_%03d.ts" \
  -var_stream_map "v:0,a:0,name:1080p v:1,a:1,name:720p v:2,a:2,name:480p" \
  -master_pl_name master.m3u8 \
  "stream_%v/playlist.m3u8"
*/

/* 
ffmpeg -i input.mp4 \
  -filter_complex \
    "[0:v]split=3[v1][v2][v3]; \
     [v1]scale=-2:${rung.height}[v1out]; \
     [v2]scale=-2:${rung.height}[v2out]; \
     [v3]scale=-2:${rung.height}[v3out]; \
  -map "[v1out]" -c:v:0 libx264 -b:v:0 ${rung.bitrate} \
  -map "[v2out]" -c:v:1 libx264 -b:v:1 ${rung.bitrate} \
  -map "[v3out]" -c:v:2 libx264 -b:v:2 ${rung.bitrate} \
  -map 0:a -c:a:0 aac -b:a:0 128k -ar 48000 \
  -map 0:a -c:a:1 aac -b:a:1 128k -ar 48000 \
  -map 0:a -c:a:2 aac -b:a:2 96k -ar 48000 \
  -f hls \
  -hls_time 6 \
  -hls_playlist_type vod \
  -hls_segment_filename "${resolutionDirectory}/seg_%03d.ts" \
  -var_stream_map "v:0,a:0,name:1080p v:1,a:1,name:720p v:2,a:2,name:480p" \
  -master_pl_name master.m3u8 \
  "${resolutionDirectory}playlist.m3u8"
*/

/*
ffmpeg -i ${tempUploadPath} -vf scale=-2:${rung.height} \
    -c:v libx264 -preset veryfast -b:v ${rung.bitrate} \
    -c:a aac -b:a 128k \
    -g 48 -keyint_min 48 -sc_threshold 0 \
    -f hls -hls_time 6 -hls_playlist_type vod \
    -hls_segment_filename ${resolutionDirectory}seg_%03d.ts \
    -master_pl_name master.m3u8 \
    ${resolutionDirectory}index.m3u8
*/
