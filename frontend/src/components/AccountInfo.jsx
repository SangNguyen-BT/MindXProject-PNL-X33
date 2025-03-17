import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import ProfileNav from "../components/ProfileNav";

import { Responsive } from "./Responsive";

const AccountInfo = () => {
    const [user, setUser] = useState({
        name: "",
        email: "",
        city: "",
    });

    const getUser = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/auth/getuser`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (response.data.ok) {
                setUser(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    const handleUpdateProfile = async () => {
        try {
            const response = await axios.put(
                `${backendUrl}/api/auth/update/${user._id}`,
                { name: user.name, email: user.email, city: user.city },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            alert("Profile updated successfully!");
            setUser(response.data);
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Error updating profile!");
        }
    };


    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleChangePassword = async () => {
        try {
            const response = await axios.put(
                `${backendUrl}/api/auth/change-password/${user._id}`,
                passwordData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            alert("Password changed successfully!");
            setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        } catch (error) {
            console.error("Error changing password:", error);
            alert(error.response?.data?.error || "Error changing password!");
        }
    };

    return (
        <div>
            <ProfileNav />

            <div className="flex justify-end min-h-screen bg-gradient-to-b from-[#0B132B] to-[#1C2541] p-6" responsive={Responsive}>

                <div className="w-3/4 bg-white shadow-lg rounded-lg p-8 ml-6">
                    {/* CUSTOMER INFO */}
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-4">CUSTOMER INFO</h2>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-bold mb-4">Personal Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block font-semibold">Name</label>
                                <input
                                    type="text"
                                    value={user.name}
                                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                                    className="w-full p-2 border border-gray-400 rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold">City</label>
                                <input
                                    type="text"
                                    value={user.city}
                                    onChange={(e) => setUser({ ...user, city: e.target.value })}
                                    className="w-full p-2 border border-gray-400 rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold">Email</label>
                                <input
                                    type="email"
                                    value={user.email}
                                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                                    className="w-full p-2 border border-gray-400 rounded-md"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleUpdateProfile}
                            className="mt-4 px-6 py-2 bg-gray-300 hover:bg-gray-400 text-black font-semibold rounded-md"
                        >
                            SAVE
                        </button>
                    </div>

                    {/* Change Password Section */}
                    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                        <h3 className="text-xl font-bold mb-4">Change Password</h3>

                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block font-semibold">
                                    Old Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.oldPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                    className="w-full p-2 border border-gray-400 rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold">
                                    New Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    className="w-full p-2 border border-gray-400 rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold">
                                    Confirm Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    className="w-full p-2 border border-gray-400 rounded-md"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleChangePassword}
                            className="mt-4 px-6 py-2 bg-gray-900 text-white font-semibold rounded-md hover:bg-gray-700"
                        >
                            CHANGE PASSWORD
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountInfo;
