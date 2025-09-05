"use client";

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    onAuthStateChanged,
} from "firebase/auth";
import { auth } from '../firebaseConfig';
import Link from 'next/link';

const LOGINHeroSection = () => {
    const router = useRouter();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    // Check authentication status and redirect if user is already logged in
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            const loginTimestamp = localStorage.getItem("loginTimestamp");

            // If user is logged in and timestamp is within 30 minutes, redirect to dashboard
            if (user && loginTimestamp) {
                const timeElapsed = Date.now() - parseInt(loginTimestamp, 10);
                if (timeElapsed < 30 * 60 * 1000) {
                    router.push("/dashboard");
                } else {
                    // Clear the timestamp if it's expired
                    localStorage.removeItem("loginTimestamp");
                }
            }
        });

        return () => unsubscribe();
    }, [router]);

    // Function to handle Google sign-in with popup
    const handleGoogleSignIn = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            if (result.user) {
                // Save the current timestamp to localStorage
                localStorage.setItem("loginTimestamp", Date.now().toString());
                router.push("/dashboard");
            } else {
                console.log("User sign-in failed or was cancelled.");
            }
        } catch (error) {
            console.error("Google Sign-In Error:", error);
        }
    };

    // Function to handle email and password sign-in
    const handleEmailPasswordSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            if (userCredential.user) {
                // Save the current timestamp to localStorage
                localStorage.setItem("loginTimestamp", Date.now().toString());
                router.push("/dashboard");
            }
        } catch (error) {
            setError("Invalid email or password. Please try again.");
            console.error("Email/Password Sign-In Error:", error);
        }
    };

    return (
        <div className="relative flex justify-center items-center min-h-screen BackgroundGradient">
            {/* Left Decorative Image */}
            <div className="w-[25%] absolute left-[170px] my-auto z-0">
                <Image
                    src="/3D Big Hero 5.png"
                    alt="Left Decorative Image"
                    layout="responsive"
                    width={0}
                    height={0}
                />
            </div>

            {/* Right Decorative Image */}
            <div className="w-[41%] absolute right-[0px] bottom-[0px] z-20">
                <Image
                    src="/3D Big Hero 6.png"
                    alt="Right Decorative Image"
                    layout="responsive"
                    width={0}
                    height={0}
                />
            </div>

            {/* Login Form */}
            <div className="relative min-w-[500px] z-10 bg-gradient-to-br from-[#d6ceff] via-white/100 to-white rounded-[30px] px-8 py-10 text-center RegBoxShadow">
                {/* Go Home Link */}
                <Link
                    href="/"
                    className="absolute top-11 left-8  flex items-center GoHomeText">
                    <div className="w-[7px] GoHomeArrow">
                        <Image
                            src="/Black Left Arrow.png"
                            alt="Black Left Arrow"
                            layout="responsive"
                            width={0}
                            height={0}
                        />
                    </div>
                    <h3 className="ml-[4px] text-black text-[12px]">Go Home</h3>
                </Link>

                {/* Rocket Icon */}
                <div className="w-[113px] absolute -top-[130px] -left-[10%] transform -translate-x-1/2">
                    <Image
                        src="/3D Rocket.png"
                        alt="Rocket Decorative Image"
                        layout="responsive"
                        width={0}
                        height={0}
                    />
                </div>

                <div className="flex flex-col items-center mb-[40px]">
                    <div className="mb-[15px] bg-gradient-to-br from-[#cdf8ff6b] to-[#e2d5ff] shadow-lg shadow-gray-400 rounded-[20px] flex justify-center items-center h-[60px] w-[60px] ThreeD">
                        <div className="w-[40px]">
                            <Image
                                src="/Lucidify Umbrella.png"
                                alt="Lucidify Logo"
                                layout="responsive"
                                width={0}
                                height={0}
                            />
                        </div>
                    </div>

                    <h1 className="text-[26px] font-semibold text-black mb-[6px]">Welcome Back!</h1>
                    <h3 className="text-black text-[15px] text-center opacity-65">Sign in to Lucidify & start growing your business!</h3>
                </div>

                {/* Google Sign-In Button */}
                <button
                    onClick={handleGoogleSignIn}
                    className="w-full bg-[rgba(0,0,0,1)] hover:bg-[rgba(0,0,0,0.80)] py-2 rounded-lg flex items-center justify-center ThreeD"
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
                    Sign in with Google
                </button>

                <div className="flex items-center mb-[25px] mt-[30px]">
                    <div className="h-[1px] bg-gray-300 w-[100%]"></div>
                    <p className="text-gray-500 mx-[10px]">or</p>
                    <div className="h-[1px] bg-gray-300 w-[100%]"></div>
                </div>

                {/* Email/Password Sign-In Form */}
                <form onSubmit={handleEmailPasswordSignIn}>
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

                    <div className="flex flex-col items-start mt-[12px]">
                        <h3 className="text-black text-[14px] font-medium">Password</h3>
                        <input
                            type="password"
                            placeholder="Password (min. 6 characters)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full text-black bg-[rgba(255,255,255,0.10)] shadow-sm shadow-gray-400 rounded-lg p-2 mt-[3px] mb-4 focus:outline-none focus:ring-1 focus:ring-[rgba(0,0,0,0.25)]"
                            required
                        />
                    </div>

                    {error && <p className="text-red-500 mb-4">{error}</p>}

                    <button
                        type="submit"
                        className="w-full text-white py-2 rounded-lg bg-[#725CF7] shadow-lg shadow-indigo-300 hover:bg-[#5D3AEA] mb-[40px]"
                    >
                        Sign In
                    </button>
                </form>

                <p className="text-gray-500 text-[14px]">
                    Don’t have an account? <Link href="/signup" className="text-black font-medium hover:text-opacity-70">Create Free Account</Link>
                </p>
            </div>
        </div>
    );
};

export default LOGINHeroSection;
