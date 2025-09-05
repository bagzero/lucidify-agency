import Image from 'next/image';
import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Adjust the path as needed

interface PopupProps {
  closePopup: () => void;
  isVisible: boolean;
}

const Popup: React.FC<PopupProps> = ({ closePopup, isVisible }) => {
  // State for form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    industry: '',
    projectDetails: '',
  });

  // State for submission status
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Add the form data to Firestore
      await addDoc(collection(db, 'project ideas'), formData);
      setIsSubmitted(true); // Set submission status to true
    } catch (error) {
      console.error('Error submitting project idea:', error);
      alert('Failed to submit project idea. Please try again.');
    }
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className={`relative bg-gradient-to-br from-[#1A1A1A] to-[#101010] rounded-[12px] transform transition-transform duration-300 ${isVisible ? 'translate-y-0' : 'translate-y-[50px]'} py-[30px] px-[60px] min-h-[810px]`}>
        <div className="absolute top-0 right-0 mt-4 mr-4 flex justify-center items-center rounded-full bg-[rgba(255,255,255,0.15)] hover:opacity-50 cursor-pointer" onClick={closePopup}>
          <div className="w-[35px] h-[35px] flex justify-center items-center">
            <div>
              <div className="w-[18px] h-[1px] bg-white rotate-[45deg]"></div>
              <div className="w-[18px] h-[1px] bg-white rotate-[135deg] -mt-[1px]"></div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-[10px]">
          <div className="w-[50px]">
            <Image
              src="/Lucidify Umbrella.png"
              alt="Lucidify Logo"
              layout="responsive"
              width={0}
              height={0}
            />
          </div>
          <h1 className="HeadingFont">Start a <span className="TextGradient">project</span>.</h1>
          <h3 className="text-[15px] opacity-90 font-light text-center max-w-[550px]">Got a vision? Let&apos;s make it real. We'll contact you in less than a day.</h3>
          <div className="w-[600px] h-[1px] bg-gradient-to-b from-[rgba(255,255,255,0.25)] to-[rgba(255,255,255,0.20)] mt-[20px] mb-[10px]" />

          {isSubmitted ? (
            // Thank you message after submission
            <h3 className="text-[18px] text-white text-center mt-[40%]">
              Thank you! We will get back to you shortly.
            </h3>
          ) : (
            // Form before submission
            <form className="flex flex-col gap-[30px] rounded-lg shadow-lg mx-auto" onSubmit={handleSubmit}>
              <div className="flex gap-[45px]">
                <div className="flex flex-col w-[275px]">
                  <label htmlFor="firstName" className="mb-[5px] text-white text-[16px] font-medium">
                    First name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    placeholder="Your first name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="p-3 rounded-lg border-none bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-[rgba(128,128,128,0.15)] bg-transparent text-white placeholder-[rgba(255,255,255,0.65)] focus:outline-none focus:bg-[rgba(255,255,255,0.05)] focus:ring-[0.5px] focus:ring-[rgba(255,255,255,0.25)] text-[14px]"
                    required
                  />
                </div>
                <div className="flex flex-col w-[275px]">
                  <label htmlFor="lastName" className="mb-[5px] text-white text-[16px] font-medium">
                    Last name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    placeholder="Your last name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="p-3 rounded-lg border-none bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-[rgba(128,128,128,0.15)] bg-transparent text-white placeholder-[rgba(255,255,255,0.65)] focus:outline-none focus:bg-[rgba(255,255,255,0.05)] focus:ring-[0.5px] focus:ring-[rgba(255,255,255,0.25)] text-[14px]"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-[45px]">
                <div className="flex flex-col w-[275px]">
                  <label htmlFor="email" className="mb-[5px] text-white text-[16px] font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="p-3 rounded-lg border-none bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-[rgba(128,128,128,0.15)] bg-transparent text-white placeholder-[rgba(255,255,255,0.65)] focus:outline-none focus:bg-[rgba(255,255,255,0.05)] focus:ring-[0.5px] focus:ring-[rgba(255,255,255,0.25)] text-[14px]"
                    required
                  />
                </div>
                <div className="flex flex-col w-[275px]">
                  <label htmlFor="phone" className="mb-[5px] text-white text-[16px] font-medium">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    placeholder="Your phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="p-3 rounded-lg border-none bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-[rgba(128,128,128,0.15)] bg-transparent text-white placeholder-[rgba(255,255,255,0.65)] focus:outline-none focus:bg-[rgba(255,255,255,0.05)] focus:ring-[0.5px] focus:ring-[rgba(255,255,255,0.25)] text-[14px]"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-[45px]">
                <div className="flex flex-col w-[275px]">
                  <label htmlFor="companyName" className="mb-[5px] text-white text-[16px] font-medium">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    placeholder="Your company name"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="p-3 rounded-lg border-none bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-[rgba(128,128,128,0.15)] bg-transparent text-white placeholder-[rgba(255,255,255,0.65)] focus:outline-none focus:bg-[rgba(255,255,255,0.05)] focus:ring-[0.5px] focus:ring-[rgba(255,255,255,0.25)] text-[14px]"
                  />
                </div>
                <div className="flex flex-col w-[275px]">
                  <label htmlFor="industry" className="mb-[5px] text-white text-[16px] font-medium">
                    Industry
                  </label>
                  <input
                    type="text"
                    id="industry"
                    placeholder="Your industry (e.g., Finance, Healthcare, Tech)"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className="p-3 rounded-lg border-none bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-[rgba(128,128,128,0.15)] bg-transparent text-white placeholder-[rgba(255,255,255,0.65)] focus:outline-none focus:bg-[rgba(255,255,255,0.05)] focus:ring-[0.5px] focus:ring-[rgba(255,255,255,0.25)] text-[14px]"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label htmlFor="projectDetails" className="mb-[5px] text-white text-[16px] font-medium">
                  Project Details
                </label>
                <textarea
                  id="projectDetails"
                  placeholder="Tell us a bit about your project"
                  value={formData.projectDetails}
                  onChange={handleInputChange}
                  className="p-3 rounded-lg border-none bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-[rgba(128,128,128,0.15)] bg-transparent text-white placeholder-[rgba(255,255,255,0.65)] focus:outline-none focus:bg-[rgba(255,255,255,0.05)] focus:ring-[0.5px] focus:ring-[rgba(255,255,255,0.25)] text-[14px]"
                  rows={5}
                />
              </div>

              <button type="submit" className="rounded-[8px] bg-[#725CF7] text-white py-3 hover:bg-[#5a3ecf] transition-colors duration-300 ease-in-out BoxShadow">
                Submit Idea
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Popup;
