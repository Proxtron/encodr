import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Response } from "express";
import * as video from "../db/video.js";
import { buildHlsUrl } from "../services/playback.js";
import { getVideo, getAllVideos, insertVideo } from "./videoController.js";
import { AppError } from "../error/error.js";
import { generatePresignedUploadUrl } from "../services/presign.js";
import { randomUUID } from "crypto";

vi.mock("../db/video.js", () => ({
    retrieve: vi.fn(),
    retrieveAll: vi.fn(),
    insert: vi.fn(),
}));
vi.mock("../services/playback.js", () => ({
    buildHlsUrl: vi.fn(),
}));
vi.mock("../services/presign.js", () => ({
    generatePresignedUploadUrl: vi.fn(),
}));
vi.mock("crypto", () => ({
    randomUUID: vi.fn(),
}));

function mockRes() {
    const res = { json: vi.fn() } as unknown as Response;
    return res;
}

describe("getVideo", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("returns the HLS link when the video exists", async () => {
        vi.mocked(video.retrieve).mockResolvedValue({ uuidName: "abc-123" } as any);
        vi.mocked(buildHlsUrl).mockReturnValue("https://cdn.example.com/output/abc-123/master.m3u8");
        const res = mockRes();

        await getVideo({ params: { id: "1" } } as any, res, vi.fn());

        expect(video.retrieve).toHaveBeenCalledWith(1);
        expect(buildHlsUrl).toHaveBeenCalledWith("abc-123");
        expect(res.json).toHaveBeenCalledWith({ link: "https://cdn.example.com/output/abc-123/master.m3u8" });
    });

    it("throws a 404 AppError when the video does not exist", async () => {
        vi.mocked(video.retrieve).mockResolvedValue(null as any);

        await expect(
            getVideo({ params: { id: "999" } } as any, mockRes(), vi.fn())
        ).rejects.toMatchObject(new AppError("Video not found", 404));

        expect(buildHlsUrl).not.toHaveBeenCalled();
    });

    it("parses the id param as an integer", async () => {
        vi.mocked(video.retrieve).mockResolvedValue({ uuidName: "xyz" } as any);
        vi.mocked(buildHlsUrl).mockReturnValue("link");

        await getVideo({ params: { id: "42" } } as any, mockRes(), vi.fn());

        expect(video.retrieve).toHaveBeenCalledWith(42);
    });
});

describe("getAllVideos", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("returns the list of videos", async () => {
        const videos = [{ id: 1, title: "a" }, { id: 2, title: "b" }];
        vi.mocked(video.retrieveAll).mockResolvedValue(videos as any);
        const res = mockRes();

        await getAllVideos({} as any, res, vi.fn());

        expect(video.retrieveAll).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith({ videos });
    });

    it("returns an empty list when there are no videos", async () => {
        vi.mocked(video.retrieveAll).mockResolvedValue([] as any);
        const res = mockRes();

        await getAllVideos({} as any, res, vi.fn());

        expect(res.json).toHaveBeenCalledWith({ videos: [] });
    });
});

describe("insertVideo", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("inserts the video, generates a presigned url, and returns both", async () => {
        vi.mocked(randomUUID).mockReturnValue("generated-uuid" as any);
        vi.mocked(video.insert).mockResolvedValue({ id: 7 } as any);
        vi.mocked(generatePresignedUploadUrl).mockResolvedValue("https://s3.example.com/upload");
        const res = mockRes();

        await insertVideo({ body: { title: "My Video" } } as any, res, vi.fn());

        expect(video.insert).toHaveBeenCalledWith("mp4", "My Video", "generated-uuid", "PENDING");
        expect(generatePresignedUploadUrl).toHaveBeenCalledWith("generated-uuid");
        expect(res.json).toHaveBeenCalledWith({
            presignedUrl: "https://s3.example.com/upload",
            videoId: 7,
        });
    });
});
