import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
// Teacher Pages
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import ClassManagement from './pages/teacher/ClassManagement';
import ViewSubmissions from './pages/teacher/ViewSubmissions';
import CreateAssignment from './pages/teacher/CreateAssignment';
import ListAssignments from './pages/teacher/ListAssignments';
import EditAssignment from './pages/teacher/EditAssignment';
// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import SubmitAssignment from './pages/student/SubmitAssignment';
import MySubmissions from './pages/student/MySubmissions';
import StudentProfilePage from './pages/student/StudentProfilePage';
import StudentSettingsPage from './pages/student/StudentSettingsPage';

import { useContext } from 'react';
import AuthContext from './context/AuthContext';

const HomeRedirect = () => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'teacher') return <Navigate to="/teacher/dashboard" replace />;
  if (user.role === 'student') return <Navigate to="/student/dashboard" replace />;
  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans relative overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900 transition-colors duration-300">

            {/* Global Cinematic Background Glows */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
              <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-200/20 dark:bg-indigo-600/10 rounded-full blur-[120px] animate-pulse duration-[10s]"></div>
              <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-200/20 dark:bg-blue-600/10 rounded-full blur-[120px] animate-pulse duration-[15s]"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-slate-200/10 dark:bg-slate-900/10 rounded-full blur-[140px]"></div>
            </div>

            <div className="relative z-10">
              <Navbar />
              <main className="pt-32 pb-20">
                <Routes>
                  <Route path="/" element={<HomeRedirect />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Common Private Routes */}
                  <Route element={<PrivateRoute />}>
                    <Route path="/profile" element={<Profile />} />
                  </Route>

                  {/* Teacher Routes */}
                  <Route element={<PrivateRoute roles={['teacher']} />}>
                    <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
                    <Route path="/teacher/classes" element={<ClassManagement />} />
                    <Route path="/teacher/create-assignment" element={<CreateAssignment />} />
                    <Route path="/teacher/assignments" element={<ListAssignments />} />
                    <Route path="/teacher/edit-assignment/:id" element={<EditAssignment />} />
                    <Route path="/teacher/submissions" element={<ViewSubmissions />} />
                  </Route>

                  {/* Student Routes */}
                  <Route element={<PrivateRoute roles={['student']} />}>
                    <Route path="/student/dashboard" element={<StudentDashboard />} />
                    <Route path="/student/submit/:id" element={<SubmitAssignment />} />
                    <Route path="/student/my-submissions" element={<MySubmissions />} />
                    <Route path="/student/profile" element={<StudentProfilePage />} />
                    <Route path="/student/settings" element={<StudentSettingsPage />} />
                  </Route>

                  {/* Default Redirect */}
                  <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
              </main>
            </div>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;