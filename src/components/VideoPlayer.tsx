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
          controls: 1,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
        },
        events: {
          onReady: (event: any) => {
            setDuration(event.target.getDuration());
            event.target.playVideo();
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
              setDuration(event.target.getDuration());
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

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        paddingBottom: "56.25%", /* Aspect ratio 16:9 */
        background: "#000",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
      }}
    >
      <div
        id={`youtube-player-${youtubeId}`}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: 0,
        }}
      />
    </div>
  );
}
