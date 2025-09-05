import CREATIONSAllCaseStudiesSection from "@/components/CREATIONSAllCaseStudiesSection";
import CREATIONSHeroSection from "@/components/CREATIONSHeroSection";
import Footer from "@/components/Footer";
import GetStartedSection from "@/components/GetStartedSection";
import Main from "@/components/Main";
import Navbar from "@/components/Navbar";

export default function CreationsPage() {
    return (
        <>
            <Navbar />
            <Main>
                <CREATIONSHeroSection />
                <CREATIONSAllCaseStudiesSection />
                <div className="mt-[200px]" />
                <GetStartedSection />
            </Main>
            <Footer />
        </>
    );
}