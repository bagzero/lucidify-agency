import React from 'react';

interface StartAProjectButtonProps {
    onClick: () => void;
}

const StartAProjectButton: React.FC<StartAProjectButtonProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="flex justify-center items-center rounded-[8px] bg-[#725CF7] BoxShadow hover:bg-[#5D3AEA]">
            <h1 className="sm:mx-[20px] sm:my-[8px] mx-[14px] my-[6px] sm:text-[16px] text-[14px]">Start a Project</h1>
        </button>
    );
};

export default StartAProjectButton;
