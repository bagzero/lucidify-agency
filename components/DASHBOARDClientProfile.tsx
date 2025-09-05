import { useEffect, useState } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import DashboardClientSideNav from './DashboardClientSideNav';
import Image from 'next/image';
import Link from 'next/link';
import Router from 'next/router';

type ServiceType = string;
type ChallengeType = string;

const DASHBOARDClientProfile = () => {
    const [userData, setUserData] = useState<{
        selectedAvatar: string | null;
        firstName: string | null;
        lastName: string | null;
        phoneNumber: number | null;
        companyName: string | null;
        companyURL: string;
        companySize: string;
        companyRole: string;
        selectedServices: ServiceType[];
        customService: string | null;
        idealOutcome: string;
        selectedChallenges: ChallengeType[];
        customChallenge: string | null;

    }>({
        selectedAvatar: null,
        firstName: "",
        lastName: "",
        phoneNumber: null, // Default value for number
        companyName: "",
        companyURL: '', // Default empty string for strings
        companySize: '', // Default empty string
        companyRole: '', // Default empty string
        selectedServices: [], // Default empty array
        customService: null,
        idealOutcome: '',
        selectedChallenges: [], // Default empty array
        customChallenge: null,
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const currentUser = auth.currentUser;

                if (currentUser) {
                    const userRef = doc(db, "users", currentUser.uid);
                    const userDoc = await getDoc(userRef);

                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        setUserData({
                            selectedAvatar: data?.selectedAvatar || null,
                            companyName: data?.companyName || null,
                            firstName: data?.firstName || null,
                            lastName: data?.lastName || null,
                            phoneNumber: data?.phoneNumber || 0, // Default to 0
                            companyURL: data?.companyURL || '', // Default to empty string
                            companySize: data?.companySize || '', // Default to empty string
                            companyRole: data?.companyRole || '', // Default to empty string
                            selectedServices: data?.selectedServices || [], // Default to empty array
                            customService: data?.customService || null, // Default to null
                            idealOutcome: data?.idealOutcome || '', // Default to empty string
                            selectedChallenges: data?.selectedChallenges || [], // Default to empty array
                            customChallenge: data?.customChallenge || '', // Default to empty string
                        });
                    } else {
                        console.error("User document does not exist.");
                    }
                } else {
                    console.error("No current user logged in.");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []);

    const { selectedAvatar, companyName, firstName, lastName, phoneNumber, companyURL, companySize, companyRole, selectedServices, customService, idealOutcome, selectedChallenges, customChallenge,
    } = userData;

    return (
        <div className="flex h-screen DashboardBackgroundGradient relative">


            {/* Left Sidebar */}
            <DashboardClientSideNav highlight="none" />

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
                            <div className="w-fit mt-[-1.00px] font-light text-sm tracking-[0] leading-[normal]">
                                Home
                            </div>
                        </div>
                        <div className="inline-flex items-center gap-[5px]">
                            <div className=" w-fit mt-[-1.00px] font-light text-sm tracking-[0] leading-[normal]">
                                / Profile
                            </div>
                        </div>
                    </div>
                    <div className="inline-flex items-center gap-5">
                        <div className="flex w-[55px] h-[55px] items-center justify-center gap-2.5 relative rounded-[100px] BlackGradient ContentCardShadow hover:cursor-pointer">
                            <div className="flex flex-col w-5 h-5 items-center justify-center gap-2.5 px-[3px] py-0 absolute -top-[5px] -left-[4px] bg-[#6265f0] rounded-md">
                                <div className=" w-fit font-normal text-xs tracking-[0] leading-[normal]">
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
                            className="flex w-[129px] h-[55px] items-center justify-center gap-2.5 px-0 py-[15px]  rounded-[15px] BlackGradient ContentCardShadow"
                        >
                            <div className=" w-fit font-light text-sm tracking-[0] leading-[normal]">
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
                    <div className="flex flex-col gap-[15px] relative w-full mx-[50px] my-[30px]">
                        <div className="flex flex-col">
                            <h1 className="text-[30px] font-semibold mb-[2px]">Account Settings</h1>
                            <h3 className="text-[14px] font-light opacity-60">
                                Manage your profile settings here.
                            </h3>
                        </div>

                        <div className="flex justify-between">
                            <div className="inline-flex flex-col gap-[30px]">

                                <div className="w-[770px] inline-flex flex-col gap-[20px] px-[35px] py-[20px] BlackGradient ContentCardShadow rounded-[15px]">
                                    <div className="flex justify-start items-center gap-[20px]">
                                        <div className="w-[85px]">
                                            <Image
                                                src={"/" + selectedAvatar || auth.currentUser?.photoURL || "/Lucidify Umbrella.png"} // Use selectedAvatar or fallback image
                                                alt="Logo Icon"
                                                layout="responsive"
                                                width={0}
                                                height={0}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-[3px] max-w-[475px]">
                                            <h1 className="text-[24px] font-semibold">{firstName} {lastName}</h1>
                                            <div className="flex flex-col gap-[1px]">
                                                <h1 className="text-[13px] opacity-60">Lucidify Member</h1>
                                                <h1 className="text-[12px] font-light opacity-60">Lucidify Member</h1>
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

export default DASHBOARDClientProfile;
