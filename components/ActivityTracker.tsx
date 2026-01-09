import { ActivityDay } from '@/types/workout';
import { useEffect, useMemo, useRef } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

interface ActivityTrackerProps {
  activityHistory: ActivityDay[];
  currentCompletedCount: number;
  isDark: boolean;
}

// Helper function to format date in local timezone as YYYY-MM-DD
const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function ActivityTracker({ activityHistory, currentCompletedCount, isDark }: ActivityTrackerProps) {
  const scrollViewRef = useRef<ScrollView>(null);

  // Generate calendar grid for each of the last 6 months
  const monthGrids = useMemo(() => {
    const today = new Date();
    const months: {
      month: string;
      weeks: (({ date: string; count: number } | null)[])[];
    }[] = [];
    
    // Generate grids for the last 6 months
    for (let monthOffset = 5; monthOffset >= 0; monthOffset--) {
      const targetDate = new Date(today.getFullYear(), today.getMonth() - monthOffset, 1);
      const year = targetDate.getFullYear();
      const month = targetDate.getMonth();
      
      // Get first and last day of month
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      
      // Get day of week for first day (0 = Sunday, 1 = Monday, etc.)
      const firstDayOfWeek = firstDay.getDay();
      const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Convert to Monday = 0
      
      // Build weeks array with nulls for empty cells
      const weeks: (({ date: string; count: number } | null)[])[] = [];
      let currentWeek: ({ date: string; count: number } | null)[] = [];
      
      // Add empty cells before the first day
      for (let i = 0; i < startOffset; i++) {
        currentWeek.push(null);
      }
      
      // Add all days in the month
      for (let day = 1; day <= lastDay.getDate(); day++) {
        const currentDate = new Date(year, month, day);
        const dateString = formatLocalDate(currentDate);
        const todayString = formatLocalDate(today);
        const isToday = dateString === todayString;
        
        // Don't show future days
        if (currentDate > today) break;
        
        // Find count from history
        const historyItem = activityHistory.find(item => item.date === dateString);
        const count = isToday ? currentCompletedCount : (historyItem?.count || 0);
        
        currentWeek.push({ date: dateString, count });
        
        // Start new week on Monday (when currentWeek has 7 items)
        if (currentWeek.length === 7) {
          weeks.push(currentWeek);
          currentWeek = [];
        }
      }
      
      // Add the last incomplete week if it exists
      if (currentWeek.length > 0) {
        weeks.push(currentWeek);
      }
      
      months.push({
        month: firstDay.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        weeks,
      });
    }
    
    return months;
  }, [activityHistory, currentCompletedCount]);

  const getColorForCount = (count: number): string => {
    if (isDark) {
      // Dark mode colors
      if (count === 0) return '#2d333b';
      if (count === 1) return '#0e4429';
      if (count === 2) return '#006d32';
      if (count === 3) return '#26a641';
      return '#39d353'; // 4+ workouts
    } else {
      // Light mode colors
      if (count === 0) return '#ebedf0';
      if (count === 1) return '#9be9a8';
      if (count === 2) return '#40c463';
      if (count === 3) return '#30a14e';
      return '#216e39'; // 4+ workouts
    }
  };
  
  const colors = {
    background: isDark ? '#1e1e1e' : '#fff',
    border: isDark ? '#333333' : '#e0e0e0',
    text: isDark ? '#ffffff' : '#333',
    textSecondary: isDark ? '#b0b0b0' : '#666',
    legendSquares: isDark 
      ? ['#2d333b', '#0e4429', '#006d32', '#26a641', '#39d353']
      : ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
  };

  // Scroll to the end (latest week) on mount
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: false });
    }, 100);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Text style={[styles.title, { color: colors.text }]}>Activity - Last 6 Months</Text>
        <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
          Today: {currentCompletedCount} workouts
        </Text>
      </View>
      
      <ScrollView
        ref={scrollViewRef}
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.gridContainer}>
          {/* Day labels */}
          <View style={styles.dayLabelsContainer}>
            <Text style={[styles.dayLabel, { color: colors.textSecondary }]}>Mon</Text>
            <Text style={[styles.dayLabel, { color: colors.textSecondary }]}>Wed</Text>
            <Text style={[styles.dayLabel, { color: colors.textSecondary }]}>Fri</Text>
          </View>
          
          {/* Grid grouped by months */}
          <View style={styles.monthsContainer}>
            {monthGrids.map((monthGrid, monthIndex) => (
              <View key={monthIndex} style={styles.monthGroup}>
                {/* Month label */}
                <Text style={[styles.monthLabel, { color: colors.textSecondary }]}>
                  {monthGrid.month}
                </Text>
                
                {/* Weeks for this month */}
                <View style={styles.grid}>
                  {monthGrid.weeks.map((week, weekIndex) => (
                    <View key={weekIndex} style={styles.week}>
                      {week.map((day, dayIndex) => (
                        day ? (
                          <View
                            key={`${weekIndex}-${dayIndex}`}
                            style={[
                              styles.day,
                              { backgroundColor: getColorForCount(day.count) }
                            ]}
                          />
                        ) : (
                          <View
                            key={`${weekIndex}-${dayIndex}-empty`}
                            style={styles.emptyDay}
                          />
                        )
                      ))}
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      
      {/* Legend */}
      <View style={styles.legend}>
        <Text style={[styles.legendText, { color: colors.textSecondary }]}>Less</Text>
        {colors.legendSquares.map((color, index) => (
          <View key={index} style={[styles.legendSquare, { backgroundColor: color }]} />
        ))}
        <Text style={[styles.legendText, { color: colors.textSecondary }]}>More</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  scrollView: {
    marginBottom: 12,
  },
  scrollContent: {
    paddingRight: 16,
  },
  gridContainer: {
    position: 'relative',
    flexDirection: 'row',
  },
  monthsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  monthGroup: {
    alignItems: 'flex-start',
  },
  monthLabel: {
    fontSize: 10,
    marginBottom: 4,
    fontWeight: '600',
  },
  dayLabelsContainer: {
    position: 'absolute',
    left: -32,
    top: 20,
    height: 105,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  dayLabel: {
    fontSize: 9,
    height: 15,
  },
  grid: {
    flexDirection: 'row',
    gap: 3,
  },
  week: {
    gap: 3,
  },
  day: {
    width: 12,
    height: 12,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: 'rgba(27, 31, 35, 0.06)',
  },
  emptyDay: {
    width: 12,
    height: 12,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 8,
  },
  legendText: {
    fontSize: 10,
  },
  legendSquare: {
    width: 10,
    height: 10,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: 'rgba(27, 31, 35, 0.06)',
  },
});
