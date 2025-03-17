import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

import { backendUrl } from "../App";

const ListUser = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get(`${backendUrl}/admin/getusers`)
      .then((res) => setUsers(res.data.data))
      .catch((err) => console.error("Failed loading user: ", err));
  }, []);

  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const sendNotification = async () => {
    if (!subject || !message || selectedUsers.length === 0) {
      toast.error("Please enter all the input!");
      return;
    }

    try {
      await axios.post(`${backendUrl}/admin/send-notification`, {
        subject,
        message,
        userIds: selectedUsers,
      });

      toast.success("Notification has been sent");
      setSelectedUsers([]);
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Sending failed");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">List of Users</h2>

      {/* Form nhập nội dung email */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border p-2 mb-2 w-full h-24"
        />
      </div>

      {/* Bảng danh sách user */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Chọn</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="text-center">
              <td className="border p-2">
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user._id)}
                  onChange={() => toggleUserSelection(user._id)}
                />
              </td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">{user.name || "Chưa cập nhật"}</td>
              <td className="border p-2">
                <button
                  onClick={() => {
                    setSelectedUsers([user._id]); // Chỉ chọn 1 user
                    sendNotification();
                  }}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Send Email
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Nút gửi email chung */}
      <button
        onClick={sendNotification}
        className="bg-green-500 text-white px-4 py-2 rounded mt-4"
      >
        Send chosen Emails
      </button>
    </div>
  );
};

export default ListUser;
