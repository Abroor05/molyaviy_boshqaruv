import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader/Loader';

// Login bo'lgan user login/register sahifasiga kira olmaydi
const PublicRoute = () => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!user) return <Outlet />;
  return <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace />;
};

export default PublicRoute;
