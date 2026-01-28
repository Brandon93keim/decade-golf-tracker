'use client';

import { useState } from 'react';
import { ArrowLeft, Plus, Edit2, Trash2, ChevronRight, MapPin } from 'lucide-react';
import { Course } from '@/lib/types';

interface CourseListProps {
  courses: Course[];
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (id: string) => void;
  onNewCourse: () => void;
  onBack: () => void;
}

export default function CourseList({ 
  courses, 
  onEditCourse, 
  onDeleteCourse, 
  onNewCourse,
  onBack 
}: CourseListProps) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    onDeleteCourse(id);
    setConfirmDelete(null);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="p-4 flex items-center gap-4 border-b border-white/10">
        <button onClick={onBack} className="p-2 -ml-2 rounded-lg hover:bg-white/10">
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold">Courses</h1>
          <p className="text-white/60 text-sm">{courses.length} course{courses.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={onNewCourse} className="golf-btn px-4 py-2">
          <Plus size={18} />
          Add
        </button>
      </div>

      <div className="p-4">
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <MapPin size={48} className="mx-auto text-white/30 mb-4" />
            <h2 className="text-lg font-semibold mb-2">No Courses Yet</h2>
            <p className="text-white/60 text-sm mb-6">
              Add your home course to get started
            </p>
            <button onClick={onNewCourse} className="golf-btn">
              <Plus size={18} />
              Add First Course
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {courses.map((course) => (
              <div key={course.id} className="golf-card">
                <button
                  onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
                  className="w-full flex items-center justify-between"
                >
                  <div className="text-left">
                    <div className="font-semibold">{course.name}</div>
                    {course.city && (
                      <div className="text-sm text-white/60">
                        {course.city}{course.state ? `, ${course.state}` : ''}
                      </div>
                    )}
                    <div className="text-xs text-white/40 mt-1">
                      {course.teeBoxes.length} tee box{course.teeBoxes.length !== 1 ? 'es' : ''}
                    </div>
                  </div>
                  <ChevronRight 
                    size={20} 
                    className={`text-white/40 transition-transform ${expandedCourse === course.id ? 'rotate-90' : ''}`}
                  />
                </button>

                {expandedCourse === course.id && (
                  <div className="mt-4 pt-4 border-t border-white/10 animate-fade-in">
                    {/* Tee Box Summary */}
                    {course.teeBoxes.length > 0 && (
                      <div className="mb-4 space-y-2">
                        <div className="text-sm font-medium text-white/70">Tee Boxes</div>
                        {course.teeBoxes.map((tee) => (
                          <div key={tee.name} className="flex justify-between text-sm bg-white/5 p-2 rounded">
                            <span>{tee.name}</span>
                            <span className="text-white/60">
                              {tee.totalYardage} yds • {tee.rating}/{tee.slope}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEditCourse(course)}
                        className="golf-btn golf-btn-secondary flex-1"
                      >
                        <Edit2 size={16} />
                        Edit
                      </button>
                      
                      {confirmDelete === course.id ? (
                        <div className="flex gap-2 flex-1">
                          <button
                            onClick={() => handleDelete(course.id)}
                            className="golf-btn golf-btn-danger flex-1"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="golf-btn golf-btn-secondary flex-1"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(course.id)}
                          className="p-3 text-red-400 hover:bg-red-400/10 rounded-lg"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
