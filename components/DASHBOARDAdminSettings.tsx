import { useEffect, useState } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import DashboardAdminSideNav from './DashboardAdminSideNav';
import Image from 'next/image';
import Link from 'next/link';

const DASHBOARDAdminSettings = () => {
  const [firstName, setFirstName] = useState<String | null>(null);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false); // State for the popup
  const auth = getAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;

      if (!user) {
        router.push('/login');
        return;
      }

      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setFirstName(data.firstName);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching user data: ', error);
      }
    };

    fetchUserData();
  }, [auth, router]);

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error logging out: ', error);
    }
  };

  return (
    <div className="flex h-screen DashboardBackgroundGradient relative">


      {/* Left Sidebar */}
      <DashboardAdminSideNav highlight="none" />

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
                / Settings
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
              <h1 className="text-[30px] font-semibold mb-[2px]">Settings</h1>
              <h3 className="text-[14px] font-light opacity-60">
                Manage your dashboard settings here.
              </h3>
            </div>

            <div
              className="flex flex-col w-[100px] h-[41px] items-center justify-center gap-2.5 px-[18px] py-2 relative rounded-[10px] ContentCardShadow LogoutGradient hover:cursor-pointer active:scale-90"
              onClick={() => setShowLogoutPopup(true)}
            >
              <div className="inline-flex items-center gap-2.5 relative">
                <div className="relative font-light text-[15px] text-center">
                  Log Out
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Popup */}
        {/* <div> className={`h-screen bg-black bg-opacity-50 ${showLogoutPopup ? 'opacity-100 translate-y-0' : 'opacity-0 pointer-events-none translate-y-[50px]'
        } fixed inset-x-0 inset-y-0 flex justify-center items-center z-20`} */}
        <div className={`ease-in-out duration-500 absolute bg-black bg-opacity-50 z-10 w-full h-full ${showLogoutPopup ? 'opacity-100 visible' : ' opacity-0 invisible'} opacity-0`}>
          <div className="absolute left-0 top-0 flex justify-center items-center w-full h-full">
            {/* Popup Content with Animation */}
            <div className={`ContentCardShadow BlackGradient rounded-xl p-6 w-[300px] shadow-lg flex flex-col items-center gap-[30px] ${showLogoutPopup ? 'opacity-100 visible translate-y-0' : ' opacity-0 invisible -translate-y-[50px]'}`}>
              <h2 className="text-[18px] font-semibold text-center">
                Are you sure you want to log out?
              </h2>
              <div className="flex gap-[30px]">
                <button
                  onClick={handleLogOut}
                  className="px-4 py-2 AddProjectGradient ContentCardShadow text-[14px] font-light rounded-md"
                >
                  Yes, Log Out
                </button>
                <button
                  onClick={() => setShowLogoutPopup(false)}
                  className="px-4 py-2 ContentCardShadow BlackGradient rounded-[15px] hover:bg-gray-400 text-[14px] font-light"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      


    </div>
  );
};

export default DASHBOARDAdminSettings;
