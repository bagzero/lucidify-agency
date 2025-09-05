import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Adjust the path as needed
import { useAuth } from '@/context/authContext'; // Import your AuthContext
import { useRouter } from 'next/navigation';    // Import Next.js router
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Import Firebase Storage

interface CreateProjectPopupProps {
    closeCreatProjectPopup: () => void;
    isVisible: boolean;
}

interface FormData {
    projectName: string;
    dueDate: string;
    projectDescription: string;
    designInspiration1: string;
    designInspiration2: string;
    logoAttachment: string | null;
    platform: string;
    subpages: string[];
    estimatedBudget: string;
    paymentPlan: number;
    weeksPaid: number;
    notes: string;
    additionalAttachment: File | null; // Allow File | null
    approval: string;
    dateCreated: string;
    progress: string;
    recentActivity: string;
    comments: string;
    status: number;
    paymentStatus: string;
    paymentStartDate: string | null;
    paymentAmount: number;
    autoPay: boolean;
    websiteDesignCount: number;
    websiteDesignStatus: string;
    maintenancePlan: string;
    maintenanceAmount: number;
    maintenanceStatus: string;
}

// Function to get the ordinal suffix
const getOrdinal = (n: number): string => {
    const suffixes = ["th", "st", "nd", "rd"];
    const value = n % 100;
    return suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0];
};

const CreateProjectPopup: React.FC<CreateProjectPopupProps> = ({ closeCreatProjectPopup, isVisible }) => {
    const { user } = useAuth();  // Access the authenticated user
    const router = useRouter();  // Access the router

    // Redirect to login if there's no user
    useEffect(() => {
        if (!user) {
            router.push("/login");  // Redirect the user to the login page
        }
    }, [user, router]);

    const [formData, setFormData] = useState<FormData>({
        projectName: '',
        dueDate: '',
        projectDescription: '',
        designInspiration1: '',
        designInspiration2: '',
        logoAttachment: null,
        platform: '',
        subpages: [],
        estimatedBudget: '',
        paymentPlan: 0,
        weeksPaid: 0,
        notes: '',
        additionalAttachment: null,
        approval: 'Pending',
        dateCreated: new Date().toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        }).replace(/(\d+)/, (match) => `${match}${getOrdinal(parseInt(match))}`), // Append ordinal suffix
        progress: '5',
        recentActivity: 'Project sent to Lucidify',
        comments: '',
        status: 1,
        paymentStatus: 'Not Started',
        paymentStartDate: null,
        paymentAmount: 0, //amount per week
        autoPay: true,
        websiteDesignCount: 0,
        websiteDesignStatus: 'Not Started',
        maintenancePlan: '',
        maintenanceAmount: 100,
        maintenanceStatus: 'Not Started',
    });

    const [isSubmitted, setIsSubmitted] = useState(false);



    // Handle Maintenance Plan selection
    const handleMaintenancePlanSelection = (plan: string) => {
        setFormData((prevState) => ({
            ...prevState,
            maintenancePlan: plan,
        }));
    };

    // Handle notes change
    const handleNotesChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prevState) => ({
            ...prevState,
            notes: e.target.value,
        }));
    };


    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    };

    // Handle subpage toggle (button acting like a checkbox)
    const handleSubpageToggle = (subpage: string) => {
        const updatedSubpages = formData.subpages.includes(subpage)
            ? formData.subpages.filter((page) => page !== subpage)
            : [...formData.subpages, subpage];
        setFormData((prevState) => ({
            ...prevState,
            subpages: updatedSubpages,
        }));
    };


    // Handle checkbox selections for subpages
    const handleSubpageSelection = (subpage: string) => {
        setFormData((prevState) => ({
            ...prevState,
            subpages: prevState.subpages.includes(subpage)
                ? prevState.subpages.filter((page) => page !== subpage)
                : [...prevState.subpages, subpage],
        }));
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            console.error('User is not logged in');
            return;
        }
        try {
            // Reference to the user's projects subcollection
            const userProjectsRef = collection(db, `users/${user.uid}/projects`);
            await addDoc(userProjectsRef, formData);

            setIsSubmitted(true);

            // Refresh the page
            window.location.reload();
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };

    // Handle file upload for attachments
    // Handle file upload for attachments using Cloudinary
    // Handle file upload for attachments using Cloudinary
    // Handle Logo Upload
    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;

        if (file && user) { // Ensure user is available and file is selected
            try {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", "Unsigned Presets"); // Replace with your Cloudinary upload preset

                // Set the folder path for the logo inside the user's UID folder
                const folderPath = `users/${user.uid}/logoAttachments`; // Logo-specific folder path
                formData.append("folder", folderPath); // Specify the folder in Cloudinary

                // Send the file to Cloudinary
                const response = await fetch("https://api.cloudinary.com/v1_1/dldxkfbz4/image/upload", {
                    method: "POST",
                    body: formData,
                });

                if (response.ok) {
                    const data = await response.json();
                    const downloadURL = data.secure_url; // Get the uploaded file's URL

                    // Optionally, store the URL in your form data or handle accordingly
                    setFormData((prevState) => ({
                        ...prevState,
                        logoAttachment: downloadURL, // Save the logo URL in the form data
                    }));

                    console.log("Logo uploaded successfully:", downloadURL); // Log URL for debugging
                } else {
                    console.error("Error uploading logo to Cloudinary:", await response.text());
                }
            } catch (error) {
                console.error("Error uploading logo:", error);
            }
        } else {
            console.error("No logo file selected or user is not logged in.");
        }
    };

    // Handle Additional File Upload
    const handleAttachmentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;

        if (file && user) { // Ensure user is available and file is selected
            try {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", "Unsigned Presets"); // Replace with your Cloudinary upload preset

                // Set the folder path for additional attachments inside the user's UID folder
                const folderPath = `users/${user.uid}/additionalAttachments`; // Additional attachments folder path
                formData.append("folder", folderPath); // Specify the folder in Cloudinary

                // Send the file to Cloudinary
                const response = await fetch("https://api.cloudinary.com/v1_1/dldxkfbz4/image/upload", {
                    method: "POST",
                    body: formData,
                });

                if (response.ok) {
                    const data = await response.json();
                    const downloadURL = data.secure_url; // Get the uploaded file's URL

                    // Store the download URL in the form data's additionalAttachment field
                    setFormData((prevState) => ({
                        ...prevState,
                        additionalAttachment: downloadURL, // Save the additional file URL
                    }));

                    console.log("Additional file uploaded successfully:", downloadURL); // Log URL for debugging
                } else {
                    console.error("Error uploading additional file to Cloudinary:", await response.text());
                }
            } catch (error) {
                console.error("Error uploading additional file:", error);
            }
        } else {
            console.error("No additional file selected or user is not logged in.");
        }
    };




    return (
        <div
            className={`h-screen bg-black bg-opacity-50 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 pointer-events-none translate-y-[50px]'} fixed inset-x-0 flex justify-center items-center z-20`}
        >
            <form
                className="relative flex max-h-[83vh] overflow-y-auto flex-col items-start px-[50px] py-5 BlackGradient ContentCardShadow rounded-[50px]"
                onSubmit={handleSubmit}
            >
                <div className="inline-flex items-center justify-center gap-5 ">
                    <div className="w-[50px]">
                        <Image
                            src="/Lucidify Umbrella.png"
                            alt="Lucidify Logo"
                            layout="responsive"
                            width={0}
                            height={0}
                        />
                    </div>
                    <div className=" font-semibold  text-[34px] leading-[normal]">
                        Create new project.
                    </div>
                </div>
                <div className="flex flex-col w-[35px] h-[35px] items-center justify-center gap-2.5 p-1.5 absolute right-[50px] rounded-[100px] CloseCreateProjectPoppupGradient ContentCardShadow hover:cursor-pointer" onClick={closeCreatProjectPopup}>
                    <div className=" w-[20px] rotate-45">
                        <Image src="/Plus Icon.png" alt="Plus Icon" layout="responsive" width={0} height={0} />
                    </div>
                </div>

                <div className="w-full my-[15px] opacity-25 border-[1.5px] border-[#808080] rounded-full" />

                <div className="inline-flex flex-col items-start gap-[50px]">
                    <div className="inline-flex flex-col items-start gap-2.5">
                        <div className="font-semibold text-xl">Project Details</div>
                        <div className="flex items-start gap-[15px] w-full">
                            <div className="inline-flex items-start gap-2.5 self-stretch">
                                <div className={`flex w-[30px] h-[30px] items-center justify-center gap-2.5 rounded-[100px] ${formData.projectName && formData.dueDate && formData.projectDescription ? "bg-[#725CF7] PopupAttentionShadow" : "bg-[#2A2A2D] ContentCardShadow"}`}>
                                    <div>1</div>
                                </div>
                                <div className="w-0.5 bg-[#80808040] rounded-[100px]" />
                            </div>
                            <div className="flex flex-wrap w-[1037px] items-center justify-between gap-[15px_15px]">
                                {/* Project Name */}
                                <div className="flex flex-col w-[492px] items-start gap-[13px]">
                                    <p className="text-sm">
                                        Project Name<span className="text-[#998af8] text-[16px] font-bold">*</span>
                                    </p>
                                    <input
                                        id="projectName"
                                        type="text"
                                        value={formData.projectName}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Ottoman - Redesign Landing Page"
                                        required
                                        className="max-h-[38px] w-full rounded-[10px] px-[17px] py-2.5 LightGrayGradient ContentCardShadow text-xs"
                                    />
                                </div>

                                {/* Estimated Due Date */}
                                <div className="flex flex-col w-[492px] items-start gap-[13px]">
                                    <p className="text-sm">
                                        Estimated Due Date<span className="text-[#998af8] text-[16px] font-bold">*</span>
                                    </p>
                                    <input
                                        id="dueDate"
                                        type="date"
                                        value={formData.dueDate}
                                        onChange={handleInputChange}
                                        required
                                        className="max-h-[38px] w-full rounded-[10px] px-[17px] py-2.5 LightGrayGradient ContentCardShadow text-xs"
                                    />
                                </div>

                                {/* Project Description */}
                                <div className="flex flex-col w-[492px] items-start gap-[13px]">
                                    <p className="text-sm">
                                        Project Description<span className="text-[#998af8] text-[16px] font-bold">*</span>
                                    </p>
                                    <input
                                        id="projectDescription"
                                        value={formData.projectDescription}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Redesigning Ottoman’s landing page to increase revenue and customer traffic. Expecting a increase in incoming traffic of at least 50%."
                                        required
                                        className="max-h-14 w-full rounded-[10px] px-[17px] py-2.5 LightGrayGradient ContentCardShadow text-xs"
                                    />
                                </div>

                                {/* Upload Logo */}
                                <div className="flex flex-col w-[492px] items-start gap-[13px]">
                                    <div className="text-sm leading-[normal]">Upload Logo (Optional)</div>
                                    <div className="flex max-h-[38px] h-[38px] items-center gap-[19px] px-0 py-2.5 w-full rounded-[10px]">
                                        <div className="flex w-[38px] h-[38px] items-center justify-center gap-2.5 rounded-[100px] BlackWithLightGradient ContentCardShadow">
                                            <div className="w-[20px]">
                                                <Image src="/Upload Icon.png" alt="Upload Icon" layout="responsive" width={0} height={0} />
                                            </div>
                                        </div>
                                        <label className="w-[246px] text-xs leading-[normal]">
                                            <span className="font-normal text-xs">Drag &amp; Drop your files here or </span>
                                            <span className="underline">Choose file</span>
                                            <input
                                                type="file"
                                                className=""
                                                onChange={handleLogoUpload}
                                                accept=".png,.jpg,.jpeg,.pdf" // Adjust accepted file types
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Website Requirements */}
                    <div className="inline-flex flex-col items-start gap-2.5">
                        <div className="font-semibold text-xl">Website Requirements</div>
                        <div className="flex items-start gap-[15px] w-full">
                            <div className="inline-flex items-start gap-2.5 self-stretch">
                                <div className={`flex w-[30px] h-[30px] items-center justify-center gap-2.5 rounded-[100px] ${formData.platform ? "bg-[#725CF7] PopupAttentionShadow" : "bg-[#2A2A2D] ContentCardShadow"}`}>
                                    <div>2</div>
                                </div>
                                <div className="w-0.5 bg-[#80808040] rounded-[100px]" />
                            </div>
                            <div className="w-[1037px] justify-between flex flex-wrap items-center gap-[0px_15px]">
                                {/* Left Side */}
                                <div className="flex flex-col w-[492px] gap-[18px]">


                                    {/* Platform Selection */}
                                    <div className="flex flex-col w-[492px] items-start gap-[18px]">
                                        <div className="flex flex-col items-start gap-[13px] w-full">
                                            <p className="text-sm">
                                                Platform<span className="text-[#998af8] text-[16px] font-bold">*</span>
                                            </p>
                                            <div className="flex items-center justify-between w-full">
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, platform: 'Custom Code' })}
                                                    className={`inline-flex items-center justify-center px-[15px] py-[8.5px] rounded-[5px] ${formData.platform === 'Custom Code' ? 'bg-[#725CF7] PopupAttentionShadow' : 'bg-[#2A2A2D] ContentCardShadow'
                                                        } ContentCardShadow text-xs`}
                                                >
                                                    Custom Code
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, platform: 'WordPress' })}
                                                    className={`inline-flex items-center justify-center px-[15px] py-[8.5px] rounded-[5px] ${formData.platform === 'WordPress' ? 'bg-[#725CF7] PopupAttentionShadow' : 'bg-[#2A2A2D] ContentCardShadow'
                                                        } ContentCardShadow text-xs`}
                                                >
                                                    WordPress
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, platform: 'Shopify' })}
                                                    className={`inline-flex items-center justify-center px-[15px] py-[8.5px] rounded-[5px] ${formData.platform === 'Shopify' ? 'bg-[#725CF7] PopupAttentionShadow' : 'bg-[#2A2A2D] ContentCardShadow'
                                                        } ContentCardShadow text-xs`}
                                                >
                                                    Shopify
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, platform: 'Wix' })}
                                                    className={`inline-flex items-center justify-center px-[15px] py-[8.5px] rounded-[5px] ${formData.platform === 'Wix' ? 'bg-[#725CF7] PopupAttentionShadow' : 'bg-[#2A2A2D] ContentCardShadow'
                                                        } ContentCardShadow text-xs`}
                                                >
                                                    Wix
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, platform: 'Unsure' })}
                                                    className={`inline-flex items-center justify-center px-[15px] py-[8.5px] rounded-[5px] ${formData.platform === 'Unsure' ? 'bg-[#725CF7] PopupAttentionShadow' : 'bg-[#2A2A2D] ContentCardShadow'
                                                        } ContentCardShadow text-xs`}
                                                >
                                                    Unsure
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Design Inspirations */}
                                    <div className="flex flex-col w-[492px] items-start gap-[18px]">
                                        <div className="flex flex-col items-start gap-[13px] w-full">
                                            <p className="text-sm">
                                                Design Inspirations (Optional)
                                            </p>
                                            <div className="flex items-center justify-between w-full">
                                                {/* */}
                                                <div className="flex flex-col w-[235px] items-start gap-[13px]">

                                                    <input
                                                        id="designInspiration1"
                                                        type="text"
                                                        value={formData.designInspiration1}
                                                        placeholder="e.g. https://www.chick-fil-a.com/"
                                                        onChange={handleInputChange}
                                                        className="max-h-[38px] w-full rounded-[10px] px-[17px] py-2.5 LightGrayGradient ContentCardShadow text-xs"
                                                    />
                                                </div>

                                                {/* */}
                                                <div className="flex flex-col w-[235px] items-start gap-[13px]">
                                                    <input
                                                        id="designInspiration2"
                                                        type="text"
                                                        value={formData.designInspiration2}
                                                        placeholder="e.g. https://www.ford.com/"
                                                        onChange={handleInputChange}
                                                        className="max-h-[38px] w-full rounded-[10px] px-[17px] py-2.5 LightGrayGradient ContentCardShadow text-xs"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Subpages Section */}
                                <div className="inline-flex flex-col items-start gap-2.5 w-[492px] h-[159px]">
                                    <p className="text-sm">
                                        Subpages (Optional)
                                    </p>
                                    <div className="flex flex-wrap gap-[15px_20px] w-full justify-center">
                                        {['About', 'Services', 'Contact', 'Testimonials', 'FAQ', 'Pricing', 'Gallery', 'Events', 'Menu', 'Online Ordering', 'Reservations', 'Custom'].map((subpage) => (
                                            <button
                                                type="button"
                                                key={subpage}
                                                onClick={() => handleSubpageToggle(subpage)}
                                                className={`px-4 py-2 rounded-[10px] text-white text-[12px] ${formData.subpages.includes(subpage)
                                                    ? 'bg-[#725CF7] PopupAttentionShadow'
                                                    : 'bg-[#2A2A2D] ContentCardShadow'
                                                    }`}
                                            >
                                                {subpage}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div className="inline-flex flex-col items-start gap-2.5">
                        <div className="inline-flex items-center justify-center gap-2.5">
                            <div className="font-semibold text-xl leading-[normal]">Payment Details</div>
                            <div className="inline-flex items-center justify-center gap-[5px]">
                                <div className="flex flex-col w-[18px] h-[18px] items-center justify-center gap-2.5 px-[5px] py-0 rounded-[100px] LightGrayGradient ContentCardShadow">
                                    <div className="text-[10px] leading-[normal]">i</div>
                                </div>
                                <p className="text-[#ffffffa6] text-xs leading-[normal]">
                                    We only start charging after you decide to proceed with one of our free web designs.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-[15px] w-full">
                            <div className="inline-flex items-start gap-2.5  self-stretch">
                                <div className={`flex w-[30px] h-[30px] items-center justify-center gap-2.5  rounded-[100px] ${formData.estimatedBudget && formData.paymentPlan ? "bg-[#725CF7] PopupAttentionShadow" : "bg-[#2A2A2D] ContentCardShadow"}`}>
                                    <div className="  leading-[normal]">
                                        3
                                    </div>
                                </div>
                                <div className=" w-0.5 bg-[#80808040] rounded-[100px]" />
                            </div>
                            <div className="flex flex-col flex-wrap w-[1037px] gap-[15px]">

                                {/* Estimated Budget */}
                                <div className="flex flex-col items-start gap-[13px]">
                                    <p className="text-sm">
                                        Estimated Budget<span className="text-[#998af8] text-[16px] font-bold">*</span>
                                    </p>
                                    <div className="flex items-center gap-[30px] w-full">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, estimatedBudget: '$500-$1k' })}
                                            className={`inline-flex items-center justify-center px-[15px] py-[8.5px] rounded-[5px] ${formData.estimatedBudget === '$500-$1k' ? 'bg-[#725CF7] PopupAttentionShadow' : 'bg-[#2A2A2D] ContentCardShadow'
                                                } ContentCardShadow text-xs`}
                                        >
                                            $500-$1k
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, estimatedBudget: '$1k-$2k' })}
                                            className={`inline-flex items-center justify-center px-[15px] py-[8.5px] rounded-[5px] ${formData.estimatedBudget === '$1k-$2k' ? 'bg-[#725CF7] PopupAttentionShadow' : 'bg-[#2A2A2D] ContentCardShadow'
                                                } ContentCardShadow text-xs`}
                                        >
                                            $1k-$2k
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, estimatedBudget: '$2k-$3k' })}
                                            className={`inline-flex items-center justify-center px-[15px] py-[8.5px] rounded-[5px] ${formData.estimatedBudget === '$2k-$3k' ? 'bg-[#725CF7] PopupAttentionShadow' : 'bg-[#2A2A2D] ContentCardShadow'
                                                } ContentCardShadow text-xs`}
                                        >
                                            $2k-$3k
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, estimatedBudget: '$3k+' })}
                                            className={`inline-flex items-center justify-center px-[15px] py-[8.5px] rounded-[5px] ${formData.estimatedBudget === '$3k+' ? 'bg-[#725CF7] PopupAttentionShadow' : 'bg-[#2A2A2D] ContentCardShadow'
                                                } ContentCardShadow text-xs`}
                                        >
                                            $3k+
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, estimatedBudget: 'Unsure' })}
                                            className={`inline-flex items-center justify-center px-[15px] py-[8.5px] rounded-[5px] ${formData.estimatedBudget === 'Unsure' ? 'bg-[#725CF7] PopupAttentionShadow' : 'bg-[#2A2A2D] ContentCardShadow'
                                                } ContentCardShadow text-xs`}
                                        >
                                            Unsure
                                        </button>
                                    </div>
                                </div>

                                {/* Payment Plan */}
                                <div className="flex flex-col items-start gap-[13px]">
                                    <p className="text-sm">
                                        Payment Plan<span className="text-[#998af8] text-[16px] font-bold">*</span>
                                    </p>

                                    <div className="flex items-center gap-[30px] w-full">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, paymentPlan: 1 })}
                                            className={`inline-flex items-center justify-center px-[15px] py-[8.5px] rounded-[5px] ${formData.paymentPlan === 1 ? 'bg-[#725CF7] PopupAttentionShadow' : 'bg-[#2A2A2D] ContentCardShadow'
                                                } ContentCardShadow text-xs`}
                                        >
                                            100% Upfront
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, paymentPlan: 2 })}
                                            className={`inline-flex items-center justify-center px-[15px] py-[8.5px] rounded-[5px] ${formData.paymentPlan === 2 ? 'bg-[#725CF7] PopupAttentionShadow' : 'bg-[#2A2A2D] ContentCardShadow'
                                                } ContentCardShadow text-xs`}
                                        >
                                            2 Weekly (50%)
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, paymentPlan: 3 })}
                                            className={`inline-flex items-center justify-center px-[15px] py-[8.5px] rounded-[5px] ${formData.paymentPlan === 3 ? 'bg-[#725CF7] PopupAttentionShadow' : 'bg-[#2A2A2D] ContentCardShadow'
                                                } ContentCardShadow text-xs`}
                                        >
                                            3 Weekly (33%)
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, paymentPlan: 4 })}
                                            className={`inline-flex items-center justify-center px-[15px] py-[8.5px] rounded-[5px] ${formData.paymentPlan === 4 ? 'bg-[#725CF7] PopupAttentionShadow' : 'bg-[#2A2A2D] ContentCardShadow'
                                                } ContentCardShadow text-xs`}
                                        >
                                            4 Weekly (25%)
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, paymentPlan: 5 })}
                                            className={`inline-flex items-center justify-center px-[15px] py-[8.5px] rounded-[5px] ${formData.paymentPlan === 5 ? 'bg-[#725CF7] PopupAttentionShadow' : 'bg-[#2A2A2D] ContentCardShadow'
                                                } ContentCardShadow text-xs`}
                                        >
                                            5 Weekly (20%)
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Maintenance Plan Section */}
                    <div className="inline-flex flex-col items-start gap-2.5">
                        <div className="inline-flex items-center justify-center gap-2.5">
                            <div className="font-semibold text-xl leading-[normal]">Maintenance Plan</div>
                            <div className="inline-flex items-center justify-center gap-[5px]">
                                <div className="flex flex-col w-[18px] h-[18px] items-center justify-center gap-2.5 px-[5px] py-0 rounded-[100px] LightGrayGradient ContentCardShadow">
                                    <div className="text-[10px] leading-[normal]">i</div>
                                </div>
                                <p className="text-[#ffffffa6] text-xs leading-[normal]">
                                    Continued website maintenance includes all custom changes to the website, additional sections, and fixing all bugs.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-[15px] w-full">
                            <div className="inline-flex items-start gap-2.5 self-stretch">
                                <div className={`flex w-[30px] h-[30px] items-center justify-center gap-2.5 rounded-[100px] ${formData.maintenancePlan ? "bg-[#725CF7] PopupAttentionShadow" : "bg-[#2A2A2D] ContentCardShadow"}`}>
                                    <div className="leading-[normal]">4</div>
                                </div>
                                <div className="w-0.5 bg-[#80808040] rounded-[100px]" />
                            </div>
                            <div className="flex flex-col w-[1037px] items-start gap-[15px]">
                                <div className="flex flex-col w-[1037px] items-start gap-[13px]">
                                    <p className="text-sm leading-[normal]">
                                        Would you like the maintenance plan? ($100 / month AFTER the development of the website)
                                        <span className="text-[#998af8] text-[16px] font-bold">*</span>
                                    </p>
                                    <div className="flex items-center gap-[30px] w-full">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, maintenancePlan: 'Yes' })}
                                            className={`inline-flex items-center justify-center px-[15px] py-[8.5px] rounded-[5px] ${formData.maintenancePlan === 'Yes' ? 'bg-[#725CF7] PopupAttentionShadow' : 'bg-[#2A2A2D] ContentCardShadow'
                                                } ContentCardShadow text-xs`}
                                        >
                                            Yes
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, maintenancePlan: 'No' })}
                                            className={`inline-flex items-center justify-center px-[15px] py-[8.5px] rounded-[5px] ${formData.maintenancePlan === 'No' ? 'bg-[#725CF7] PopupAttentionShadow' : 'bg-[#2A2A2D] ContentCardShadow'
                                                } ContentCardShadow text-xs`}
                                        >
                                            No
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, maintenancePlan: 'Unsure' })}
                                            className={`inline-flex items-center justify-center px-[15px] py-[8.5px] rounded-[5px] ${formData.maintenancePlan === 'Unsure' ? 'bg-[#725CF7] PopupAttentionShadow' : 'bg-[#2A2A2D] ContentCardShadow'
                                                } ContentCardShadow text-xs`}
                                        >
                                            Unsure
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Information Section */}
                    <div className="flex flex-col w-[1094px] items-start gap-2.5">
                        <div className="font-semibold text-xl leading-[normal]">Additional Information</div>

                        <div className="flex items-start gap-[15px] w-full">
                            <div className="inline-flex items-start gap-2.5 self-stretch">
                                <div className={`flex w-[30px] h-[30px] items-center justify-center gap-2.5 rounded-[100px] ${formData.projectName && formData.dueDate && formData.projectDescription && formData.platform && formData.estimatedBudget && formData.paymentPlan && formData.maintenancePlan ? "bg-[#725CF7] PopupAttentionShadow" : "bg-[#2A2A2D] ContentCardShadow"}`}>
                                    <div className="leading-[normal]">5</div>
                                </div>
                                <div className="w-0.5 bg-[#80808040] rounded-[100px]" />
                            </div>

                            <div className="flex w-full justify-between">
                                {/* Notes for Lucidify */}
                                <div className="flex flex-col w-[492px] items-start gap-[18px]">
                                    <div className="flex flex-col items-start gap-[13px] w-full">
                                        <div className="text-sm leading-[normal]">Notes for Lucidify (Optional)</div>
                                        <input
                                            className="max-h-[38px] w-full rounded-[10px] px-[17px] py-2.5 LightGrayGradient ContentCardShadow text-xs"
                                            value={formData.notes}
                                            onChange={handleNotesChange}
                                            placeholder="Anything else?"
                                        />
                                    </div>
                                </div>

                                {/* Other Attachments */}
                                <div className="flex flex-col w-[492px] items-start gap-[13px]">
                                    <div className="text-sm leading-[normal]">Other Attachments (Optional)</div>
                                    <div className="flex max-h-[38px] h-[38px] items-center gap-[19px] px-0 py-2.5 w-full rounded-[10px]">
                                        <div className="flex w-[38px] h-[38px] items-center justify-center gap-2.5 rounded-[100px] BlackWithLightGradient ContentCardShadow">
                                            <div className="w-[20px]">
                                                <Image src="/Upload Icon.png" alt="Upload Icon" layout="responsive" width={0} height={0} />
                                            </div>
                                        </div>
                                        <label className="w-[246px] text-xs leading-[normal]">
                                            <span className="font-normal text-xs">Drag &amp; Drop your files here or </span>
                                            <span className="underline">Choose file</span>
                                            <input
                                                type="file"
                                                className=""
                                                onChange={handleAttachmentUpload}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>



                </div>
                <div className="w-full my-[15px] opacity-25 border-[1.5px] border-[#808080] rounded-full" />

                <button
                    type="submit"
                    className={`py-[8px] w-full inline-flex items-center justify-center text-[16px] rounded-[10px] ${formData.projectName && formData.dueDate && formData.projectDescription && formData.platform && formData.estimatedBudget && formData.paymentPlan && formData.maintenancePlan ? "PopupAttentionGradient PopupAttentionShadow" : "PopupAttentionGradient ContentCardShadow opacity-50"}`}
                    disabled={!formData.projectName || !formData.dueDate || !formData.projectDescription || !formData.platform || !formData.estimatedBudget || !formData.paymentPlan || !formData.maintenancePlan}
                >
                    Create Project
                </button>
            </form>
        </div>
    );
};

export default CreateProjectPopup;
