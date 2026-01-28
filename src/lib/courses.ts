import { Course, TeeBox, HoleInfo } from './types';

// Generate unique ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Course storage functions
export function getCourses(): Course[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('golf-courses');
  return stored ? JSON.parse(stored) : [];
}

export function saveCourses(courses: Course[]): void {
  localStorage.setItem('golf-courses', JSON.stringify(courses));
}

export function getCourse(id: string): Course | null {
  const courses = getCourses();
  return courses.find(c => c.id === id) || null;
}

export function addCourse(course: Course): void {
  const courses = getCourses();
  courses.push(course);
  saveCourses(courses);
}

export function updateCourse(course: Course): void {
  const courses = getCourses();
  const index = courses.findIndex(c => c.id === course.id);
  if (index !== -1) {
    courses[index] = { ...course, updatedAt: new Date().toISOString() };
    saveCourses(courses);
  }
}

export function deleteCourse(id: string): void {
  const courses = getCourses();
  saveCourses(courses.filter(c => c.id !== id));
}

export function searchCourses(query: string): Course[] {
  const courses = getCourses();
  const lowerQuery = query.toLowerCase();
  return courses.filter(c => 
    c.name.toLowerCase().includes(lowerQuery) ||
    c.city?.toLowerCase().includes(lowerQuery) ||
    c.state?.toLowerCase().includes(lowerQuery)
  );
}

// Create a new course with default structure
export function createEmptyCourse(name: string, city?: string, state?: string): Course {
  return {
    id: generateId(),
    name,
    city,
    state,
    teeBoxes: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// Create a new tee box with 18 holes defaulted to par 4, 400 yards
export function createEmptyTeeBox(name: string): TeeBox {
  const holes: HoleInfo[] = Array.from({ length: 18 }, (_, i) => ({
    number: i + 1,
    par: 4,
    yardage: 400,
  }));
  
  return {
    name,
    rating: 72.0,
    slope: 113,
    totalYardage: 7200,
    holes,
  };
}

// Calculate total yardage and par from holes
export function calculateTeeBoxTotals(teeBox: TeeBox): { totalYardage: number; totalPar: number } {
  const totalYardage = teeBox.holes.reduce((sum, h) => sum + h.yardage, 0);
  const totalPar = teeBox.holes.reduce((sum, h) => sum + h.par, 0);
  return { totalYardage, totalPar };
}

// Get holes for a round (all 18, front 9, or back 9)
export function getHolesForRound(
  teeBox: TeeBox, 
  isNineHole: boolean, 
  nineHoleType?: 'front' | 'back'
): HoleInfo[] {
  if (!isNineHole) {
    return teeBox.holes;
  }
  
  if (nineHoleType === 'front') {
    return teeBox.holes.slice(0, 9);
  } else {
    return teeBox.holes.slice(9, 18);
  }
}
