"use client"

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import NavStartAProjectButton from './NavStartAProjectButton';
import Popup from './Popup'; // Import the Popup component
import SignUpButton from './SignUpButton';

const Navbar = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    return (
        <header>
            <Popup closePopup={togglePopup} isVisible={isPopupOpen} />

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex justify-between h-[125px] items-center relative ">
                <div className="xl:w-[80%] md:w-[85%] 2xl:w-[75%] flex justify-between items-center text-[14px] relative mx-auto">
                    {/* Left Logo */}
                    <Link href="/" className="relative w-[125px]">
                        <Image
                            src="/Lucidify white logo.png"
                            alt="Lucidify Logo"
                            layout="responsive"
                            width={0}
                            height={0}
                        />
                    </Link>

                    {/* Center Navigation Links */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 flex">
                        <Link href="/" className="mx-6 font-medium flex flex-col items-center NavItemHover">
                            Home
                            <div className="h-[1px] w-[50%] bg-white rounded-full NavItemUnderline"></div>
                        </Link>
                        <Link href="/services" className="mx-6 font-medium flex flex-col items-center NavItemHover">
                            Services
                            <div className="h-[1px] w-[50%] bg-white rounded-full NavItemUnderline"></div>
                        </Link>
                        <Link href="/creations" className="mx-6 font-medium flex flex-col items-center NavItemHover">
                            Our Creations
                            <div className="h-[1px] w-[50%] bg-white rounded-full NavItemUnderline"></div>
                        </Link>
                        <Link href="/contact" className="mx-6 font-medium flex flex-col items-center NavItemHover">
                            Let&apos;s Connect
                            <div className="h-[1px] w-[50%] bg-white rounded-full NavItemUnderline"></div>
                        </Link>
                    </div>

                    {/* Right Side Buttons */}
                    <div className="flex">
                        <div className='mr-[15px]'>
                            <SignUpButton />
                        </div>
                        <NavStartAProjectButton onClick={togglePopup} />
                    </div>
                </div>
            </nav>

            {/* Mobile Navigation */}
            <nav className="lg:hidden flex justify-center items-center">
                <div className="xl:w-[80%] md:w-[85%] w-[90%] mt-[30px] 2xl:w-[75%] flex justify-between items-center text-[14px] border-solid border border-1 border-[#414141] rounded-full py-[8px] px-[16px]">
                    <Link href="/" className="relative sm:w-[125px] w-[110px]">
                        <Image
                            src="/Lucidify white logo.png"
                            alt="Lucidify Logo"
                            layout="responsive"
                            width={0}
                            height={0}
                        />
                    </Link>
                    <div className="flex items-center">
                        <NavStartAProjectButton onClick={togglePopup} />
                        <div className="w-[30px] h-[30px] rounded-full bg-white shadow cursor-pointer ml-[10px] flex flex-col justify-center items-center active:scale-[0.90] active:opacity-75 duration-100 ease-in-out">
                            <div className="w-[14px] h-[2px] bg-black rounded-full" />
                            <div className="w-[14px] h-[2px] bg-black rounded-full my-[2px]" />
                            <div className="w-[14px] h-[2px] bg-black rounded-full" />
                        </div>
                    </div>
                </div>
            </nav>
        </header>

    );
};

export default Navbar;
