import React, { ReactNode } from 'react'

interface MainProps {
    children: ReactNode;
}

const Main: React.FC<MainProps> = (props) => {
    const { children } = props
    return (
        <main>
            {children}
        </main>
    )
}

export default Main