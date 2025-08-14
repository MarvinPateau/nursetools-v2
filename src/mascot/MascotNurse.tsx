import Lottie from 'lottie-react';
import idle from '../brand/mascot/nurse_idle.json';
import success from '../brand/mascot/nurse_success.json';
import { useMascot, type MascotState } from './useMascot';
import { useReducedMotion } from '../ui/motion/ReducedMotion';

const animations: Record<MascotState, object> = {
  idle,
  hello: idle,
  success,
  error: success,
  thinking: idle,
  loading: idle,
  sleep: idle,
  nightShift: idle,
  sunny: idle,
  rainy: idle,
  cloudy: idle,
};

export function MascotNurse({
  state,
  size = 80,
  decorative = true,
  className,
}: {
  state: MascotState;
  size?: number;
  decorative?: boolean;
  className?: string;
}) {
  const { reduced } = useMascot();
  const prefersReduced = useReducedMotion();
  const anim = animations[state] || idle;

  if (reduced || prefersReduced) {
    return (
      <svg
        viewBox="0 0 64 64"
        width={size}
        height={size}
        className={className}
        aria-hidden={decorative ? 'true' : undefined}
        role={decorative ? undefined : 'img'}
      >
        <circle cx="32" cy="20" r="12" fill="currentColor" />
        <rect x="20" y="8" width="24" height="8" rx="2" fill="currentColor" />
        <path d="M32 10v4M30 12h4" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
        <path d="M16 54c0-8 8-14 16-14s16 6 16 14" fill="currentColor" />
      </svg>
    );
  }

  return (
    <Lottie
      animationData={anim}
      loop={state === 'idle'}
      style={{ width: size, height: size }}
      className={className}
      aria-hidden={decorative}
    />
  );
}
