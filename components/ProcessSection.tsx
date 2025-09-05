import Image from 'next/image'
import React from 'react'

const ProcessSection = () => {
    return (
        <section className="items-center">
            <div className="flex justify-center UpsideDownBackgroundGradient rounded-[50px] mt-[150px]">
                <div className="flex sm:flex-row flex-col justify-between items-center my-[150px]">
                    <div className="flex flex-col sm:mr-[200px] sm:items-start items-center">
                        <h1 className="HeadingFont">Our Process.</h1>
                        <div className="flex mt-[10px]">
                            <div className="w-[16px] mr-3">
                                <Image
                                    src="/Lucidify Umbrella and L (black gradient).png"
                                    alt="Lucidify Umbrella"
                                    layout="responsive"  // Adjusts height based on width while maintaining aspect ratio
                                    width={0}           // leave at 0 (wrap with a div and that will choose the width)
                                    height={0}          // leave at 0
                                />
                            </div>
                            <h2 className="TextFont tracking-[1.5px] font-medium sm:mb-0 mb-[75px]">It&apos;s that simple.</h2>
                        </div>
                    </div>

                    <div className="flex flex-col justify-between">
                        <div className="flex items-center mb-[50px]">
                            <div className="sm:w-[50px] w-[40px] mr-[15px]">
                                <Image
                                    src="/Purple Circle.png"
                                    alt="Circle"
                                    layout="responsive"  // Adjusts height based on width while maintaining aspect ratio
                                    width={0}           // leave at 0 (wrap with a div and that will choose the width)
                                    height={0}          // leave at 0
                                />
                            </div>
                            <div className="flex flex-col">
                                <h2 className="sm:text-[25px] text-[20px] font-medium">01 PLAN</h2>
                                <h3 className="TextFont mt-[10px] sm:max-w-[100%] max-w-[250px]">We get your vision and map out the plan. </h3>
                            </div>
                        </div>

                        <div className="flex items-center my-[50px]">
                            <div className="sm:w-[50px] w-[40px] mr-[15px]">
                                <Image
                                    src="/Purple Circle.png"
                                    alt="Circle"
                                    layout="responsive"  // Adjusts height based on width while maintaining aspect ratio
                                    width={0}           // leave at 0 (wrap with a div and that will choose the width)
                                    height={0}          // leave at 0
                                />
                            </div>
                            <div className="flex flex-col">
                                <h2 className="sm:text-[25px] text-[20px] font-medium">02 DESIGN</h2>
                                <h3 className="TextFont mt-[10px] sm:max-w-[100%] max-w-[250px]">We design a stunning site that fits your brand. </h3>
                            </div>
                        </div>

                        <div className="flex items-center my-[50px]">
                            <div className="sm:w-[50px] w-[40px] mr-[15px]">
                                <Image
                                    src="/Purple Circle.png"
                                    alt="Circle"
                                    layout="responsive"  // Adjusts height based on width while maintaining aspect ratio
                                    width={0}           // leave at 0 (wrap with a div and that will choose the width)
                                    height={0}          // leave at 0
                                />
                            </div>
                            <div className="flex flex-col max-w-[400px]">
                                <h2 className="sm:text-[25px] text-[20px] font-medium">03 DEVELOP</h2>
                                <h3 className="TextFont mt-[10px] sm:max-w-[100%] max-w-[250px]">We build your site with precision, ensuring speed, functionality, and responsiveness. </h3>
                            </div>
                        </div>

                        <div className="flex items-center mt-[50px]">
                            <div className="sm:w-[50px] w-[40px] mr-[15px]">
                                <Image
                                    src="/Purple Circle.png"
                                    alt="Circle"
                                    layout="responsive"  // Adjusts height based on width while maintaining aspect ratio
                                    width={0}           // leave at 0 (wrap with a div and that will choose the width)
                                    height={0}          // leave at 0
                                />
                            </div>
                            <div className="flex flex-col">
                                <h2 className="sm:text-[25px] text-[20px] font-medium">04 LAUNCH</h2>
                                <h3 className="TextFont mt-[10px] sm:max-w-[100%] max-w-[250px]">We launch your website for free. It’s that simple.</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ProcessSection