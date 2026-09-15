export default function Waveform({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 80"
      className={className}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0 40 C25 25 75 25 100 40 C125 70 175 70 200 40 C225 18 275 18 300 40 C325 52 375 52 400 40 C425 5 475 5 500 40 C525 58 575 58 600 40 C625 30 675 30 700 40 C725 68 775 68 800 40"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.6"
      />
    </svg>
  );
}
