
import React, { useState, useEffect, useRef, useCallback } from 'react';

// Déclaration pour l'API YouTube
declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

const VIDEO_ID = 'ER-qkekcKb8';

const App: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const playerRef = useRef<any>(null);

  const onPlayerStateChange = useCallback((event: any) => {
    // 0 = Terminé, 1 = En cours, 2 = En pause
    if (event.data === 0) {
      setIsEnded(true);
      setIsPlaying(false);
    } else if (event.data === 1) {
      setIsPlaying(true);
      setIsEnded(false);
    } else if (event.data === 2) {
      setIsPlaying(false);
    }
  }, []);

  useEffect(() => {
    // Chargement de l'API YouTube
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    } else {
      initPlayer();
    }

    function initPlayer() {
      if (playerRef.current) return;
      playerRef.current = new window.YT.Player('youtube-player', {
        videoId: VIDEO_ID,
        playerVars: {
          autoplay: 0,
          controls: 1, // Interaction visuelle minimale autorisée
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          fs: 1,
          playsinline: 1,
          color: 'white', // Barre de progression blanche plus discrète
        },
        events: {
          onStateChange: onPlayerStateChange,
        },
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [onPlayerStateChange]);

  const handleStart = () => {
    if (playerRef.current) {
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  };

  const handleReplay = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(0);
      playerRef.current.playVideo();
      setIsEnded(false);
      setIsPlaying(true);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center">
      
      {/* Header & Logo - Pixel Perfect Centering */}
      <header className="pt-12 pb-10 md:pt-20 md:pb-16 animate-fade-in flex justify-center w-full">
        <img 
          src="/Logo-Unilabs.png" 
          alt="Unilabs" 
          className="w-48 md:w-64 h-auto object-contain drop-shadow-md"
        />
      </header>

      {/* Main Video Section - Cinema Ratio */}
      <main className="w-full max-w-[1100px] px-4 md:px-0 animate-fade-in [animation-delay:200ms] mb-12">
        <div className="relative aspect-video bg-[#050505] rounded-lg overflow-hidden video-shadow border border-white/10">
          
          {/* YouTube Player Container */}
          <div id="youtube-player" className="absolute inset-0 w-full h-full"></div>

          {/* Start Overlay (Premium Cover) */}
          {!isPlaying && !isEnded && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/70 backdrop-blur-[2px] transition-all duration-700">
              <button
                onClick={handleStart}
                className="group relative flex items-center justify-center w-20 h-20 md:w-28 md:h-28 rounded-full bg-white text-black transition-all duration-500 hover:scale-110 active:scale-95 shadow-[0_0_50px_rgba(255,255,255,0.2)]"
                aria-label="Lancer l'expérience"
              >
                <div className="absolute inset-0 rounded-full border border-white/20 group-hover:animate-ping opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <svg className="w-8 h-8 md:w-12 md:h-12 ml-1.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
          )}

          {/* End Overlay (Preventing YouTube suggestions) */}
          {isEnded && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black animate-fade-in duration-500">
              <button
                onClick={handleReplay}
                className="group flex flex-col items-center gap-6"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center border border-white/20 rounded-full transition-all duration-300 group-hover:border-white group-hover:bg-white/5 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                </div>
                <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/60 group-hover:text-white transition-colors">Revoir les vœux</span>
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="mt-auto py-10 text-center opacity-40 select-none animate-fade-in [animation-delay:600ms]">
        <p className="text-[10px] text-gray-400 tracking-[0.7em] uppercase font-bold">
          Unilabs Diagnostics &bull; 2026
        </p>
      </footer>

    </div>
  );
};

export default App;
