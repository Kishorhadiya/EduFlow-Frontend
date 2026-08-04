import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const PrivateRoute = ({ roles }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div className="p-8">Loading...</div>;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (roles && !roles.includes(user.role)) {
        const target = user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard';
        return <Navigate to={target} replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;