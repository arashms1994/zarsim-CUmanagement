interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  variant?: "text" | "rectangular" | "circular";
  animation?: "pulse" | "wave" | "none";
  count?: number;
}

const Skeleton: React.FC<SkeletonProps> = ({
  width = "100%",
  height = "1rem",
  className = "",
  variant = "rectangular",
  animation = "pulse",
  count = 1,
}) => {
  const baseClasses = "bg-gray-200 dark:bg-gray-700";

  const variantClasses = {
    text: "rounded",
    rectangular: "rounded-md",
    circular: "rounded-full",
  };

  const animationClasses = {
    pulse: "animate-pulse",
    wave: "animate-wave",
    none: "",
  };

  const skeletonClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${animationClasses[animation]}
    ${className}
  `.trim();

  const skeletonStyle = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
    animationDuration: "1500ms",
  };

  if (count === 1) {
    return <div className={skeletonClasses} style={skeletonStyle} />;
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className={skeletonClasses} style={skeletonStyle} />
      ))}
    </div>
  );
};

// Skeleton components for specific use cases
export const SkeletonText: React.FC<Omit<SkeletonProps, "variant">> = (
  props
) => <Skeleton {...props} variant="text" />;

export const SkeletonRect: React.FC<Omit<SkeletonProps, "variant">> = (
  props
) => <Skeleton {...props} variant="rectangular" />;

export const SkeletonCircle: React.FC<Omit<SkeletonProps, "variant">> = (
  props
) => <Skeleton {...props} variant="circular" />;

// Form-specific skeleton components
export const SkeletonInput: React.FC<{ className?: string }> = ({
  className = "",
}) => (
  <SkeletonRect
    width="250px"
    height="36px"
    className={`rounded-md ${className}`}
  />
);

export const SkeletonButton: React.FC<{ className?: string }> = ({
  className = "",
}) => (
  <SkeletonRect
    width="120px"
    height="40px"
    className={`rounded-lg ${className}`}
  />
);

export const SkeletonCard: React.FC<{ className?: string }> = ({
  className = "",
}) => (
  <SkeletonRect
    width="100%"
    height="200px"
    className={`rounded-lg ${className}`}
  />
);

// Search suggestion skeleton
export const SkeletonSearchSuggestion: React.FC<{ count?: number }> = ({
  count = 3,
}) => (
  <div className="space-y-1">
    {Array.from({ length: count }, (_, index) => (
      <SkeletonRect
        key={index}
        width="100%"
        height="32px"
        className="rounded-md"
      />
    ))}
  </div>
);

// Form field skeleton
export const SkeletonFormField: React.FC<{ className?: string }> = ({
  className = "",
}) => (
  <div className={`flex items-center justify-start gap-2 ${className}`}>
    <SkeletonRect width="150px" height="20px" className="rounded" />
    <SkeletonInput />
  </div>
);

export default Skeleton;
