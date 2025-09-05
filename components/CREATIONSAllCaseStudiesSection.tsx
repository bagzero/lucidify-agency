import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const CREATIONSAllCaseStudiesSection = () => {
    return (
        <section className="items-center">

            <div className="items-center mt-[75px]">
                <div className="flex sm:flex-row flex-col justify-between mx-auto max-w-[100%] 2xl:max-w-[1620px] xl:max-w-[90%] sm:max-w-[95%]">
                    <div className="flex flex-col">
                        <div className="flex flex-col sm:mr-[150px] 2xl:mr-[150px] xl:mr-[100px] lg:mr-[75px] sm:mx-none mx-auto">
                            <Link
                                className="flex justify-center items-center TransparentBackgroundGradient rounded-[50px] CaseStudyHover "
                                href="https://vensar.co/" target="_blank">
                                <div className="w-full h-full bg-[#00000080] z-40 absolute flex justify-center items-center ViewMoreCard opacity-0">
                                    <div className="flex items-center">
                                        <h3 className="text-[20px] font-light z-40">View Live</h3>
                                        <div className="TextGradient flex items-center">
                                            <div className="w-[16px] -rotate-45 ml-[8px]">
                                                <Image
                                                    src="/White Top Right Arrow.png"
                                                    alt="Top Right Arrow"
                                                    layout="responsive"  // Adjusts height based on width while maintaining aspect ratio
                                                    width={0}           // leave at 0 (wrap with a div and that will choose the width)
                                                    height={0}          // leave at 0
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col mt-[100px] sm:mb-[75px] mb-[50px] relative justify-center">
                                    <div className="2xl:max-w-[500px] xl:max-w-[375px] lg:max-w-[360px] max-w-[340px] z-20">
                                        <Image
                                            src="/VENSAR Homepage.png"
                                            alt="VENSAR Case Study Website"
                                            layout="responsive"  // Adjusts height based on width while maintaining aspect ratio
                                            width={0}           // leave at 0 (wrap with a div and that will choose the width)
                                            height={0}          // leave at 0
                                            className="rounded-[25px]"
                                        />
                                    </div>
                                    <div className="2xl:max-w-[500px] xl:max-w-[375px] lg:max-w-[360px] max-w-[340px] sm:-mt-[75px] -mt-[50px] sm:ml-[150px] ml-[50px]">
                                        <Image
                                            src="/VENSAR Flashcards.png"
                                            alt="VENSAR Case Study Website"
                                            layout="responsive"  // Adjusts height based on width while maintaining aspect ratio
                                            width={0}           // leave at 0 (wrap with a div and that will choose the width)
                                            height={0}          // leave at 0
                                            className="rounded-[25px]"
                                        />
                                    </div>
                                    <div className="2xl:max-w-[500px] xl:max-w-[375px] lg:max-w-[360px] max-w-[340px] sm:-mt-[75px] -mt-[50px] z-10">
                                        <Image
                                            src="/VENSAR Footer.png"
                                            alt="VENSAR Case Study Website"
                                            layout="responsive"  // Adjusts height based on width while maintaining aspect ratio
                                            width={0}           // leave at 0 (wrap with a div and that will choose the width)
                                            height={0}          // leave at 0
                                            className="rounded-[25px]"
                                        />
                                    </div>
                                </div>
                            </Link>
                            <div className="flex flex-col sm:max-w-[100%] max-w-[85%] mx-auto">
                                <div className="flex justify-between mt-[40px] mb-[30px]">
                                    <h2 className="sm:text-[32px] text-[28px] font-medium">VENSAR</h2>
                                    <h2 className="sm:text-[32px] text-[28px] font-thin">2024</h2>
                                </div>
                                <h3 className="TextFont mb-[20px]">In just 2 weeks, we created a modern, responsive website for Vensar that boosted conversion rates by 30%.
                                    The intuitive design and seamless functionality
                                    led to a 25% increase in user engagement, driving more business directly through their site.
                                </h3>

                            </div>
                        </div>



                        {/* <div className="flex flex-col mt-[75px] sm:mr-[150px] 2xl:mr-[150px] xl:mr-[100px] lg:mr-[75px] sm:mx-none mx-auto">
                            <Link
                                className="flex justify-center items-center TransparentBackgroundGradient rounded-[50px] CaseStudyHover "
                                href="https://www.cltutoring.org/" target="_blank">
                                <div className="w-full h-full bg-[#00000080] z-40 absolute flex justify-center items-center ViewMoreCard opacity-0">
                                    <div className="flex items-center">
                                        <h3 className="text-[20px] font-light z-40">View Live</h3>
                                        <div className="TextGradient flex items-center">
                                            <div className="w-[16px] -rotate-45 ml-[8px]">
                                                <Image
                                                    src="/White Top Right Arrow.png"
                                                    alt="Top Right Arrow"
                                                    layout="responsive"  // Adjusts height based on width while maintaining aspect ratio
                                                    width={0}           // leave at 0 (wrap with a div and that will choose the width)
                                                    height={0}          // leave at 0
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col mt-[100px] sm:mb-[75px] mb-[50px] relative justify-center">
                                    <div className="2xl:max-w-[500px] xl:max-w-[375px] lg:max-w-[360px] max-w-[340px] z-20">
                                        <Image
                                            src="/CLTutoring Homepage.png"
                                            alt="CLTutoring Case Study Website"
                                            layout="responsive"  // Adjusts height based on width while maintaining aspect ratio
                                            width={0}           // leave at 0 (wrap with a div and that will choose the width)
                                            height={0}          // leave at 0
                                            className="rounded-[25px]"
                                        />
                                    </div>
                                    <div className="2xl:max-w-[500px] xl:max-w-[375px] lg:max-w-[360px] max-w-[340px] sm:-mt-[75px] -mt-[50px] sm:ml-[150px] ml-[50px]">
                                        <Image
                                            src="/CLTutoring Features.png"
                                            alt="CLTutoring Case Study Website"
                                            layout="responsive"  // Adjusts height based on width while maintaining aspect ratio
                                            width={0}           // leave at 0 (wrap with a div and that will choose the width)
                                            height={0}          // leave at 0
                                            className="rounded-[25px]"
                                        />
                                    </div>
                                    <div className="2xl:max-w-[500px] xl:max-w-[375px] lg:max-w-[360px] max-w-[340px] sm:-mt-[75px] -mt-[50px] z-10">
                                        <Image
                                            src="/CLTutoring Footer.png"
                                            alt="CLTutoring Case Study Website"
                                            layout="responsive"  // Adjusts height based on width while maintaining aspect ratio
                                            width={0}           // leave at 0 (wrap with a div and that will choose the width)
                                            height={0}          // leave at 0
                                            className="rounded-[25px]"
                                        />
                                    </div>
                                </div>
                            </Link>
                            <div className="flex flex-col sm:max-w-[100%] max-w-[85%] mx-auto">
                                <div className="flex justify-between mt-[40px] mb-[30px]">
                                    <h2 className="sm:text-[32px] text-[28px] font-medium">CLTutoring</h2>
                                    <h2 className="sm:text-[32px] text-[28px] font-thin">2023</h2>
                                </div>
                                <h3 className="TextFont mb-[20px]">In just 2.5 weeks, we developed a 7-page interactive website for CLTutoring that improved client retention by 65%. The custom features, including online booking, enhanced the overall user experience and helped the company streamline operations.
                                </h3>

                            </div>
                        </div> */}


                    </div>




                    <div className="flex flex-col">
                        <div className="flex flex-col align-center sm:mt-[300px] mt-[75px] sm:mx-none mx-auto">
                            <Link
                                className="flex justify-center items-center TransparentBackgroundGradient rounded-[50px] CaseStudyHover"
                                href="https://bgintl.co/" target="_blank">
                                <div className="w-full h-full bg-[#00000080] z-40 absolute flex justify-center items-center ViewMoreCard opacity-0">
                                    <div className="flex items-center">
                                        <h3 className="text-[20px] font-light z-40">View Live</h3>
                                        <div className="TextGradient flex items-center">
                                            <div className="w-[16px] -rotate-45 ml-[8px]">
                                                <Image
                                                    src="/White Top Right Arrow.png"
                                                    alt="Top Right Arrow"
                                                    layout="responsive"  // Adjusts height based on width while maintaining aspect ratio
                                                    width={0}           // leave at 0 (wrap with a div and that will choose the width)
                                                    height={0}          // leave at 0
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col mt-[100px] mb-[75px] relative justify-center">
                                    <div className="2xl:max-w-[500px] xl:max-w-[375px] lg:max-w-[360px] max-w-[340px] z-20 sm:ml-[150px] ml-[50px]">
                                        <Image
                                            src="/BGINTL Homepage.png"
                                            alt="BGINTL Case Study Website"
                                            layout="responsive"  // Adjusts height based on width while maintaining aspect ratio
                                            width={0}           // leave at 0 (wrap with a div and that will choose the width)
                                            height={0}          // leave at 0
                                            className="rounded-[25px]"
                                        />
                                    </div>
                                    <div className="2xl:max-w-[500px] xl:max-w-[375px] lg:max-w-[360px] max-w-[340px] sm:-mt-[75px] -mt-[50px] sm:mr-[150px] mr-[50px]">
                                        <Image
                                            src="/BGINTL Flashcards.png"
                                            alt="BGINTL Case Study Website"
                                            layout="responsive"  // Adjusts height based on width while maintaining aspect ratio
                                            width={0}           // leave at 0 (wrap with a div and that will choose the width)
                                            height={0}          // leave at 0
                                            className="rounded-[25px]"
                                        />
                                    </div>
                                    <div className="2xl:max-w-[500px] xl:max-w-[375px] lg:max-w-[360px] max-w-[340px] sm:-mt-[75px] -mt-[50px] z-10 sm:ml-[150px] ml-[50px]">
                                        <Image
                                            src="/BGINTL Footer.png"
                                            alt="BGINTL Case Study Website"
                                            layout="responsive"  // Adjusts height based on width while maintaining aspect ratio
                                            width={0}           // leave at 0 (wrap with a div and that will choose the width)
                                            height={0}          // leave at 0
                                            className="rounded-[25px]"
                                        />
                                    </div>
                                </div>
                            </Link>
                            <div className="flex flex-col sm:max-w-[100%] max-w-[85%] mx-auto">
                                <div className="flex justify-between mt-[40px] mb-[30px]">
                                    <h2 className="sm:text-[32px] text-[28px] font-medium">BGINTL</h2>
                                    <h2 className="sm:text-[32px] text-[28px] font-thin">2024</h2>
                                </div>
                                <h3 className="TextFont mb-[20px]">We revamped BGINTL’s portfolio website, focusing on showcasing their expertise and projects.
                                    The improved design and user experience helped them attract higher-quality leads, leading to a
                                    30% increase in client inquiries within the first two months.
                                </h3>

                            </div>
                        </div>


                    </div>



                </div>
            </div>
        </section>
    )
}

export default CREATIONSAllCaseStudiesSection