"use client"

import DASHBOARDAdminProjectDetails from '@/components/DASHBOARDAdminProjectDetails';
import DASHBOARDClientProjectDetails from '@/components/DASHBOARDClientProjectDetails';
import { useAuth } from '@/context/authContext';
import { useSearchParams } from 'next/navigation'; // Assuming you're still using `useSearchParams`
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ProjectPage = () => {
  const router = useRouter();
  const { user, loading } = useAuth();  // Use your auth hook
  const searchParams = useSearchParams(); // Initialize useSearchParams
  const userId = searchParams.get('userId'); // Get userId from query parameters
  const projectId = searchParams.get('projectId'); // Get projectId from query parameters



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

  // Ensure userId and projectId exist before rendering the component
  if (!userId || !projectId) {
    return <div>Missing user or project information.</div>;
  }


  if (!user) {
    return null;  // Prevent rendering until user is confirmed
  }

  // Render correct dashboard
  return user.email === 'ayush.bhujle@gmail.com' ? (
    <DASHBOARDAdminProjectDetails userId={userId} projectId={projectId} />
  ) : (
    <DASHBOARDClientProjectDetails userId={userId} projectId={projectId} />
  );

};

export default ProjectPage;