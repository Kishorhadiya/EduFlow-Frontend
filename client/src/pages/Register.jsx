import { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import ThemeContext from "../context/ThemeContext";
import Swal from "sweetalert2";
import {
  User,
  Mail,
  UserCircle,
  School,
  ArrowRight,
  GraduationCap,
  KeyRound,
  ChevronDown,
} from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    classId: "",
  });
  const [classes, setClasses] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    if (user) {
      if (user.role === "teacher") {
        navigate("/teacher/dashboard");
      } else if (user.role === "student") {
        navigate("/student/dashboard");
      }
    }
  }, [user, navigate]);

  useEffect(() => {
    if (formData.role === "student") {
      fetch(`${API_URL}/classes`)
        .then((res) => res.json())
        .then((data) => setClasses(data))
        .catch((err) => console.error(err));
    }
  }, [formData.role, API_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        login(data);
        Swal.fire({
          icon: "success",
          title: "Welcome aboard!",
          text: "Onboarding sequence initiated.",
          timer: 1500,
          showConfirmButton: false,
          background: theme === "dark" ? "#0f172a" : "#fff",
          color: theme === "dark" ? "#f8fafc" : "#1e293b",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Onboarding Failed",
          text: data.message || "Validation error.",
          background: theme === "dark" ? "#0f172a" : "#fff",
          color: theme === "dark" ? "#f8fafc" : "#1e293b",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: "Connection failed.",
        background: theme === "dark" ? "#0f172a" : "#fff",
        color: theme === "dark" ? "#f8fafc" : "#1e293b",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 relative overflow-hidden font-sans transition-colors duration-300">
      {/* Subtle Gradient Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-full h-full bg-linear-to-br from-indigo-50/50 via-white to-blue-50/50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900"></div>
        <div className="absolute top-[-10%] right-[-10%] w-125 h-125 bg-indigo-200/10 dark:bg-indigo-500/5 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-125 h-125 bg-blue-200/10 dark:bg-blue-500/5 rounded-full blur-[100px] animate-pulse"></div>
      </div>

      <div className="relative z-10 w-full max-w-112.5 sm:max-w-125 py-6 sm:py-10">
        {/* Branding */}
        <div className="flex flex-col items-center mb-6 sm:mb-8">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-indigo-600 dark:bg-indigo-500 rounded-2xl flex items-center justify-center shadow-xl mb-3 sm:mb-4 group hover:scale-105 transition-transform duration-300 cursor-pointer">
            <GraduationCap className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Join EduFlow
          </h1>
          <p className="text-slate-400 dark:text-slate-500 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.3em] mt-1.5">
            Create academic profile
          </p>
        </div>

        {/* Glassmorphic Register Card */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-4xl sm:rounded-[2.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.05)] dark:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] p-5 sm:p-6 md:p-8 lg:p-12 border border-slate-100/50 dark:border-slate-800/50">
          <div className="mb-6 sm:mb-8 text-center">
            <h2 className="text-xl sm:text-2xl font-black text-slate-850 dark:text-white mb-2 tracking-tight">
              Create Profile
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium">
              Join our academic community.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1 sm:space-y-1.5">
                <label className="block text-[9px] sm:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                  Full Name
                </label>
                <div className="relative group">
                  <div className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors pointer-events-none">
                    <User className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Kishor Hadiya"
                    className="w-full pl-10 sm:pl-11 pr-3 sm:pr-4 py-3 sm:py-3.5 bg-slate-50/50 dark:bg-slate-950/30 border-2 border-slate-100 dark:border-slate-800/60 rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-600 dark:focus:border-indigo-500 outline-none transition-all font-bold text-slate-800 dark:text-slate-250 placeholder:text-slate-300 dark:placeholder:text-slate-700 text-sm"
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    autoComplete="off"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1 sm:space-y-1.5">
                <label className="block text-[9px] sm:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                  Portal Role
                </label>
                <div className="relative group">
                  <div className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors pointer-events-none">
                    <UserCircle className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </div>
                  <select
                    className="w-full pl-10 sm:pl-11 pr-8 sm:pr-10 py-3 sm:py-3.5 bg-slate-50/50 dark:bg-slate-950/30 border-2 border-slate-100 dark:border-slate-800/60 rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-600 dark:focus:border-indigo-500 outline-none transition-all font-black text-slate-700 dark:text-slate-300 appearance-none cursor-pointer uppercase text-[9px] sm:text-[10px] tracking-widest text-sm"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        role: e.target.value,
                        classId: "",
                      })
                    }
                    value={formData.role}
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                  </select>
                  <ChevronDown className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="space-y-1 sm:space-y-1.5">
              <label className="block text-[9px] sm:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                Email Identifier
              </label>
              <div className="relative group">
                <div className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors pointer-events-none">
                  <Mail className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </div>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full pl-10 sm:pl-11 pr-3 sm:pr-4 py-3 sm:py-3.5 bg-slate-50/50 dark:bg-slate-950/30 border-2 border-slate-100 dark:border-slate-800/60 rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-600 dark:focus:border-indigo-500 outline-none transition-all font-bold text-slate-800 dark:text-slate-250 placeholder:text-slate-300 dark:placeholder:text-slate-700 text-sm"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  autoComplete="off"
                  required
                />
              </div>
            </div>

            <div className="space-y-1 sm:space-y-1.5">
              <label className="block text-[9px] sm:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                Secure Passkey
              </label>
              <div className="relative group">
                <div className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors pointer-events-none">
                  <KeyRound className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </div>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  className="w-full pl-10 sm:pl-11 pr-3 sm:pr-4 py-3 sm:py-3.5 bg-slate-50/50 dark:bg-slate-950/30 border-2 border-slate-100 dark:border-slate-800/60 rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-600 dark:focus:border-indigo-500 outline-none transition-all font-bold text-slate-805 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-700 text-sm"
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            {formData.role === "student" && (
              <div className="space-y-1 sm:space-y-1.5 animate-in slide-in-from-top-2 duration-300">
                <label className="block text-[9px] sm:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                  Class Assignment
                </label>
                <div className="relative group">
                  <div className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors pointer-events-none">
                    <School className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </div>
                  <select
                    className="w-full pl-10 sm:pl-11 pr-8 sm:pr-10 py-3 sm:py-3.5 bg-slate-50/50 dark:bg-slate-950/30 border-2 border-slate-100 dark:border-slate-800/60 rounded-2xl focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-600 dark:focus:border-indigo-500 outline-none transition-all font-black text-slate-700 dark:text-slate-300 appearance-none cursor-pointer uppercase text-[9px] sm:text-[10px] tracking-widest text-sm"
                    onChange={(e) =>
                      setFormData({ ...formData, classId: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Academic Unit</option>
                    {classes.map((cls) => (
                      <option key={cls._id} value={cls._id}>
                        {cls.className}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 sm:py-4.5 bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white font-black text-xs sm:text-sm rounded-2xl transition-all shadow-lg shadow-indigo-600/10 dark:shadow-indigo-500/10 hover:shadow-indigo-600/20 dark:hover:shadow-indigo-500/20 flex items-center justify-center gap-2 sm:gap-3 active:scale-[0.98] disabled:opacity-70 group mt-3 sm:mt-4 cursor-pointer"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Initialize Account</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-100 dark:border-slate-800/60 text-center">
            <p className="text-slate-400 dark:text-slate-500 font-bold text-[10px] sm:text-xs tracking-tight">
              Already a member?{" "}
              <Link
                to="/login"
                className="text-indigo-600 dark:text-indigo-450 hover:underline font-black ml-1"
              >
                Log in here
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 text-center text-slate-300 dark:text-slate-700 text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.5em]">
          SECURE REGISTRATION • v2.6
        </div>
      </div>
    </div>
  );
};

export default Register;
