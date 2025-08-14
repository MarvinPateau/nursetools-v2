export type SproutMood = 'happy' | 'sad' | 'rainy';

export function Sprout({ mood = 'happy', className }: { mood?: SproutMood; className?: string }) {
  const mouth = mood === 'sad' ? 'M9 18q3 2 6 0' : 'M9 18q3 -2 6 0';
  return (
    <svg
      viewBox="0 0 24 24"
      className={"h-8 w-8 " + (className ?? 'text-primary')}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 22v-7" />
      <path d="M9 15v-4a3 3 0 0 1 6 0v4" />
      <path d="M5 15v-2a2 2 0 0 1 4 0v2" />
      <path d="M15 15v-2a2 2 0 0 1 4 0v2" />
      <path d="M5 22h14" />
      <circle cx="10" cy="17" r="0.5" fill="currentColor" />
      <circle cx="14" cy="17" r="0.5" fill="currentColor" />
      <path d={mouth} />
      {mood === 'rainy' && (
        <path d="M19 3v2m-2-1h4" strokeWidth={1} />
      )}
    </svg>
  );
}
