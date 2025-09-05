"use client";

import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Adjust the import path based on your Firebase setup
import Link from 'next/link';
import Image from 'next/image';
import DashboardAdminSideNav from '@/components/DashboardAdminSideNav';

interface DASHBOARDAdminProjectDetailsProgressProps {
    userId: string;
    projectId: string;
}

interface ProjectDetails {
    progress: number;
    recentActivity: string[];
    comments: string[];
    status: number;
    [key: string]: any; // Allow additional fields if necessary
}

const DASHBOARDAdminProjectDetailsProgress = ({ userId, projectId }: DASHBOARDAdminProjectDetailsProgressProps) => {
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
            setProjectDetails((prevDetails: ProjectDetails | null) => {
                if (!prevDetails) return null;

                return {
                    ...prevDetails,
                    progress: newProgress,
                    recentActivity: [...(prevDetails.recentActivity || []), newActivity],
                    comments: [...(prevDetails.comments || []), newComment],
                    status: newStatus,
                };
            });


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
            <DashboardAdminSideNav highlight="projects" />

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
                            <div className="font-light text-sm">ADMIN</div>
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
                        </div>
                        <div className="flex justify-between">
                            <div className="inline-flex flex-col gap-[30px]">
                                <div className="w-full inline-flex flex-col gap-[30px] px-[35px] py-[20px] BlackGradient ContentCardShadow rounded-[15px]">
                                    <div className="inline-flex flex-col items-start gap-2.5">
                                        <div className="flex gap-[50px] items-center">
                                            <p className="text-[24px] font-semibold">
                                                Progress Update Station
                                            </p>
                                            <div className="text-sm opacity-70">• Current Progress: {progress}%</div>
                                        </div>
                                        <div className="flex flex-wrap gap-[15px_20px] w-full justify-center">
                                            <button
                                                type="button"
                                                onClick={() => handleProgressUpdate(10, "Gathering website details", "Message Lucidify for anything you want to tell us!", 1)}
                                                className={`relative flex justify-center items-center px-4 py-2 rounded-[10px] text-white text-[12px] ${progress >= 10
                                                    ? 'PopupAttentionGradient PopupAttentionShadow'
                                                    : 'BlackGradient ContentCardShadow'
                                                    }`}
                                            >
                                                <div className={`opacity-0 flex hover:opacity-100 absolute bg-[#1A1A1A] bg-opacity-60 rounded-[10px] w-full h-full items-center justify-center`}>
                                                    <div className={`${progress >= 10
                                                        ? 'BlackGradient ContentCardShadow'
                                                        : 'PopupAttentionGradient PopupAttentionShadow'} rounded-[10px] px-[8px] py-[4px]`}>
                                                        10%
                                                    </div>
                                                </div>
                                                Gathering Website Details
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleProgressUpdate(15, "Lucidify is designing the web designs", "Message us for any preferences (color scheme, layout)", 2)}
                                                className={`relative flex justify-center items-center px-4 py-2 rounded-[10px] text-white text-[12px] ${progress >= 15
                                                    ? 'PopupAttentionGradient PopupAttentionShadow'
                                                    : 'BlackGradient ContentCardShadow'
                                                    }`}
                                            >
                                                <div className={`opacity-0 flex hover:opacity-100 absolute bg-[#1A1A1A] bg-opacity-60 rounded-[10px] w-full h-full items-center justify-center`}>
                                                    <div className={`${progress >= 15
                                                        ? 'BlackGradient ContentCardShadow'
                                                        : 'PopupAttentionGradient PopupAttentionShadow'} rounded-[10px] px-[8px] py-[4px]`}>
                                                        15%
                                                    </div>
                                                </div>
                                                Working on Web Designs
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleProgressUpdate(25, "Lucidify has sent the web designs", "Take a look at the web designs and select", 2)}
                                                className={`relative flex justify-center items-center px-4 py-2 rounded-[10px] text-white text-[12px] ${progress >= 25
                                                    ? 'PopupAttentionGradient PopupAttentionShadow'
                                                    : 'BlackGradient ContentCardShadow'
                                                    }`}
                                            >
                                                <div className={`opacity-0 flex hover:opacity-100 absolute bg-[#1A1A1A] bg-opacity-60 rounded-[10px] w-full h-full items-center justify-center`}>
                                                    <div className={`${progress >= 25
                                                        ? 'BlackGradient ContentCardShadow'
                                                        : 'PopupAttentionGradient PopupAttentionShadow'} rounded-[10px] px-[8px] py-[4px]`}>
                                                        25%
                                                    </div>
                                                </div>
                                                Web Designs Sent
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleProgressUpdate(35, "Web Designs have been selected and completed", "Please start the payments to Lucidify (message Lucidify for any questions)", 2)}
                                                className={`relative flex justify-center items-center px-4 py-2 rounded-[10px] text-white text-[12px] ${progress >= 35
                                                    ? 'PopupAttentionGradient PopupAttentionShadow'
                                                    : 'BlackGradient ContentCardShadow'
                                                    }`}
                                            >
                                                <div className={`opacity-0 flex hover:opacity-100 absolute bg-[#1A1A1A] bg-opacity-60 rounded-[10px] w-full h-full items-center justify-center`}>
                                                    <div className={`${progress >= 35
                                                        ? 'BlackGradient ContentCardShadow'
                                                        : 'PopupAttentionGradient PopupAttentionShadow'} rounded-[10px] px-[8px] py-[4px]`}>
                                                        35%
                                                    </div>
                                                </div>
                                                Web Designs Completed
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleProgressUpdate(45, "Payments have been started", "Thank you! Lucidify will start developing the project soon", 2)}
                                                className={`relative flex justify-center items-center px-4 py-2 rounded-[10px] text-white text-[12px] ${progress >= 45
                                                    ? 'PopupAttentionGradient PopupAttentionShadow'
                                                    : 'BlackGradient ContentCardShadow'
                                                    }`}
                                            >
                                                <div className={`opacity-0 flex hover:opacity-100 absolute bg-[#1A1A1A] bg-opacity-60 rounded-[10px] w-full h-full items-center justify-center`}>
                                                    <div className={`${progress >= 45
                                                        ? 'BlackGradient ContentCardShadow'
                                                        : 'PopupAttentionGradient PopupAttentionShadow'} rounded-[10px] px-[8px] py-[4px]`}>
                                                        45%
                                                    </div>
                                                </div>
                                                Payments Started
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleProgressUpdate(50, "Website is being developed", "Message Lucidify for any questions or preferences", 3)}
                                                className={`relative flex justify-center items-center px-4 py-2 rounded-[10px] text-white text-[12px] ${progress >= 50
                                                    ? 'PopupAttentionGradient PopupAttentionShadow'
                                                    : 'BlackGradient ContentCardShadow'
                                                    }`}
                                            >
                                                <div className={`opacity-0 flex hover:opacity-100 absolute bg-[#1A1A1A] bg-opacity-60 rounded-[10px] w-full h-full items-center justify-center`}>
                                                    <div className={`${progress >= 50
                                                        ? 'BlackGradient ContentCardShadow'
                                                        : 'PopupAttentionGradient PopupAttentionShadow'} rounded-[10px] px-[8px] py-[4px]`}>
                                                        50%
                                                    </div>
                                                </div>
                                                Development Started
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleProgressUpdate(65, "Website is half developed", "Message Lucidify for any questions or preferences", 3)}
                                                className={`relative flex justify-center items-center px-4 py-2 rounded-[10px] text-white text-[12px] ${progress >= 65
                                                    ? 'PopupAttentionGradient PopupAttentionShadow'
                                                    : 'BlackGradient ContentCardShadow'
                                                    }`}
                                            >
                                                <div className={`opacity-0 flex hover:opacity-100 absolute bg-[#1A1A1A] bg-opacity-60 rounded-[10px] w-full h-full items-center justify-center`}>
                                                    <div className={`${progress >= 65
                                                        ? 'BlackGradient ContentCardShadow'
                                                        : 'PopupAttentionGradient PopupAttentionShadow'} rounded-[10px] px-[8px] py-[4px]`}>
                                                        65%
                                                    </div>
                                                </div>
                                                Development Midway
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleProgressUpdate(80, "Website is fully developed, soon to be hosted", "Message Lucidify for any questions or preferences", 3)}
                                                className={`relative flex justify-center items-center px-4 py-2 rounded-[10px] text-white text-[12px] ${progress >= 80
                                                    ? 'PopupAttentionGradient PopupAttentionShadow'
                                                    : 'BlackGradient ContentCardShadow'
                                                    }`}
                                            >
                                                <div className={`opacity-0 flex hover:opacity-100 absolute bg-[#1A1A1A] bg-opacity-60 rounded-[10px] w-full h-full items-center justify-center`}>
                                                    <div className={`${progress >= 80
                                                        ? 'BlackGradient ContentCardShadow'
                                                        : 'PopupAttentionGradient PopupAttentionShadow'} rounded-[10px] px-[8px] py-[4px]`}>
                                                        80%
                                                    </div>
                                                </div>
                                                Development Finished
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleProgressUpdate(90, "Website has been hosted", "We have sent you the url for your website", 4)}
                                                className={`relative flex justify-center items-center px-4 py-2 rounded-[10px] text-white text-[12px] ${progress >= 90
                                                    ? 'PopupAttentionGradient PopupAttentionShadow'
                                                    : 'BlackGradient ContentCardShadow'
                                                    }`}
                                            >
                                                <div className={`opacity-0 flex hover:opacity-100 absolute bg-[#1A1A1A] bg-opacity-60 rounded-[10px] w-full h-full items-center justify-center`}>
                                                    <div className={`${progress >= 90
                                                        ? 'BlackGradient ContentCardShadow'
                                                        : 'PopupAttentionGradient PopupAttentionShadow'} rounded-[10px] px-[8px] py-[4px]`}>
                                                        90%
                                                    </div>
                                                </div>
                                                Website Hosted
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleProgressUpdate(99, "Project complete", "Message us for any questions", 4)}
                                                className={`relative flex justify-center items-center px-4 py-2 rounded-[10px] text-white text-[12px] ${progress >= 99
                                                    ? 'PopupAttentionGradient PopupAttentionShadow'
                                                    : 'BlackGradient ContentCardShadow'
                                                    }`}
                                            >
                                                <div className={`opacity-0 flex hover:opacity-100 absolute bg-[#1A1A1A] bg-opacity-60 rounded-[10px] w-full h-full items-center justify-center`}>
                                                    <div className={`${progress >= 99
                                                        ? 'BlackGradient ContentCardShadow'
                                                        : 'PopupAttentionGradient PopupAttentionShadow'} rounded-[10px] px-[8px] py-[4px]`}>
                                                        99%
                                                    </div>
                                                </div>
                                                Project Completed
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleProgressUpdate(100, "Website is being maintained", "No new tasks", 5)}
                                                className={`relative flex justify-center items-center px-4 py-2 rounded-[10px] text-white text-[12px] ${progress >= 100
                                                    ? 'PopupAttentionGradient PopupAttentionShadow'
                                                    : 'BlackGradient ContentCardShadow'
                                                    }`}
                                            >
                                                <div className={`opacity-0 flex hover:opacity-100 absolute bg-[#1A1A1A] bg-opacity-60 rounded-[10px] w-full h-full items-center justify-center`}>
                                                    <div className={`${progress >= 100
                                                        ? 'BlackGradient ContentCardShadow'
                                                        : 'PopupAttentionGradient PopupAttentionShadow'} rounded-[10px] px-[8px] py-[4px]`}>
                                                        100%
                                                    </div>
                                                </div>
                                                Maintaining
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DASHBOARDAdminProjectDetailsProgress;
