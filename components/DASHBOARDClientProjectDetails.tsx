"use client";

import { useEffect, useState } from 'react';
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Adjust the import path based on your Firebase setup
import Link from 'next/link';
import Image from 'next/image';
import DashboardClientSideNav from './DashboardClientSideNav';

interface DASHBOARDClientProjectDetailsProps {
    userId: string;
    projectId: string;
}

interface ProjectDetails {
    projectName?: string;
    dueDate?: string;
    projectDescription?: string;
    logoAttachment?: string;
    status?: string;
    paymentStatus?: string;
    progress?: number;
    websiteDesignCount?: number;
    websiteDesignStatus?: string;
    weeksPaid?: number;
    paymentPlan?: string;
    paymentAmount?: number;
    paymentStartDate?: string;
    autoPay?: boolean;
    [key: string]: any; // Add this for flexibility if the object has extra fields
}

const DASHBOARDClientProjectDetails = ({ userId, projectId }: DASHBOARDClientProjectDetailsProps) => {
    const [projectDetails, setProjectDetails] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [paymentType, setPaymentType] = useState("week"); // Initialize paymentType with "week"

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

    // Access project data using projectDetails, assuming projectName and projectDescription are fields in the document
    const { projectName, dueDate, projectDescription, logoAttachment, status, paymentStatus, progress, websiteDesignCount, websiteDesignStatus, weeksPaid, paymentPlan, paymentAmount, paymentStartDate, autoPay } = projectDetails || {};


    const changePaymentType = (newPaymentType: string) => {
        setPaymentType(newPaymentType);
    };


    const handleAutoPayButton = async (newAutoPay: boolean) => {
        if (!userId || !projectId) return; // Ensure we have userId and projectId

        try {
            // Reference to the specific user's project document
            const projectDocRef = doc(db, 'users', userId, 'projects', projectId);

            // Update the progress field in Firestore
            await updateDoc(projectDocRef, {
                autoPay: newAutoPay,
            });

            // Update local state to reflect new progress and activities
            setProjectDetails((prevDetails: ProjectDetails) => ({
                ...prevDetails,
                autoPay: newAutoPay,
            }));


        } catch (err) {
            console.error('Error updating payment status:', err);
        }
    };

    if (loading) {
        return <div>Loading project details...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }





    const size = 260;
    const strokeWidth = 52; // 20% of 260px for the circle thickness
    const radius = (size - strokeWidth) / 2;
    const circumference = Math.PI * radius; // Circumference of the semi-circle

    // Calculate amount paid and total payment
    const amountPaid = weeksPaid * paymentAmount;
    const totalPayment = paymentPlan * paymentAmount;
    const remainingPayment = totalPayment - amountPaid;

    // Calculate progress percentage (0 to 1 range)
    const paymentProgress = amountPaid / totalPayment;
    const strokeDashOffset = 450 - paymentProgress * 450; // Calculate the offset based on the progress
    const offset = circumference * (1 - paymentProgress);

    console.log("amountPaid" + amountPaid)
    console.log("totalPayment" + totalPayment)
    console.log("paymentProgress" + paymentProgress)
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
                                className="relative font-normal text-base hover:cursor-pointer">Overview</Link>
                            <Link
                                href={`/dashboard/projects/${projectId}/progress?projectId=${projectId}&userId=${userId}`}
                                className="relative font-normal text-[#ffffff66] text-base hover:cursor-pointer">Progress</Link>
                            <Link
                                href={`/dashboard/projects/${projectId}/uploads?projectId=${projectId}&userId=${userId}`}
                                className="relative font-normal text-[#ffffff66] text-base hover:cursor-pointer">Uploads</Link>
                            <div className="relative font-normal text-[#ffffff66] text-base hover:cursor-pointer">Analytics</div>
                        </div>
                        <div className="flex justify-between">
                            <div className="inline-flex flex-col gap-[30px]">

                                <div className="w-[770px] inline-flex flex-col gap-[20px] px-[35px] py-[20px] BlackGradient ContentCardShadow rounded-[15px]">
                                    <div className="flex justify-between items-center">
                                        <div className="flex flex-col gap-[10px] max-w-[475px]">
                                            <h1 className="text-[24px] font-semibold">{projectName}</h1>
                                            <h1 className="text-[12px] opacity-60">{projectDescription}</h1>
                                        </div>
                                        <div className="w-[50px]">
                                            <Image
                                                src="/Lucidify Umbrella.png"
                                                alt="Logo Icon"
                                                layout="responsive"
                                                width={0}
                                                height={0}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-between">
                                        <div className="flex flex-col gap-[5px]">
                                            <h3 className="text-[12px] font-light">Status</h3>
                                            <div className="relative w-[120px] h-[25px] bg-[#333741] rounded-[5px] ContentCardLightShadow flex items-center justify-center">
                                                <div className="z-10 flex">
                                                    <h3 className="text-[12px]">
                                                        {(() => {
                                                            switch (status) {
                                                                case 1:
                                                                    return 'Planning';
                                                                case 2:
                                                                    return 'Designing';
                                                                case 3:
                                                                    return 'Developing';
                                                                case 4:
                                                                    return 'Launching';
                                                                case 5:
                                                                    return 'Maintaining';
                                                                default:
                                                                    return 'Unknown Status';
                                                            }
                                                        })()} / {progress} %
                                                    </h3>
                                                </div>
                                                <div className="absolute top-0 left-0 rounded-[5px] h-[25px] PopupAttentionGradient" style={{ width: `${progress}%` }}></div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-[5px]">
                                            <h3 className="text-[12px] font-light">Due Date</h3>
                                            <h3 className="text-[16px] font-medium">
                                                {dueDate}
                                            </h3>
                                        </div>

                                        <div className="flex flex-col gap-[5px]">
                                            <h3 className="text-[12px] font-light">Payment Status</h3>
                                            <h3 className="text-[16px]">
                                                <div className="flex z-10 gap-[25px]">
                                                    <div
                                                        className={`flex justify-center items-center rounded-full ${paymentStatus === "Overdue" ? "ErrorGradient" : paymentStatus === "Not Started" ? "PendingGradient" : paymentStatus === "On Time" && "CorrectGradient"}`}
                                                    >
                                                        <div className="text-[12px] font-semibold px-[12px] py-[4px]">
                                                            {paymentStatus === "Overdue" ? "Overdue!" : paymentStatus === "Not Started" ? "Not Started" : paymentStatus === "On Time" && "On Time"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </h3>
                                        </div>


                                    </div>
                                </div>
                                <div className="flex justify-between ">

                                    <div className="w-[370px] inline-flex flex-col gap-[36px] px-[25px] py-[20px] BlackGradient ContentCardShadow rounded-[15px] items-center">
                                        <h1 className="text-[24px] font-semibold">Website Designs</h1>
                                        <div className="flex justify-between gap-[50px]">
                                            <div className="rounded-[10px] PopupAttentionShadow relative PopupAttentionGradient flex flex-col items-center justify-center px-[34px] py-[9px]">
                                                <div className="flex flex-col z-20 items-center">
                                                    <h3 className="text-[10px]">Total Designs</h3>
                                                    <h1 className="text-[38px] font-semibold TextShadow">2</h1>
                                                </div>
                                                {/* Centered absolute div */}
                                                <div className="w-[117.29%] h-[128.75%] opacity-30 z-10 absolute inset-0 PopupAttentionGradient rounded-[10px] rotate-[3.28deg] transform translate-x-[-50%] translate-y-[-50%] left-[50%] top-[50%]"></div>
                                            </div>

                                            <div className="rounded-[10px] PopupAttentionShadow relative PopupAttentionGradient flex flex-col items-center justify-center px-[10px] py-[9px]">
                                                <div className="flex flex-col z-20 items-center">
                                                    <h3 className="text-[10px]">Design Status</h3>
                                                    <div className="min-w-[115px] flex justify-center">
                                                        <div
                                                            className={`my-[15px] inline-flex justify-center items-center rounded-full ${websiteDesignStatus === "Pending Selection" ? "ErrorGradient" : websiteDesignStatus === "Not Started" ? "PendingGradient" : websiteDesignStatus === "Completed" && "CorrectGradient"}`}
                                                        >
                                                            <div className="text-[10px] font-semibold px-[10px] py-[4px]">
                                                                {websiteDesignStatus === "Pending Selection" ? "Pending Selection!" : websiteDesignStatus === "Not Started" ? "Not Started" : websiteDesignStatus === "Completed" && "Completed"}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Centered absolute div */}
                                                <div className="w-[117.29%] h-[128.75%] opacity-30 z-10 absolute inset-0 PopupAttentionGradient rounded-[10px] rotate-[3.28deg] transform translate-x-[-50%] translate-y-[-50%] left-[50%] top-[50%]"></div>
                                            </div>
                                        </div>
                                        <Link
                                            href="/"
                                            className="rounded-full BlackWithLightGradient ContentCardShadow flex justify-center items-center gap-[8px]">
                                            <h3 className="pl-[16px] text-[14px] font-light">View More</h3>
                                            <div className="PopupAttentionGradient PopupAttentionShadow p-[9px] rounded-full">
                                                <div className="w-[15px] rotate-[135deg]">
                                                    <Image
                                                        src="/Left White Arrow.png"
                                                        alt="Logo Icon"
                                                        layout="responsive"
                                                        width={0}
                                                        height={0}
                                                    />
                                                </div>
                                            </div>
                                        </Link>
                                    </div>


                                    <div className="flex flex-col w-[370px]">

                                        <div className=" inline-flex flex-col gap-[36px] px-[25px] py-[20px] BlackGradient ContentCardShadow rounded-[15px] items-center">
                                            <h3 className="text-[24px] font-semibold"></h3>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col w-full ml-[30px]">
                                <div className="inline-flex flex-col gap-[36px] px-[50px] py-[20px] BlackGradient ContentCardShadow rounded-[15px] items-center">
                                    <div className="flex justify-between w-full items-center">
                                        <div className="flex flex-col gap-[10px]">
                                            <h1 className="text-[24px] font-semibold">Payment Progress</h1>
                                        </div>
                                        <h3 className="text-[16px]">
                                            <div className="flex z-10 gap-[25px]">
                                                <div
                                                    className={`flex justify-center items-center rounded-full ${paymentStatus === "Overdue" ? "ErrorGradient" : paymentStatus === "Not Started" ? "PendingGradient" : paymentStatus === "On Time" && "CorrectGradient"}`}
                                                >
                                                    <div className="text-[12px] font-semibold px-[12px] py-[4px]">
                                                        {paymentStatus === "Overdue" ? "Overdue!" : paymentStatus === "Not Started" ? "Not Started" : paymentStatus === "On Time" && "On Time"}
                                                    </div>
                                                </div>
                                            </div>
                                        </h3>
                                    </div>

                                    <div className="flex justify-evenly w-full items-center">

                                        <div className="skill">
                                            <div className="outer">
                                                <div className="inner">
                                                    <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>${amountPaid}</h2>
                                                    <p style={{ fontSize: '12px', opacity: 0.4 }}>of ${totalPayment}</p>
                                                </div>
                                            </div>
                                            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="160px" height="160px">
                                                <defs>
                                                    <linearGradient id="GradientColor">
                                                        <stop offset="0%" stopColor="#725CF7" />
                                                        <stop offset="100%" stopColor="#6265F0" />
                                                    </linearGradient>
                                                </defs>
                                                <circle
                                                    cx="80"
                                                    cy="80"
                                                    r="70"
                                                    strokeLinecap="round"
                                                    style={{
                                                        fill: 'none',
                                                        stroke: 'url(#GradientColor)',
                                                        strokeWidth: '20px',
                                                        strokeDasharray: '450',
                                                        strokeDashoffset: strokeDashOffset, // Use dynamic offset
                                                        transition: 'stroke-dashoffset 2s linear', // Smooth transition
                                                    }}
                                                />
                                            </svg>
                                        </div>
                                        <div className="flex gap-[40px]">
                                            <div className="flex flex-col gap-[30px]">

                                                <div className="flex flex-col gap-[5px]">
                                                    <h3 className="text-[14px]">Payment Plan</h3>
                                                    <div className="relative font-normal text-sm">
                                                        {paymentPlan === 1 && (
                                                            <div className="flex flex-col gap-[5px]">
                                                                <div className="flex gap-[5px] opacity-60 items-center">
                                                                    <div className="w-[15px] flex items-center">
                                                                        <Image
                                                                            src="/Credit Card Icon.png"
                                                                            alt="Credit Card Icon"
                                                                            layout="responsive"
                                                                            width={0}
                                                                            height={0}
                                                                        />
                                                                    </div>
                                                                    <h3 className="text-[12px] font-light">100% upfront payment</h3>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {paymentPlan === 2 && (
                                                            <div className="flex flex-col gap-[5px]">
                                                                <div className="flex gap-[5px] opacity-60 items-center">
                                                                    <div className="w-[15px] flex items-center">
                                                                        <Image
                                                                            src="/Credit Card Icon.png"
                                                                            alt="Credit Card Icon"
                                                                            layout="responsive"
                                                                            width={0}
                                                                            height={0}
                                                                        />
                                                                    </div>
                                                                    <h3 className="text-[12px] font-light">2-week payment</h3>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {paymentPlan === 3 && (
                                                            <div className="flex flex-col gap-[5px]">
                                                                <div className="flex gap-[5px] opacity-60 items-center">
                                                                    <div className="w-[15px] flex items-center">
                                                                        <Image
                                                                            src="/Credit Card Icon.png"
                                                                            alt="Credit Card Icon"
                                                                            layout="responsive"
                                                                            width={0}
                                                                            height={0}
                                                                        />
                                                                    </div>
                                                                    <h3 className="text-[12px] font-light">3-week payment</h3>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {paymentPlan === 4 && (
                                                            <div className="flex flex-col gap-[5px]">
                                                                <div className="flex gap-[5px] opacity-60 items-center">
                                                                    <div className="w-[15px] flex items-center">
                                                                        <Image
                                                                            src="/Credit Card Icon.png"
                                                                            alt="Credit Card Icon"
                                                                            layout="responsive"
                                                                            width={0}
                                                                            height={0}
                                                                        />
                                                                    </div>
                                                                    <h3 className="text-[12px] font-light">4-week payment</h3>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {paymentPlan === 5 && (
                                                            <div className="flex flex-col gap-[5px]">
                                                                <div className="flex gap-[5px] opacity-60 items-center">
                                                                    <div className="w-[15px] flex items-center">
                                                                        <Image
                                                                            src="/Credit Card Icon.png"
                                                                            alt="Credit Card Icon"
                                                                            layout="responsive"
                                                                            width={0}
                                                                            height={0}
                                                                        />
                                                                    </div>
                                                                    <h3 className="text-[12px] font-light">5-week payment</h3>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div><div className="flex flex-col gap-[5px]">
                                                    <h3 className="text-[14px]">Payment Status</h3>
                                                    <div className="relative font-normal text-sm">
                                                        {paymentPlan === 1 && (
                                                            <div className="flex flex-col gap-[5px]">
                                                                <div className="flex gap-[5px]">
                                                                    <div className={`${weeksPaid === 1 ? "opacity-100" : "opacity-40"} w-[17px] h-[17px] PopupAttentionGradient rounded-[4px]`} />
                                                                </div>
                                                            </div>
                                                        )}

                                                        {paymentPlan === 2 && (
                                                            <div className="flex flex-col gap-[5px]">
                                                                <div className="flex gap-[5px]">
                                                                    <div className={`${weeksPaid === 1 || weeksPaid === 2 ? "opacity-100" : "opacity-40"} w-[17px] h-[17px] PopupAttentionGradient rounded-[4px]`} />
                                                                    <div className={`${weeksPaid === 2 ? "opacity-100" : "opacity-40"} w-[17px] h-[17px] PopupAttentionGradient rounded-[4px]`} />
                                                                </div>
                                                            </div>
                                                        )}

                                                        {paymentPlan === 3 && (
                                                            <div className="flex flex-col gap-[5px]">
                                                                <div className="flex gap-[5px]">
                                                                    <div className={`${weeksPaid === 1 || weeksPaid === 2 || weeksPaid === 3 ? "opacity-100" : "opacity-40"} w-[17px] h-[17px] PopupAttentionGradient rounded-[4px]`} />
                                                                    <div className={`${weeksPaid === 2 || weeksPaid === 3 ? "opacity-100" : "opacity-40"} w-[17px] h-[17px] PopupAttentionGradient rounded-[4px]`} />
                                                                    <div className={`${weeksPaid === 3 ? "opacity-100" : "opacity-40"} w-[17px] h-[17px] PopupAttentionGradient rounded-[4px]`} />
                                                                </div>

                                                            </div>
                                                        )}

                                                        {paymentPlan === 4 && (
                                                            <div className="flex flex-col gap-[5px]">
                                                                <div className="flex gap-[5px]">
                                                                    <div className={`${weeksPaid === 1 || weeksPaid === 2 || weeksPaid === 3 || weeksPaid === 4 ? "opacity-100" : "opacity-40"} w-[17px] h-[17px] PopupAttentionGradient rounded-[4px]`} />
                                                                    <div className={`${weeksPaid === 2 || weeksPaid === 3 || weeksPaid === 4 ? "opacity-100" : "opacity-40"} w-[17px] h-[17px] PopupAttentionGradient rounded-[4px]`} />
                                                                    <div className={`${weeksPaid === 3 || weeksPaid === 4 ? "opacity-100" : "opacity-40"} w-[17px] h-[17px] PopupAttentionGradient rounded-[4px]`} />
                                                                    <div className={`${weeksPaid === 4 ? "opacity-100" : "opacity-40"} w-[17px] h-[17px] PopupAttentionGradient rounded-[4px]`} />
                                                                </div>

                                                            </div>
                                                        )}

                                                        {paymentPlan === 5 && (
                                                            <div className="flex flex-col gap-[5px]">
                                                                <div className="flex gap-[5px]">
                                                                    <div className={`${weeksPaid === 1 || weeksPaid === 2 || weeksPaid === 3 || weeksPaid === 4 || weeksPaid === 5 ? "opacity-100" : "opacity-40"} w-[17px] h-[17px] PopupAttentionGradient rounded-[4px]`} />
                                                                    <div className={`${weeksPaid === 2 || weeksPaid === 3 || weeksPaid === 4 || weeksPaid === 5 ? "opacity-100" : "opacity-40"} w-[17px] h-[17px] PopupAttentionGradient rounded-[4px]`} />
                                                                    <div className={`${weeksPaid === 3 || weeksPaid === 4 || weeksPaid === 5 ? "opacity-100" : "opacity-40"} w-[17px] h-[17px] PopupAttentionGradient rounded-[4px]`} />
                                                                    <div className={`${weeksPaid === 4 || weeksPaid === 5 ? "opacity-100" : "opacity-40"} w-[17px] h-[17px] PopupAttentionGradient rounded-[4px]`} />
                                                                    <div className={`${weeksPaid === 5 ? "opacity-100" : "opacity-40"} w-[17px] h-[17px] PopupAttentionGradient rounded-[4px]`} />
                                                                </div>

                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-[30px]">
                                                <div className="flex flex-col gap-[5px]">
                                                    <h3 className="text-[14px]">Payment Amount</h3>
                                                    <div className="relative font-normal text-[14px] opacity-60">
                                                        ${paymentAmount}.00
                                                    </div>
                                                </div><div className="flex flex-col gap-[5px]">
                                                    <h3 className="text-[14px]">Payment Start Date</h3>
                                                    <div className="relative font-normal text-[14px] opacity-60">
                                                        {paymentStartDate || "Not Started"}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between w-full">
                                        <div className="flex flex-col gap-[10px]">
                                            <h3 className="text-[14px] opacity-80">Auto-pay:</h3>
                                            <div className="flex items-center justify-between BlackGradient ContentCardShadow rounded-[10px]">
                                                <div className="flex gap-[2px] items-center text-[14px]">
                                                    <button
                                                        onClick={() => handleAutoPayButton(true)}
                                                        disabled={autoPay} // Disable the button if no input
                                                        className={`rounded-[10px] text-white text-[14px] px-[37px] py-[10px] ${autoPay ? 'PopupAttentionGradient PopupAttentionShadow' : ' opacity-70'}`} // Style when disabled
                                                    >
                                                        {autoPay ? "Enabled" : "Enable"}
                                                    </button>
                                                    <button
                                                        onClick={() => handleAutoPayButton(false)}
                                                        disabled={!autoPay} // Disable the button if no input
                                                        className={`rounded-[10px] text-white text-[14px] px-[37px] py-[10px] ${!autoPay ? 'PopupAttentionGradient PopupAttentionShadow' : ' opacity-70'}`} // Style when disabled
                                                    >
                                                        {!autoPay ? "Disabled" : "Disable"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>


                                    </div>

                                    <div className="flex justify-between w-full">
                                        <div className="flex flex-col gap-[15px] w-full">
                                            <div className="flex gap-[20px]">
                                                <h3
                                                    className={`text-[14px] ${paymentType === "week" ? "opacity-80" : "opacity-60"} hover:cursor-pointer`}
                                                    onClick={() => changePaymentType("week")}
                                                >
                                                    Week
                                                </h3>
                                                <h3
                                                    className={`text-[14px] ${paymentType === "full" ? "opacity-80" : "opacity-60"} hover:cursor-pointer`}
                                                    onClick={() => changePaymentType("full")}
                                                >
                                                    Full
                                                </h3>
                                            </div>
                                            <div className="flex items-center justify-between BlackWithLightGradient ContentCardShadow rounded-[10px] w-full">
                                                <div className="flex gap-[2px] items-center text-[14px] w-full">
                                                    <h3 className="w-full ml-[20px] text-[16px] font-semibold ">
                                                        ${paymentType === "week" ? paymentAmount : remainingPayment}
                                                    </h3>
                                                    <button
                                                        onClick={() => handleAutoPayButton(false)}
                                                        disabled={paymentStatus === "Not Started"}
                                                        className={`${paymentStatus === "Not Started" && "opacity-70 cursor-not-allowed"} flex rounded-[10px] text-white text-[14px] px-[20px] py-[10px] PopupAttentionGradient PopupAttentionShadow whitespace-nowrap`}
                                                    >
                                                        Pay now
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
            </div>
        </div>
    );
};

export default DASHBOARDClientProjectDetails;