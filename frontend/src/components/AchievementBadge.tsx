import React from 'react';
import { Trophy, Star, Lock } from 'lucide-react';

interface Achievement {
  id: number;
  name: string;
  description: string;
  badge_icon_url: string;
  points_value: number;
  earned?: boolean;
  earned_at?: string;
}

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  className?: string;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  achievement,
  size = 'md',
  showDetails = true,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };

  const iconSizes = {
    sm: 16,
    md: 24,
    lg: 32
  };

  const isEarned = achievement.earned;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className={`
        ${sizeClasses[size]} 
        rounded-full flex items-center justify-center relative
        transition-all duration-300 transform hover:scale-105
        ${isEarned 
          ? 'bg-gradient-to-br from-yellow-400 to-amber-600 shadow-lg shadow-yellow-500/25' 
          : 'bg-gray-200 border-2 border-gray-300'
        }
      `}>
        {isEarned ? (
          <>
            {achievement.badge_icon_url ? (
              <img 
                src={achievement.badge_icon_url} 
                alt={achievement.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <Trophy size={iconSizes[size]} className="text-white" />
            )}
            <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full p-1">
              <Star size={size === 'sm' ? 8 : size === 'md' ? 10 : 12} fill="currentColor" />
            </div>
          </>
        ) : (
          <Lock size={iconSizes[size]} className="text-gray-400" />
        )}
      </div>
      
      {showDetails && (
        <div className="mt-2 text-center">
          <h3 className={`font-semibold text-gray-900 ${
            size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'
          }`}>
            {achievement.name}
          </h3>
          <p className={`text-gray-600 mt-1 ${
            size === 'sm' ? 'text-xs' : 'text-sm'
          }`}>
            {achievement.description}
          </p>
          <div className="flex items-center justify-center mt-1 space-x-2">
            <span className={`font-bold text-amber-600 ${
              size === 'sm' ? 'text-xs' : 'text-sm'
            }`}>
              +{achievement.points_value}
            </span>
            {isEarned && achievement.earned_at && (
              <span className={`text-gray-500 ${
                size === 'sm' ? 'text-xs' : 'text-xs'
              }`}>
                {new Date(achievement.earned_at).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface AchievementGridProps {
  achievements: Achievement[];
  columns?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const AchievementGrid: React.FC<AchievementGridProps> = ({
  achievements,
  columns = 4,
  size = 'md',
  className = ''
}) => {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6'
  };

  return (
    <div className={`grid ${gridCols[columns as keyof typeof gridCols] || 'grid-cols-4'} gap-4 ${className}`}>
      {achievements.map((achievement) => (
        <AchievementBadge
          key={achievement.id}
          achievement={achievement}
          size={size}
        />
      ))}
    </div>
  );
};

interface AchievementProgressProps {
  achievements: Achievement[];
  className?: string;
}

export const AchievementProgress: React.FC<AchievementProgressProps> = ({
  achievements,
  className = ''
}) => {
  const earnedCount = achievements.filter(a => a.earned).length;
  const totalCount = achievements.length;
  const totalPoints = achievements.filter(a => a.earned).reduce((sum, a) => sum + a.points_value, 0);
  const possiblePoints = achievements.reduce((sum, a) => sum + a.points_value, 0);
  const percentage = totalCount > 0 ? (earnedCount / totalCount) * 100 : 0;

  return (
    <div className={`bg-white rounded-lg p-6 shadow-sm ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievement Progress</h3>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Achievements Unlocked</span>
            <span className="font-semibold text-gray-900">{earnedCount}/{totalCount}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-amber-400 to-amber-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Points Earned</span>
            <span className="font-semibold text-amber-600">{totalPoints}/{possiblePoints}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${possiblePoints > 0 ? (totalPoints / possiblePoints) * 100 : 0}%` }}
            />
          </div>
        </div>

        <div className="pt-2 border-t border-gray-100">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Completion Rate</span>
            <span className="font-bold text-gray-900">{percentage.toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
