import Lottie from 'lottie-react';
import idleAnim from './idle.json';
import successAnim from './success.json';
import { useMascot } from './useMascot';

export type MascotState =
  | 'idle'
  | 'hello'
  | 'success'
  | 'error'
  | 'thinking'
  | 'loading'
  | 'sleep'
  | 'nightShift'
  | 'sunny'
  | 'rainy'
  | 'cloudy';

const animations: Record<MascotState, unknown> = {
  idle: idleAnim,
  hello: idleAnim,
  success: successAnim,
  error: idleAnim,
  thinking: idleAnim,
  loading: idleAnim,
  sleep: idleAnim,
  nightShift: idleAnim,
  sunny: idleAnim,
  rainy: idleAnim,
  cloudy: idleAnim,
};

export interface MascotNurseProps {
  state: MascotState;
  size?: number;
  decorative?: boolean;
  className?: string;
}

function StaticNurse({ size }: { size: number }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden="true"
      className="text-primary"
    >
      <circle cx="32" cy="32" r="30" fill="currentColor" />
      <rect x="22" y="18" width="20" height="12" fill="#fff" rx="2" />
      <path d="M32 20v8M28 24h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function MascotNurse({ state, size = 80, decorative = true, className }: MascotNurseProps) {
  const { enabled, reduced } = useMascot();
  if (!enabled) return null;
  const anim = animations[state] || animations.idle;
  if (reduced) {
    return <StaticNurse size={size} />;
  }
  return (
    <Lottie
      animationData={anim as object}
      loop={state === 'idle'}
      style={{ width: size, height: size }}
      aria-hidden={decorative}
      className={className}
    />
  );
}
