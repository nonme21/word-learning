"use client";

import { useMemo } from "react";

interface ActivityCalendarProps {
  activities: { date: Date; count: number }[];
  dailyReviewLimit: number;
}

export function ActivityCalendar({ activities, dailyReviewLimit }: ActivityCalendarProps) {
  const days = 28;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const pastDays = useMemo(() => {
    const dates = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      dates.push(d);
    }
    return dates;
  }, [today]);

  const activityMap = useMemo(() => {
    const map = new Map<string, number>();
    activities.forEach((a) => {
      map.set(new Date(a.date).toISOString().split('T')[0], a.count);
    });
    return map;
  }, [activities]);

  const currentStreak = useMemo(() => {
    let streak = 0;
    for (let i = 0; i < days; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const count = activityMap.get(key) || 0;
      if (count > 0 || (i === 0 && count === 0)) { 
        if (count > 0) streak++;
      } else {
        break;
      }
    }
    return streak;
  }, [activityMap, today]);

  return (
    <div className="flex flex-col space-y-4 p-5 bg-card rounded-2xl border-2 border-border/50 shadow-sm relative overflow-hidden">
      {/* Decorative ice glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
      
      <div className="flex justify-between items-center relative z-10">
        <h3 className="font-bold text-lg flex items-center gap-2">
          ❄️ Ледяной удар
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black text-primary">{currentStreak}</span>
          <span className="text-muted-foreground font-medium text-sm">дней подряд</span>
        </div>
      </div>
      
      <div className="flex gap-2 overflow-x-auto pb-2 pt-2 custom-scrollbar relative z-10 snap-x">
        {pastDays.map((date, i) => {
          const key = date.toISOString().split('T')[0];
          const count = activityMap.get(key) || 0;
          const isToday = i === days - 1;
          const isCompleted = count > 0;
          const isGoalMet = count >= dailyReviewLimit;
          
          return (
            <div 
              key={key} 
              className={`flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all duration-300 snap-center
                ${isGoalMet 
                  ? 'bg-primary border-primary text-primary-foreground shadow-[0_0_12px_rgba(0,180,216,0.6)] scale-110' 
                  : isCompleted 
                    ? 'bg-primary/40 border-primary/40 text-primary-foreground' 
                    : isToday 
                      ? 'border-border border-dashed bg-muted/50' 
                      : 'border-border/50 bg-muted/10 text-muted-foreground/30'}
              `}
              title={`${date.toLocaleDateString()}: ${count} слов`}
            >
              <span className={`text-sm font-bold ${isGoalMet ? 'text-white' : ''}`}>
                {date.getDate()}
              </span>
            </div>
          );
        })}
      </div>
      
      <div className="text-xs text-muted-foreground text-center pt-1 font-medium">
        Выполните цель ({dailyReviewLimit} слов), чтобы заморозить день!
      </div>
    </div>
  );
}
