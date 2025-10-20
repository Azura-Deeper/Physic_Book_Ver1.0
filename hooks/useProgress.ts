import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { IUserProgress } from '@/models/UserProgress';

interface UseProgressReturn {
  progress: { [key: number]: IUserProgress };
  loading: boolean;
  updateProgress: (lessonId: number, completed: boolean, timeSpent?: number) => Promise<boolean>;
  isLessonCompleted: (lessonId: number) => boolean;
  getCompletionRate: () => number;
  getTotalTimeSpent: () => number;
}

export const useProgress = (): UseProgressReturn => {
  const [progress, setProgress] = useState<{ [key: number]: IUserProgress }>({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch progress data when user is available
  useEffect(() => {
    if (user) {
      fetchProgress();
    } else {
      setProgress({});
      setLoading(false);
    }
  }, [user]);

  const fetchProgress = async () => {
    if (!user) return;

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch('/api/progress', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProgress(data.progress || {});
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (lessonId: number, completed: boolean, timeSpent?: number): Promise<boolean> => {
    if (!user) return false;

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return false;

      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          lessonId,
          completed,
          timeSpent,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setProgress(prev => ({
          ...prev,
          [lessonId]: data.progress,
        }));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error updating progress:', error);
      return false;
    }
  };

  const isLessonCompleted = (lessonId: number): boolean => {
    return progress[lessonId]?.completed || false;
  };

  const getCompletionRate = (): number => {
    const totalLessons = 4; // We have 4 lessons
    const completedLessons = Object.values(progress).filter(p => p.completed).length;
    return Math.round((completedLessons / totalLessons) * 100);
  };

  const getTotalTimeSpent = (): number => {
    return Object.values(progress).reduce((total, p) => total + (p.timeSpent || 0), 0);
  };

  return {
    progress,
    loading,
    updateProgress,
    isLessonCompleted,
    getCompletionRate,
    getTotalTimeSpent,
  };
};