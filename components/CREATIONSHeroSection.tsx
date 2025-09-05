import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import LogInButton from './LogInButton'

const CREATIONSHeroSection = () => {
    return (
        <section>
            <div className="flex justify-center rounded-[50px] mx-auto BackgroundGradient pb-[140px] pt-[110px] ">
                <div className="flex items-start justify-center w-full flex-col max-w-[650px] mr-[75px]">
                    <div className="flex justify-center items-center border-solid border border-1 border-[#2F2F2F] rounded-full">
                        <div className="flex">
                            <div className="flex items-center my-1.5 mx-4">
                                <div className="sm:w-[16px] w-[14px] mr-3">
                                    <Image
                                        src="/Lucidify Umbrella and L (black gradient).png"
                                        alt="Lucidify Umbrella"
                                        layout="responsive"
                                        width={0}
                                        height={0}
                                    />
                                </div>
                                <h2 className="tracking-[4px] font-medium sm:text-[12px] text-[10px]">CASE STUDIES</h2>
                            </div>
                        </div>
                    </div>
                    <h1 className="TitleFont my-[22px] lg:max-w-[80%] xl:max-w-[100%] max-w-[90%]">We are confident about <span className="TextGradient">our work</span>.</h1>
                    <div className="max-w-[75%] sm:max-w-[80%] mb-[45px]">
                        <h3 className="TextFont max-w-[95%]">We put <span className="font-medium">time and quality</span> in every project in order to truly satisfy our clients.</h3>
                    </div>


                </div>
                <div className="w-[550px] flex items-center">
                    <Image
                        src="/3D Time Platform.png"
                        alt="LinkedIn Icon"
                        layout="responsive"
                        width={0}
                        height={0}
                    />
                </div>
            </div>
        </section>
    )
}

export default CREATIONSHeroSection