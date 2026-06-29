export default function SparkBar({ data = [], height = 32, highThreshold = 70 }) {
  const max = Math.max(...data, 1);
  return (
    <div className="sparkbar-container" style={{ height }}>
      {data.map((val, i) => {
        const pct = (val / max) * 100;
        const isHigh = val >= highThreshold;
        return (
          <div
            key={i}
            className="sparkbar-item"
            style={{
              height: `${pct}%`,
              background: isHigh ? '#2DD4A0' : '#E4E7EC',
            }}
            title={String(val)}
          />
        );
      })}
    </div>
  );
}
