import { Star, StarHalf } from 'lucide-react';

export default function Rating({ value, size = 14 }) {
  const stars = [];
  const full = Math.floor(value);
  const hasHalf = value - full >= 0.5;

  for (let i = 0; i < full; i++) {
    stars.push(<Star key={`s-${i}`} size={size} fill="#f59e0b" color="#f59e0b" />);
  }
  if (hasHalf) {
    stars.push(<StarHalf key="half" size={size} fill="#f59e0b" color="#f59e0b" />);
  }
  const empty = 5 - stars.length;
  for (let i = 0; i < empty; i++) {
    stars.push(<Star key={`e-${i}`} size={size} color="#475569" />);
  }

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '1px' }}>
      {stars}
      <span style={{ marginLeft: '4px', fontSize: '0.8em', fontWeight: 600, color: '#f59e0b' }}>
        {value}
      </span>
    </span>
  );
}
