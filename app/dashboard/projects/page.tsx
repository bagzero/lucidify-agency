"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminDashboard from '@/components/DASHBOARDAdminProjects';
import ClientDashboard from '@/components/DASHBOARDClientProjects';
import { useAuth } from '@/context/authContext';

const DashboardPage = () => {
  const router = useRouter();
  const { user, loading } = useAuth();  // Use your auth hook

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');  // Redirect to login if no user is logged in
      } else {
        // Check if the user is admin based on their email
        if (user.email === 'ayush.bhujle@gmail.com') {
          // Admin
        } else {
          // Client
        }
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;  // Prevent rendering until user is confirmed
  }

  // Render correct dashboard
  return user.email === 'ayush.bhujle@gmail.com' ? (
    <AdminDashboard />
  ) : (
    <ClientDashboard />
  );
};

export default DashboardPage;
