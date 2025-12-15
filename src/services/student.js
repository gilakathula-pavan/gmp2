// Mock student service: returns sample data synchronously for scaffold
export function getStudent(){
  return {
    id: 's1',
    name: 'Gilakathula Pavan',
    email: 'pavan@gmail.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=12',
    enrolledCourseIds: ['c1','c2'],
    stats: { progressPct: 72, attendancePct: 88 },
    profile: {
      phone: '999999999',
      location: 'Hyderabad, India',
      emergencyContact: '999999999',
      dob: '2003-04-14',
      role: 'Frontend Developer Intern',
      department: 'Product Engineering',
      traineeId: 'INT-2045',
      joined: '2025-09-01',
      status: 'Active',
      summary: 'Building accessible web apps; focused on UI systems and performance.',
      cgpa: '7.2'
    }
  }
}

export function getCourses(){
  return [
    { id: 'c1', title: 'React Basics', instructor: 'Jane Doe', progressPct: 40 },
    { id: 'c2', title: 'Advanced CSS', instructor: 'John Smith', progressPct: 100 }
  ]
}
