export default function TongueIcon({
  className = "",
  title = "Custom Exercise",
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      role="img"
      aria-label={title}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      {/* Outline / mouth */}
      <path
        d="M4.5 10.5C4.5 6.91 7.41 4 11 4h2c3.59 0 6.5 2.91 6.5 6.5 0 2.54-.58 4.7-1.34 6.08-.5.94-1.46 1.42-2.41 1.42-.77 0-1.54-.32-2.09-.91l-.89-.94a.75.75 0 0 0-1.08 0l-.89.94c-.55.59-1.32.91-2.09.91-.95 0-1.91-.48-2.41-1.42C5.08 15.2 4.5 13.04 4.5 10.5Z"
        fill="#ef4444"
        stroke="#b91c1c"
        strokeWidth="1.5"
      />
      {/* Tongue center highlight */}
      <path
        d="M9.75 11.5c0-1.24 1.01-2.25 2.25-2.25s2.25 1.01 2.25 2.25v4.25c0 .69-.56 1.25-1.25 1.25h-2c-.69 0-1.25-.56-1.25-1.25V11.5Z"
        fill="#f87171"
      />
      {/* Shine */}
      <path
        d="M8.3 9.9c-.37-.62-.55-1.23-.55-1.9 0-1.06.53-2.06 1.41-2.66.25-.17.6-.1.77.16.17.25.1.6-.16.77-.56.38-.87 1-.87 1.73 0 .46.12.9.41 1.39.17.28.07.64-.21.8a.58.58 0 0 1-.8-.29Z"
        fill="#fee2e2"
      />
    </svg>
  );
}
