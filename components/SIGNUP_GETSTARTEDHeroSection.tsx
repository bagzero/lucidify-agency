"use client"

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup, getRedirectResult, onAuthStateChanged } from "firebase/auth";
import { auth, db } from '../firebaseConfig';
import Link from 'next/link';
import { addDoc, collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import axios from "axios";

// Sample avatar images (replace with your own images)
const avatars = [
  { id: 1, src: "/Avatar 1.png" },
  { id: 2, src: "/Avatar 2.png" },
  { id: 3, src: "/Avatar 3.png" },
  { id: 4, src: "/Avatar 4.png" },
  { id: 5, src: "/Avatar 5.png" },
  { id: 6, src: "/Avatar 6.png" },
  { id: 7, src: "/Avatar 7.png" },
  { id: 8, src: "/Avatar 8.png" },
  { id: 9, src: "/Avatar 9.png" },
  { id: 10, src: "/Avatar 10.png" },
  { id: 11, src: "/Avatar 11.png" },
  { id: 12, src: "/Avatar 12.png" },
  { id: 13, src: "/Avatar 13.png" },
  { id: 14, src: "/Avatar 14.png" },
  { id: 15, src: "/Avatar 15.png" },
  { id: 16, src: "/Avatar 16.png" },
  { id: 17, src: "/Avatar 17.png" },
  { id: 18, src: "/Avatar 18.png" },
  { id: 19, src: "/Avatar 19.png" },
  { id: 20, src: "/Avatar 20.png" },
  { id: 21, src: "/Avatar 21.png" },
  { id: 22, src: "/Avatar 22.png" },
  { id: 23, src: "/Avatar 23.png" },
  { id: 24, src: "/Avatar 24.png" },
];


const SIGNUP_GETTINGSTARTEDHeroSection = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState<string>("");
  const [email, setEmail] = useState<string | null>(null);
  const [uid, setUid] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<number | null>(null);
  const [companyName, setCompanyName] = useState<string>("");
  const [companyURL, setCompanyURL] = useState<string>("");
  const [companySize, setCompanySize] = useState<string>("");
  const [companyRole, setCompanyRole] = useState<string>("");
  // Define the state types
  type ServiceType = string;

  const [selectedServices, setSelectedServices] = useState<ServiceType[]>([]);
  const [customService, setCustomService] = useState<string | null>(null);
  const [hoveredService, setHoveredService] = useState<string | null>(null); // Tracks hover

  const [idealOutcome, setIdealOutcome] = useState<string>("");
  type ChallengeType = string;

  const [selectedChallenges, setSelectedChallenges] = useState<ChallengeType[]>([]);
  const [customChallenge, setCustomChallenge] = useState<string | null>(null);
  const [hoveredChallenge, setHoveredChallenge] = useState<string | null>(null); // Tracks hover
  const [brandPersonality, setBrandPersonality] = useState<string>("");

  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<number>(1);
  const [section3Visited, setSection3Visited] = useState<boolean>(false);

  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  // const [countries, setCountries] = useState<{ name: string; code: string }[]>([]);
  // const [states, setStates] = useState<string[]>([]);
  // const [country, setCountry] = useState<string>("");
  const [selectedStateAbbv, setSelectedStateAbbv] = useState("");
  const [selectedStateName, setSelectedStateName] = useState("");

  const [city, setCity] = useState<string>("");

  const usStates = [
    { code: "INTL", name: "Other Country than USA" },
    { code: "AL", name: "Alabama" },
    { code: "AK", name: "Alaska" },
    { code: "AZ", name: "Arizona" },
    { code: "AR", name: "Arkansas" },
    { code: "CA", name: "California" },
    { code: "CO", name: "Colorado" },
    { code: "CT", name: "Connecticut" },
    { code: "DE", name: "Delaware" },
    { code: "FL", name: "Florida" },
    { code: "GA", name: "Georgia" },
    { code: "HI", name: "Hawaii" },
    { code: "ID", name: "Idaho" },
    { code: "IL", name: "Illinois" },
    { code: "IN", name: "Indiana" },
    { code: "IA", name: "Iowa" },
    { code: "KS", name: "Kansas" },
    { code: "KY", name: "Kentucky" },
    { code: "LA", name: "Louisiana" },
    { code: "ME", name: "Maine" },
    { code: "MD", name: "Maryland" },
    { code: "MA", name: "Massachusetts" },
    { code: "MI", name: "Michigan" },
    { code: "MN", name: "Minnesota" },
    { code: "MS", name: "Mississippi" },
    { code: "MO", name: "Missouri" },
    { code: "MT", name: "Montana" },
    { code: "NE", name: "Nebraska" },
    { code: "NV", name: "Nevada" },
    { code: "NH", name: "New Hampshire" },
    { code: "NJ", name: "New Jersey" },
    { code: "NM", name: "New Mexico" },
    { code: "NY", name: "New York" },
    { code: "NC", name: "North Carolina" },
    { code: "ND", name: "North Dakota" },
    { code: "OH", name: "Ohio" },
    { code: "OK", name: "Oklahoma" },
    { code: "OR", name: "Oregon" },
    { code: "PA", name: "Pennsylvania" },
    { code: "RI", name: "Rhode Island" },
    { code: "SC", name: "South Carolina" },
    { code: "SD", name: "South Dakota" },
    { code: "TN", name: "Tennessee" },
    { code: "TX", name: "Texas" },
    { code: "UT", name: "Utah" },
    { code: "VT", name: "Vermont" },
    { code: "VA", name: "Virginia" },
    { code: "WA", name: "Washington" },
    { code: "WV", name: "West Virginia" },
    { code: "WI", name: "Wisconsin" },
    { code: "WY", name: "Wyoming" }
  ];
  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStateAbbv = e.target.value;
    const selectedState = usStates.find((state) => state.code === selectedStateAbbv);

    setSelectedStateAbbv(selectedStateAbbv);
    setSelectedStateName(selectedState ? selectedState.name : "");
  };

  // const countries = [
  //   "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", 
  //   "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", 
  //   "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", 
  //   "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", 
  //   "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", 
  //   "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", 
  //   "Comoros", "Congo (Congo-Brazzaville)", "Costa Rica", "Croatia", "Cuba", 
  //   "Cyprus", "Czechia (Czech Republic)", "Denmark", "Djibouti", "Dominica", 
  //   "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", 
  //   "Eritrea", "Estonia", "Eswatini (fmr. 'Swaziland')", "Ethiopia", "Fiji", 
  //   "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", 
  //   "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", 
  //   "Haiti", "Holy See", "Honduras", "Hungary", "Iceland", "India", "Indonesia", 
  //   "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", 
  //   "Kazakhstan", "Kenya", "Kiribati", "Korea (North)", "Korea (South)", "Kosovo", 
  //   "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", 
  //   "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", 
  //   "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", 
  //   "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", 
  //   "Montenegro", "Morocco", "Mozambique", "Myanmar (formerly Burma)", "Namibia", 
  //   "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", 
  //   "Nigeria", "North Macedonia (formerly Macedonia)", "Norway", "Oman", 
  //   "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", 
  //   "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", 
  //   "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", 
  //   "Saint Vincent and the Grenadines", "Samoa", "San Marino", 
  //   "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", 
  //   "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", 
  //   "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", 
  //   "Suriname", "Sweden", "Switzerland", "Syria", "Tajikistan", "Tanzania", 
  //   "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", 
  //   "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", 
  //   "United Kingdom", "United States of America", "Uruguay", "Uzbekistan", 
  //   "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
  // ];

  // // Fetch countries from REST Countries API
  // useEffect(() => {
  //   const fetchCountries = async () => {
  //     try {
  //       const response = await axios.get("https://restcountries.com/v3.1/all");
  //       const countryData = response.data.map((country: any) => ({
  //         name: country.name.common,
  //         code: country.cca2, // Two-letter country code
  //       }));
  //       setCountries(countryData.sort((a: any, b: any) => a.name.localeCompare(b.name)));
  //     } catch (error) {
  //       console.error("Error fetching countries:", error);
  //     }
  //   };

  //   fetchCountries();
  // }, []);

  // // Fetch states when country changes
  // useEffect(() => {
  //   const fetchStates = async () => {
  //     if (!country) return;
  //     try {
  //       const selectedCountry = countries.find((c) => c.code === country);
  //       const countryCode = selectedCountry?.code;

  //       if (!countryCode) {
  //         console.error("Invalid country code");
  //         return;
  //       }

  //       const response = await axios.get(
  //         `https://api.geodatasource.com/v2/states?key=WXKAITMT11ODEMXFIMAXHWO2X8RSW5I5Y&country=${countryCode}`
  //       );
  //       const stateNames = response.data.map((state: any) => state.name);
  //       setStates(stateNames);
  //     } catch (error) {
  //       console.error("Error fetching states:", error);
  //       setStates([]);
  //     }
  //   };

  //   fetchStates();
  // }, [country, countries]); // Ensure this effect runs when country changes

  // const [currentIndex, setCurrentIndex] = useState<number>(4); // Start with the 5th avatar (index 4)

  // const handleLeftClick = () => {
  //   if (currentIndex > 0) {
  //     setCurrentIndex((prev) => prev - 1);
  //   }
  // };

  // const handleRightClick = () => {
  //   if (currentIndex < avatars.length - 1) {
  //     setCurrentIndex((prev) => prev + 1);
  //   }
  // };

  // Handle the result of Google redirect sign-up

  // Function to toggle service selection
  const toggleService = (service: ServiceType) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter((s) => s !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };
  console.log(selectedServices)

  // Function for handling hover state
  const handleMouseEnter = (service: string) => setHoveredService(service);
  const handleMouseLeave = () => setHoveredService(null);

  // Toggles selection of a challenge
  const toggleChallenge = (challenge: ChallengeType) => {
    setSelectedChallenges((prev) =>
      prev.includes(challenge)
        ? prev.filter((item) => item !== challenge)
        : [...prev, challenge]
    );
  };

  // Handles mouse enter for hover effect
  const handleMouseEnterChallenge = (challenge: ChallengeType) => {
    setHoveredChallenge(challenge);
  };

  // Handles mouse leave for hover effect
  const handleMouseLeaveChallenge = () => {
    setHoveredChallenge(null);
  };
  // Redirect if the user is not authenticated or hasn't just signed up
  useEffect(() => {
    const checkAuth = async () => {
      onAuthStateChanged(auth, async (user) => {
        if (!user) {
          router.push("/signup"); // Redirect if no user is logged in
        } else {
          const userRef = doc(db, "users", user.uid);
          const userData = (await getDoc(userRef)).data();

          if (userData?.setUp === true) {
            router.push("/dashboard"); // Redirect to dashboard if setup is complete
          }
        }
      });
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("signupEmail");
    const storedUid = sessionStorage.getItem("signupUid");

    if (!storedEmail || !storedUid) {
      router.push("/signup"); // redirect if no auth info
    } else {
      setEmail(storedEmail); // store in state if needed
      setUid(storedUid);
    }
  }, [router]);

  // var section1Visited = true;
  // var section2Visited = false;
  // let section3Visited = false;
  // var section4Visited = false;

  // Move to the next step with animation
  const handleContinue = (stepNumber: number) => {
    setStep(stepNumber);
    setTimeout(() => {

      const section1 = document.getElementById("SignUpSection1");
      const section1Pic1 = document.getElementById("SignUpSection1Pic1");
      const section1Pic2 = document.getElementById("SignUpSection1Pic2");
      const section2Pic1 = document.getElementById("SignUpSection2Pic1");
      const section2 = document.getElementById("SignUpSection2");
      const section3 = document.getElementById("SignUpSection3");
      const section4 = document.getElementById("SignUpSection4");

      if (stepNumber === 1) {
        // Check if section2 exists before accessing its properties
        if (section2 && section1 && section1Pic1 && section1Pic2 && section2Pic1 && section3 && section4) {
          section1.style.transform = "translateX(0)";
          section1.style.opacity = "1";
          section1.style.pointerEvents = "auto";
          section1Pic1.style.transform = "translateX(0px)"
          section1Pic2.style.transform = "translateX(1980px)"
          section2Pic1.style.transform = "translateX(1980px)"
          section2.style.transform = "translateX(1980px)"
          section2.style.opacity = "0"
          section2.style.pointerEvents = "none";

          section3.style.transform = "translateX(1980px)"
          section3.style.opacity = "0"
          section3.style.pointerEvents = "none";

          section4.style.transform = "translateX(1980px)"
          section4.style.opacity = "0"
          section4.style.pointerEvents = "none";
          setTimeout(() => {
            section2.style.position = "absolute"
            section1.style.position = "relative"
            section3.style.position = "absolute"
            section4.style.position = "absolute"
          }, 300)
        }
      }
      if (stepNumber === 2) {

        // Check if section2 exists before accessing its properties
        if (section2 && section1 && section1Pic1 && section1Pic2 && section2Pic1 && section3 && section4) {
          section2.style.transform = "translateX(0)";
          section2.style.opacity = "1";
          section2.style.pointerEvents = "auto";
          section1.style.transform = "translateX(-1980px)"
          section1Pic1.style.transform = "translateX(-1980px)"
          section1Pic2.style.transform = "translateX(0px)"
          section2Pic1.style.transform = "translateX(0px)"
          section1.style.opacity = "0"
          section1.style.pointerEvents = "none";

          section3.style.transform = "translateX(1980px)"
          section3.style.opacity = "0"
          section3.style.pointerEvents = "none";

          section4.style.transform = "translateX(1980px)"
          section4.style.opacity = "0"
          section4.style.pointerEvents = "none";
          setTimeout(() => {
            section1.style.position = "absolute"
            section2.style.position = "relative"
            section3.style.position = "absolute"
            section4.style.position = "absolute"
          }, 300)
        }
      }


      if (stepNumber === 3) {
        setSection3Visited(true);

        // Check if section2 exists before accessing its properties
        if (section2 && section1 && section1Pic2 && section2Pic1 && section1Pic1 && section3 && section4) {
          section1Pic2.style.transform = "translateX(-1980px)"
          section2Pic1.style.transform = "translateX(-1980px)"
          section1Pic1.style.transform = "translateX(-1980px)"
          section1.style.opacity = "0"
          section1.style.transform = "translateX(-1980px)"
          section1.style.pointerEvents = "none";
          section2.style.opacity = "0"
          section2.style.transform = "translateX(-1980px)"
          section2.style.pointerEvents = "none";
          section3.style.transform = "translateX(0px)";
          section3.style.opacity = "1";
          section3.style.pointerEvents = "auto";

          section4.style.opacity = "0"
          section4.style.transform = "translateX(1980px)"
          section4.style.pointerEvents = "none";
          setTimeout(() => {
            section1.style.position = "absolute"
            section2.style.position = "absolute"
            section3.style.position = "relative"
            section4.style.position = "absolute"
          }, 300)
        }
      }

      if (stepNumber === 4) {
        // Check if section2 exists before accessing its properties
        if (section2 && section1 && section1Pic1 && section1Pic2 && section2Pic1 && section3 && section4) {
          section1Pic1.style.transform = "translateX(-1980px)"
          section1Pic2.style.transform = "translateX(-1980px)"
          section2Pic1.style.transform = "translateX(-1980px)"
          section1.style.opacity = "0"
          section1.style.pointerEvents = "none";
          section1.style.transform = "translateX(-1980px)"
          section2.style.opacity = "0"
          section2.style.pointerEvents = "none";
          section2.style.transform = "translateX(-1980px)"
          section4.style.transform = "translateX(0px)";
          section4.style.opacity = "1";
          section4.style.pointerEvents = "auto";

          section3.style.opacity = "0"
          section3.style.transform = "translateX(-1980px)"
          section3.style.pointerEvents = "none";
          setTimeout(() => {
            section1.style.position = "absolute"
            section2.style.position = "absolute"
            section3.style.position = "absolute"
            section4.style.position = "relative"
          }, 300)
        }
      }
    }, 0);  // Small delay to ensure animation triggers smoothly
  };

  // let deviceWidth = window.innerWidth;
  // console.log(deviceWidth);

  // window.addEventListener("resize", () => {
  //   deviceWidth = window.innerWidth;
  //   console.log(`Updated device width: ${deviceWidth}`);
  // });
  const handleSubmit = async () => {
    if (!uid || !email) return; // safety check

    const userRef = doc(db, "users", uid);

    // Create the user profile doc
    await setDoc(userRef, {
      email: email, // saved from signup
      firstName,
      lastName,
      phoneNumber,
      companyName,
      companyURL,
      companySize,
      companyRole,
      selectedServices,
      customService,
      idealOutcome,
      selectedChallenges,
      customChallenge,
      selectedAvatar,
      selectedStateName,
      selectedStateAbbv,
      setUp: true, // Mark as setup complete
      createdAt: new Date(),
    });

    // --- Conversations Setup ---
    const conversationsRef = collection(db, "users", uid, "conversations");

    // Create the Lucidify pinned conversation
    const conversationDocRef = await addDoc(conversationsRef, {
      title: "Lucidify",
      isPinned: true,
      lastMessage: "Welcome to Lucidify! We're excited to help you get started with your project.",
      lastMessageSender: "Lucidify",
      timestamp: new Date(),
      unreadCounts: {
        [uid]: 1,       // The new user's unread count
        Lucidify: 0          // Admin's unread count
      },
    });

    // Create the "messages" subcollection under this conversation
    const messagesRef = collection(
      db,
      "users",
      uid,
      "conversations",
      conversationDocRef.id,
      "messages"
    );

    await addDoc(messagesRef, {
      text: "Welcome to Lucidify! We're excited to help you get started with your project.",
      sender: "Lucidify",
      timestamp: new Date(),
      isRead: false,
    });

    // --- Cleanup sessionStorage ---
    sessionStorage.removeItem("signupEmail");
    sessionStorage.removeItem("signupUid");

    // Redirect to dashboard
    router.push("/dashboard");
  };


  return (
    <div className="relative flex justify-center items-center min-h-screen BackgroundGradient overflow-hidden">
      {/* Left Decorative Image */}
      <div className="w-[25%] absolute left-[7%]  my-auto z-10" id={"SignUpSection1Pic1"}>
        <Image
          src="/3D Big Saly.png"
          alt="Left Decorative Image"
          layout="responsive"
          width={0}
          height={0}
        />
      </div>

      {/* Right Decorative Image */}
      <div className="right-[4%] bottom-0 w-[25%] absolute translate-x-[1980px]" id={"SignUpSection2Pic1"}>
        <Image
          src="/3D Big Henry.png"
          alt="Right Decorative Image"
          layout="responsive"
          width={0}
          height={0}
        />
      </div>

      <div className="absolute -left-[25%] translate-x-[1980px] -bottom-[100px] w-[50%]" id={"SignUpSection1Pic2"}>
        <Image
          src="/3D Geometry.png"
          alt="Rocket Decorative Image"
          layout="responsive"
          width={0}
          height={0}
        />
      </div>

      {/* Left Decorative Image
      <div className="absolute right-[15%]  my-auto z-10" id={"SignUpSection1Text1"}>
        <div className="px-[40px] py-[10px] bg-gradient-to-br from-[#d6ceff] via-white/100 to-[#d6ceff] ContentCardShadow rounded-[15px] max-w-[300px]">
          <h3 className="text-black text-[18px] text-center">We are glad to have you on board!</h3>
        </div>
      </div> */}
      {/* <div className="absolute left-[0%] -bottom-[20%] w-[30%] z-20">
        <Image
          src="/3D Black Balloons.png"
          alt="Rocket Decorative Image"
          layout="responsive"
          width={0}
          height={0}
        />
      </div> */}



      <nav className="top-[40px] fixed flex px-[40px] py-[10px] bg-gradient-to-br from-[#d6ceff] via-white/100 to-[#d6ceff] ContentCardShadow  rounded-full">
        <div className="flex gap-[20px]">
          <button className={`ButtonLessBoxShadow w-[160px] button h-[50px] rounded-[40px] border-solid border-l-[1px] border-[#a5b4fcc4] ${step >= 1 ? "opacity-100" : "opacity-80 pointer-events-none"} ${firstName && lastName && selectedStateAbbv && city && "opacity-100 ButtonDone"}`}
            onClick={() => handleContinue(1)}  // Trigger transition
          >
            <div className="button__content rounded-[40px]">
              <div className="button__icon">
              </div>
              <p className={`button__text ${firstName && lastName && selectedStateAbbv && city ? "text-black" : "text-[rgba(0,0,0,0.6)]"} `}>Profile</p>
            </div>
          </button>

          <button className={`ButtonLessBoxShadow w-[180px] button h-[50px] rounded-[40px] border-solid border-l-[1px] border-[#a5b4fcc4] ${firstName && lastName && selectedStateAbbv && city ? "opacity-100" : "opacity-80 pointer-events-none"} ${companyName && companyURL && companySize && companyRole && "opacity-100 ButtonDone"}`}
            onClick={() => handleContinue(2)}  // Trigger transition
            disabled={!firstName || !lastName || !selectedStateAbbv || !city}>
            <div className="button__content rounded-[40px]">
              <div className="button__icon">
              </div>
              <p className={`button__text ${firstName && lastName && selectedStateAbbv && city ? "text-black" : "text-[rgba(0,0,0,0.6)]"} `}>Company</p>
            </div>
          </button>

          <button className={`ButtonLessBoxShadow w-[160px] button h-[50px] rounded-[40px] border-solid border-l-[1px] border-[#a5b4fcc4] ${firstName && lastName && selectedStateAbbv && city && section3Visited ? "opacity-100" : "opacity-80 pointer-events-none"} ${selectedServices.length > 0 && selectedChallenges.length > 0 && idealOutcome && "opacity-100 ButtonDone"}`}
            onClick={() => handleContinue(3)}  // Trigger transition
            disabled={!firstName || !lastName || !selectedStateAbbv || !city || !section3Visited}>
            <div className="button__content rounded-[40px]">
              <div className="button__icon">
              </div>
              <p className={`button__text ${firstName && lastName && selectedStateAbbv && city && section3Visited ? "text-black" : "text-[rgba(0,0,0,0.6)]"} `}>Vision</p>
            </div>
          </button>

          <button className={`ButtonLessBoxShadow w-[190px] button h-[50px] rounded-[40px] border-solid border-l-[1px] border-[#a5b4fcc4] ${firstName && lastName && selectedStateAbbv && city && section3Visited ? "opacity-100" : "opacity-80 pointer-events-none"} ${selectedAvatar && "opacity-100 ButtonDone"}`}
            onClick={() => handleContinue(4)}  // Trigger transition
            disabled={selectedServices.length === 0 || selectedChallenges.length === 0 || !idealOutcome}>
            <div className="button__content rounded-[40px]">
              <div className="button__icon">
              </div>
              <p className={`button__text ${selectedServices.length > 0 && selectedChallenges.length > 0 && idealOutcome ? "text-black" : "text-[rgba(0,0,0,0.6)]"} `}>Launch</p>
            </div>
          </button>
          {/* <div className="flex gap-[10px] items-center">
              <div className="flex justify-center items-center rounded-full PopupAttentionGradient PopupAttentionShadow w-[30px] h-[30px]">
                <div className="text-[15px]">1</div>
              </div>
              <div className="text-[18px] font-medium text-black">Profile</div>
              <div className="h-[1.5px] w-[20px] bg-black"></div>
            </div>

            <div className="flex gap-[10px] items-center">
              <div className="h-[1.5px] w-[20px] bg-black mr-[4px]"></div>
              <div className="flex justify-center items-center rounded-full border-black border-solid border-[2px] text-black w-[30px] h-[30px]">
                <div className="text-[15px] font-medium">2</div>
              </div>
              <div className="text-[18px] font-medium text-black">Company</div>
              <div className="h-[1.5px] w-[20px] bg-black"></div>
            </div>

            <div className="flex gap-[10px] items-center">
              <div className="h-[1.5px] w-[20px] bg-black mr-[4px]"></div>

              <div className="flex justify-center items-center rounded-full border-black border-solid border-[2px] text-black w-[30px] h-[30px]">
                <div className="text-[15px] font-medium">3</div>
              </div>
              <div className="text-[18px] font-medium text-black">Projects</div>
              <div className="h-[1.5px] w-[20px] bg-black"></div>

            </div>

            <div className="flex gap-[10px] items-center">
              <div className="h-[1.5px] w-[20px] bg-black mr-[4px]"></div>

              <div className="flex justify-center items-center rounded-full border-black border-solid border-[2px] text-black w-[30px] h-[30px]">
                <div className="text-[15px] font-medium">4</div>
              </div>
              <div className="text-[18px] font-medium text-black">Company</div>
            </div> */}
        </div>
      </nav>

      {/* Signup Form */}
      <div className={`relative min-w-[600px] z-10 bg-gradient-to-br from-[#d6ceff] via-white/100 to-white rounded-[30px] text-center RegBoxShadow transition-opacity: 100ms`} id="SignUpSection1">

        <div
          className="transition-transform duration-500 ease-in-out overflow-x-hidden px-[1px]"
        >
          <div className="px-8 py-10">


            {/* Step 1: Google Signup or Email Input */}
            <div className="flex flex-col items-center mb-[40px]">
              <h1 className="text-[26px] font-semibold text-black mb-[6px]">Welcome to Lucidify!👋</h1>
              <h3 className="text-black text-[15px] text-center opacity-65">Follow these steps to set up your account.</h3>
            </div>



            {/* Email Input and Continue Button */}
            <h3 className="text-start text-black text-[18px] font-medium mb-[10px]">Let&apos;s start with the basics</h3>

            <div className="flex flex-col gap-[10px]">
              <div className="flex justify-between relative">

                <div className="w-[47%] flex flex-col items-start gap-[3px]">
                  <h3 className="text-black text-[14px]">What&apos;s your first name?<span className="text-[#7160DE] font-bold text-[16px]">*</span></h3>
                  <input
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full text-black bg-[rgba(255,255,255,0.10)] shadow-sm shadow-gray-400 rounded-lg p-2 pl-[12px] focus:outline-none focus:ring-1 focus:ring-[rgba(0,0,0,0.25)]"
                    required
                  />
                </div>

                <div className="w-[47%] flex flex-col items-start gap-[3px]">
                  <h3 className="text-black text-[14px]">What&apos;s your last name?<span className="text-[#7160DE] font-bold text-[16px]">*</span></h3>
                  <input
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full text-black bg-[rgba(255,255,255,0.10)] shadow-sm shadow-gray-400 rounded-lg p-2 pl-[12px] focus:outline-none focus:ring-1 focus:ring-[rgba(0,0,0,0.25)]"
                    required
                  />
                </div>
              </div>

              <div className="flex  flex-col gap-[5px]">
                <div className="w-full flex flex-col items-start ">
                  <h3 className="text-black text-[14px] mb-[3px]">Phone number</h3>
                  <input
                    type="number"
                    placeholder="(123) 456-7890"
                    value={phoneNumber ?? ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      setPhoneNumber(value === "" ? null : Number(value));
                    }}
                    className="w-full text-black bg-[rgba(255,255,255,0.10)] shadow-sm shadow-gray-400 rounded-lg p-2 pl-[12px] focus:outline-none focus:ring-1 focus:ring-[rgba(0,0,0,0.25)]"
                  />
                </div>
                <div className="text-black opacity-80 text-start text-[12px]">Not required, but better for communication.</div>
              </div>

              <div>
                {/* Country Field
              <div className="w-full flex flex-col items-start">
                <h3 className="text-black text-[14px] mb-[3px]">Country<span className="text-[#7160DE] font-bold text-[16px]">*</span></h3>
                <select
                  value={country}
                  onChange={(e) => {
                    setCountry(e.target.value);
                    setState(""); // Reset state when country changes
                  }}
                  className="w-full text-black bg-[rgba(255,255,255,0.10)] shadow-sm shadow-gray-400 rounded-lg p-2 pl-[12px] focus:outline-none focus:ring-1 focus:ring-[rgba(0,0,0,0.25)]"
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div> */}

                <div className="flex justify-between">
                  {/* State Field */}
                  <div className="w-[48%] flex flex-col items-start">
                    <h3 className="text-black text-[14px] mb-[3px]">State/Province<span className="text-[#7160DE] font-bold text-[16px]">*</span></h3>
                    <select
                      value={selectedStateAbbv}
                      onChange={handleStateChange}
                      className="w-full text-black bg-[rgba(255,255,255,0.10)] shadow-sm shadow-gray-400 rounded-lg p-2 pl-[12px] focus:outline-none focus:ring-1 focus:ring-[rgba(0,0,0,0.25)]"
                      required
                    >
                      <option value="">Select State/Province</option>
                      {usStates.map((state) => (
                        <option key={state.code} value={state.code}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* City Field */}
                  <div className="w-[48%] flex flex-col items-start">
                    <h3 className="text-black text-[14px] mb-[3px]">City<span className="text-[#7160DE] font-bold text-[16px]">*</span></h3>
                    <input
                      type="text"
                      placeholder="Enter your city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full text-black bg-[rgba(255,255,255,0.10)] shadow-sm shadow-gray-400 rounded-lg p-2 pl-[12px] focus:outline-none focus:ring-1 focus:ring-[rgba(0,0,0,0.25)]"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>


            {/* <button
              className={`w-full ${firstName && lastName && selectedStateAbbv && city ? "text-white" : "text-[rgba(0,0,0,0.5)]"} py-2 mt-4 rounded-lg bg-${firstName && lastName && selectedStateAbbv && city ? "[#725CF7]" : "[rgba(114,92,247,0.5)]"} shadow-lg shadow-indigo-300 ${firstName && lastName && selectedStateAbbv && city && "hover:bg-[#5D3AEA]"}`}
              onClick={() => handleContinue(2)}  // Trigger transition
              disabled={!firstName || !lastName || !selectedStateAbbv || !city}
            >
              Continue
            </button> */}
            <button className={`w-full button h-[50px] rounded-[40px] ${firstName && lastName && selectedStateAbbv && city ? "opacity-100" : "opacity-80 pointer-events-none"} mt-[26px]`}
              onClick={() => handleContinue(2)}  // Trigger transition
              disabled={!firstName || !lastName || !selectedStateAbbv || !city}                >
              <div className="button__content rounded-[40px]">
                <div className="button__icon">
                </div>
                <p className={`button__text ${firstName && lastName && selectedStateAbbv && city ? "text-black" : "text-[rgba(0,0,0,0.6)]"} `}>Continue</p>
              </div>
            </button>
          </div>


        </div>

      </div>



      {/* Signup Form */}
      <div className={`absolute min-w-[600px] z-10 bg-gradient-to-br from-[#d6ceff] via-white/100 to-white rounded-[30px] text-center RegBoxShadow translate-x-[1980px] opacity-0 pointer-events-none`} id="SignUpSection2">
        {/* Rocket Icon */}
        {/* <div className="w-[50px] absolute -top-[70px] -right-[12%] transform">
          <Image
            src="/3D Glowy Donut.png"
            alt="Rocket Decorative Image"
            layout="responsive"
            width={0}
            height={0}
          />
        </div>

        <div className="absolute rotate-[100deg] -left-[11%] -top-[15px] w-[50px]">
          <Image
            src="/3D Glowy Donut.png"
            alt="Rocket Decorative Image"
            layout="responsive"
            width={0}
            height={0}
          />
        </div>
        <div className="absolute rotate-[100deg] -left-[18%] -top-[55px] w-[68px]">
          <Image
            src="/3D Glowy Donut.png"
            alt="Rocket Decorative Image"
            layout="responsive"
            width={0}
            height={0}
          />
        </div>
        <div className="absolute rotate-[100deg] -left-[26%] -top-[100px] w-[85px]">
          <Image
            src="/3D Glowy Donut.png"
            alt="Rocket Decorative Image"
            layout="responsive"
            width={0}
            height={0}
          />
        </div> */}

        <div className="px-8 py-10">
          {/* Step 1: Google Signup or Email Input */}
          <div className="flex flex-col items-center mb-[40px]">
            <h1 className="text-[26px] font-semibold text-black mb-[6px]">Company Information</h1>
            <h3 className="text-black text-[15px] text-center opacity-65">If you aren&apos;t associated with a company, you may skip this step!</h3>
          </div>



          {/* Company Information */}


          <div className="flex flex-col gap-[20px]">
            <div className="flex justify-between">

              {/* Company Name */}
              <div className="w-[48%] flex flex-col items-start gap-[3px]">
                <h3 className="text-black text-[14px]">What is your company&apos;s name?<span className="text-[#7160DE] font-bold text-[16px]">*</span></h3>
                <input
                  type="text"
                  placeholder="Your Company Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full text-black bg-[rgba(255,255,255,0.10)] shadow-sm shadow-gray-400 rounded-lg p-2 pl-[12px] focus:outline-none focus:ring-1 focus:ring-[rgba(0,0,0,0.25)]"
                  required
                />
              </div>

              {/* Company Website */}
              <div className="w-[48%] flex flex-col items-start gap-[3px]">
                <h3 className="text-black text-[14px]">Link to company website<span className="text-[#7160DE] font-bold text-[16px]">*</span></h3>
                <input
                  type="text"
                  placeholder="www.lucidify.agency"
                  value={companyURL}
                  onChange={(e) => setCompanyURL(e.target.value)}
                  className="w-full text-black bg-[rgba(255,255,255,0.10)] shadow-sm shadow-gray-400 rounded-lg p-2 pl-[12px] focus:outline-none focus:ring-1 focus:ring-[rgba(0,0,0,0.25)]"
                  required
                />
              </div>
            </div>


            <div className="flex justify-between">
              {/* Company Size */}
              <div className="w-[48%] flex flex-col items-start gap-[3px]">
                <h3 className="text-black text-[14px]">How large is your company?<span className="text-[#7160DE] font-bold text-[16px]">*</span></h3>
                <select
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                  className="w-full text-black bg-[rgba(255,255,255,0.10)] shadow-sm shadow-gray-400 rounded-lg p-2 pl-[12px] focus:outline-none focus:ring-1 focus:ring-[rgba(0,0,0,0.25)]"
                  required
                >
                  <option value="" disabled>Select company size</option>
                  <option value="1-10">1-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-100">51-100</option>
                  <option value="100+">100+</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              {/* Company Role */}
              <div className="w-[48%] flex flex-col items-start gap-[3px]">
                <h3 className="text-black text-[14px]">What is your role in the company?<span className="text-[#7160DE] font-bold text-[16px]">*</span></h3>
                <select
                  value={companyRole}
                  onChange={(e) => setCompanyRole(e.target.value)}
                  className="w-full text-black bg-[rgba(255,255,255,0.10)] shadow-sm shadow-gray-400 rounded-lg p-2 pl-[12px] focus:outline-none focus:ring-1 focus:ring-[rgba(0,0,0,0.25)]"
                  required
                >
                  <option value="" disabled>Select your role</option>
                  <option value="Founder/Owner">Founder/Owner</option>
                  <option value="General Manager">General Manager</option>
                  <option value="Head of Marketing">Head of Marketing</option>
                  <option value="Marketing Manager">Marketing Manager</option>
                  <option value="Digital Marketing Lead">Digital Marketing Lead</option>
                  <option value="Business Development Lead">Business Development Lead</option>
                  <option value="Creative Director">Creative Director</option>
                  <option value="Design Lead">Design Lead</option>
                  <option value="IT Manager">IT Manager</option>
                  <option value="Operations Manager">Operations Manager</option>
                  <option value="Customer Support Specialist">Customer Support Specialist</option>
                  <option value="Administrative Assistant">Administrative Assistant</option>
                  <option value="Team Member">Team Member</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-[5px] mt-[26px]">
              <div className="flex justify-between">
                <button className={`w-[35%] button h-[50px] rounded-[20px] border-solid border-r-[1px] border-[#a5b4fcc4]`}
                  onClick={() => handleContinue(1)}  // Trigger transition
                >
                  <div className="button__content rounded-[20px]">
                    <p className={`button__text text-black `}>Back</p>
                  </div>
                </button>
                <button className={`w-[42%] button h-[50px] rounded-[40px] border-solid border-l-[1px] border-[#a5b4fcc4] ${companyName && companyURL && companySize && companyRole ? "opacity-100" : "opacity-80 pointer-events-none"}`}
                  onClick={() => handleContinue(3)}  // Trigger transition
                  disabled={!companyName || !companyURL || !companySize || !companyRole}>
                  <div className="button__content rounded-[40px]">
                    <p className={`button__text ${companyName && companyURL && companySize && companyRole ? "text-black" : "text-[rgba(0,0,0,0.6)]"} `}>Continue</p>
                  </div>
                </button>
                {/* <button
                  className={`w-[35%] hover:-translate-y-[3px] hover:-translate-x-[2px] hover:scale-[101%] hover:shadow-xl hover:shadow-indigo-300 text-white py-2 mt-4 rounded-lg bg-[rgba(0,0,0,0.6)] shadow-lg shadow-indigo-300 "hover:bg-[#5D3AEA]"`}
                  onClick={() => handleContinue(3)}  // Trigger transition
                  disabled={!firstName || !lastName || !selectedStateAbbv || !city}
                >
                  Back
                </button> */}
                {/* <button
                  className={`w-[42%] hover:-translate-y-[3px] hover:translate-x-[2px] hover:scale-[101%] hover:shadow-xl hover:shadow-indigo-300 ${firstName && lastName && selectedStateAbbv && city ? "text-white" : "text-[rgba(0,0,0,0.5)]"} py-2 mt-4 rounded-lg bg-${firstName && lastName && selectedStateAbbv && city ? "[#725CF7]" : "[rgba(114,92,247,0.5)]"} shadow-lg shadow-indigo-300 ${firstName && lastName && selectedStateAbbv && city && "hover:bg-[#5D3AEA]"}`}
                  onClick={() => handleContinue(3)}  // Trigger transition
                  disabled={!firstName || !lastName || !selectedStateAbbv || !city}
                >
                  Continue
                </button> */}
              </div>
              <div className="w-full flex justify-end mt-[10px]">
                <button
                  className={`text-black`}
                  onClick={() => handleContinue(3)}  // Trigger transition
                >
                  <div className="flex items-center gap-[5px] hover:translate-x-[3px] SkipText mr-[10px]">
                    <h1 className="text-[14px]">Skip for now</h1>
                    <div className="w-[15px] SkipArrow">
                      <Image
                        src="/Black Full Right Arrow.png"
                        alt="Rocket Decorative Image"
                        layout="responsive"
                        width={0}
                        height={0}
                      />
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>


        </div>

      </div>


      {/* Signup Form */}
      <div className={`absolute w-[1200px] z-10 bg-gradient-to-br from-[#d6ceff] via-white/100 to-white rounded-[30px] text-center RegBoxShadow translate-x-[3960px] opacity-0 pointer-events-none`} id="SignUpSection3">


        <div className="px-8 py-10">
          {/* Step 1: Google Signup or Email Input */}
          <div className="flex flex-col items-center mb-[40px]">
            <h1 className="text-[26px] font-semibold text-black mb-[6px]">Your Vision</h1>
            <h3 className="text-black text-[15px] text-center opacity-65">We are a full service agency with experts ready to assist your business.</h3>
          </div>



          {/* Company Information */}


          <div className="flex flex-col gap-[20px]">

            {/* Interested Services */}
            <div className="flex flex-col items-start gap-[10px] w-full">
              <h3 className="text-black text-[14px]">
                Which services would you possibly be interested in?
                <span className="text-[#7160DE] font-bold text-[16px]">*</span>
              </h3>
              <div className="w-full flex flex-wrap justify-between gap-[20px]">
                {[
                  "Website Design & Dev.",
                  "Marketing & Ad Management",
                  "Business Automation Solutions",
                ].map((service, index) => (
                  <div
                    key={index}
                    className={`w-[23%] hover:cursor-pointer h-[50px] rounded-[20px] border-solid border-r-[1px] border-[#a5b4fcc4] ${selectedServices.includes(service)
                      ? "buttonClicked"
                      : hoveredService === service
                        ? "buttonHovered"
                        : "button ButtonMuchLessBoxShadow"
                      }`}
                    onClick={() => toggleService(service)}
                    onMouseEnter={() => handleMouseEnter(service)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="button__content rounded-[20px]">
                      <p className="button__text text-black text-[14px]">{service}</p>
                    </div>
                  </div>
                ))}
                {/* Other Option */}
                <div className="w-[23%] flex justify-between">

                  <div
                    className={`w-[30%] h-[50px] hover:cursor-pointer  rounded-[20px] border-solid border-r-[1px] border-[#a5b4fcc4] ${selectedServices.includes("Other")
                      ? "buttonClicked"
                      : hoveredService === "Other"
                        ? "buttonHovered"
                        : "button ButtonMuchLessBoxShadow"
                      }`}
                    onClick={() => toggleService("Other")}
                    onMouseEnter={() => handleMouseEnter("Other")}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="button__content rounded-[20px]">
                      <p className="button__text text-black text-[14px]">Other</p>
                    </div>
                  </div>
                  {selectedServices.includes("Other") && (
                    <input
                      type="text"
                      placeholder="Please specify"
                      value={customService || ""} // Provide a fallback value of an empty string
                      onChange={(e) => setCustomService(e.target.value)}
                      className={`w-[65%] text-black bg-[rgba(255,255,255,0.10)] shadow-sm shadow-gray-400 rounded-lg p-2 pl-[12px] focus:outline-none focus:ring-1 focus:ring-[rgba(0,0,0,0.25)]`}
                    />
                  )}
                </div>

              </div>
            </div>
            <div className="flex justify-between">

              {/* Key Challenges */}
              <div className="flex flex-col items-start gap-[10px] w-[70%]">
                <h3 className="text-black text-[14px]">
                  What do you think are some key challenges holding back business growth?
                  <span className="text-[#7160DE] font-bold text-[16px]">*</span>
                </h3>
                <div className="w-full flex flex-wrap justify-between gap-[10px]">
                  {[
                    "Suboptimal Web Design",
                    "Low on Search Results",
                    "Low Marketing Reach",
                    "Ineffective Paid Ads",
                    "Manual, Timely Processes",
                  ].map((challenge, index) => (
                    <div
                      key={index}
                      className={`w-[31%] hover:cursor-pointer h-[50px] rounded-[20px] border-solid border-r-[1px] border-[#a5b4fcc4] ${selectedChallenges.includes(challenge)
                        ? "buttonClicked"
                        : hoveredChallenge === challenge
                          ? "buttonHovered"
                          : "button ButtonMuchLessBoxShadow"
                        }`}
                      onClick={() => toggleChallenge(challenge)}
                      onMouseEnter={() => handleMouseEnterChallenge(challenge)}
                      onMouseLeave={handleMouseLeaveChallenge}
                    >
                      <div className="button__content rounded-[20px]">
                        <p className="button__text text-black text-[14px]">{challenge}</p>
                      </div>
                    </div>
                  ))}
                  {/* Other Option */}
                  <div className="w-[31%] flex justify-between">
                    <div
                      className={`w-[30%] h-[50px] hover:cursor-pointer  rounded-[20px] border-solid border-r-[1px] border-[#a5b4fcc4] ${selectedChallenges.includes("Other")
                        ? "buttonClicked"
                        : hoveredChallenge === "Other"
                          ? "buttonHovered"
                          : "button ButtonMuchLessBoxShadow"
                        }`}
                      onClick={() => toggleChallenge("Other")}
                      onMouseEnter={() => handleMouseEnterChallenge("Other")}
                      onMouseLeave={handleMouseLeaveChallenge}
                    >
                      <div className="button__content rounded-[20px]">
                        <p className="button__text text-black text-[14px]">Other</p>
                      </div>
                    </div>
                    {selectedChallenges.includes("Other") && (
                      <input
                        type="text"
                        placeholder="Please specify"
                        value={customChallenge || ""} // Provide a fallback value of an empty string
                        onChange={(e) => setCustomChallenge(e.target.value)}
                        className={`w-[65%] text-black bg-[rgba(255,255,255,0.10)] shadow-sm shadow-gray-400 rounded-lg p-2 pl-[12px] focus:outline-none focus:ring-1 focus:ring-[rgba(0,0,0,0.25)]`}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Ideal Outcome */}
              <div className="w-[28%] flex flex-col items-start gap-[3px]">
                <h3 className="text-black text-[14px] text-start text-wrap">
                  Optimally, where do you see your business in six months?
                  <span className="text-[#7160DE] font-bold text-[16px]">*</span>
                </h3>
                <textarea
                  placeholder="e.g. 30% increased website traffic & ad engagement."
                  value={idealOutcome}
                  onChange={(e) => setIdealOutcome(e.target.value)}
                  className="w-full text-black bg-[rgba(255,255,255,0.10)] shadow-sm shadow-gray-400 rounded-lg p-2 pl-[12px] pb-[40px] focus:outline-none focus:ring-1 focus:ring-[rgba(0,0,0,0.25)]"
                  required
                />
              </div>

            </div>


            <div className="flex flex-col gap-[5px] mt-[26px]">
              <div className="flex justify-between">
                <button className={`w-[17%] button h-[50px] rounded-[20px] border-solid border-r-[1px] border-[#a5b4fcc4]`}
                  onClick={() => handleContinue(2)}  // Trigger transition
                >
                  <div className="button__content rounded-[20px]">
                    <p className={`button__text text-black `}>Back</p>
                  </div>
                </button>
                <button className={`w-[21%] button h-[50px] rounded-[40px] border-solid border-l-[1px] border-[#a5b4fcc4] ${selectedServices.length > 0 && selectedChallenges.length > 0 && idealOutcome ? "opacity-100" : "opacity-80 pointer-events-none"}`}
                  onClick={() => handleContinue(4)}  // Trigger transition
                  disabled={selectedServices.length === 0 || selectedChallenges.length === 0 || !idealOutcome}>
                  <div className="button__content rounded-[40px]">
                    <p className={`button__text ${selectedServices.length > 0 && selectedChallenges.length > 0 && idealOutcome ? "text-black" : "text-[rgba(0,0,0,0.6)]"} `}>Continue</p>
                  </div>
                </button>
                {/* <button
                  className={`w-[35%] hover:-translate-y-[3px] hover:-translate-x-[2px] hover:scale-[101%] hover:shadow-xl hover:shadow-indigo-300 text-white py-2 mt-4 rounded-lg bg-[rgba(0,0,0,0.6)] shadow-lg shadow-indigo-300 "hover:bg-[#5D3AEA]"`}
                  onClick={() => handleContinue(3)}  // Trigger transition
                  disabled={!firstName || !lastName || !selectedStateAbbv || !city}
                >
                  Back
                </button> */}
                {/* <button
                  className={`w-[42%] hover:-translate-y-[3px] hover:translate-x-[2px] hover:scale-[101%] hover:shadow-xl hover:shadow-indigo-300 ${firstName && lastName && selectedStateAbbv && city ? "text-white" : "text-[rgba(0,0,0,0.5)]"} py-2 mt-4 rounded-lg bg-${firstName && lastName && selectedStateAbbv && city ? "[#725CF7]" : "[rgba(114,92,247,0.5)]"} shadow-lg shadow-indigo-300 ${firstName && lastName && selectedStateAbbv && city && "hover:bg-[#5D3AEA]"}`}
                  onClick={() => handleContinue(3)}  // Trigger transition
                  disabled={!firstName || !lastName || !selectedStateAbbv || !city}
                >
                  Continue
                </button> */}
              </div>

            </div>
          </div>


        </div>
      </div>

      {/* Signup Form */}
      <div className={`absolute w-[1000px] z-10 bg-gradient-to-br from-[#d6ceff] via-white/100 to-white rounded-[30px] text-center RegBoxShadow translate-x-[5940px] opacity-0 pointer-events-none`} id="SignUpSection4">


        <div className="px-8 py-10">
          {/* Step 1: Google Signup or Email Input */}
          <div className="flex flex-col items-center mb-[40px]">
            <h1 className="text-[26px] font-semibold text-black mb-[6px]">Launching Your Account</h1>
            <h3 className="text-black text-[15px] text-center opacity-65">One last step before your account is set up!</h3>
          </div>



          {/* Company Information */}


          <div className="flex flex-col gap-[20px]">

            {/* Choosing Avatar */}
            <div className="flex flex-col items-start gap-[10px] w-full">
              <h3 className="text-black text-[14px]">
                Choose your avatar.
                <span className="text-[#7160DE] font-bold text-[16px]">*</span>
              </h3>

              <div className="flex flex-wrap justify-between gap-x-[20px] gap-y-[12px] w-full">
                {avatars.map((avatar) => (
                  <div
                    key={avatar.id}
                    className={`flex items-center rounded-full overflow-hidden transition-all ease-in-out duration-300 ${selectedAvatar === `Avatar ${avatar.id}.png` ? "opacity-100 scale-[1.25] -translate-y-[3px] shadow-lg shadow-slate-300 " : "opacity-90 hover:scale-[1.05] shadow-sm shadow-slate-300"
                      }`}
                    onClick={() => setSelectedAvatar(`Avatar ${avatar.id}.png`)}
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    <div
                      className={`w-[95px] rounded-full mb-[3px] mt-[1px]`}
                    >
                      <Image
                        src={avatar.src}
                        alt={`Avatar ${avatar.id}`}
                        layout="responsive"
                        width={0}
                        height={0}
                      />
                    </div>
                  </div>
                ))}
              </div>

            </div>



            <div className="flex flex-col gap-[5px] mt-[26px]">
              <div className="flex justify-between">
                <button className={`w-[17%] button h-[50px] rounded-[20px] border-solid border-r-[1px] border-[#a5b4fcc4]`}
                  onClick={() => handleContinue(3)}  // Trigger transition
                >
                  <div className="button__content rounded-[20px]">
                    <p className={`button__text text-black `}>Back</p>
                  </div>
                </button>
                <button className={`w-[25%] button h-[50px] rounded-[40px] border-solid border-l-[1px] border-[#a5b4fcc4] ${selectedAvatar ? "opacity-100" : "opacity-80 pointer-events-none"}`}
                  onClick={() => handleSubmit()}  // Trigger transition
                  disabled={!selectedAvatar}>
                  <div className="button__content rounded-[40px]">
                    <p className={`button__text ${selectedAvatar ? "text-black" : "text-[rgba(0,0,0,0.6)]"} `}>Finish Setup</p>
                  </div>
                </button>
                {/* <button
                  className={`w-[35%] hover:-translate-y-[3px] hover:-translate-x-[2px] hover:scale-[101%] hover:shadow-xl hover:shadow-indigo-300 text-white py-2 mt-4 rounded-lg bg-[rgba(0,0,0,0.6)] shadow-lg shadow-indigo-300 "hover:bg-[#5D3AEA]"`}
                  onClick={() => handleContinue(3)}  // Trigger transition
                  disabled={!firstName || !lastName || !selectedStateAbbv || !city}
                >
                  Back
                </button> */}
                {/* <button
                  className={`w-[42%] hover:-translate-y-[3px] hover:translate-x-[2px] hover:scale-[101%] hover:shadow-xl hover:shadow-indigo-300 ${firstName && lastName && selectedStateAbbv && city ? "text-white" : "text-[rgba(0,0,0,0.5)]"} py-2 mt-4 rounded-lg bg-${firstName && lastName && selectedStateAbbv && city ? "[#725CF7]" : "[rgba(114,92,247,0.5)]"} shadow-lg shadow-indigo-300 ${firstName && lastName && selectedStateAbbv && city && "hover:bg-[#5D3AEA]"}`}
                  onClick={() => handleContinue(3)}  // Trigger transition
                  disabled={!firstName || !lastName || !selectedStateAbbv || !city}
                >
                  Continue
                </button> */}
              </div>

            </div>
          </div>


        </div>
      </div>
    </div >
  );
};

export default SIGNUP_GETTINGSTARTEDHeroSection;
