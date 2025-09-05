"use client"

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup, getRedirectResult } from "firebase/auth";
import { auth, db } from '../firebaseConfig';
import Link from 'next/link';
import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';

const SIGNUPHeroSection = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");
  const [error, setError] = useState<string | string[] | null>(null);
  const [step, setStep] = useState<number>(1);
  const [isEmailTaken, setIsEmailTaken] = useState<string | null>(null);  // Track email existence

  
  const handleAuthRedirect = async (user: any) => {
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      router.push("/dashboard");
    } else {
      // Store email & uid in sessionStorage
      sessionStorage.setItem("signupEmail", user.email);
      sessionStorage.setItem("signupUid", user.uid);
      router.push("/signup/get-started");
    }
  };

  // Handle Google Sign-up with redirect
  // Google Sign-Up

  // Google Sign-Up
  const handleGoogleSignUp = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      if (result.user) {
        const user = result.user;
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          router.push("/dashboard");
        } else {
          sessionStorage.setItem("signupEmail", user.email || "");
          sessionStorage.setItem("signupUid", user.uid);
          router.push("/signup/get-started");
        }
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  
  const isValidEmail = (email: string) => {
    return email.includes("@");
  };

  // Email/Password Sign-Up
  const handleEmailSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const errorMessages: string[] = [];
    if (password.length < 8) errorMessages.push("Password must be at least 8 characters.");
    if (!/\d/.test(password)) errorMessages.push("Password must include at least one number.");
    if (errorMessages.length > 0) {
      setError(errorMessages);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check Firestore
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        router.push("/dashboard");
      } else {
        // Store email & uid in sessionStorage for get-started page
        sessionStorage.setItem("signupEmail", user.email || "");
        sessionStorage.setItem("signupUid", user.uid);
        router.push("/signup/get-started");
      }
    } catch (error: any) {
      setError(["Sign-up failed. Please try again."]);
      console.error(error);
    }
  };



  // Handle the result of Google redirect sign-up
  useEffect(() => {
    const fetchRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Google Redirect Error:", error);
      }
    };
    fetchRedirectResult();
  }, [router]);

  // Move to the next step with animation
  const handleContinue = () => {
    setStep(2);  // Switch to step 2
    setTimeout(() => {

      const section1 = document.getElementById("SignUpSection1");
      const section2 = document.getElementById("SignUpSection2");


      // Check if section2 exists before accessing its properties
      if (section2) {
        section2.style.transform = "translateX(0)";
        section2.style.opacity = "1";
      }
    }, 0);  // Small delay to ensure animation triggers smoothly
  };

  // this function would be able to check if the email exists alr, however, the async and await messes up the transition to step 2. i'm still not sure why. 12/19/2024
  // const handleContinue = async () => {
  //   // Check if the email already exists in Firestore
  //   const usersRef = collection(db, "users");
  //   const emailQuery = query(usersRef, where("email", "==", email)); // Query Firestore for email

  //   const querySnapshot = await getDocs(emailQuery);
  //   console.log("lol");

  //   if (!querySnapshot.empty) {
  //     setIsEmailTaken(true); // Set to true if the email already exists
  //     console.log("LMAO");
  //   } else {
  //     setIsEmailTaken(false); // Reset to false if the email is available
  //     setTimeout(() => {

  //       setStep(2);  // Switch to step 2
  //       console.log(step);

  //       const section2 = document.getElementById("SignUpSection2");
  //       if (section2) {
  //         section2.style.transform = "translateX(0)";
  //         section2.style.opacity = "1";
  //       }
  //     }, 5000)
  //   }
  // };

  // Move to the previous step with animation
  const handleBack = () => {
    setStep(1);  // Switch to step 2
    setTimeout(() => {

      const section1 = document.getElementById("SignUpSection1");
      const section2 = document.getElementById("SignUpSection2");


      // Check if section2 exists before accessing its properties
      if (section2) {
        section2.style.transform = "translateX(300px)";
        section2.style.opacity = "0";
      }
    }, 0);  // Small delay to ensure animation triggers smoothly
  };


  return (
    <div className="relative flex justify-center items-center min-h-screen BackgroundGradient overflow-clip">
      {/* Left Decorative Image */}
      <div className="w-[18%] absolute left-[10%] top-[27%] my-auto z-10">
        <Image
          src="/3D Astronaut.png"
          alt="Left Decorative Image"
          layout="responsive"
          width={0}
          height={0}
        />
      </div>

      {/* Right Decorative Image */}
      <div className="-right-[17%] bottom-[57%] w-[50%] absolute">
        <Image
          src="/3D Earth.png"
          alt="Right Decorative Image"
          layout="responsive"
          width={0}
          height={0}
        />
      </div>

      {/* Signup Form */}
      <div className={`relative min-w-[500px] z-10 bg-gradient-to-br from-[#d6ceff] via-white/100 to-white rounded-[30px] text-center RegBoxShadow`}>
        {/* Rocket Icon */}
        <div className="w-[113px] absolute -top-[120px] -left-[10%] transform -translate-x-1/2">
          <Image
            src="/3D Invis Rocket.png"
            alt="Rocket Decorative Image"
            layout="responsive"
            width={0}
            height={0}
          />
        </div>

        <div
          className="transition-transform duration-500 ease-in-out overflow-x-hidden px-[1px]"
        >
          {step === 1 && (
            <div id="SignUpSection1" className=" px-8 py-10 ">

              {/* Step 1: Google Signup or Email Input */}
              <div className="flex flex-col items-center mb-[40px]">
                <h1 className="text-[26px] font-semibold text-black mb-[6px]">Create an Account</h1>
                <h3 className="text-black text-[15px] text-center opacity-65">Sign up to Lucidify & start growing your business!</h3>
              </div>

              {/* Google Sign-Up Button */}
              <button
                onClick={handleGoogleSignUp}
                className="text-white w-full bg-[rgba(0,0,0,1)] hover:bg-[rgba(0,0,0,0.80)] py-2 rounded-lg flex items-center justify-center ThreeD mb-4"
              >
                <div className="w-[15px] mr-[10px]">
                  <Image
                    src="/Google Icon.png"
                    alt="Google Icon"
                    layout="responsive"
                    width={0}
                    height={0}
                  />
                </div>
                Sign up with Google
              </button>

              <div className="flex items-center mb-[25px] mt-[30px]">
                <div className="h-[1px] bg-gray-300 w-[100%]"></div>
                <p className="text-gray-500 mx-[10px]">or</p>
                <div className="h-[1px] bg-gray-300 w-[100%]"></div>
              </div>

              {/* Email Input and Continue Button */}
              <div className="flex flex-col items-start">
                <h3 className="text-black text-[14px] font-medium">Email</h3>
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-black bg-[rgba(255,255,255,0.10)] shadow-sm shadow-gray-400 rounded-lg p-2 mt-[3px] focus:outline-none focus:ring-1 focus:ring-[rgba(0,0,0,0.25)]"
                  required
                />
              </div>

              <button
                className={`w-full ${isValidEmail(email) ? "text-white" : "text-[rgba(0,0,0,0.5)]"} py-2 mt-[20px] rounded-lg bg-${isValidEmail(email) ? "[#725CF7]" : "[rgba(114,92,247,0.5)]"} shadow-lg shadow-indigo-300 ${isValidEmail(email) && "hover:bg-[#5D3AEA]"}`}
                onClick={handleContinue}  // Trigger transition
                disabled={!isValidEmail(email)}  // Disable if invalid email
              >
                Continue
              </button>

              <p className="text-gray-500 text-[14px] mt-[40px]">
                Already have an account? <Link href="/login" className="text-black font-medium hover:text-opacity-70">Log In</Link>
              </p>
            </div>
          )}



          {step === 2 && (
            <div className="translate-x-[300px] opacity-0 px-8 py-10" id="SignUpSection2">
              {/* Step 2: Password Input */}
              <div className="flex flex-col items-center mb-[40px]">
                <h1 className="text-[26px] font-semibold text-black mb-[6px]">Almost There!</h1>
                <h3 className="text-black text-[15px] text-center opacity-65">Enter your password to complete your sign-up.</h3>
              </div>

              {/* Email/Password Sign-Up Form */}
              <form onSubmit={handleEmailSignUp}>
                <div className="flex flex-col items-start mb-[20px]">
                  <h3 className="text-black text-[14px] font-medium">Password</h3>
                  <input
                    type="password"
                    placeholder="Password (min. 8 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-black bg-[rgba(255,255,255,0.10)] shadow-sm shadow-gray-400 rounded-lg p-2 mt-[3px] focus:outline-none focus:ring-1 focus:ring-[rgba(0,0,0,0.25)]"
                    required
                  />
                  <div className="text-black opacity-70 text-[13px] font-light mt-[10px]">Must contain a number.</div>
                </div>
                <div className="flex flex-col items-start">
                  <h3 className="text-black text-[14px] font-medium">Retype Password</h3>
                  <input
                    type="password"
                    placeholder="Password (min. 8 characters)"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    className="w-full text-black bg-[rgba(255,255,255,0.10)] shadow-sm shadow-gray-400 rounded-lg p-2 mt-[3px] focus:outline-none focus:ring-1 focus:ring-[rgba(0,0,0,0.25)]"
                    required
                  />
                </div>

                {error && (
                  <div className="flex flex-col gap-2 mt-4 items-start">
                    {Array.isArray(error)
                      ? error.map((err, index) => (
                        <p key={index} className="text-red-500 text-[14px]">
                          {err}
                        </p>
                      ))
                      : <p className="text-red-500 text-[14px]">{error}</p>}
                  </div>
                )}


                <div className="flex justify-between mt-[30px]">
                  <button
                    onClick={handleBack}
                    className={`w-[28%] text-black py-[10px] rounded-lg bg-transparent flex items-center justify-center gap-[4px] opacity-60 hover:opacity-100 GoHomeText`}>
                    <div className="w-[10px] GoHomeArrow">
                      <Image
                        src="/Black Left Arrow.png"
                        alt="Black Left Arrow"
                        layout="responsive"
                        width={0}
                        height={0}
                      />
                    </div>
                    Go Back
                  </button>
                  <button
                    type="submit"
                    disabled={!password || password !== password2}
                    className={`w-[70%] ${(!password || password !== password2) ? "text-[rgba(0,0,0,0.5)]" : "text-white"} py-[10px] rounded-lg bg-${(!password || password !== password2) ? "[rgba(114,92,247,0.5)]" : "[#725CF7]"} shadow-lg shadow-indigo-300 ${(password && password === password2) && "hover:bg-[#5D3AEA]"}`}
                  >
                    Complete Sign Up
                  </button>
                </div>

              </form>


            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SIGNUPHeroSection;
