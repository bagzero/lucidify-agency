"use client"

import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react';
import StartAProjectButton from './StartAProjectButton'
import LogInButton from './LogInButton'
import Popup from './Popup';

const GetStartedSection = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    return (
        <section className="items-center">
            <Popup closePopup={togglePopup} isVisible={isPopupOpen} /> {/* Show popup if isPopupOpen is true */}

            <div className="BackgroundGradient rounded-[50px]">
                <div className="flex flex-col items-center sm:max-w-[700px] mx-auto pt-[50px] pb-[150px]">
                    <div className="flex justify-center items-center rounded-full bg-white shadow-sm shadow-neutral-900">
                        <div className="flex items-center justify-center sm:mx-[16px] sm:my-[8px] mx-[14px] my-[6px]">
                            <div className="flex items-center my-[0px] mx-[2px]">
                                <div className="sm:w-[14px] w-[12px] mr-3">
                                    <Image
                                        src="/Lucidify Umbrella and L (black gradient).png"
                                        alt="Lucidify Umbrella"
                                        layout="responsive"  // Adjusts height based on width while maintaining aspect ratio
                                        width={0}           // leave at 0 (wrap with a div and that will choose the width)
                                        height={0}          // leave at 0
                                    />
                                </div>
                                <h2 className="tracking-[4px] font-semibold sm:text-[14px] text-[12px] text-black">GET STARTED TODAY</h2>
                            </div>
                        </div>

                    </div>

                    <h1 className="HeadingFont text-center my-[22px]">Lets build something <span className="TextGradient">amazing</span> together.</h1>
                    <h3 className="TextFont text-center sm:mb-[50px] mb-[35px] sm:max-w-[100%] max-w-[80%]">
                        Take the first step toward a website that elevates your business.
                        Whether you need a complete overhaul or a brand-new site, Lucidify will bring your vision to life.
                    </h3>

                    <div className="flex justify-between">
                        <div className="mr-[32px]">
                            <StartAProjectButton onClick={togglePopup} />
                        </div>

                        <LogInButton />
                    </div>
                </div>
            </div>

        </section>
    )
}

export default GetStartedSection