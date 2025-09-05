import { auth, db } from '@/firebaseConfig';
import { collection, doc, getDoc, getDocs, onSnapshot } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

type DashboardClientSideNavProps = {
    highlight: "getStarted" | "dashboard" | "projects" | "messages" | "transactions" | "none";
}

const DashboardClientSideNav: React.FC<DashboardClientSideNavProps> = ({
    highlight,
}) => {
    const [totalUnread, setTotalUnread] = useState<number>(0);
    const [conversations, setConversations] = useState<any[]>([]);

    const [userData, setUserData] = useState<{
        selectedAvatar: string | null;
        companyName: string | null;
        firstName: string | null;
        lastName: string | null;
    }>({
        selectedAvatar: null,
        companyName: null,
        firstName: null,
        lastName: null,
    });

    useEffect(() => {
        const currentUser = auth.currentUser?.uid;
        if (!currentUser) return;

        const total = conversations.reduce((sum, convo) => {
            return sum + (convo.unreadCounts?.[currentUser] || 0);
        }, 0);

        setTotalUnread(total);
    }, [conversations]);


    useEffect(() => {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        const conversationsRef = collection(db, "users", currentUser.uid, "conversations");

        // Listen for real-time updates
        const unsubscribe = onSnapshot(conversationsRef, (snapshot) => {
            const convos: any[] = [];
            snapshot.forEach(doc => {
                convos.push({ id: doc.id, ...doc.data() });
            });
            setConversations(convos);
        });

        // Clean up the listener when the component unmounts
        return () => unsubscribe();
    }, []);




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

    const { selectedAvatar, companyName, firstName, lastName } = userData;


    return (
        <nav className="min-h-screen box-border rounded-r-[35px] DashboardBackgroundGradient RightGradientBorder DashboardSideNav px-[30px] py-[30px] hidden xl:block lg:w-[18%]">
            <div className="flex flex-col justify-between h-full">
                <div className="flex flex-col items-center">
                    <Link href="/dashboard/" className="relative w-[150px]">
                        <Image
                            src="/Lucidify white logo w designs.png"
                            alt="Lucidify Logo"
                            layout="responsive"
                            width={0}
                            height={0}
                        />
                    </Link>

                    <div className="flex flex-col mt-[165px] w-full">
                        <Link
                            href="/dashboard/get-started"
                            className={`${highlight === "getStarted" && "BlackWithLightGradient ContentCardShadow"} flex items-center rounded-[10px]`}>
                            <div className="flex mx-[10px] my-[7px] items-center justify-between w-full">
                                <div className={`${highlight === "getStarted" ? "opacity-100" : "opacity-50"} flex items-center`}>
                                    <div className="relative w-[20px] h-[20px] mr-[4px]">
                                        <Image
                                            src="/Get Started Icon.png"
                                            alt="Get Started Icon"
                                            layout="responsive"
                                            width={0}
                                            height={0}
                                        />
                                    </div>
                                    <h3 className="text-[15px] font-light">Get Started</h3>
                                </div>
                                <div className="PopupAttentionGradient PopupAttentionShadow rounded-[7px]">
                                    <h3 className="mx-[8px] my-[4px] text-[11px] tracking-[0.1px]">Incomplete</h3>
                                </div>
                            </div>
                        </Link>

                        <div className="flex items-center rounded-[10px] mt-[45px] mb-[45px] SearchBackground ContentCardShadow">
                            <div className="flex mx-[20px] my-[9px] items-center">
                                <div className="relative w-[16px] h-[16px] mr-[8px]">
                                    <Image
                                        src="/Search Icon.png"
                                        alt="Search Icon"
                                        layout="responsive"
                                        width={0}
                                        height={0}
                                    />
                                </div>
                                <h3 className="text-[15px] font-light opacity-70">Search</h3>
                            </div>
                        </div>

                        <div className="flex flex-col gap-[10px]">
                            <div className="opacity-60 tracking-[1px] font-extralight text-[14px]">MENU</div>
                            <div className="flex flex-col gap-[10px]">
                                <Link
                                    href="/dashboard"
                                    className={`${highlight === "dashboard" && "BlackWithLightGradient ContentCardShadow"} flex items-center rounded-[10px]`}>
                                    <div className={`${highlight === "dashboard" ? "opacity-100" : "opacity-50"} flex mx-[20px] my-[9px] items-center`}>
                                        <div className="relative w-[16px] h-[16px] mr-[15px]">
                                            <Image
                                                src="/Dashboard Icon.png"
                                                alt="Dashboard Icon"
                                                layout="responsive"
                                                width={0}
                                                height={0}
                                            />
                                        </div>
                                        <h3 className="text-[15px] font-light">Dashboard</h3>
                                    </div>
                                </Link>

                                <Link
                                    href="/dashboard/projects"
                                    className={`${highlight === "projects" && "BlackWithLightGradient ContentCardShadow"} flex items-center rounded-[10px]`}>
                                    <div className={`${highlight === "projects" ? "opacity-100" : "opacity-50"} flex mx-[20px] my-[9px] items-center`}>
                                        <div className="relative w-[16px] h-[16px] mr-[15px]">
                                            <Image
                                                src="/Projects Icon.png"
                                                alt="Projects Icon"
                                                layout="responsive"
                                                width={0}
                                                height={0}
                                            />
                                        </div>
                                        <h3 className="text-[15px] font-light">Projects</h3>
                                    </div>
                                </Link>

                                <Link
                                    href="/dashboard/messages"
                                    className={`${highlight === "messages" && "BlackWithLightGradient ContentCardShadow"} flex items-center rounded-[10px]`}>
                                    <div className="flex mx-[20px] my-[9px] items-center justify-between w-full">
                                        <div className={`${highlight === "messages" ? "opacity-100" : "opacity-50"} flex items-center`}>
                                            <div className="relative w-[16px] h-[16px] mr-[15px]">
                                                <Image
                                                    src="/Messages Icon.png"
                                                    alt="Messages Icon"
                                                    layout="responsive"
                                                    width={0}
                                                    height={0}
                                                />
                                            </div>
                                            <h3 className="text-[15px] font-light">Messages</h3>
                                        </div>
                                        <div className="PopupAttentionGradient PopupAttentionShadow rounded-[7px] flex justify-center items-center min-w-[20px] min-h-[20px]">
                                            <h3 className="mx-[8px] text-[11px]">{totalUnread}</h3>
                                        </div>
                                    </div>
                                </Link>

                                <Link
                                    href="/dashboard/transactions"
                                    className={`${highlight === "transactions" && "BlackWithLightGradient ContentCardShadow"} flex items-center rounded-[10px]`}>
                                    <div className={`${highlight === "transactions" ? "opacity-100" : "opacity-50"} flex mx-[20px] my-[9px] items-center`}>
                                        <div className="relative w-[16px] h-[16px] mr-[15px]">
                                            <Image
                                                src="/Transactions Icon.png"
                                                alt="Transactions Icon"
                                                layout="responsive"
                                                width={0}
                                                height={0}
                                            />
                                        </div>
                                        <h3 className="text-[15px] font-light">Transactions</h3>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <Link
                    href="/dashboard/profile"
                    className="rounded-[10px] flex items-center justify-around relative bg-white w-full BlackWithLightGradient ContentCardShadow active:scale-95">
                    <div className="flex w-full items-center justify-between relative mx-[20px] my-[14px]">
                        <div className="flex items-center gap-[15px] relative">
                            <div className="relative w-[35px] rounded-full overflow-hidden">
                                <Image
                                    src={"/" + selectedAvatar || auth.currentUser?.photoURL || "/Lucidify Umbrella.png"} // Use selectedAvatar or fallback image
                                    alt="User Profile"
                                    layout="responsive"
                                    width={0}
                                    height={0}
                                />
                            </div>
                            <div className="flex flex-col gap-[2px]">
                                <div className="text-[14px]">
                                    {firstName} {lastName || "User Name"}
                                </div>
                                <div className="text-[#ffffff66] text-[12px]">{companyName || "Lucidify"}</div>
                            </div>
                        </div>
                        <div className="relative w-[12px]">
                            <Image
                                src="/White Right Arrow.png"
                                alt="Right Arrow"
                                layout="responsive"
                                width={0}
                                height={0}
                            />
                        </div>
                    </div>
                </Link>
            </div>
        </nav>
    );
};

export default DashboardClientSideNav;
