import Image from 'next/image'
import React from 'react'

const QuoteSection = () => {
    return (
        <section className="items-center my-[150px]">
            <div className="flex flex-col max-w-[720px] items-center mx-auto">
                <div className="flex items-center my-1.5 mx-5">
                    <div className="w-[16px] mr-3">
                        <Image
                            src="/Lucidify Umbrella and L (black gradient).png"
                            alt="Lucidify Umbrella"
                            layout="responsive"  // Adjusts height based on width while maintaining aspect ratio
                            width={0}           // leave at 0 (wrap with a div and that will choose the width)
                            height={0}          // leave at 0
                        />
                    </div>
                    <h2 className="tracking-[4px] font-medium text-[12px]">OUTCOME</h2>
                </div>
                <h1 className="HeadingFont sm:max-w-[100%] max-w-[80%] text-center">Boost your <span className="TextGradient">Online Presence</span>.</h1>
                <h3 className="TextFont sm:max-w-[600px] max-w-[80%] my-[15px] text-center">&quot;A significant portion of internet users, about <span className="font-medium">48%</span>, view web design as a
                    crucial factor in determining the credibility of a business.
                    The way a website looks can impact the first impression and overall perception of a company.&quot;
                    <div className="mt-[20px] mr-[15px]">
                        <h3 className="TextFont text-end">- Forbes</h3>
                    </div>
                </h3>
            </div>
        </section>
    )
}

export default QuoteSection