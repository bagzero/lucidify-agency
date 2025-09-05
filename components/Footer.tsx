import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
    return (
        <footer>
            <div className="max-w-[97%] mx-auto flex flex-col items-center justify-between">
                <div className="flex sm:flex-row flex-col justify-between 2xl:min-w-[1000px] xl:min-w-[800px] lg:min-w-[700px] sm:min-w-[60%] min-w-[50%] sm:mt-[100px] mt-[50px]">
                    <div className="flex flex-col">
                        <Link
                            href="/"
                            className="relative w-[125px] inline"> {/* Set fixed width */}
                            <Image
                                src="/Lucidify white logo.png"
                                alt="Lucidify Logo"
                                layout="responsive"  // Adjusts height based on width while maintaining aspect ratio
                                width={0}           //leave at 0 (wrap with a div and that will choose the width)
                                height={0}          // leave at 0
                            />
                        </Link>
                    </div>

                    <div className="font-light flex flex-col space-y-[15px] xl:text-[16px] text-[14px] sm:mt-0 mt-[40px]">
                        <h2 className="">Company</h2>
                        <Link
                            className="font-light opacity-40 hover:opacity-65 xl:text-[16px] text-[14px]"
                            href="/">
                            Services
                        </Link>
                        <Link
                            className="font-light opacity-40 hover:opacity-65 xl:text-[16px] text-[14px]"
                            href="/creations">
                            Past Work
                        </Link>
                        <Link
                            className="font-light opacity-40 hover:opacity-65 xl:text-[16px] text-[14px]"
                            href="/">
                            Contact
                        </Link>
                        <Link
                            className="font-light opacity-40 hover:opacity-65 xl:text-[16px] text-[14px]"
                            href="/">
                            Start a Project
                        </Link>


                    </div>
                </div>

                <div className="w-full border-t-solid border-t-[1px] border-t-[#FFFFFF4D] pt-[5px] sm:mt-[75px] mt-[50px] mb-[5px]">
                    <div className="flex justify-center">
                        <h3 className="opacity-70 text-[#F6F5FF] text-[12px]">© 2024 Lucidify, All rights reserved.</h3>
                    </div>
                </div>

            </div>
        </footer>
    )
}

export default Footer