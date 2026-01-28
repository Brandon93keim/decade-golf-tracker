'use client';

import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Play, Search, Plus, X } from 'lucide-react';
import { ActiveRound, HoleData, Course, TeeBox } from '@/lib/types';
import { getCourses, searchCourses, getHolesForRound, generateId } from '@/lib/courses';

interface NewRoundProps {
  onStartRound: (round: ActiveRound) => void;
  onCancel: () => void;
  onManageCourses: () => void;
}

export default function NewRound({ onStartRound, onCancel, onManageCourses }: NewRoundProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedTeeBox, setSelectedTeeBox] = useState<TeeBox | null>(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isNineHole, setIsNineHole] = useState(false);
  const [nineHoleType, setNineHoleType] = useState<'front' | 'back'>('front');
  const [showCourseSearch, setShowCourseSearch] = useState(false);

  // Load courses on mount
  useEffect(() => {
    setCourses(getCourses());
  }, []);

  // Filter courses based on search
  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return courses;
    return searchCourses(searchQuery);
  }, [courses, searchQuery]);

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    setSelectedTeeBox(course.teeBoxes[0] || null);
    setShowCourseSearch(false);
    setSearchQuery('');
  };

  const handleStart = () => {
    if (!selectedCourse || !selectedTeeBox) {
      alert('Please select a course and tee box');
      return;
    }

    const holeInfos = getHolesForRound(selectedTeeBox, isNineHole, nineHoleType);
    
    const holes: HoleData[] = holeInfos.map((h) => ({
      holeNumber: h.number,
      par: h.par,
      distance: h.yardage,
      score: 0,
      approaches: [],
      shortGameShots: [],
      putts: [],
    }));

    const round: ActiveRound = {
      id: generateId(),
      date,
      courseId: selectedCourse.id,
      courseName: selectedCourse.name,
      teeBoxName: selectedTeeBox.name,
      courseRating: selectedTeeBox.rating,
      courseSlope: selectedTeeBox.slope,
      currentHole: isNineHole && nineHoleType === 'back' ? 10 : 1,
      holes,
      isNineHole,
      nineHoleType: isNineHole ? nineHoleType : undefined,
    };

    onStartRound(round);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center gap-4">
        <button onClick={onCancel} className="p-2 -ml-2 rounded-lg hover:bg-white/10">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-xl font-bold">New Round</h1>
          <p className="text-white/60 text-sm">Set up your round</p>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-auto">
        {/* Course Selection */}
        <div className="golf-card space-y-3">
          <label className="block text-sm font-medium">Course</label>
          
          {selectedCourse ? (
            <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
              <div>
                <div className="font-semibold">{selectedCourse.name}</div>
                {selectedCourse.city && (
                  <div className="text-sm text-white/60">
                    {selectedCourse.city}{selectedCourse.state ? `, ${selectedCourse.state}` : ''}
                  </div>
                )}
              </div>
              <button 
                onClick={() => { setSelectedCourse(null); setSelectedTeeBox(null); }}
                className="p-2 hover:bg-white/10 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowCourseSearch(true)}
              className="w-full p-3 border border-dashed border-white/30 rounded-lg text-left hover:border-white/50 transition-colors"
            >
              <div className="flex items-center gap-2 text-white/60">
                <Search size={18} />
                <span>Search for a course...</span>
              </div>
            </button>
          )}

          {/* Tee Box Selection */}
          {selectedCourse && selectedCourse.teeBoxes.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2">Tee Box</label>
              <div className="flex flex-wrap gap-2">
                {selectedCourse.teeBoxes.map((tee) => (
                  <button
                    key={tee.name}
                    onClick={() => setSelectedTeeBox(tee)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      selectedTeeBox?.name === tee.name
                        ? 'bg-green-600 ring-2 ring-white'
                        : 'bg-white/10 hover:bg-white/15'
                    }`}
                  >
                    <div className="font-medium">{tee.name}</div>
                    <div className="text-xs text-white/70">{tee.totalYardage} yds</div>
                  </button>
                ))}
              </div>
              {selectedTeeBox && (
                <div className="mt-2 text-sm text-white/60">
                  Rating: {selectedTeeBox.rating} / Slope: {selectedTeeBox.slope}
                </div>
              )}
            </div>
          )}

          {/* No tee boxes warning */}
          {selectedCourse && selectedCourse.teeBoxes.length === 0 && (
            <div className="p-3 bg-amber-900/30 border border-amber-500/30 rounded-lg text-sm">
              This course has no tee boxes set up. 
              <button 
                onClick={onManageCourses}
                className="text-amber-400 underline ml-1"
              >
                Add tee boxes
              </button>
            </div>
          )}
        </div>

        {/* Date Selection */}
        <div className="golf-card">
          <label className="block text-sm font-medium mb-2">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="golf-input w-full max-w-full"
            style={{ colorScheme: 'dark' }}
          />
        </div>

        {/* 9/18 Hole Selection */}
        <div className="golf-card space-y-3">
          <label className="block text-sm font-medium">Round Type</label>
          <div className="flex gap-3">
            <button
              onClick={() => setIsNineHole(false)}
              className={`flex-1 p-4 rounded-lg text-center transition-all ${
                !isNineHole ? 'bg-green-600 ring-2 ring-white' : 'bg-white/10'
              }`}
            >
              <div className="text-2xl font-bold">18</div>
              <div className="text-sm text-white/70">Full Round</div>
            </button>
            <button
              onClick={() => setIsNineHole(true)}
              className={`flex-1 p-4 rounded-lg text-center transition-all ${
                isNineHole ? 'bg-green-600 ring-2 ring-white' : 'bg-white/10'
              }`}
            >
              <div className="text-2xl font-bold">9</div>
              <div className="text-sm text-white/70">Half Round</div>
            </button>
          </div>

          {/* Front/Back Selection */}
          {isNineHole && (
            <div className="flex gap-3">
              <button
                onClick={() => setNineHoleType('front')}
                className={`flex-1 p-3 rounded-lg text-center transition-all ${
                  nineHoleType === 'front' ? 'bg-green-600' : 'bg-white/10'
                }`}
              >
                Front 9 (1-9)
              </button>
              <button
                onClick={() => setNineHoleType('back')}
                className={`flex-1 p-3 rounded-lg text-center transition-all ${
                  nineHoleType === 'back' ? 'bg-green-600' : 'bg-white/10'
                }`}
              >
                Back 9 (10-18)
              </button>
            </div>
          )}
        </div>

        {/* Manage Courses Link */}
        <button
          onClick={onManageCourses}
          className="w-full p-3 text-center text-green-400 hover:bg-white/5 rounded-lg"
        >
          <Plus size={18} className="inline mr-2" />
          Add or Edit Courses
        </button>
      </div>

      {/* Start Button */}
      <div className="p-4 safe-bottom">
        <button 
          onClick={handleStart}
          disabled={!selectedCourse || !selectedTeeBox}
          className="golf-btn w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play size={24} />
          Start Round
        </button>
      </div>

      {/* Course Search Modal */}
      {showCourseSearch && (
        <div className="fixed inset-0 bg-black/80 z-50 flex flex-col">
          <div className="p-4 flex items-center gap-3 border-b border-white/10">
            <button 
              onClick={() => { setShowCourseSearch(false); setSearchQuery(''); }}
              className="p-2 hover:bg-white/10 rounded-lg"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses..."
                className="golf-input w-full pl-10"
                autoFocus
              />
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4">
            {filteredCourses.length > 0 ? (
              <div className="space-y-2">
                {filteredCourses.map((course) => (
                  <button
                    key={course.id}
                    onClick={() => handleSelectCourse(course)}
                    className="w-full p-4 text-left bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <div className="font-semibold">{course.name}</div>
                    {course.city && (
                      <div className="text-sm text-white/60">
                        {course.city}{course.state ? `, ${course.state}` : ''}
                      </div>
                    )}
                    <div className="text-xs text-white/40 mt-1">
                      {course.teeBoxes.length} tee box{course.teeBoxes.length !== 1 ? 'es' : ''}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-white/60 mb-4">
                  {searchQuery ? 'No courses found' : 'No courses added yet'}
                </p>
                <button
                  onClick={() => { setShowCourseSearch(false); onManageCourses(); }}
                  className="golf-btn"
                >
                  <Plus size={18} />
                  Add New Course
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
