import Image from 'next/image';
import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Adjust the path as needed

interface CreateProjectPopupProps {
    closeCreatProjectPopup: () => void;
    isVisible: boolean;
}

const CreateProjectPopup: React.FC<CreateProjectPopupProps> = ({ closeCreatProjectPopup, isVisible }) => {
    // State for form data
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        companyName: '',
        industry: '',
        projectDetails: '',
    });

    // State for submission status
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Add the form data to Firestore
            await addDoc(collection(db, 'project ideas'), formData);
            setIsSubmitted(true); // Set submission status to true
        } catch (error) {
            console.error('Error submitting project idea:', error);
            alert('Failed to submit project idea. Please try again.');
        }
    };
    return (
        <div className={`h-screen bg-black bg-opacity-50 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 pointer-events-none translate-y-[50px]'} fixed inset-x-0 flex justify-center items-center z-10`}>
            <div className={`relative flex max-h-[83vh] overflow-y-auto flex-col items-start px-[50px] py-5 z-10 BlackGradient ContentCardShadow rounded-[50px]`}>

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
                        <Image
                            src="/Plus Icon.png"
                            alt="Plus Icon"
                            layout="responsive"
                            width={0}
                            height={0}
                        />
                    </div>
                </div>

                <div className="w-full my-[15px] opacity-25 border-[1.5px] border-[#808080] rounded-full" />

                <div className="inline-flex flex-col items-start gap-[50px] ">
                    <div className="inline-flex flex-col items-start gap-2.5 ">
                        <div className=" font-semibold  text-xl   leading-[normal]">
                            Project Details
                        </div>
                        <div className="flex items-start gap-[15px]  w-full">
                            <div className="inline-flex items-start gap-2.5  self-stretch">
                                <div className="flex w-[30px] h-[30px] items-center justify-center gap-2.5  rounded-[100px] PopupAttentionGradient PopupAttentionShadow">
                                    <div className="  leading-[normal]">
                                        1
                                    </div>
                                </div>
                                <div className=" w-0.5 bg-[#80808040] rounded-[100px]" />
                            </div>
                            <div className="flex flex-wrap w-[1037px] items-center justify-between gap-[15px_15px] ">
                                <div className="flex flex-col w-[492px] items-start gap-[13px] ">
                                    <p className=" text-sm   leading-[normal]">
                                        <span className="">Project Name</span>
                                        <span className="text-[#998af8]">*</span>
                                    </p>
                                    <div className="flex max-h-[38px] items-start gap-2.5 px-[17px] py-2.5  w-full rounded-[10px] LightGrayGradient ContentCardShadow">
                                        <p className=" w-[458px]   text-xs leading-[normal]">
                                            Ottoman - Redesign Landing Page
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col w-[492px] items-start gap-[13px] ">
                                    <p className="   text-sm leading-[normal]">
                                        <span className="">Estimated Due Date</span>
                                        <span className="text-[#998af8]">*</span>
                                    </p>
                                    <div className="items-start px-[17px] py-2.5 LightGrayGradient ContentCardShadow flex max-h-[38px] justify-between  w-full rounded-[10px]">
                                        <div className="   text-xs leading-[normal]">
                                            10/10/2024
                                        </div>
                                        <div className="w-[15px]">
                                            <Image
                                                src="/Calendar Icon.png"
                                                alt="Calendar Icon"
                                                layout="responsive"
                                                width={0}
                                                height={0}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col w-[492px] items-start gap-[13px] ">
                                    <p className=" text-sm   leading-[normal]">
                                        <span className="">Project Description</span>
                                        <span className="text-[#998af8]">*</span>
                                    </p>
                                    <div className="flex max-h-14 items-start justify-around gap-2.5 px-[17px] py-2.5  w-full rounded-[10px] LightGrayGradient ContentCardShadow">
                                        <p className=" w-[458px]   text-xs leading-[normal]">
                                            Redesigning Ottoman’s landing page to increase revenue and customer traffic. Expecting a increase in
                                            incoming traffic of at least 50%.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col w-[492px] items-start gap-[13px] ">
                                    <div className="   text-sm leading-[normal]">
                                        Upload Logo (Optional)
                                    </div>
                                    <div className="h-[38px] items-center px-0 py-2.5 flex max-h-[38px] justify-between w-full rounded-[10px]">
                                        <div className="flex w-[38px] h-[38px] items-center justify-center gap-2.5  rounded-[100px] BlackWithLightGradient ContentCardShadow">
                                            <div className="w-[20px]">
                                                <Image
                                                    src="/Upload Icon.png"
                                                    alt="Upload Icon"
                                                    layout="responsive"
                                                    width={0}
                                                    height={0}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex w-[437px] h-[38px] items-center gap-2.5 px-5 py-[13px]  rounded-[10px] SearchBackground ContentCardShadow">
                                            <div className="flex w-[348px] items-center gap-2.5 ">
                                                <div className="inline-flex items-center justify-center gap-2.5  rounded-sm">
                                                    <div className="w-[15px]">
                                                        <Image
                                                            src="/Picture Icon.png"
                                                            alt="Picture Icon"
                                                            layout="responsive"
                                                            width={0}
                                                            height={0}
                                                        />
                                                    </div>                                            </div>
                                                <div className="inline-flex h-[18px] items-center justify-center gap-[3px] ">
                                                    <div className="text-xs leading-[normal]">
                                                        Ottoman Logo.png
                                                    </div>
                                                    <div className=" text-[#ffffff99] text-[10px] leading-[normal]">
                                                        • 4.2 MB
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="inline-flex flex-col items-start gap-2.5 ">
                        <div className="   font-semibold  text-xl leading-[normal]">
                            Website Requirements
                        </div>
                        <div className="flex items-start gap-[15px]  w-full">
                            <div className="inline-flex items-start gap-2.5  self-stretch">
                                <div className="flex w-[30px] h-[30px] items-center justify-center gap-2.5  rounded-[100px] PopupAttentionGradient PopupAttentionShadow">
                                    <div className="  leading-[normal]">
                                        2
                                    </div>
                                </div>
                                <div className=" w-0.5 bg-[#80808040] rounded-[100px]" />
                            </div>
                            <div className="w-[1037px] justify-between flex flex-wrap items-center gap-[0px_15px] ">
                                <div className="flex flex-col w-[492px] items-start gap-[18px] ">
                                    <div className="flex flex-col items-start gap-[13px]  w-full">
                                        <p className="   text-sm leading-[normal]">
                                            <span className="">Platform</span>
                                            <span className="text-[#998af8]">*</span>
                                        </p>
                                        <div className="flex items-center justify-between  w-full">
                                            <div className="inline-flex items-center justify-center px-[15px] py-[8.5px] rounded-[5px] BlackGradient ContentCardShadow">
                                                <div className="  text-xs leading-[normal]">
                                                    Custom Code
                                                </div>
                                            </div>
                                            <div className="inline-flex items-center justify-center px-[15px] py-[8.5px] rounded-[5px] PopupAttentionGradient PopupAttentionShadow">
                                                <div className="  text-xs leading-[normal]">
                                                    WordPress
                                                </div>
                                            </div>
                                            <div className="inline-flex items-center justify-center px-[15px] py-[8.5px] rounded-[5px] BlackGradient ContentCardShadow">
                                                <div className="  text-xs leading-[normal]">
                                                    Shopify
                                                </div>
                                            </div>
                                            <div className="inline-flex items-center justify-center px-[15px] py-[8.5px] rounded-[5px] BlackGradient ContentCardShadow">
                                                <div className="  text-xs leading-[normal]">
                                                    Wix
                                                </div>
                                            </div>
                                            <div className="inline-flex items-center justify-center px-[15px] py-[8.5px] rounded-[5px] BlackGradient ContentCardShadow">
                                                <div className="  text-xs leading-[normal]">
                                                    Unsure
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-start gap-[13px]  w-full">
                                        <div className="   text-sm leading-[normal]">
                                            Design Inspirations (Optional)
                                        </div>
                                        <div className="flex w-[487px] items-center justify-between ">
                                            <div className="flex w-[235px] max-h-[38px] items-start gap-2.5 px-[17px] py-2.5  rounded-[10px] LightGrayGradient ContentCardShadow">
                                                <div className=" w-[201px]   text-xs leading-[normal]">
                                                    https://www.virgin.com/
                                                </div>
                                            </div>
                                            <div className="flex w-[235px] max-h-[38px] items-start gap-2.5 px-[17px] py-2.5  rounded-[10px] LightGrayGradient ContentCardShadow">
                                                <div className=" w-[201px]   text-xs leading-[normal]">
                                                    https://www.chick-fil-a.com/
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col w-[492px] h-[159px] items-start gap-[13px] ">
                                    <div className="   text-sm leading-[normal]">
                                        Subpages (Optional)
                                    </div>
                                    <div className="flex-wrap items-center justify-center gap-[15px_20px] flex  w-full">
                                        <div className="BlackGradient ContentCardShadow inline-flex items-center justify-center px-[15px] py-[7px]  rounded-[5px]">
                                            <div className="  text-xs leading-[normal]">
                                                About
                                            </div>
                                        </div>
                                        <div className="PopupAttentionGradient PopupAttentionShadow inline-flex items-center justify-center px-[15px] py-[7px]  rounded-[5px]">
                                            <div className="  text-xs leading-[normal]">
                                                Services
                                            </div>
                                        </div>
                                        <div className="inline-flex items-center justify-center px-[15px] py-[7px]  rounded-[5px] PopupAttentionGradient PopupAttentionShadow ">
                                            <div className="  text-xs leading-[normal]">
                                                Contact
                                            </div>
                                        </div>
                                        <div className="BlackGradient ContentCardShadow inline-flex items-center justify-center px-[15px] py-[7px]  rounded-[5px]">
                                            <div className="  text-xs leading-[normal]">
                                                Testimonials
                                            </div>
                                        </div>
                                        <div className="BlackGradient ContentCardShadow inline-flex items-center justify-center px-[15px] py-[7px]  rounded-[5px]">
                                            <div className="  text-xs leading-[normal]">
                                                FAQ
                                            </div>
                                        </div>
                                        <div className="PopupAttentionGradient PopupAttentionShadow inline-flex items-center justify-center px-[15px] py-[7px]  rounded-[5px]">
                                            <div className="  text-xs leading-[normal]">
                                                Pricing
                                            </div>
                                        </div>
                                        <div className="BlackGradient ContentCardShadow inline-flex items-center justify-center px-[15px] py-[7px]  rounded-[5px]">
                                            <div className="  text-xs leading-[normal]">
                                                Gallery
                                            </div>
                                        </div>
                                        <div className="BlackGradient ContentCardShadow inline-flex items-center justify-center px-[15px] py-[7px]  rounded-[5px]">
                                            <div className="  text-xs leading-[normal]">
                                                Events
                                            </div>
                                        </div>
                                        <div className="BlackGradient ContentCardShadow inline-flex items-center justify-center px-[15px] py-[7px]  rounded-[5px]">
                                            <div className="  text-xs leading-[normal]">
                                                Menu
                                            </div>
                                        </div>
                                        <div className="BlackGradient ContentCardShadow inline-flex items-center justify-center px-[15px] py-[7px]  rounded-[5px]">
                                            <div className="  text-xs leading-[normal]">
                                                Online Ordering
                                            </div>
                                        </div>
                                        <div className="BlackGradient ContentCardShadow inline-flex items-center justify-center px-[15px] py-[7px]  rounded-[5px]">
                                            <div className="  text-xs leading-[normal]">
                                                Reservations
                                            </div>
                                        </div>
                                        <div className="BlackGradient ContentCardShadow inline-flex items-center justify-center px-[15px] py-[7px]  rounded-[5px]">
                                            <div className=" text-[#ffffffa6] text-xs leading-[normal]">
                                                Custom...
                                            </div>
                                        </div>
                                        <div className="BlackGradient ContentCardShadow inline-flex items-center justify-center px-[15px] py-[7px]  rounded-[5px]">
                                            <div className=" font-normal text-[#ffffffa6] text-xs leading-[normal]">
                                                Custom...
                                            </div>
                                        </div>
                                        <div className="BlackGradient ContentCardShadow inline-flex items-center justify-center px-[15px] py-[7px]  rounded-[5px]">
                                            <div className=" font-normal text-[#ffffffa6] text-xs leading-[normal]">
                                                Custom...
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="inline-flex flex-col items-start gap-2.5 ">
                        <div className="inline-flex items-center justify-center gap-2.5 ">
                            <div className="font-semibold  text-xl   leading-[normal]">
                                Payment Details
                            </div>
                            <div className="inline-flex items-center justify-center gap-[5px] ">
                                <div className="flex flex-col w-[18px] h-[18px] items-center justify-center gap-2.5 px-[5px] py-0  rounded-[100px] LightGrayGradient ContentCardShadow">
                                    <div className=" font-normal  text-[10px] leading-[normal]">
                                        i
                                    </div>
                                </div>
                                <p className=" text-[#ffffffa6] text-xs leading-[normal]">
                                    We only start charging after you decide to proceed with one of our free web designs.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-[15px]  w-full">
                            <div className="inline-flex items-start gap-2.5  self-stretch">
                                <div className="flex w-[30px] h-[30px] items-center justify-center gap-2.5  rounded-[100px] PopupAttentionGradient PopupAttentionShadow">
                                    <div className="  leading-[normal]">
                                        3
                                    </div>
                                </div>
                                <div className=" w-0.5 bg-[#80808040] rounded-[100px]" />
                            </div>
                            <div className="flex flex-col w-[1037px] items-start gap-[15px] ">
                                <div className="flex flex-col w-[1037px] items-start gap-[13px] ">
                                    <p className="   text-sm leading-[normal]">
                                        <span className="">Estimated Budget Range (your budget sets our level of effort)</span>
                                        <span className="text-[#998af8]">*</span>
                                    </p>
                                    <div className="items-start gap-[30px] flex  w-full">
                                        <div className="inline-flex items-center justify-center px-[15px] py-[8.5px]  rounded-[5px] BlackGradient ContentCardShadow">
                                            <div className="  text-xs leading-[normal]">
                                                $500-$1k
                                            </div>
                                        </div>
                                        <div className="inline-flex items-center justify-center px-[15px] py-[8.5px]  rounded-[5px] PopupAttentionGradient PopupAttentionShadow">
                                            <div className="  text-xs leading-[normal]">
                                                $1k-$2k
                                            </div>
                                        </div>
                                        <div className="inline-flex items-center justify-center px-[15px] py-[8.5px]  rounded-[5px] BlackGradient ContentCardShadow">
                                            <div className="  text-xs leading-[normal]">
                                                $2k-$3k
                                            </div>
                                        </div>
                                        <div className="inline-flex items-center justify-center px-[15px] py-[8.5px]  rounded-[5px] BlackGradient ContentCardShadow">
                                            <div className="  text-xs leading-[normal]">
                                                $3k+
                                            </div>
                                        </div>
                                        <div className="inline-flex items-center justify-center px-[15px] py-[8.5px]  rounded-[5px] BlackGradient ContentCardShadow">
                                            <div className="  text-xs leading-[normal]">
                                                Unsure
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-start gap-[13px] ">
                                    <p className=" text-sm   leading-[normal]">
                                        <span className="">Payment Plan</span>
                                        <span className="text-[#998af8]">*</span>
                                    </p>
                                    <div className="flex-wrap items-start gap-[15px_30px] flex  w-full">
                                        <div className="BlackGradient ContentCardShadow inline-flex items-center justify-center px-[15px] py-[8.5px] rounded-[5px]">
                                            <div className="  text-xs leading-[normal]">
                                                100% Upfront
                                            </div>
                                        </div>
                                        <div className="BlackGradient ContentCardShadow inline-flex items-center justify-center px-[15px] py-[8.5px] rounded-[5px]">
                                            <div className="  text-xs leading-[normal]">
                                                2 Weekly (50%)
                                            </div>
                                        </div>
                                        <div className="BlackGradient ContentCardShadow inline-flex items-center justify-center px-[15px] py-[8.5px] rounded-[5px]">
                                            <div className="  text-xs leading-[normal]">
                                                3 Weekly (33%)
                                            </div>
                                        </div>
                                        <div className="inline-flex items-center justify-center px-[15px] py-[8.5px] rounded-[5px] PopupAttentionGradient PopupAttentionShadow">
                                            <div className="  text-xs leading-[normal]">
                                                4 Weekly (25%)
                                            </div>
                                        </div>
                                        <div className="BlackGradient ContentCardShadow inline-flex items-center justify-center px-[15px] py-[8.5px] rounded-[5px]">
                                            <div className="  text-xs leading-[normal]">
                                                5 Weekly (20%)
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="inline-flex flex-col items-start gap-2.5 ">
                        <div className="inline-flex items-center justify-center gap-2.5 ">
                            <div className="   font-semibold  text-xl leading-[normal]">
                                Maintenance Plan
                            </div>
                            <div className="inline-flex items-center justify-center gap-[5px] ">
                                <div className="flex flex-col w-[18px] h-[18px] items-center justify-center gap-2.5 px-[5px] py-0  rounded-[100px] LightGrayGradient ContentCardShadow">
                                    <div className="  text-[10px] leading-[normal]">
                                        i
                                    </div>
                                </div>
                                <p className="  text-[#ffffffa6] text-xs leading-[normal]">
                                    Continued website maintenance includes all custom changes to the website, additional sections, and
                                    fixing all bugs.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-[15px]  w-full">
                            <div className="inline-flex items-start gap-2.5  self-stretch">
                                <div className="flex w-[30px] h-[30px] items-center justify-center gap-2.5  rounded-[100px] PopupAttentionGradient PopupAttentionShadow">
                                    <div className="  leading-[normal]">
                                        4
                                    </div>
                                </div>
                                <div className=" w-0.5 bg-[#80808040] rounded-[100px]" />
                            </div>
                            <div className="flex flex-col w-[1037px] items-start gap-[15px] ">
                                <div className="flex flex-col w-[1037px] items-start gap-[13px] ">
                                    <p className="   text-sm leading-[normal]">
                                        <span className="">
                                            Would you like the maintenance plan? ($100 / month AFTER the development of the website)
                                        </span>
                                        <span className="text-[#998af8]">*</span>
                                    </p>
                                    <div className="items-center gap-[30px] flex  w-full">
                                        <div className="inline-flex items-center justify-center px-[15px] py-[8.5px]  rounded-[5px] PopupAttentionGradient PopupAttentionShadow">
                                            <div className="  text-xs leading-[normal]">
                                                Yes
                                            </div>
                                        </div>
                                        <div className="inline-flex items-center justify-center px-[15px] py-[8.5px]  rounded-[5px] BlackGradient ContentCardShadow">
                                            <div className="  text-xs leading-[normal]">
                                                No
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col w-[1094px] items-start gap-2.5 ">
                        <div className="   font-semibold  text-xl leading-[normal]">
                            Additional Information
                        </div>
                        <div className="flex items-start gap-[15px]  w-full">
                            <div className="inline-flex items-start gap-2.5  self-stretch">
                                <div className="flex w-[30px] h-[30px] items-center justify-center gap-2.5  rounded-[100px] [background:linear-gradient(180deg,rgb(45.69,45.69,45.69)_0.01%,rgb(31.88,31.88,31.88)_100%)]">
                                    <div className="  leading-[normal]">
                                        5
                                    </div>
                                </div>
                                <div className=" w-0.5 bg-[#80808040] rounded-[100px]" />
                            </div>
                            <div className="flex w-[1037px] items-start justify-between ">
                                <div className="w-[492px] justify-around flex flex-wrap items-center gap-[0px_15px] ">
                                    <div className="flex flex-col w-[492px] items-start gap-[18px] ">
                                        <div className="flex flex-col items-start gap-[13px]  w-full">
                                            <div className="   text-sm leading-[normal]">
                                                Notes for Lucidify (Optional)
                                            </div>
                                            <div className="flex max-h-[38px] items-start gap-2.5 px-[17px] py-2.5  w-full rounded-[10px] LightGrayGradient ContentCardShadow">
                                                <p className="   text-xs leading-[normal]">
                                                    This is a wedding planner type of business. Are you experienced with it?
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col w-[492px] items-start gap-[13px] ">
                                    <div className="   text-sm leading-[normal]">
                                        Other Attachments (Optional)
                                    </div>
                                    <div className="flex max-h-[38px] h-[38px] items-center gap-[19px] px-0 py-2.5  w-full rounded-[10px]">
                                        <div className="flex w-[38px] h-[38px] items-center justify-center gap-2.5  rounded-[100px] BlackWithLightGradient ContentCardShadow">
                                            <div className="w-[20px]">
                                                <Image
                                                    src="/Upload Icon.png"
                                                    alt="Upload Icon"
                                                    layout="responsive"
                                                    width={0}
                                                    height={0}
                                                />
                                            </div>                                    </div>
                                        <p className=" w-[246px]   text-xs leading-[normal]">
                                            <span className=" font-normal  text-xs">
                                                Drag &amp; Drop your files here or{" "}
                                            </span>
                                            <span className="underline">Choose file</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full my-[15px] opacity-25 border-[1.5px] border-[#808080] rounded-full" />


                <div className="flex flex-col h-[41px] items-center justify-center gap-2.5 px-[18px] py-2  w-full rounded-[10px] PopupAttentionGradient ContentCardShadow">
                    <div className="inline-flex items-center gap-1.5 ">
                        <div className="   text-center leading-[normal]">
                            Create Project
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateProjectPopup