
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
    // YT.PlayerState: 0 (ENDED), 1 (PLAYING), 2 (PAUSED)
    if (event.data === 0) {
      setIsEnded(true);
      setIsPlaying(false);
    } else if (event.data === 1) {
      setIsPlaying(true);
      setIsEnded(false);
    } else if (event.data === 2) {
      // Si la vidéo est mise en pause (clic involontaire par exemple), on relance pour rester immersif
      if (!isEnded) {
        playerRef.current?.playVideo();
      }
    }
  }, [isEnded]);

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
          showinfo: 0,
          autohide: 1
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
    <div className="min-h-screen bg-black flex flex-col items-center overflow-hidden font-sans selection:bg-white/10">
      
      {/* Header & Logo - Tentative intelligente de chemin public/ vs racine */}
      <header className="pt-12 pb-10 md:pt-24 md:pb-20 flex justify-center w-full animate-premium-entry">
        <img 
          src="/public/Logo-Unilabs.png" 
          alt="Unilabs" 
          className="w-48 md:w-64 h-auto object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]"
          onError={(e) => {
            const target = e.currentTarget;
            // Si /public/ échoue (ex: déploiement racine sur Vercel), on tente /
            if (target.src.includes('/public/')) {
              target.src = "/Logo-Unilabs.png";
            } else {
              target.style.opacity = '0';
              console.warn("Logo non trouvé. Vérifiez le dossier /public/ ou la racine.");
            }
          }}
        />
      </header>

      {/* Main Video Section */}
      <main className="w-full max-w-[1100px] px-4 md:px-0 opacity-0 animate-premium-entry [animation-delay:300ms] [animation-fill-mode:forwards]">
        <div className="relative aspect-video bg-[#050505] rounded-2xl overflow-hidden shadow-[0_0_120px_rgba(255,255,255,0.03)] border border-white/5">
          
          {/* CINEMATIC CROP : Zoom 1.18 pour masquer totalement l'UI native de YouTube */}
          <div className="absolute inset-0 w-full h-full scale-[1.18] origin-center">
            <div id="youtube-player" className="w-full h-full pointer-events-none"></div>
          </div>

          {/* MOUSE SHIELD : Bloque le survol souris pour masquer les infos de profil YouTube */}
          {isPlaying && !isEnded && (
            <div className="absolute inset-0 z-10 bg-transparent cursor-none" />
          )}

          {/* Start Overlay Custom */}
          {!isPlaying && !isEnded && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-[6px] transition-all duration-1000">
              <button
                onClick={handleStart}
                aria-label="Play video"
                className="group/btn relative flex items-center justify-center w-24 h-24 rounded-full bg-white text-black transition-all duration-700 hover:scale-110 active:scale-95 shadow-[0_0_60px_rgba(255,255,255,0.4)]"
              >
                <div className="absolute inset-0 rounded-full border-2 border-white/30 group-hover/btn:animate-ping opacity-50"></div>
                <svg className="w-10 h-10 ml-1.5 transition-transform duration-500 group-hover/btn:scale-110" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
          )}

          {/* End Overlay Replay (Hides suggestions) */}
          {isEnded && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black animate-in fade-in duration-1000">
              <button 
                onClick={handleReplay} 
                className="group/replay flex flex-col items-center gap-8"
                aria-label="Replay video"
              >
                <div className="w-20 h-20 md:w-28 md:h-28 flex items-center justify-center border border-white/10 rounded-full group-hover/replay:border-white group-hover/replay:bg-white/5 transition-all duration-700 shadow-2xl">
                  <svg className="w-10 h-10 md:w-12 md:h-12 text-white transition-transform duration-700 group-hover/replay:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                </div>
                <span className="text-[11px] font-bold tracking-[0.8em] uppercase text-white/40 group-hover/replay:text-white group-hover/replay:tracking-[0.95em] transition-all duration-700">Revoir</span>
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer Minimaliste */}
      <footer className="mt-auto py-16 opacity-0 animate-premium-entry [animation-delay:700ms] [animation-fill-mode:forwards]">
        <p className="text-[10px] text-gray-600 tracking-[1.2em] uppercase font-black select-none opacity-40 hover:opacity-100 transition-opacity duration-1000">
          Unilabs 2026
        </p>
      </footer>

      <style>{`
        @keyframes premiumEntry {
          from { 
            opacity: 0; 
            transform: translateY(40px); 
            filter: blur(15px);
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
            filter: blur(0);
          }
        }
        .animate-premium-entry {
          animation: premiumEntry 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
