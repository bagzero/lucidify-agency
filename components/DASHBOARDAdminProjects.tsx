import { useEffect, useState } from 'react';
import { collection, doc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Firestore instance
import Link from 'next/link';
import Image from 'next/image';
import DashboardAdminSideNav from './DashboardAdminSideNav';

interface Project {
    uid: string;
    projectName: string;
    progress?: string;
    logoAttachment?: string | null;
    recentActivity?: string;
    dateCreated?: string;
    comments?: string;
    approval?: string;
    paymentPlan?: number;
    weeksPaid?: number;
    dueDate?: string;
    status?: number;
}

interface User {
    displayName: string;
    email: string;
    photoURL: string;
    selectedAvatar?: string; // Add this property
}

interface UserProjects {
    userId: string;
    projects: Project[];
}

const DASHBOARDAdminProjects = () => {
    const [userProjects, setUserProjects] = useState<UserProjects[]>([]);
    const [userProfiles, setUserProfiles] = useState<{ [userId: string]: User }>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllUserProjects = async () => {
            try {
                const usersSnapshot = await getDocs(collection(db, 'users'));
                const allUserProjects: UserProjects[] = [];
                const userProfiles: { [userId: string]: User & { selectedAvatar?: string } } = {}; // Include selectedAvatar
    
                // Iterate through all users
                for (const userDoc of usersSnapshot.docs) {
                    const userId = userDoc.id;
                    const userData = userDoc.data() as User & { selectedAvatar?: string };
    
                    userProfiles[userId] = {
                        displayName: userData.displayName,
                        email: userData.email,
                        photoURL: userData.photoURL, // Fallback in case selectedAvatar is unavailable
                        selectedAvatar: userData.selectedAvatar || undefined, // Use undefined as fallback
                    };
    
                    const projectsSnapshot = await getDocs(collection(db, 'users', userId, 'projects'));
    
                    const projectsList: Project[] = [];
                    projectsSnapshot.forEach((projectDoc) => {
                        const projectData = projectDoc.data() as Project;
                        projectsList.push({
                            uid: projectDoc.id,
                            projectName: projectData.projectName || 'Unnamed Project',
                            progress: projectData.progress || '5',
                            logoAttachment: projectData.logoAttachment || null,
                            recentActivity: projectData.recentActivity || 'N/A',
                            dateCreated: projectData.dateCreated || 'N/A',
                            comments: projectData.comments || 'No new tasks',
                            approval: projectData.approval || 'Pending',
                            paymentPlan: projectData.paymentPlan || 0,
                            weeksPaid: projectData.weeksPaid || 0,
                            dueDate: projectData.dueDate || 'No deadline',
                            status: projectData.status || 1,
                        });
                    });
    
                    allUserProjects.push({ userId, projects: projectsList });
                }
    
                setUserProfiles(userProfiles);
                setUserProjects(allUserProjects);
            } catch (error) {
                console.error("Error fetching user projects: ", error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchAllUserProjects();
    }, []);
    
    if (loading) {
        return <div>Loading projects...</div>;
    }

    const handleApproval = async (userId: string, projectId: string, newStatus: 'Approved' | 'Declined') => {
        try {
            const projectRef = doc(db, 'users', userId, 'projects', projectId);

            // Determine the recentActivity message based on the newStatus
            const recentActivityMessage = newStatus === 'Approved'
                ? 'Project approved by Lucidify.'
                : 'Project declined by Lucidify.';

            await updateDoc(projectRef, {
                approval: newStatus,
                recentActivity: recentActivityMessage, // Update recentActivity field
            });

            window.location.reload(); // Refresh the page to reflect the changes
        } catch (error) {
            console.error("Error updating approval status: ", error);
        }
    };

    const handleDeleteProject = async (userId: string, projectId: string) => {

        // Confirmation dialog
        const confirmed = window.confirm("Are you sure you want to cancel this project?");
        if (!confirmed) {
            return; // Exit if the user does not confirm
        }

        try {
            // Reference to the specific project document to delete
            const projectRef = doc(db, 'users', userId, 'projects', projectId);
            await deleteDoc(projectRef);

            window.location.reload(); // Refresh the page to reflect the changes
        } catch (error) {
            alert('Error deleting project');
            console.error('Error deleting project: ', error);
        }
    };

    return (
        <div className="flex h-screen DashboardBackgroundGradient">
            {/* Left Sidebar */}
            <DashboardAdminSideNav highlight="projects" />

            {/* Right Side (Main Content) */}
            <div className="flex-1 flex flex-col"> {/* Takes up remaining space */}
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
                            <div className="font-light text-sm">
                                ADMIN
                            </div>
                        </div>
                        <div className="inline-flex items-center gap-[5px]">
                            <div className=" font-light text-sm">
                                / Projects
                            </div>
                        </div>
                    </div>
                    <div className="inline-flex items-center gap-5">
                        <div className="flex w-[55px] h-[55px] items-center justify-center gap-2.5 relative rounded-[100px] BlackGradient ContentCardShadow hover:cursor-pointer">
                            <div className="flex flex-col w-5 h-5 items-center justify-center gap-2.5 px-[3px] py-0 absolute -top-[5px] -left-[4px] bg-[#6265f0] rounded-md">
                                <div className=" font-normal text-xs">
                                    2
                                </div>
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
                            className="flex w-[129px] h-[55px] items-center justify-center gap-2.5 px-0 py-[15px]  rounded-[15px] BlackGradient ContentCardShadow">
                            <div className=" font-light text-sm">
                                Settings
                            </div>
                            <div className=" w-[30px]">
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
                    <div className="flex flex-col gap-10 relative w-full mx-[50px] my-[30px]">
                        <div className="flex flex-col gap-0.5 relative">
                            <h1 className="font-semibold text-3xl">Projects</h1>
                            <p className="text-sm text-[#ffffff99]">View and manage your projects.</p>
                        </div>

                        <div className="flex flex-wrap gap-[30px] justify-start max-h-[655px] overflow-y-auto BlackScrollbar">
                            {userProjects.map((user) =>
                                user.projects.map((project) => (
                                    <div
                                        key={project.uid}
                                        className={`${project.approval !== 'Approved' && "pointer-events-none"} relative w-full sm:w-[45%] lg:w-[23%] px-[24px] py-[20px] BlackGradient ContentCardShadow rounded-[10px] flex flex-col gap-4`}
                                    >
                                        {/* Top Section: Title and Logo */}
                                        <div className="flex justify-between items-center">
                                            <div className="flex flex-col">
                                                <h3 className="text-lg font-semibold">{project.projectName}</h3>
                                                <p className="text-[12px] text-white opacity-60">Created: {project.dateCreated}</p>
                                                <p className="text-[12px] text-white opacity-60">Due: {project.dueDate}</p>
                                            </div>
                                            {project.logoAttachment && (
                                                <div className=" w-[50px]">
                                                    <Image
                                                        src={project.logoAttachment}
                                                        alt="Settings Icon"
                                                        layout="responsive"
                                                        width={0}
                                                        height={0}
                                                    />
                                                </div>
                                            )}
                                        </div>



                                        {/* User Info and Status */}
                                        <div className="flex flex-col gap-[10px] z-20">
                                            <div className="flex justify-between items-end">
                                                <div className="relative group">
                                                    <div className="ProfileHover w-[30px] rounded-full pointer-events-auto overflow-clip">
                                                        <Image
                                                            src={"/" + userProfiles[user.userId]?.selectedAvatar || userProfiles[user.userId]?.photoURL || '/default-avatar.png'}
                                                            alt="User Profile"
                                                            layout="responsive"
                                                            width={0}
                                                            height={0}
                                                        />
                                                    </div>
                                                    <div className="ProfileDescription opacity-0 transition-opacity duration-300 ease-in-out absolute group-hover:opacity-100 MessagesHighlightGradient ContentCardShadow p-[10px] rounded-[6px] -top-[220%] left-0 flex flex-col gap-[2px]">
                                                        <span className="text-sm font-semibold">
                                                            {userProfiles[user.userId]?.displayName}
                                                        </span>
                                                        <span className="text-xs opacity-40">
                                                            {userProfiles[user.userId]?.email}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="relative font-normal text-[14px]">
                                                    {project.status === 1 && (
                                                        <div className="flex gap-[8px] items-center">
                                                            <div className="flex flex-wrap gap-[3px]">
                                                                <div className={`rounded-full bg-[#ADA0FF] w-[5px] h-[5px]`} />
                                                                <div className={`opacity-40 rounded-full bg-[#ADA0FF] w-[5px] h-[5px]`} />
                                                                <div className={`opacity-40 rounded-full bg-[#ADA0FF] w-[5px] h-[5px]`} />
                                                                <div className={`opacity-40 rounded-full bg-[#ADA0FF] w-[5px] h-[5px]`} />
                                                            </div>
                                                            <h3 className="text-[#ADA0FF]">Planning</h3>
                                                        </div>
                                                    )}
                                                    {project.status === 2 && (
                                                        <div className="flex gap-[8px] items-center">
                                                            <div className="flex flex-wrap gap-[3px]">
                                                                <div className={`rounded-full bg-[#FFD563] w-[5px] h-[5px]`} />
                                                                <div className={`rounded-full bg-[#FFD563] w-[5px] h-[5px]`} />
                                                                <div className={`opacity-40 rounded-full bg-[#FFD563] w-[5px] h-[5px]`} />
                                                                <div className={`opacity-40 rounded-full bg-[#FFD563] w-[5px] h-[5px]`} />
                                                            </div>
                                                            <h3 className="text-[#FFD563]">Designing</h3>
                                                        </div>
                                                    )}

                                                    {project.status === 3 && (
                                                        <div className="flex gap-[8px] items-center">
                                                            <div className="flex flex-wrap gap-[3px]">
                                                                <div className={`rounded-full bg-[#467CD9] w-[5px] h-[5px]`} />
                                                                <div className={`rounded-full bg-[#467CD9] w-[5px] h-[5px]`} />
                                                                <div className={`rounded-full bg-[#467CD9] w-[5px] h-[5px]`} />
                                                                <div className={`opacity-40 rounded-full bg-[#467CD9] w-[5px] h-[5px]`} />
                                                            </div>
                                                            <h3 className="text-[#6294E9]">Developing</h3>
                                                        </div>
                                                    )}

                                                    {project.status === 4 && (
                                                        <div className="flex gap-[8px] items-center">
                                                            <div className="flex flex-wrap gap-[3px]">
                                                                <div className={`rounded-full bg-[#46D999] w-[5px] h-[5px]`} />
                                                                <div className={`rounded-full bg-[#46D999] w-[5px] h-[5px]`} />
                                                                <div className={`rounded-full bg-[#46D999] w-[5px] h-[5px]`} />
                                                                <div className={`rounded-full bg-[#46D999] w-[5px] h-[5px]`} />
                                                            </div>
                                                            <h3 className="text-[#62E98F]">Launching</h3>
                                                        </div>
                                                    )}

                                                    {project.status === 5 && (
                                                        <div className="flex gap-[8px] items-center">
                                                            <h3 className="text-[#6294E9]">Maintaining</h3>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="relative flex flex-col items-end gap-[8px]">
                                                <div className="w-full h-[9px] bg-[#333741] rounded-full ContentCardLightShadow">
                                                    <div
                                                        className={`h-[9px] ContentCardLightShadow rounded-full ${project.status === 1 ? 'bg-[#ADA0FF]' :
                                                            project.status === 2 ? 'bg-[#FFD563]' :
                                                                project.status === 3 ? 'bg-[#467CD9]' :
                                                                    project.status === 4 ? 'bg-[#46D999]' :
                                                                        project.status === 5 ? 'bg-[#6294E9]' :
                                                                            'bg-[#ADA0FF]' // Fallback color if none match
                                                            }`} style={{ width: `${project.progress}%` }}
                                                    />
                                                </div>
                                                <p className="text-[14px]">
                                                    {project.progress}%
                                                </p>
                                            </div>
                                        </div>

                                        {/* View Project, Approval and Hover Section */}
                                        {project.approval === 'Pending' ? (
                                            <div className="pointer-events-auto inset-0 bg-opacity-90 flex justify-between items-center">
                                                {/* <button
                                                    className="pointer-events-auto text-[14px] px-4 py-2 rounded PopupAttentionGradient PopupAttentionShadow"
                                                    onClick={() => handleApproval(user.userId, project.uid, 'Approved')}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    className="pointer-events-auto text-[14px] ErrorGradient ContentCardShadow px-4 py-2 rounded hover:opacity-90 hover:scale-95"
                                                    onClick={() => handleApproval(user.userId, project.uid, 'Declined')}
                                                >
                                                    Decline
                                                </button> */}
                                                <button
                                                    className="button-86 button-approve hover:cursor-pointer pointer-events-auto" role="button"
                                                    onClick={() => handleApproval(user.userId, project.uid, 'Approved')}>
                                                    Approve
                                                </button>
                                                <button
                                                    className="button-86 button-decline hover:cursor-pointer pointer-events-auto" role="button"
                                                    onClick={() => handleApproval(user.userId, project.uid, 'Declined')}>
                                                    Decline
                                                </button>
                                            </div>
                                        ) : project.approval === 'Declined' ? (
                                            <div className="pointer-events-auto inset-0 bg-opacity-90 flex justify-between items-center">
                                                <button
                                                    className="button-86 button-override hover:cursor-pointer pointer-events-auto" role="button"
                                                    onClick={() => handleApproval(user.userId, project.uid, 'Approved')}>
                                                    Reapprove
                                                </button>
                                                <div className="body">
                                                    <div className="container container2">
                                                        <div className="btn" style={{ width: `100px`, height: '40px' }}><a className="hover:cursor-pointer" onClick={() => handleDeleteProject(user.userId, project.uid)}>Delete</a></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : project.approval === 'Approved' ? (
                                            <div className="inset-0 bg-opacity-90 flex justify-between items-center">

                                                <div className="body">
                                                    <div className="container container1">
                                                        <div className="btn" style={{ width: `140px`, height: '40px' }}>
                                                            <a href={`/dashboard/projects/${project.uid}?projectId=${project.uid}&userId=${user.userId}`}>
                                                                View Project
                                                                <div className="-rotate-45 w-[12px] ml-[4px] rounded-full pointer-events-auto overflow-clip">
                                                                    <Image
                                                                        src="/White Top Right Arrow.png"
                                                                        alt="Right Arrow"
                                                                        layout="responsive"
                                                                        width={0}
                                                                        height={0}
                                                                    />
                                                                </div>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="body">
                                                    <div className="container container2">
                                                        <div className="btn" style={{ width: `100px`, height: '40px' }}><a className="hover:cursor-pointer" onClick={() => handleDeleteProject(user.userId, project.uid)}>Delete</a></div>
                                                    </div>
                                                </div>

                                                {/* <button
                                                    className="pointer-events-auto text-[14px] bg-red-500 px-4 py-2 rounded"
                                                    onClick={() => handleDeleteProject(user.userId, project.uid)}
                                                >
                                                    Delete
                                                </button> */}
                                            </div>
                                        ) : null}
                                    </div>

                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default DASHBOARDAdminProjects;
