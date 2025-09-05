import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { auth, db } from '../firebaseConfig'; // Firestore instance
import DashboardClientSideNav from './DashboardClientSideNav';
import Image from 'next/image';
import Link from 'next/link';
import CreateProjectPopup from './CreateProjectPopup';

interface Project {
    uid: string;
    projectName: string;
    logoAttachment: string | null;
    progress?: string;
    recentActivity?: string;
    dateCreated?: string;
    comments?: string;
    approval?: string;
    paymentPlan?: number;
    weeksPaid?: number;
    dueDate?: string;
    status?: number;
}




const DASHBOARDClientProjects = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true); // To handle loading state
    const [firstName, setFirstName] = useState<string | null>(null);
    const [isCreateProjectPopupOpen, setIsCreateProjectPopupOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    const toggleCreateProjectPopup = () => {
        setIsCreateProjectPopupOpen(!isCreateProjectPopupOpen);
    };

    const handleDeleteProject = async (uid: string) => {
        const user = auth.currentUser;

        if (!user) {
            alert('User is not logged in');
            return;
        }

        // Confirmation dialog
        const confirmed = window.confirm("Are you sure you want to cancel this project?");
        if (!confirmed) {
            return; // Exit if the user does not confirm
        }

        try {
            // Reference to the specific project document to delete
            const projectRef = doc(db, "users", user.uid, "projects", uid);
            await deleteDoc(projectRef);
            // Optionally refresh the project list
            setProjects(projects.filter((project) => project.uid !== uid));
        } catch (error) {
            alert('Error deleting project');
            console.error('Error deleting project: ', error);
        }
    };

    const auth = getAuth();
    const router = useRouter();
    const user = auth.currentUser;

    useEffect(() => {
        const fetchProjects = async () => {

            if (!user) {
                // Redirect to login page if user is not authenticated
                router.push('/login');
                return;
            }

            try {
                // Fetch the projects subcollection under the current user's document
                const projectsRef = collection(db, "users", user.uid, "projects");
                const projectsSnapshot = await getDocs(projectsRef);

                const projectsList: Project[] = [];
                projectsSnapshot.forEach((doc) => {
                    const projectData = doc.data() as Project;
                    projectsList.push({
                        uid: doc.id, // Add this line to get the document ID
                        projectName: projectData.projectName || 'Unnamed Project',
                        logoAttachment: projectData.logoAttachment || null,
                        progress: projectData.progress || '5',
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

                setProjects(projectsList);
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [auth, router]);

    return (
        <div className="flex h-screen DashboardBackgroundGradient">
            <CreateProjectPopup closeCreatProjectPopup={toggleCreateProjectPopup} isVisible={isCreateProjectPopupOpen} />

            {/* Left Sidebar */}
            <DashboardClientSideNav highlight="projects" />

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
                                Home
                            </div>
                        </div>
                        <div className="inline-flex items-center gap-[5px]">
                            <div className=" font-light text-sm">
                                / Projects
                            </div>
                        </div>
                    </div>
                    <div className="inline-flex items-center gap-5">
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="flex w-[55px] h-[55px] items-center justify-center gap-2.5 rounded-[100px] BlackGradient ContentCardShadow">
                                <div className="flex flex-col w-5 h-5 items-center justify-center gap-2.5 px-[3px] py-0 absolute -top-[5px] -left-[4px] bg-[#6265f0] rounded-md">
                                    <div className=" font-normal text-xs">
                                        2
                                    </div>
                                </div>
                                <div className="w-[25px]">
                                    <Image
                                        src="/Notification Bell Icon.png"
                                        alt="Bell Icon"
                                        layout="responsive"
                                        width={0}
                                        height={0}
                                    />
                                </div>

                            </button>
                            <div className={`${showNotifications ? "opacity-100 translate-y-[0px]" : "pointer-events-none opacity-0 translate-y-[50px]"} absolute top-[65px] z-20 right-[0px] w-[300px] min-h-[200px] max-h-[250px] BlackGradient ContentCardShadow rounded-[15px]`}>
                                <div className="pt-[10px] pb-[10px]">
                                    <h1 className="px-[20px] text-[18px] font-medium tracking-[0.5px] pb-[10px]">Notifications</h1>
                                    <div className="h-[0.5px] w-full BottomGradientBorder"></div>
                                </div>
                                <div className="px-[10px] flex items-start">
                                    <button className="rounded-[10px] w-full hover:bg-[rgba(255,255,255,.07)] px-[10px] py-[11px] my-[2px] flex">

                                        <div className="w-[20px] flex mt-[7px]">
                                            <div className="PopupAttentionGradient PopupAttentionShadow rounded-full w-[6px] h-[6px]"></div>
                                        </div>
                                        <div className="flex flex-col">

                                            <h2 className="font-light text-[14px]"><span className="font-medium">Lucidify</span> sent a message</h2>
                                            <div className="flex">
                                                <h3 className="text-[11px] font-light opacity-70">2 hours ago •&nbsp;</h3>
                                                <h3 className="text-[11px] font-light opacity-70">Messages</h3>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                                <div className="px-[10px]  flex items-start">
                                    <button className="rounded-[10px] w-full hover:bg-[rgba(255,255,255,.07)] px-[10px] py-[11px] my-[2px] flex">
                                        <div className="w-[20px] flex mt-[7px]">
                                            <div className="PopupAttentionGradient PopupAttentionShadow rounded-full w-[6px] h-[6px]"></div>
                                        </div>
                                        <div className="flex flex-col">

                                            <h2 className="font-light text-[14px]">Your <span className="font-medium">project </span>has been <span className="font-medium">approved!</span></h2>
                                            <div className="flex">
                                                <h3 className="text-[11px] font-light opacity-70">17 hours ago •&nbsp;</h3>
                                                <h3 className="text-[11px] font-light opacity-70">Projects</h3>
                                            </div>
                                        </div>
                                    </button>
                                </div>
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
                    <div className="flex flex-col items-end gap-10 relative w-full mx-[50px] my-[30px]">
                        <div className="flex items-center gap-[1033px] relative self-stretch w-full ">
                            <div className="flex flex-col gap-0.5 relative">
                                <div className="relative self-stretch font-semibold text-3xl">
                                    Projects
                                </div>
                                <p className="relative self-stretch font-normal text-[#ffffff99] text-sm">
                                    View and manage your projects.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col items-start relative self-stretch w-full ">
                            <div className="flex items-center justify-between relative self-stretch w-full mb-[27px]">
                                <div className="inline-flex items-center gap-[30px] relative ">
                                    <div className="relative font-normal text-base hover:cursor-pointer">
                                        Current
                                    </div>
                                    <div className="relative font-normal text-[#ffffff66] text-base hover:cursor-pointer">
                                        Past
                                    </div>
                                </div>
                                <div className="flex flex-col w-[149px] h-[41px] items-center justify-center gap-2.5 px-[18px] py-2 relative rounded-[10px] ContentCardShadow AddProjectGradient hover:cursor-pointer" onClick={toggleCreateProjectPopup}>
                                    <div className="inline-flex items-center gap-2.5 relative ">
                                        <div className=" w-[15px]">
                                            <Image
                                                src="/Plus Icon.png"
                                                alt="Plus Icon"
                                                layout="responsive"
                                                width={0}
                                                height={0}
                                            />
                                        </div>
                                        <div className="relative font-normal text-[15px] text-center">
                                            Add project
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center relative w-full mb-[10px] text-[#ffffff99] text-sm">
                                <h3 className="ml-[100px] w-[260px]">
                                    Name
                                </h3>
                                <h3 className="w-[190px]">
                                    Recent Activity
                                </h3>
                                <h3 className="w-[180px]">
                                    Comments
                                </h3>
                                <h3 className="w-[200px]">
                                    Status
                                </h3>
                                <h3 className="w-[170px]">
                                    Progress
                                </h3>
                                <h3 className="w-[210px]">
                                    Payment Status
                                </h3>
                                <h3 className="">
                                    Deadline
                                </h3>
                            </div>

                            {/* LIST OF PROJECTS */}
                            <div className="flex flex-col items-center gap-[20px] relative self-stretch w-full">
                                <div className="flex flex-col gap-[20px] max-h-[400px] overflow-y-auto BlackScrollbar">
                                    {loading ? (
                                        <div className=" py-[34px] opacity-60">Loading projects...</div>
                                    ) : projects.length > 0 ? (
                                        projects.map((project, index) => (
                                            <div
                                                key={index}
                                                className={`${project.approval === "Pending" ? "TransparentBlackWithLightGradient" : "BlackWithLightGradient"} flex justify-center items-center relative self-stretch w-full rounded-[10px] ContentCardShadow`}
                                            >
                                                {project.approval === "Pending" && (
                                                    <div className="flex absolute z-10 gap-[25px]">
                                                        <div className="flex justify-center items-center rounded-full PendingGradient">
                                                            <div className="text-[14px] font-semibold px-[15px] py-[5px]">Pending Approval</div>
                                                        </div>
                                                        <div className="flex justify-center items-center rounded-full bg-[#1A1A1A] hover:bg-[#F13F5E] ContentCardShadow">
                                                            <div className="text-[14px] font-light px-[22px] py-[8px] hover:cursor-pointer" onClick={() => handleDeleteProject(project.uid)}>
                                                                Cancel Project
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {project.approval === "Approved" && user && (
                                                    <Link
                                                        href={`/dashboard/projects/${project.uid}?projectId=${project.uid}&userId=${user.uid}`}
                                                        className="ClientProjectHover flex absolute z-10 gap-[25px] w-full h-full justify-center items-center hover:bg-black hover:bg-opacity-60 rounded-[10px]"
                                                    >
                                                        <div className="ClientProject opacity-0 hover:scale-95 rounded-full BlackWithLightGradient ContentCardShadow flex justify-center items-center gap-[8px]">
                                                            <h3 className="pl-[18px] text-[15px] font-light">View Project</h3>
                                                            <div className="PopupAttentionGradient PopupAttentionShadow p-[10px] rounded-full">
                                                                <div className="w-[17px] rotate-[135deg]">
                                                                    <Image
                                                                        src="/Left White Arrow.png"
                                                                        alt="Logo Icon"
                                                                        layout="responsive"
                                                                        width={0}
                                                                        height={0}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                )}

                                                <div className={`${project.approval === "Pending" && "opacity-50"} flex items-center py-[26px] gap-[20px]`}>
                                                    <div className="ml-[30px] mr-[10px] w-[40px]">
                                                        <Image
                                                            src={project.logoAttachment != null ? project.logoAttachment : "/Lucidify Umbrella.png"}
                                                            alt="Lucidify Logo"
                                                            layout="responsive"
                                                            width={0}
                                                            height={0}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col w-[220px] mr-[20px] relative font-normal text-[13px]">
                                                        {project.projectName}
                                                        <div className="flex opacity-40 items-center gap-[5px] font-light">
                                                            <div className="w-[10px] h-[10px] rounded-full">
                                                                <Image
                                                                    src="/Calendar Icon.png"
                                                                    alt="Calendar Icon"
                                                                    layout="responsive"
                                                                    width={0}
                                                                    height={0}
                                                                />
                                                            </div>
                                                            <div className="">Created on {project.dateCreated}</div>
                                                        </div>
                                                    </div>
                                                    <div className="w-[170px] relative font-normal text-sm">
                                                        {project.recentActivity}
                                                    </div>
                                                    <div className="w-[160px] relative font-normal text-sm">
                                                        {project.comments}
                                                    </div>
                                                    <div className="w-[180px] relative font-normal text-sm">
                                                        {project.status === 1 && (
                                                            <div className="inline-flex bg-[#5E49E2] border border-solid border-[#7B67FF] rounded-[4px]">
                                                                <div className="flex px-[8px] py-[4px] gap-[8px] items-center">
                                                                    <div className="flex flex-wrap gap-[1px] w-[13px] h-[13px]">
                                                                        <div className={`rounded-[1px] bg-[#ADA0FF] w-[6px] h-[6px]`} />
                                                                        <div className={`opacity-40 rounded-[1px] bg-[#ADA0FF] w-[6px] h-[6px]`} />
                                                                        <div className={`opacity-40 rounded-[1px] bg-[#ADA0FF] w-[6px] h-[6px]`} />
                                                                        <div className={`opacity-40 rounded-[1px] bg-[#ADA0FF] w-[6px] h-[6px]`} />
                                                                    </div>
                                                                    <h3 className="text-[#ADA0FF] text-[16px]">Planning</h3>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {project.status === 2 && (
                                                            <div className="inline-flex bg-[#A9671C] border border-solid border-[#B56A20] rounded-[4px]">
                                                                <div className="flex px-[8px] py-[4px] gap-[8px] items-center">
                                                                    <div className="flex flex-wrap gap-[1px] w-[13px] h-[13px]">
                                                                        <div className={`rounded-[1px] bg-[#FFD563] w-[6px] h-[6px]`} />
                                                                        <div className={`rounded-[1px] bg-[#FFD563] w-[6px] h-[6px]`} />
                                                                        <div className={`opacity-40 rounded-[1px] bg-[#FFD563] w-[6px] h-[6px]`} />
                                                                        <div className={`opacity-40 rounded-[1px] bg-[#FFD563] w-[6px] h-[6px]`} />
                                                                    </div>
                                                                    <h3 className="text-[#FFD563] text-[16px]">Designing</h3>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {project.status === 3 && (
                                                            <div className="inline-flex bg-[#102A56] border border-solid border-[#153B84] rounded-[4px]">
                                                                <div className="flex px-[8px] py-[4px] gap-[8px] items-center">
                                                                    <div className="flex flex-wrap gap-[1px] w-[13px] h-[13px]">
                                                                        <div className={`rounded-[1px] bg-[#467CD9] w-[6px] h-[6px]`} />
                                                                        <div className={`rounded-[1px] bg-[#467CD9] w-[6px] h-[6px]`} />
                                                                        <div className={`rounded-[1px] bg-[#467CD9] w-[6px] h-[6px]`} />
                                                                        <div className={`opacity-40 rounded-[1px] bg-[#467CD9] w-[6px] h-[6px]`} />
                                                                    </div>
                                                                    <h3 className="text-[#6294E9] text-[16px]">Developing</h3>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {project.status === 4 && (
                                                            <div className="inline-flex bg-[#105625] border border-solid border-[#27733E] rounded-[4px]">
                                                                <div className="flex px-[8px] py-[4px] gap-[8px] items-center">
                                                                    <div className="flex flex-wrap gap-[1px] w-[13px] h-[13px]">
                                                                        <div className={`rounded-[1px] bg-[#46D999] w-[6px] h-[6px]`} />
                                                                        <div className={`rounded-[1px] bg-[#46D999] w-[6px] h-[6px]`} />
                                                                        <div className={`rounded-[1px] bg-[#46D999] w-[6px] h-[6px]`} />
                                                                        <div className={`rounded-[1px] bg-[#46D999] w-[6px] h-[6px]`} />
                                                                    </div>
                                                                    <h3 className="text-[#62E98F] text-[16px]">Launching</h3>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {project.status === 5 && (
                                                            <div className="inline-flex bg-[#102A56] border border-solid border-[#153B84] rounded-[4px]">
                                                                <div className="flex px-[8px] py-[4px] gap-[8px] items-center">
                                                                    <h3 className="text-[#6294E9] text-[16px]">Maintaining</h3>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="w-[150px] relative font-normal text-sm">
                                                        <div className="absolute w-[100px] rounded-full bg-[#333741]">
                                                            <div
                                                                className="rounded-full bg-[#5840F0] h-[8px]"
                                                                style={{ width: `${project.progress}%` }} // Use inline style for dynamic width
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="w-[190px] relative font-normal text-sm">
                                                        {project.paymentPlan === 1 && (
                                                            <div className="flex flex-col gap-[5px]">
                                                                <div className="flex gap-[5px]">
                                                                    <div className={`${project.weeksPaid === 1 ? "opacity-100" : "opacity-40"} w-[15px] h-[15px] PopupAttentionGradient rounded-[4px]`} />
                                                                </div>
                                                                <div className="flex gap-[5px] opacity-40 items-center">
                                                                    <div className="w-[15px]">
                                                                        <Image
                                                                            src="/Credit Card Icon.png"
                                                                            alt="Credit Card Icon"
                                                                            layout="responsive"
                                                                            width={0}
                                                                            height={0}
                                                                        />
                                                                    </div>
                                                                    <h3 className="text-[10px] font-light">100% upfront payment</h3>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {project.paymentPlan === 2 && (
                                                            <div className="flex flex-col gap-[5px]">
                                                                <div className="flex gap-[5px]">
                                                                    <div className={`${project.weeksPaid === 1 || project.weeksPaid === 2 ? "opacity-100" : "opacity-40"} w-[15px] h-[15px] PopupAttentionGradient rounded-[4px]`} />
                                                                    <div className={`${project.weeksPaid === 2 ? "opacity-100" : "opacity-40"} w-[15px] h-[15px] PopupAttentionGradient rounded-[4px]`} />
                                                                </div>
                                                                <div className="flex gap-[5px] opacity-40 items-center">
                                                                    <div className="w-[15px]">
                                                                        <Image
                                                                            src="/Credit Card Icon.png"
                                                                            alt="Credit Card Icon"
                                                                            layout="responsive"
                                                                            width={0}
                                                                            height={0}
                                                                        />
                                                                    </div>
                                                                    <h3 className="text-[10px] font-light">2-week payment</h3>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {project.paymentPlan === 3 && (
                                                            <div className="flex flex-col gap-[5px]">
                                                                <div className="flex gap-[5px]">
                                                                    <div className={`${project.weeksPaid === 1 || project.weeksPaid === 2 || project.weeksPaid === 3 ? "opacity-100" : "opacity-40"} w-[15px] h-[15px] PopupAttentionGradient rounded-[4px]`} />
                                                                    <div className={`${project.weeksPaid === 2 || project.weeksPaid === 3 ? "opacity-100" : "opacity-40"} w-[15px] h-[15px] PopupAttentionGradient rounded-[4px]`} />
                                                                    <div className={`${project.weeksPaid === 3 ? "opacity-100" : "opacity-40"} w-[15px] h-[15px] PopupAttentionGradient rounded-[4px]`} />
                                                                </div>
                                                                <div className="flex gap-[5px] opacity-40 items-center">
                                                                    <div className="w-[15px]">
                                                                        <Image
                                                                            src="/Credit Card Icon.png"
                                                                            alt="Credit Card Icon"
                                                                            layout="responsive"
                                                                            width={0}
                                                                            height={0}
                                                                        />
                                                                    </div>
                                                                    <h3 className="text-[10px] font-light">3-week payment</h3>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {project.paymentPlan === 4 && (
                                                            <div className="flex flex-col gap-[5px]">
                                                                <div className="flex gap-[5px]">
                                                                    <div className={`${project.weeksPaid === 1 || project.weeksPaid === 2 || project.weeksPaid === 3 || project.weeksPaid === 4 ? "opacity-100" : "opacity-40"} w-[15px] h-[15px] PopupAttentionGradient rounded-[4px]`} />
                                                                    <div className={`${project.weeksPaid === 2 || project.weeksPaid === 3 || project.weeksPaid === 4 ? "opacity-100" : "opacity-40"} w-[15px] h-[15px] PopupAttentionGradient rounded-[4px]`} />
                                                                    <div className={`${project.weeksPaid === 3 || project.weeksPaid === 4 ? "opacity-100" : "opacity-40"} w-[15px] h-[15px] PopupAttentionGradient rounded-[4px]`} />
                                                                    <div className={`${project.weeksPaid === 4 ? "opacity-100" : "opacity-40"} w-[15px] h-[15px] PopupAttentionGradient rounded-[4px]`} />
                                                                </div>
                                                                <div className="flex gap-[5px] opacity-40 items-center">
                                                                    <div className="w-[15px]">
                                                                        <Image
                                                                            src="/Credit Card Icon.png"
                                                                            alt="Credit Card Icon"
                                                                            layout="responsive"
                                                                            width={0}
                                                                            height={0}
                                                                        />
                                                                    </div>
                                                                    <h3 className="text-[10px] font-light">4-week payment</h3>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {project.paymentPlan === 5 && (
                                                            <div className="flex flex-col gap-[5px]">
                                                                <div className="flex gap-[5px]">
                                                                    <div className={`${project.weeksPaid === 1 || project.weeksPaid === 2 || project.weeksPaid === 3 || project.weeksPaid === 4 || project.weeksPaid === 5 ? "opacity-100" : "opacity-40"} w-[15px] h-[15px] PopupAttentionGradient rounded-[4px]`} />
                                                                    <div className={`${project.weeksPaid === 2 || project.weeksPaid === 3 || project.weeksPaid === 4 || project.weeksPaid === 5 ? "opacity-100" : "opacity-40"} w-[15px] h-[15px] PopupAttentionGradient rounded-[4px]`} />
                                                                    <div className={`${project.weeksPaid === 3 || project.weeksPaid === 4 || project.weeksPaid === 5 ? "opacity-100" : "opacity-40"} w-[15px] h-[15px] PopupAttentionGradient rounded-[4px]`} />
                                                                    <div className={`${project.weeksPaid === 4 || project.weeksPaid === 5 ? "opacity-100" : "opacity-40"} w-[15px] h-[15px] PopupAttentionGradient rounded-[4px]`} />
                                                                    <div className={`${project.weeksPaid === 5 ? "opacity-100" : "opacity-40"} w-[15px] h-[15px] PopupAttentionGradient rounded-[4px]`} />
                                                                </div>
                                                                <div className="flex gap-[5px] opacity-40 items-center">
                                                                    <div className="w-[15px]">
                                                                        <Image
                                                                            src="/Credit Card Icon.png"
                                                                            alt="Credit Card Icon"
                                                                            layout="responsive"
                                                                            width={0}
                                                                            height={0}
                                                                        />
                                                                    </div>
                                                                    <h3 className="text-[10px] font-light">5-week payment</h3>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="w-[170px] relative font-normal text-sm">
                                                        {project.dueDate}
                                                    </div>
                                                </div>

                                            </div>
                                        ))
                                    ) : (
                                        <div className=""></div>
                                    )}
                                </div>

                                {/* Add New Project Button */}
                                <div className="flex w-full h-[100px] items-center justify-center gap-2.5 px-[55px] py-14 relative rounded-[15px] ContentCardShadow AddANewProjectGradient hover:cursor-pointer" onClick={toggleCreateProjectPopup}>
                                    <div className="flex gap-2.5 items-center opacity-60">
                                        <div className="relative font-light text-[15px] text-center">
                                            Add a New Project
                                        </div>
                                        <div className="w-[15px]">
                                            <Image
                                                src="/Plus Icon.png"
                                                alt="Plus Icon"
                                                layout="responsive"
                                                width={0}
                                                height={0}
                                            />
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

export default DASHBOARDClientProjects;
