import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Adjust the path as needed
import { useAuth } from '@/context/authContext'; // Import your AuthContext
import { useRouter } from 'next/navigation';    // Import Next.js router
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Import Firebase Storage

interface CreateWebDesignPopupProps {
    closeCreatProjectPopup: () => void;
    isVisible: boolean;
    projectId: string; // Add projectId to the props
    userId: string;
}

interface FormData {
    designName: string;
    designDescription: string;
    designURL: string;
    designPage: "Sections" | "Full-Page" | "";
    designType: string;
    dateCreated: string;
    selectedDesign: boolean;
}

// Function to get the ordinal suffix
const getOrdinal = (n: number): string => {
    const suffixes = ["th", "st", "nd", "rd"];
    const value = n % 100;
    return suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0];
};

const CreateWebDesignPopup: React.FC<CreateWebDesignPopupProps> = ({ closeCreatProjectPopup, isVisible, projectId, userId }) => {
    const { user } = useAuth();  // Access the authenticated user
    const router = useRouter();  // Access the router

    // Redirect to login if there's no user
    useEffect(() => {
        if (!user) {
            router.push("/login");  // Redirect the user to the login page
        }
    }, [user, router]);

    const [formData, setFormData] = useState<FormData>({
        designName: '',
        designDescription: '',
        designURL: '',
        designPage: '',
        designType: '',
        dateCreated: new Date().toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        }).replace(/(\d+)/, (match) => `${match}${getOrdinal(parseInt(match))}`), // Append ordinal suffix
        selectedDesign: false,
    });

    const designPages = ["Sections", "Full-Page"] as const; // 'as const' makes this a readonly tuple of literal types


    const [isSubmitted, setIsSubmitted] = useState(false);

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    };

    // Handle designType toggle (button acting like a radio button, only one designType can be selected)
    const handleDesignTypeToggle = (type: string) => {
        setFormData(prev => ({
            ...prev,
            designType: prev.designType === type ? "" : type // toggle string
        }));
    };

    // Handle designType toggle (button acting like a radio button, only one designType can be selected)
    const handleDesignPageToggle = (page: "Sections" | "Full-Page") => {
        setFormData(prev => ({
            ...prev,
            designPage: prev.designPage === page ? "" : page // toggle string
        }));
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            console.error('User is not logged in');
            return;
        }

        if (!formData.designPage) {
            console.error('Design page type is missing');
            return;
        }

        try {
            console.log(formData.designPage);
            // Determine the subcollection path based on designPage value
            const subCollectionPath =
                formData.designPage == 'Sections'
                    ? `users/${userId}/projects/${projectId}/section web designs`
                    : `users/${userId}/projects/${projectId}/full-page web designs`;

            console.log(subCollectionPath);

            // Reference to the appropriate subcollection
            const designRef = collection(db, subCollectionPath);

            console.log(designRef);
            // Add the design data to the appropriate subcollection
            await addDoc(designRef, formData);

            console.log('Web design successfully created!');

            // Optionally, redirect or close the popup after submission
            closeCreatProjectPopup();
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };

    // Handle file upload for attachments
    // Handle file upload for attachments using Cloudinary
    // Handle file upload for attachments using Cloudinary
    // Handle Logo Upload
    const handleDesignUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;

        if (file && user) { // Ensure user is available and file is selected
            try {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", "Unsigned Presets"); // Replace with your Cloudinary upload preset

                // Set the folder path for the logo inside the user's UID folder
                const folderPath = `users/${userId}/webDesigns`; // Logo-specific folder path
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
                        designURL: downloadURL, // Save the logo URL in the form data
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


    return (
        <div
            className={`h-screen bg-black bg-opacity-50 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 pointer-events-none translate-y-[50px]'} fixed inset-x-0 flex justify-center items-center z-20`}
        >
            <form
                className="relative flex max-h-[83vh] BlackScrollbar overflow-y-auto flex-col items-start px-[50px] py-5 BlackGradient ContentCardShadow rounded-[50px]"
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
                        Create a Web Design.
                    </div>
                </div>
                <div className="flex flex-col w-[35px] h-[35px] items-center justify-center gap-2.5 p-1.5 absolute right-[50px] rounded-[100px] CloseCreateProjectPoppupGradient ContentCardShadow hover:cursor-pointer" onClick={closeCreatProjectPopup}>
                    <div className=" w-[20px] rotate-45">
                        <Image src="/Plus Icon.png" alt="Plus Icon" layout="responsive" width={0} height={0} />
                    </div>
                </div>

                <div className="w-full my-[15px] opacity-25 border-[1.5px] border-[#808080] rounded-full" />

                <div className="inline-flex flex-col items-start gap-[50px] mb-[25px]">
                    <div className="inline-flex flex-col items-start gap-2.5">
                        <div className="font-semibold text-xl">Web Design Details</div>
                        <div className="flex items-start gap-[15px] w-full">
                            <div className="inline-flex items-start gap-2.5 self-stretch">
                                <div className={`flex w-[30px] h-[30px] items-center justify-center gap-2.5 rounded-[100px] ${formData.designName && formData.designDescription ? "bg-[#725CF7] PopupAttentionShadow" : "bg-[#2A2A2D] ContentCardShadow"}`}>
                                    <div>1</div>
                                </div>
                                <div className="w-0.5 bg-[#80808040] rounded-[100px]" />
                            </div>
                            <div className="flex flex-wrap w-[1037px] items-center justify-between gap-[15px_15px]">
                                {/* Upload Logo */}
                                <div className="flex flex-col w-[492px] items-start gap-[13px]">
                                    <div className="text-sm leading-[normal]">Upload Design<span className="text-[#998af8] text-[16px] font-bold">*</span></div>
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
                                                onChange={handleDesignUpload}
                                                accept=".png,.jpg,.jpeg,.pdf" // Adjust accepted file types
                                            />
                                        </label>
                                    </div>
                                </div>

                                {/* Project Name */}
                                <div className="flex flex-col w-[492px] items-start gap-[13px]">
                                    <p className="text-sm">
                                        Design Name<span className="text-[#998af8] text-[16px] font-bold">*</span>
                                    </p>
                                    <input
                                        id="designName"
                                        type="text"
                                        value={formData.designName}
                                        onChange={handleInputChange}
                                        placeholder="Modern Homepage Redesign"
                                        required
                                        className="max-h-[38px] w-full rounded-[10px] px-[17px] py-2.5 LightGrayGradient ContentCardShadow text-xs"
                                    />
                                </div>



                                {/* Project Description */}
                                <div className="flex flex-col w-[492px] items-start gap-[13px]">
                                    <p className="text-sm">
                                        Design Description<span className="text-[#998af8] text-[16px] font-bold">*</span>
                                    </p>
                                    <input
                                        id="designDescription"
                                        value={formData.designDescription}
                                        onChange={handleInputChange}
                                        placeholder="Professional sleek design of a homepage, involving a homepage moving video and SSR."
                                        required
                                        className="max-h-14 w-full rounded-[10px] px-[17px] py-2.5 LightGrayGradient ContentCardShadow text-xs"
                                    />
                                </div>
                                {/* designTypes Section */}
                                <div className="inline-flex flex-col w-[492px] items-start gap-2.5">
                                    <p className="text-sm">
                                        Design Page<span className="text-[#998af8] text-[16px] font-bold">*</span>
                                    </p>
                                    <div className="flex flex-wrap gap-[15px_20px] w-full justify-start">
                                        {designPages.map((page) => (
                                            <button
                                                key={page}
                                                type="button"
                                                onClick={() => handleDesignPageToggle(page)}
                                                className={`px-4 py-2 rounded-[10px] text-white text-[12px] ${formData.designPage === page
                                                    ? 'bg-[#725CF7] PopupAttentionShadow'
                                                    : 'bg-[#2A2A2D] ContentCardShadow'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                {/* designTypes Section */}
                                <div className="inline-flex flex-col items-start gap-2.5">
                                    <p className="text-sm">
                                        Design Type<span className="text-[#998af8] text-[16px] font-bold">*</span>
                                    </p>
                                    <div className="flex flex-wrap gap-[15px_20px] w-full justify-start">
                                        {['Homepage', 'About', 'Services', 'Contact', 'Testimonials', 'FAQ', 'Pricing', 'Gallery', 'Events', 'Menu', 'Online Ordering', 'Reservations', 'Our Team', 'Blog', 'Portfolio', 'Support', 'Log in', 'Sign up', 'Social Media'].map((designType) => (
                                            <button
                                                type="button"
                                                key={designType}
                                                onClick={() => handleDesignTypeToggle(designType)}
                                                className={`px-4 py-2 rounded-[10px] text-white text-[12px] ${formData.designType.includes(designType)
                                                    ? 'bg-[#725CF7] PopupAttentionShadow'
                                                    : 'bg-[#2A2A2D] ContentCardShadow'
                                                    }`}
                                            >
                                                {designType}
                                            </button>
                                        ))}
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>

                </div>
                <button
                    type="submit"
                    className={`py-[8px] w-full inline-flex items-center justify-center text-[16px] rounded-[10px] ${formData.designName && formData.designDescription && formData.designURL && formData.designPage && formData.designType ? "PopupAttentionGradient PopupAttentionShadow" : "PopupAttentionGradient ContentCardShadow opacity-50"}`}
                    disabled={!formData.designName || !formData.designDescription || !formData.designURL || !formData.designType || !formData.designPage}
                >
                    Create Web Design
                </button>
            </form>
        </div>
    );
};

export default CreateWebDesignPopup;