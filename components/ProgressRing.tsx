type Props = {
  percentage: number;
};

export default function ProgressRing({ percentage }: Props) {
  const radius = 48;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="#1e293b"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />

        <circle
          stroke="#3b82f6"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          transform={`rotate(-90 ${radius} ${radius})`}
        />

        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="fill-white text-xl font-bold"
        >
          {percentage}%
        </text>
      </svg>

      <p className="mt-2 text-slate-400 text-sm">Skill Match</p>
    </div>
  );
}