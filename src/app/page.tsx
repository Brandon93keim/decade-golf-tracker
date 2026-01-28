'use client';

import { useState, useEffect } from 'react';
import { Home, PlusCircle, History, MapPin } from 'lucide-react';
import Dashboard from '@/components/Dashboard';
import NewRound from '@/components/NewRound';
import RoundEntry from '@/components/RoundEntry';
import RoundHistory from '@/components/RoundHistory';
import CourseManager from '@/components/CourseManager';
import CourseList from '@/components/CourseList';
import { ActiveRound, Round, Course } from '@/lib/types';
import { getCourses, saveCourses, addCourse, updateCourse, deleteCourse } from '@/lib/courses';

type View = 'dashboard' | 'new-round' | 'round-entry' | 'history' | 'courses' | 'course-edit';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [activeRound, setActiveRound] = useState<ActiveRound | null>(null);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [editingCourse, setEditingCourse] = useState<Course | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      try {
        const savedRounds = localStorage.getItem('golf-rounds');
        if (savedRounds) {
          setRounds(JSON.parse(savedRounds));
        }
        
        const savedActiveRound = localStorage.getItem('golf-active-round');
        if (savedActiveRound) {
          const active = JSON.parse(savedActiveRound);
          setActiveRound(active);
          setCurrentView('round-entry');
        }

        setCourses(getCourses());
      } catch (error) {
        console.error('Error loading data:', error);
      }
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  const saveRounds = (newRounds: Round[]) => {
    setRounds(newRounds);
    localStorage.setItem('golf-rounds', JSON.stringify(newRounds));
  };

  const saveActiveRound = (round: ActiveRound | null) => {
    setActiveRound(round);
    if (round) {
      localStorage.setItem('golf-active-round', JSON.stringify(round));
    } else {
      localStorage.removeItem('golf-active-round');
    }
  };

  const handleStartRound = (round: ActiveRound) => {
    saveActiveRound(round);
    setCurrentView('round-entry');
  };

  const handleCompleteRound = (round: Round) => {
    saveRounds([round, ...rounds]);
    saveActiveRound(null);
    setCurrentView('dashboard');
  };

  const handleDeleteRound = (id: string) => {
    saveRounds(rounds.filter(r => r.id !== id));
  };

  const handleDiscardRound = () => {
    saveActiveRound(null);
    setCurrentView('dashboard');
  };

  // Course management
  const handleSaveCourse = (course: Course) => {
    if (editingCourse) {
      updateCourse(course);
    } else {
      addCourse(course);
    }
    setCourses(getCourses());
    setEditingCourse(undefined);
    setCurrentView('courses');
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setCurrentView('course-edit');
  };

  const handleDeleteCourse = (id: string) => {
    deleteCourse(id);
    setCourses(getCourses());
  };

  const handleNewCourse = () => {
    setEditingCourse(undefined);
    setCurrentView('course-edit');
  };

  const handleManageCourses = () => {
    setCurrentView('courses');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <main className="animate-fade-in">
        {currentView === 'dashboard' && (
          <Dashboard 
            rounds={rounds} 
            onStartRound={() => setCurrentView('new-round')}
            hasActiveRound={!!activeRound}
            onResumeRound={() => setCurrentView('round-entry')}
          />
        )}
        
        {currentView === 'new-round' && (
          <NewRound 
            onStartRound={handleStartRound}
            onCancel={() => setCurrentView('dashboard')}
            onManageCourses={handleManageCourses}
          />
        )}
        
        {currentView === 'round-entry' && activeRound && (
          <RoundEntry 
            activeRound={activeRound}
            onUpdateRound={saveActiveRound}
            onCompleteRound={handleCompleteRound}
            onDiscardRound={handleDiscardRound}
          />
        )}
        
        {currentView === 'history' && (
          <RoundHistory 
            rounds={rounds}
            onDeleteRound={handleDeleteRound}
          />
        )}

        {currentView === 'courses' && (
          <CourseList
            courses={courses}
            onEditCourse={handleEditCourse}
            onDeleteCourse={handleDeleteCourse}
            onNewCourse={handleNewCourse}
            onBack={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'course-edit' && (
          <CourseManager
            course={editingCourse}
            onSave={handleSaveCourse}
            onCancel={() => setCurrentView('courses')}
          />
        )}
      </main>

      {/* Bottom Navigation - hide during round entry and course edit */}
      {!['round-entry', 'course-edit'].includes(currentView) && (
        <nav className="bottom-nav">
          <button 
            className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentView('dashboard')}
          >
            <Home size={24} />
            <span>Home</span>
          </button>
          
          <button 
            className={`nav-item ${currentView === 'new-round' ? 'active' : ''}`}
            onClick={() => setCurrentView('new-round')}
          >
            <PlusCircle size={24} />
            <span>New Round</span>
          </button>

          <button 
            className={`nav-item ${currentView === 'courses' ? 'active' : ''}`}
            onClick={() => setCurrentView('courses')}
          >
            <MapPin size={24} />
            <span>Courses</span>
          </button>
          
          <button 
            className={`nav-item ${currentView === 'history' ? 'active' : ''}`}
            onClick={() => setCurrentView('history')}
          >
            <History size={24} />
            <span>History</span>
          </button>
        </nav>
      )}
    </div>
  );
}
