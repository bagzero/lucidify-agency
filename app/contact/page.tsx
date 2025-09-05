import CONTACTHeroSection from "@/components/CONTACTHeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";
import GetStartedSection from "@/components/GetStartedSection";
import Main from "@/components/Main";
import Navbar from "@/components/Navbar";

export default function ContactPage() {
    return (
        <>
            <Navbar />
            <Main>
                <CONTACTHeroSection />
                <FeaturesSection />
                <GetStartedSection />
            </Main>
            <Footer />
        </>
    );
}