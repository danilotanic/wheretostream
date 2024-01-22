type ActivityIndicatorProps = {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
};

export default function ActivityIndicator({
  style,
  size = 16,
  className,
}: ActivityIndicatorProps) {
  const amount = 8;
  const duration = amount / 10;

  return (
    <div
      className={`relative m-0 inline-block align-middle ${className}`}
      style={{ width: `${size}px`, height: `${size}px`, ...style }}
    >
      {Array.from(Array(amount)).map((_, i) => {
        const delay = amount * -0.1 + i * 0.1;
        const rotation = (360 / amount) * i;
        const y = 120;

        return (
          <div
            key={i}
            className="absolute left-[44.5%] top-[37%] h-[25%] w-[10%] animate-activity-indicator rounded-[50%/20%] bg-current"
            style={{
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
              transform: `rotate(${rotation}deg) translate(0, ${y}%)`,
            }}
          />
        );
      })}
    </div>
  );
}
