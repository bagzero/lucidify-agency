import Link from 'next/link'
import React from 'react'

const SignUpButton = () => {
    return (
        <Link
            href="/signup"
            className="flex justify-center items-center rounded-full bg-[#231F1D] BoxShadow hover:bg-[#36313b] active:scale-95">
            <div className="flex items-center justify-center mx-[14px] sm:my-[8px] sm:mx-[16px]">
                <h1 className="mr-1 sm:text-[16px] text-[14px]">Sign up</h1>
            </div>

        </Link>
    )
}

export default SignUpButton