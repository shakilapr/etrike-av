import React from 'react';
import { Car, Gauge, Bone, Cloud } from 'lucide-react';

interface HudVisibilityTogglesProps {
  showTukTuk: boolean;
  showSpeed: boolean;
  showSkeletons: boolean;
  showPointCloud: boolean;
  toggleShowTukTuk: () => void;
  toggleShowSpeed: () => void;
  toggleShowSkeletons: () => void;
  toggleShowPointCloud: () => void;
}

export const HudVisibilityToggles: React.FC<HudVisibilityTogglesProps> = ({
  showTukTuk,
  showSpeed,
  showSkeletons,
  showPointCloud,
  toggleShowTukTuk,
  toggleShowSpeed,
  toggleShowSkeletons,
  toggleShowPointCloud,
}) => {
  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2.5 bg-[#080808]/90 backdrop-blur-xl border border-neutral-800/90 p-2 rounded-2xl pointer-events-auto shadow-2xl z-40">
      <button
        onClick={toggleShowTukTuk}
        title={showTukTuk ? 'Hide E-Trike Model (TukTuk)' : 'Show E-Trike Model (TukTuk)'}
        className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center transition-all border ${
          showTukTuk
            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.35)]'
            : 'bg-neutral-900/80 text-neutral-500 border-neutral-800 hover:text-neutral-300'
        }`}
      >
        <Car className="w-4 h-4" />
        <span className="text-[9px] font-black tracking-tighter mt-0.5">TUK</span>
      </button>

      <button
        onClick={toggleShowSpeed}
        title={showSpeed ? 'Hide Speedometer Display' : 'Show Speedometer Display'}
        className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center transition-all border ${
          showSpeed
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/60 shadow-[0_0_12px_rgba(16,185,129,0.35)]'
            : 'bg-neutral-900/80 text-neutral-500 border-neutral-800 hover:text-neutral-300'
        }`}
      >
        <Gauge className="w-4 h-4" />
        <span className="text-[9px] font-black tracking-tighter mt-0.5">SPD</span>
      </button>

      <button
        onClick={toggleShowSkeletons}
        title={showSkeletons ? 'Hide RTMPose Keypoint Skeletons' : 'Show RTMPose Keypoint Skeletons'}
        className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center transition-all border ${
          showSkeletons
            ? 'bg-amber-500/20 text-amber-300 border-amber-400/60 shadow-[0_0_12px_rgba(245,158,11,0.35)]'
            : 'bg-neutral-900/80 text-neutral-500 border-neutral-800 hover:text-neutral-300'
        }`}
      >
        <Bone className="w-4 h-4" />
        <span className="text-[9px] font-black tracking-tighter mt-0.5">SKEL</span>
      </button>

      <button
        onClick={toggleShowPointCloud}
        title={showPointCloud ? 'Hide LiDAR Point Cloud' : 'Show LiDAR Point Cloud'}
        className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center transition-all border ${
          showPointCloud
            ? 'bg-violet-500/20 text-violet-300 border-violet-400/60 shadow-[0_0_12px_rgba(167,139,250,0.35)]'
            : 'bg-neutral-900/80 text-neutral-500 border-neutral-800 hover:text-neutral-300'
        }`}
      >
        <Cloud className="w-4 h-4" />
        <span className="text-[9px] font-black tracking-tighter mt-0.5">PTS</span>
      </button>
    </div>
  );
};
