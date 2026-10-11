"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function VideoPlayer({ youtubeId, title = "Vídeo Aula" }: { youtubeId: string, title?: string }) {
  const playerRef = useRef<any>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false); // Default false before autoplay
  const [isControlsVisible, setIsControlsVisible] = useState(false);

  useEffect(() => {
    // Carregar a API do YouTube
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
      }
      
      playerRef.current = new window.YT.Player(`youtube-player-${youtubeId}`, {
        videoId: youtubeId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          iv_load_policy: 3,
          disablekb: 1,
        },
        events: {
          onReady: (event: any) => {
            setDuration(event.target.getDuration());
            event.target.playVideo();
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
              setDuration(event.target.getDuration()); // Ensure we have duration
            } else {
              setIsPlaying(false);
            }
          }
        }
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    }

    return () => {
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
      }
    };
  }, [youtubeId]);

  useEffect(() => {
    let interval: any;
    if (isPlaying && playerRef.current?.getCurrentTime) {
      interval = setInterval(() => {
        setProgress(playerRef.current.getCurrentTime());
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setProgress(time);
    if (playerRef.current?.seekTo) {
      playerRef.current.seekTo(time, true);
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const togglePlay = () => {
    if (isPlaying) {
      playerRef.current?.pauseVideo();
    } else {
      playerRef.current?.playVideo();
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        paddingBottom: "56.25%", /* Aspect ratio 16:9 */
        background: "#0a0d14",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
      }}
      onMouseEnter={() => setIsControlsVisible(true)}
      onMouseLeave={() => setIsControlsVisible(false)}
    >
      <div
        id={`youtube-player-${youtubeId}`}
        style={{
          position: "absolute",
          top: "-20%", // Hack para esconder topo
          left: 0,
          width: "100%",
          height: "140%", // Hack para esconder controles nativos
          border: 0,
          pointerEvents: "none", // Prevent native clicks so we can control it overlay
        }}
      />
      
      {/* Overlay invisível para clique Play/Pause em toda a área */}
      <div 
        style={{ position: "absolute", inset: 0, zIndex: 10, cursor: "pointer" }} 
        onClick={togglePlay} 
      />

      {/* Controles Customizados (Timeline + Play/Pause) */}
      <div 
        className="video-controls"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "24px 16px 16px",
          background: "linear-gradient(transparent, rgba(0,0,0,0.9))",
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          gap: "16px",
          opacity: isControlsVisible ? 1 : 0,
          transition: "opacity 0.3s ease",
          pointerEvents: isControlsVisible ? "auto" : "none",
        }}
      >
        <button 
          onClick={togglePlay}
          style={{
            border: "none",
            color: "#fff",
            cursor: "pointer",
            fontSize: "1.2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "32px",
            height: "32px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "50%",
            transition: "background 0.2s"
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(74, 158, 255, 0.4)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
        >
          {isPlaying ? "⏸" : "▶"}
        </button>

        <span style={{ color: "#fff", fontSize: "0.85rem", minWidth: "40px", textAlign: "right" }}>
          {formatTime(progress)}
        </span>

        <input
          type="range"
          min={0}
          max={duration || 100}
          value={progress}
          onChange={handleSeek}
          style={{
            flex: 1,
            cursor: "pointer",
            accentColor: "#4a9eff",
            height: "4px",
            background: "rgba(255,255,255,0.2)",
            borderRadius: "4px",
            outline: "none"
          }}
        />

        <span style={{ color: "#fff", fontSize: "0.85rem", minWidth: "40px" }}>
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}
