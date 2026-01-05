
import React, { useState, useEffect, useRef, useCallback } from 'react';

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
    // 0: Ended, 1: Playing, 2: Paused
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
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = () => initPlayer();
    } else {
      initPlayer();
    }

    function initPlayer() {
      if (playerRef.current) return;
      playerRef.current = new window.YT.Player('youtube-player', {
        videoId: VIDEO_ID,
        host: 'https://www.youtube-nocookie.com',
        playerVars: {
          autoplay: 0,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          iv_load_policy: 3,
          fs: 0,
          disablekb: 1,
          playsinline: 1,
        },
        events: {
          onStateChange: onPlayerStateChange,
        },
      });
    }
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
    <div className="min-h-screen bg-black flex flex-col items-center overflow-hidden font-sans">
      
      {/* Logo pointant explicitement vers le dossier public */}
      <header className="pt-12 pb-10 md:pt-20 md:pb-16 flex justify-center w-full animate-fade-in">
        <img 
          src="public/Logo-Unilabs.png" 
          alt="Unilabs" 
          className="w-48 md:w-64 h-auto object-contain drop-shadow-2xl"
          onError={(e) => {
            // Si le chemin public/ échoue (car Vercel redirige déjà), on tente à la racine
            const target = e.currentTarget;
            if (target.src.includes('public/')) {
              target.src = "/Logo-Unilabs.png";
            }
          }}
        />
      </header>

      {/* Section Vidéo */}
      <main className="w-full max-w-[1100px] px-4 md:px-0 opacity-0 animate-fade-in [animation-delay:400ms] [animation-fill-mode:forwards]">
        <div className="relative aspect-video bg-[#050505] rounded-xl overflow-hidden shadow-[0_0_100px_rgba(255,255,255,0.05)] border border-white/5">
          
          <div className="absolute inset-0 w-full h-full scale-[1.16] origin-center">
            <div id="youtube-player" className="w-full h-full pointer-events-none"></div>
          </div>

          {!isPlaying && !isEnded && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all duration-1000">
              <button
                onClick={handleStart}
                aria-label="Lancer"
                className="group relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-white text-black transition-all duration-500 hover:scale-110 active:scale-95 shadow-[0_0_50px_rgba(255,255,255,0.2)]"
              >
                <div className="absolute inset-0 rounded-full border-2 border-white/30 group-hover:animate-ping"></div>
                <svg className="w-8 h-8 md:w-10 md:h-10 ml-1.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
          )}

          {isEnded && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black animate-in fade-in duration-1000">
              <button 
                onClick={handleReplay} 
                className="group flex flex-col items-center gap-6"
                aria-label="Revoir"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center border border-white/10 rounded-full group-hover:border-white group-hover:bg-white/5 transition-all duration-500 shadow-xl">
                  <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                </div>
                <span className="text-[10px] font-bold tracking-[0.5em] uppercase text-white/40 group-hover:text-white transition-all duration-500">Revoir l'expérience</span>
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-12 opacity-0 animate-fade-in [animation-delay:800ms] [animation-fill-mode:forwards]">
        <p className="text-[10px] text-gray-500 tracking-[0.6em] uppercase font-bold select-none">
          Unilabs 2026
        </p>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
