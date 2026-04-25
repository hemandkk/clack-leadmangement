"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatDate } from "@leadpro/utils";
import { formatDuration } from "@/lib/staffConfig";
import type { CallRecord } from "@leadpro/types";

interface Props {
  url: string;
  callInfo: CallRecord;
  onClose: () => void;
}

export function CallRecordingPlayer({ url, callInfo, onClose }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onLoaded = () => setDuration(audio.duration);
    const onTime = () => setCurrent(audio.currentTime);
    const onEnded = () => setPlaying(false);
    const onError = () => setError(true);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);
    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play();
      setPlaying(true);
    }
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Number(e.target.value);
    setCurrent(Number(e.target.value));
  };

  const pct = duration ? (current / duration) * 100 : 0;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 w-96 bg-white border border-slate-200
      rounded-2xl shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3
        bg-slate-900 text-white"
      >
        <div>
          <p className="text-sm font-semibold">
            {callInfo.leadName ?? "Call recording"}
          </p>
          <p className="text-xs text-slate-400">
            {callInfo.direction} · {formatDate(callInfo.createdAt)}
          </p>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="p-4">
        <audio ref={audioRef} src={url} preload="metadata" />

        {error ? (
          <p className="text-sm text-red-500 text-center py-4">
            Failed to load recording
          </p>
        ) : (
          <>
            {/* Progress bar */}
            <div className="relative mb-3">
              <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={current}
                onChange={seek}
                className="absolute inset-0 w-full opacity-0 cursor-pointer h-1.5"
              />
            </div>

            {/* Time */}
            <div className="flex justify-between text-xs text-slate-400 mb-4">
              <span>{formatDuration(Math.floor(current))}</span>
              <span>{formatDuration(Math.floor(duration))}</span>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              {/* Rewind 10s */}
              <button
                onClick={() => {
                  if (audioRef.current) audioRef.current.currentTime -= 10;
                }}
                className="text-slate-400 hover:text-slate-700 text-xs font-medium"
              >
                ← 10s
              </button>

              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="h-12 w-12 rounded-full bg-slate-900 text-white
                  flex items-center justify-center hover:bg-slate-700
                  transition-colors"
              >
                {playing ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5 ml-0.5" />
                )}
              </button>

              {/* Forward 10s */}
              <button
                onClick={() => {
                  if (audioRef.current) audioRef.current.currentTime += 10;
                }}
                className="text-slate-400 hover:text-slate-700 text-xs font-medium"
              >
                10s →
              </button>

              {/* Download */}

              <a
                href={url}
                download="recording.mp3"
                className="text-slate-400 hover:text-slate-700"
                title="Download recording"
              >
                <Download className="h-4 w-4" />
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
