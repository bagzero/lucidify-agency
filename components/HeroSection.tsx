import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import LogInButton from './LogInButton'
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

const HeroSection = () => {
  return (
    <section className={`${poppins.className} items-center`}>
      <div
        className="flex justify-center rounded-[50px] mx-auto BackgroundGradient"
      >
        <div className="flex items-center w-full flex-col mt-[125px] sm:mb-[150px] mb-[125px] 2xl:mt-[125px] 2xl:mb-[150px] xl:mt-[80px] xl:mb-[125px] lg:mt-[70px] lg:mb-[100px] max-w-[650px]">
          <div className="flex justify-center items-center border-solid border border-1 border-[#2F2F2F] rounded-full">
            <div className="flex">
              <div className="flex items-center my-1.5 mx-5">
                <div className="sm:w-[16px] w-[14px] mr-3">
                  <Image
                    src="/Lucidify Umbrella and L (black gradient).png"
                    alt="Lucidify Umbrella"
                    layout="responsive"  // Adjusts height based on width while maintaining aspect ratio
                    width={0}           // leave at 0 (wrap with a div and that will choose the width)
                    height={0}          // leave at 0
                  />
                </div>
                <h2 className="tracking-[4px] font-medium sm:text-[12px] text-[10px]">WEB DEVELOPMENT AGENCY</h2>
              </div>
            </div>
          </div>
          <h1 className={`${poppins.className} TitleFont my-[22px] text-center lg:max-w-[80%] xl:max-w-[100%] max-w-[90%]`}>Take your <span className="TextGradient">business</span> to the next level.</h1>
          <div className="max-w-[75%] sm:max-w-[80%] mb-[45px]">
            <h3 className="TextFont text-center">yo mama sucked my left nut Lucidify will build your dream website hassle-free, delivering a seamless process that saves you time and effort.</h3>
          </div>
          <div className="flex justify-center">
            <Link
              href="/"
              className="flex justify-center items-center rounded-full bg-white mr-[32px] ThreeD hover:shadow-lg
              hover:shadow-gray-600 hover:-translate-y-[4px]">
              <div className="flex items-center justify-center sm:mx-[16px] mx-[14px] my-[8px]">
                <h1 className="text-black font-medium mr-1 sm:text-[16px] text-[14px]">Get a Demo</h1>
                <div className="w-[11px]">
                  <Image
                    src="/Black Right Arrow.png"
                    alt="Lucidify Umbrella"
                    layout="responsive"  // Adjusts height based on width while maintaining aspect ratio
                    width={0}           // leave at 0 (wrap with a div and that will choose the width)
                    height={0}          // leave at 0
                  />
                </div>
              </div>

            </Link>
            <LogInButton />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection