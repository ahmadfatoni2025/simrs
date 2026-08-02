export interface DonutSegment {
    value: number;
    color: string;
}

export function DonutChart({
    segments,
    size = 176,
}: {
    segments: DonutSegment[];
    size?: number;
}) {
    const total = segments.reduce((acc, s) => acc + s.value, 0);
    const r = 54;
    const c = 2 * Math.PI * r;
    let offset = 0;

    return (
        <svg
            viewBox="0 0 140 140"
            className="-rotate-90"
            style={{ width: size, height: size }}
        >
            {segments.map((s, i) => {
                const dash = (s.value / total) * c;
                const el = (
                    <circle
                        key={i}
                        cx="70"
                        cy="70"
                        r={r}
                        fill="none"
                        stroke={s.color}
                        strokeWidth="16"
                        strokeDasharray={`${dash} ${c - dash}`}
                        strokeDashoffset={-offset}
                    />
                );
                offset += dash;
                return el;
            })}
        </svg>
    );
}