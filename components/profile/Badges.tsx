import React, { useEffect, useState } from 'react';

interface Badge {
  id: string;
  label: string;
}

const BADGE_LABELS: Record<string, string> = {
  '3-day-streak': '3-Day Streak',
  '7-day-streak': '7-Day Streak',
  '30-day-streak': '30-Day Streak',
};

export default function Badges() {
  const [badges, setBadges] = useState<Badge[]>([]);

  useEffect(() => {
    try {
      const profile = JSON.parse(localStorage.getItem('userProfile') || '{}');
      const storedBadges: string[] = profile.badges || [];
      setBadges(
        storedBadges.map((id: string) => ({ id, label: BADGE_LABELS[id] || id }))
      );
    } catch {
      setBadges([]);
    }
  }, []);

  if (badges.length === 0) {
    return null;
  }

  return (
    <div className="badges">
      {badges.map((b) => (
        <span key={b.id} className="badge">
          {b.label}
        </span>
      ))}
    </div>
  );
}
