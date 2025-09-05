"use client";

import { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Adjust the import path based on your Firebase setup
import Link from 'next/link';
import Image from 'next/image';
import DashboardAdminSideNav from '@/components/DashboardAdminSideNav';
import CreateWebDesignPopup from './CreateWebDesignPopup';

interface DASHBOARDAdminProjectDetailsUploadsProps {
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

interface Design {
    designName: string;
    designDescription: string;
    designURL: string;
    designPage: "Sections" | "Full-Page";
    designType: string;
    dateCreated: string;
    selectedDesign?: boolean;
}

const DASHBOARDAdminProjectDetailsUploads = ({ userId, projectId }: DASHBOARDAdminProjectDetailsUploadsProps) => {
    const [projectDetails, setProjectDetails] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPage, setSelectedPage] = useState("Sections");
    const [sectionsCount, setSectionsCount] = useState(0);
    const [fullPageCount, setFullPageCount] = useState(0);
    const [designs, setDesigns] = useState<Design[]>([]);
    const [isCreateWebDesignPopupOpen, setIsCreateWebDesignPopupOpen] = useState(false);

    const toggleCreateWebDesignPopup = () => {
        setIsCreateWebDesignPopupOpen(!isCreateWebDesignPopupOpen);
    };

    useEffect(() => {
        async function fetchData() {
            const basePath = `users/${userId}/projects/${projectId}`;
            let sectionDocs: Design[] = [];
            let fullPageDocs: Design[] = [];

            try {
                // Fetch Section Web Designs
                const sectionsCollection = collection(db, `${basePath}/section web designs`);
                const sectionsSnapshot = await getDocs(sectionsCollection);
                sectionDocs = sectionsSnapshot.docs.map((doc) => doc.data() as Design);
                setSectionsCount(sectionDocs.length);
            } catch {
                setSectionsCount(0); // Handle case where "section web designs" doesn't exist
            }

            try {
                // Fetch Full-Page Web Designs
                const fullPageCollection = collection(db, `${basePath}/full-page web designs`);
                const fullPageSnapshot = await getDocs(fullPageCollection);
                fullPageDocs = fullPageSnapshot.docs.map((doc) => doc.data() as Design);
                setFullPageCount(fullPageDocs.length);
            } catch {
                setFullPageCount(0); // Handle case where "full-page web designs" doesn't exist
            }

            // Set designs based on the selected page
            setDesigns(selectedPage === "Sections" ? sectionDocs : fullPageDocs);
        }

        fetchData();
    }, [selectedPage, userId, projectId]);


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
            <CreateWebDesignPopup
                closeCreatProjectPopup={toggleCreateWebDesignPopup}
                isVisible={isCreateWebDesignPopupOpen}
                userId={userId}
                projectId={projectId} // Pass the projectId here
            />
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
                                className="relative font-normal text-[#ffffff66] text-base hover:cursor-pointer">
                                Progress
                            </Link>
                            <Link
                                href={`/dashboard/projects/${projectId}/uploads?projectId=${projectId}&userId=${userId}`}
                                className="relative font-normal text-base hover:cursor-pointer">Uploads</Link>
                            <div className="relative font-normal text-[#ffffff66] text-base hover:cursor-pointer">Analytics</div>
                        </div>
                        <div className="flex flex-col w-full CardGradient ContentCardShadow rounded-[15px]">
                            <div className="mx-[35px] my-[25px] flex flex-col">
                                <h1 className="text-[24px] font-semibold ">Website Design Upload Station</h1>
                                <div className="flex justify-between items-end mb-[20px]">
                                    <div className="flex gap-[30px]">
                                        <button
                                            onClick={() => setSelectedPage("Sections")}
                                            className={`flex gap-[10px] items-center ${selectedPage === "Full-Page" ? "opacity-50" : "opacity-100"}`}>
                                            <div className="PopupAttentionGradient PopupAttentionShadow rounded-[7px] flex justify-center items-center w-[20px] h-[20px]">
                                                <h3 className="mx-[8px] text-[11px]">{sectionsCount}</h3>
                                            </div>
                                            <h3 className="text-[15px]">Sections</h3>
                                        </button>
                                        <button
                                            onClick={() => setSelectedPage("Full-Page")}
                                            className={`flex gap-[10px] items-center ${selectedPage === "Sections" ? "opacity-50" : "opacity-100"}`}>
                                            <div className="PopupAttentionGradient PopupAttentionShadow rounded-[7px] flex justify-center items-center w-[20px] h-[20px]">
                                                <h3 className="mx-[8px] text-[11px]">{fullPageCount}</h3>
                                            </div>
                                            <h3 className="text-[15px]">Full-Page</h3>
                                        </button>
                                    </div>
                                    <button className="flex flex-col w-[149px] h-[41px] items-center justify-center gap-2.5 px-[18px] py-2 relative rounded-[10px] ContentCardShadow AddProjectGradient hover:cursor-pointer"
                                        onClick={toggleCreateWebDesignPopup}
                                    >
                                        <div className="inline-flex items-center gap-2.5 relative "
                                        >

                                            <div className=" w-[15px]">
                                                <Image
                                                    src="/Plus Icon.png"
                                                    alt="Plus Icon"
                                                    layout="responsive"
                                                    width={0}
                                                    height={0}
                                                />
                                            </div>
                                            <div>
                                                {/* Add Design Button */}
                                                <div
                                                    className="relative font-normal text-[15px] text-center cursor-pointer"
                                                >
                                                    Add design
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-4">
                                    {designs.length > 0 ? (
                                        designs.map((design, index) => (
                                            <div
                                                key={index}
                                                className="flex flex-col w-[30%] px-[25px] py-[20px] BlackWithLightGradient ContentCardShadow rounded-[10px]"
                                            >
                                                <div className="flex flex-col gap-[20px]">
                                                    <div className=" w-full rounded-[10px] overflow-hidden shadow-[rgba(255,255,255,0.05)] shadow-xl">
                                                        <Image
                                                            src={design.designURL} // Access the designURL
                                                            alt={`Design ${index + 1}`}
                                                            layout="responsive"
                                                            width={0}
                                                            height={0}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-[15px]">
                                                        <div className="flex justify-between">
                                                            <h3 className="font-semibold text-[17px]">{design.designName}</h3>
                                                            <div className="PopupAttentionGradient PopupAttentionShadow rounded-[7px]">
                                                                <h3 className="mx-[15px] my-[3px] text-[13px] tracking-[0.1px]">{design.designType}</h3>
                                                            </div>
                                                        </div>
                                                        <h3 className="font-light text-[13px]">{design.designDescription}</h3>
                                                        <div className="flex gap-[10px]">
                                                            <div className="w-[15px] flex items-center">
                                                                <Image
                                                                    src="/Calendar Icon.png" // Access the designURL
                                                                    alt={`Design ${index + 1}`}
                                                                    layout="responsive"
                                                                    width={0}
                                                                    height={0}
                                                                />
                                                            </div>
                                                            <h3 className="opacity-60 text-[13px] font-light">Uploaded on {design.dateCreated}</h3>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No designs available</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DASHBOARDAdminProjectDetailsUploads;