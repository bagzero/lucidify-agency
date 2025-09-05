"use client";

import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Adjust the import path based on your Firebase setup
import Link from 'next/link';
import Image from 'next/image';
import DashboardClientSideNav from '@/components/DashboardClientSideNav';

interface DASHBOARDClientProjectDetailsProgressProps {
    userId: string;
    projectId: string;
}

interface ProjectDetails {
    progress?: number;
    recentActivity?: string[];
    comments?: string[];
    status?: number;
    [key: string]: any;
}

const DASHBOARDClientProjectDetailsProgress = ({ userId, projectId }: DASHBOARDClientProjectDetailsProgressProps) => {
    const [projectDetails, setProjectDetails] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProjectDetails = async () => {
            if (!userId || !projectId) {
                return; // If userId or projectId is not available, do not fetch
            }

            try {
                // Reference to the specific user's project document
                const projectDocRef = doc(db, 'users', userId, 'projects', projectId);
                const projectDoc = await getDoc(projectDocRef);

                if (projectDoc.exists()) {
                    const projectData = projectDoc.data();
                    setProjectDetails(projectData); // Store entire project data in state
                } else {
                    setError('Project not found.');
                }
            } catch (err) {
                console.error('Error fetching project details:', err);
                setError('Failed to fetch project details.');
            } finally {
                setLoading(false);
            }
        };

        fetchProjectDetails();
    }, [userId, projectId]); // Include userId and projectId in the dependency array

    const handleProgressUpdate = async (newProgress: number, newActivity: string, newComment: string, newStatus: number) => {
        if (!userId || !projectId) return; // Ensure we have userId and projectId

        try {
            // Reference to the specific user's project document
            const projectDocRef = doc(db, 'users', userId, 'projects', projectId);

            // Update the progress field in Firestore
            await updateDoc(projectDocRef, {
                progress: newProgress,
                recentActivity: newActivity,
                comments: newComment,
                status: newStatus,
            });

            // Update local state to reflect new progress and activities
            setProjectDetails((prevDetails: ProjectDetails) => ({
                ...prevDetails,
                progress: newProgress, // Update the progress in the local state
                recentActivity: [...recentActivity, newActivity], // Update the local state
                comments: [...comments, newComment], // Update the local state
                status: newStatus, // Update the local state
            }));


        } catch (err) {
            console.error('Error updating progress:', err);
        }
    };

    if (loading) {
        return <div>Loading project details...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    // Access project data using projectDetails, assuming projectName and projectDescription are fields in the document
    const { projectName, progress, recentActivity, comments } = projectDetails || {};

    return (
        <div className="flex h-screen DashboardBackgroundGradient">
            {/* Left Sidebar */}
            <DashboardClientSideNav highlight="projects" />

            {/* Right Side (Main Content) */}
            <div className="flex-1 flex flex-col">
                <div className="absolute BottomGradientBorder left-0 top-[103px] w-full" />
                <div className="flex min-w-min items-center justify-between px-[50px] py-6">
                    <div className="inline-flex items-center gap-[5px]">
                        <div className="inline-flex items-center gap-[5px] opacity-40">
                            <div className="w-[15px]">
                                <Image
                                    src="/Home Icon.png"
                                    alt="Home Icon"
                                    layout="responsive"
                                    width={0}
                                    height={0}
                                />
                            </div>
                            <div className="font-light text-sm">Home</div>
                        </div>
                        <div className="inline-flex items-center gap-[5px]">
                            <div className="font-light text-sm">/ Projects</div>
                            <div className="font-light text-sm">/ {projectName}</div>
                        </div>
                    </div>
                    <div className="inline-flex items-center gap-5">
                        <div className="flex w-[55px] h-[55px] items-center justify-center gap-2.5 relative rounded-[100px] BlackGradient ContentCardShadow hover:cursor-pointer">
                            <div className="flex flex-col w-5 h-5 items-center justify-center gap-2.5 px-[3px] py-0 absolute -top-[5px] -left-[4px] bg-[#6265f0] rounded-md">
                                <div className=" font-normal text-xs">2</div>
                            </div>
                            <div className=" w-[25px]">
                                <Image
                                    src="/Notification Bell Icon.png"
                                    alt="Bell Icon"
                                    layout="responsive"
                                    width={0}
                                    height={0}
                                />
                            </div>
                        </div>
                        <Link
                            href="/dashboard/settings"
                            className="flex w-[129px] h-[55px] items-center justify-center gap-2.5 px-0 py-[15px] rounded-[15px] BlackGradient ContentCardShadow"
                        >
                            <div className="font-light text-sm">Settings</div>
                            <div className="w-[30px]">
                                <Image
                                    src="/Settings Icon.png"
                                    alt="Settings Icon"
                                    layout="responsive"
                                    width={0}
                                    height={0}
                                />
                            </div>
                        </Link>
                    </div>
                </div>

                <div className="flex w-full justify-center">
                    <div className="flex flex-col gap-[20px] relative w-full mx-[50px] my-[30px]">
                        <div className="inline-flex items-center gap-[30px] relative">
                            <Link
                                href={`/dashboard/projects/${projectId}?projectId=${projectId}&userId=${userId}`}
                                className="relative font-normal text-[#ffffff66] text-base hover:cursor-pointer">
                                Overview
                            </Link>
                            <Link
                                href={`/dashboard/projects/${projectId}/progress?projectId=${projectId}&userId=${userId}`}
                                className="relative font-normal text-base hover:cursor-pointer">
                                Progress
                            </Link>

                            <Link
                                href={`/dashboard/projects/${projectId}/uploads?projectId=${projectId}&userId=${userId}`}
                                className="relative font-normal text-[#ffffff66] text-base hover:cursor-pointer">Uploads</Link>
                            <div className="relative font-normal text-[#ffffff66] text-base hover:cursor-pointer">Analytics</div>
                            <Link
                                href={`/dashboard/projects/${projectId}/edit?projectId=${projectId}&userId=${userId}`}
                                className="relative font-normal text-[#ffffff66] text-base hover:cursor-pointer flex items-center gap-[5px]">
                                <div className="w-[15px] opacity-40">
                                    <Image
                                        src="/Edit Icon.png"
                                        alt="Edit Icon"
                                        layout="responsive"
                                        width={0}
                                        height={0}
                                    />
                                </div>
                                Edit
                            </Link>
                        </div>
                        <div className="flex justify-between">
                            <div className="inline-flex flex-col gap-[30px]">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DASHBOARDClientProjectDetailsProgress;
