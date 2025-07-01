import React  from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Profile from "../../components/Profile/Profile";

const ProfilePage = () => {
    return (
        <div>
            <Navbar/>
            <Profile/>
            <Footer/>
        </div>
    );
};
export default ProfilePage;