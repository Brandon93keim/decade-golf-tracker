'use client';

import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, ChevronDown, ChevronUp, Save } from 'lucide-react';
import { Course, TeeBox, HoleInfo } from '@/lib/types';
import { createEmptyCourse, createEmptyTeeBox, calculateTeeBoxTotals, generateId } from '@/lib/courses';

interface CourseManagerProps {
  course?: Course;  // If editing existing course
  onSave: (course: Course) => void;
  onCancel: () => void;
}

export default function CourseManager({ course, onSave, onCancel }: CourseManagerProps) {
  const [name, setName] = useState(course?.name || '');
  const [city, setCity] = useState(course?.city || '');
  const [state, setState] = useState(course?.state || '');
  const [teeBoxes, setTeeBoxes] = useState<TeeBox[]>(course?.teeBoxes || []);
  const [expandedTeeBox, setExpandedTeeBox] = useState<number | null>(teeBoxes.length > 0 ? 0 : null);
  const [newTeeBoxName, setNewTeeBoxName] = useState('');

  const handleAddTeeBox = () => {
    if (!newTeeBoxName.trim()) return;
    const newTeeBox = createEmptyTeeBox(newTeeBoxName.trim());
    setTeeBoxes([...teeBoxes, newTeeBox]);
    setExpandedTeeBox(teeBoxes.length);
    setNewTeeBoxName('');
  };

  const handleRemoveTeeBox = (index: number) => {
    setTeeBoxes(teeBoxes.filter((_, i) => i !== index));
    setExpandedTeeBox(null);
  };

  const handleTeeBoxChange = (index: number, field: keyof TeeBox, value: any) => {
    const updated = [...teeBoxes];
    updated[index] = { ...updated[index], [field]: value };
    setTeeBoxes(updated);
  };

  const handleHoleChange = (teeBoxIndex: number, holeIndex: number, field: keyof HoleInfo, value: number) => {
    const updated = [...teeBoxes];
    updated[teeBoxIndex].holes[holeIndex] = {
      ...updated[teeBoxIndex].holes[holeIndex],
      [field]: value,
    };
    // Recalculate total yardage
    const { totalYardage } = calculateTeeBoxTotals(updated[teeBoxIndex]);
    updated[teeBoxIndex].totalYardage = totalYardage;
    setTeeBoxes(updated);
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('Please enter a course name');
      return;
    }
    if (teeBoxes.length === 0) {
      alert('Please add at least one tee box');
      return;
    }

    const courseData: Course = {
      id: course?.id || generateId(),
      name: name.trim(),
      city: city.trim() || undefined,
      state: state.trim() || undefined,
      teeBoxes,
      createdAt: course?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(courseData);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center gap-4 border-b border-white/10">
        <button onClick={onCancel} className="p-2 -ml-2 rounded-lg hover:bg-white/10">
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold">{course ? 'Edit Course' : 'Add New Course'}</h1>
        </div>
        <button onClick={handleSave} className="golf-btn px-4 py-2">
          <Save size={18} />
          Save
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-6">
        {/* Course Info */}
        <div className="golf-card space-y-4">
          <h2 className="font-semibold">Course Information</h2>
          
          <div>
            <label className="block text-sm font-medium mb-2">Course Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Money Hill Country Club"
              className="golf-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-2">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g., Abita Springs"
                className="golf-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g., LA"
                className="golf-input"
                maxLength={2}
              />
            </div>
          </div>
        </div>

        {/* Tee Boxes */}
        <div className="golf-card space-y-4">
          <h2 className="font-semibold">Tee Boxes</h2>

          {/* Add Tee Box */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newTeeBoxName}
              onChange={(e) => setNewTeeBoxName(e.target.value)}
              placeholder="Tee name (e.g., Blue, White)"
              className="golf-input flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleAddTeeBox()}
            />
            <button onClick={handleAddTeeBox} className="golf-btn px-4">
              <Plus size={18} />
            </button>
          </div>

          {/* Tee Box List */}
          {teeBoxes.map((teeBox, teeIndex) => (
            <div key={teeIndex} className="border border-white/20 rounded-lg overflow-hidden">
              {/* Tee Box Header */}
              <button
                onClick={() => setExpandedTeeBox(expandedTeeBox === teeIndex ? null : teeIndex)}
                className="w-full flex items-center justify-between p-3 hover:bg-white/5"
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium">{teeBox.name}</span>
                  <span className="text-sm text-white/60">
                    {teeBox.totalYardage} yds • {teeBox.rating}/{teeBox.slope}
                  </span>
                </div>
                {expandedTeeBox === teeIndex ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>

              {/* Expanded Content */}
              {expandedTeeBox === teeIndex && (
                <div className="p-3 pt-0 space-y-4 border-t border-white/10">
                  {/* Rating & Slope */}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-white/60 mb-1">Rating</label>
                      <input
                        type="number"
                        step="0.1"
                        value={teeBox.rating}
                        onChange={(e) => handleTeeBoxChange(teeIndex, 'rating', parseFloat(e.target.value) || 0)}
                        className="golf-input text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/60 mb-1">Slope</label>
                      <input
                        type="number"
                        value={teeBox.slope}
                        onChange={(e) => handleTeeBoxChange(teeIndex, 'slope', parseInt(e.target.value) || 0)}
                        className="golf-input text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-white/60 mb-1">Total</label>
                      <div className="golf-input text-center bg-white/5">{teeBox.totalYardage}</div>
                    </div>
                  </div>

                  {/* Holes Table */}
                  <div>
                    <div className="grid grid-cols-4 gap-1 text-xs text-white/60 mb-2 px-1">
                      <span>Hole</span>
                      <span className="text-center">Par</span>
                      <span className="text-center">Yards</span>
                      <span></span>
                    </div>
                    
                    {/* Front 9 */}
                    <div className="text-xs font-medium text-green-400 mb-1">Front 9</div>
                    {teeBox.holes.slice(0, 9).map((hole, holeIndex) => (
                      <div key={holeIndex} className="grid grid-cols-4 gap-1 mb-1 items-center">
                        <span className="text-sm font-medium pl-1">#{hole.number}</span>
                        <select
                          value={hole.par}
                          onChange={(e) => handleHoleChange(teeIndex, holeIndex, 'par', parseInt(e.target.value))}
                          className="golf-select text-sm py-1 text-center"
                        >
                          <option value={3}>3</option>
                          <option value={4}>4</option>
                          <option value={5}>5</option>
                        </select>
                        <input
                          type="number"
                          value={hole.yardage}
                          onChange={(e) => handleHoleChange(teeIndex, holeIndex, 'yardage', parseInt(e.target.value) || 0)}
                          className="golf-input text-sm py-1 text-center"
                        />
                        <span></span>
                      </div>
                    ))}
                    
                    {/* Front 9 Total */}
                    <div className="grid grid-cols-4 gap-1 mb-3 py-1 bg-white/5 rounded text-sm">
                      <span className="pl-1 font-medium">Out</span>
                      <span className="text-center">{teeBox.holes.slice(0, 9).reduce((s, h) => s + h.par, 0)}</span>
                      <span className="text-center">{teeBox.holes.slice(0, 9).reduce((s, h) => s + h.yardage, 0)}</span>
                      <span></span>
                    </div>

                    {/* Back 9 */}
                    <div className="text-xs font-medium text-green-400 mb-1">Back 9</div>
                    {teeBox.holes.slice(9, 18).map((hole, idx) => {
                      const holeIndex = idx + 9;
                      return (
                        <div key={holeIndex} className="grid grid-cols-4 gap-1 mb-1 items-center">
                          <span className="text-sm font-medium pl-1">#{hole.number}</span>
                          <select
                            value={hole.par}
                            onChange={(e) => handleHoleChange(teeIndex, holeIndex, 'par', parseInt(e.target.value))}
                            className="golf-select text-sm py-1 text-center"
                          >
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                          </select>
                          <input
                            type="number"
                            value={hole.yardage}
                            onChange={(e) => handleHoleChange(teeIndex, holeIndex, 'yardage', parseInt(e.target.value) || 0)}
                            className="golf-input text-sm py-1 text-center"
                          />
                          <span></span>
                        </div>
                      );
                    })}
                    
                    {/* Back 9 Total */}
                    <div className="grid grid-cols-4 gap-1 mb-2 py-1 bg-white/5 rounded text-sm">
                      <span className="pl-1 font-medium">In</span>
                      <span className="text-center">{teeBox.holes.slice(9, 18).reduce((s, h) => s + h.par, 0)}</span>
                      <span className="text-center">{teeBox.holes.slice(9, 18).reduce((s, h) => s + h.yardage, 0)}</span>
                      <span></span>
                    </div>

                    {/* Total */}
                    <div className="grid grid-cols-4 gap-1 py-2 bg-green-900/30 rounded text-sm font-semibold">
                      <span className="pl-1">Total</span>
                      <span className="text-center">{teeBox.holes.reduce((s, h) => s + h.par, 0)}</span>
                      <span className="text-center">{teeBox.totalYardage}</span>
                      <span></span>
                    </div>
                  </div>

                  {/* Delete Tee Box */}
                  <button
                    onClick={() => handleRemoveTeeBox(teeIndex)}
                    className="flex items-center justify-center gap-2 w-full py-2 text-red-400 hover:bg-red-400/10 rounded-lg"
                  >
                    <Trash2 size={16} />
                    Delete {teeBox.name} Tees
                  </button>
                </div>
              )}
            </div>
          ))}

          {teeBoxes.length === 0 && (
            <p className="text-center text-white/40 py-4">
              Add a tee box to set up hole-by-hole yardages
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
