import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const LogInButton = () => {
    return (
        <Link
            href="/login"
            className="flex justify-center items-center rounded-[8px] bg-[#231F1D] BoxShadow hover:bg-[#0c0b0e] active:scale-95">
            <div className="flex items-center justify-center mx-[14px] sm:my-[8px] sm:mx-[16px]">
                <h1 className="mr-1 sm:text-[16px] text-[14px]">Log in</h1>
                <div className="w-[11px]">
                    <Image
                        src="/White Right Arrow.png"
                        alt="Lucidify Umbrella"
                        layout="responsive"  // Adjusts height based on width while maintaining aspect ratio
                        width={0}           // leave at 0 (wrap with a div and that will choose the width)
                        height={0}          // leave at 0
                    />
                </div>
            </div>

        </Link>
    )
}

export default LogInButton