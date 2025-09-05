import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { collection, doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { db } from '../firebaseConfig'; // Firestore instance
import DashboardClientSideNav from './DashboardClientSideNav';
import Image from 'next/image';
import Link from 'next/link';

interface Project {
  name: string;
  progress: number;
  // Add other fields as needed, e.g., description, deadlines, etc.
}

const DASHBOARDClientDashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true); // To handle loading state
  const [firstName, setFirstName] = useState<String | null>(null);
  const auth = getAuth();
  const router = useRouter();

  // Function to get the formatted date
  const getFormattedDate = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const currentDate = new Date();
    const day = days[currentDate.getDay()];
    const date = currentDate.getDate();
    const month = months[currentDate.getMonth()];

    return `${day}, ${month} ${date}`;
  };


  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;

      if (!user) {
        // Redirect to login page if user is not authenticated
        router.push('/login');
        return;
      }

      try {
        // Get the user document from the "users" collection
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setFirstName(data.firstName);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    fetchUserData();
  }, [auth, router]);

  return (
    <div className="flex h-screen DashboardBackgroundGradient">
      {/* Left Sidebar */}
      <DashboardClientSideNav highlight="dashboard" />

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
              <div className="w-fit mt-[-1.00px] font-light text-sm tracking-[0] leading-[normal]">
                Home
              </div>
            </div>
            <div className="inline-flex items-center gap-[5px]">
              <div className=" w-fit mt-[-1.00px] font-light text-sm tracking-[0] leading-[normal]">
                / Dashboard
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
              className="flex w-[129px] h-[55px] items-center justify-center gap-2.5 px-0 py-[15px]  rounded-[15px] BlackGradient ContentCardShadow">
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
          <div className="flex flex-col relative w-full mx-[50px] my-[30px]">
            <div className="flex flex-col">
              <h1 className="text-[30px] font-semibold mb-[2px]">Welcome, {firstName || "user..."}!</h1>
              <h3 className="text-[14px] font-light opacity-60">Today is {getFormattedDate()}</h3>
            </div>

          </div>
        </div>
      </div>
    </div>
  );

};

export default DASHBOARDClientDashboard;
