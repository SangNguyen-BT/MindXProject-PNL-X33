import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

import { backendUrl } from "../App";

const CreateCinemaPage = ({setShowAddCinema}) => {
  const tempSeatLayout = [
    {
      // platinum
      type: "platinum",
      rows: [
        {
          // row 2
          rowname: "H",
          cols: [
            // col 1
            {
              seats: [
                { seat_id: "H01" },
                { seat_id: "H02" },
                { seat_id: "H03" },
                { seat_id: "H04" },
                { seat_id: "H05" },
                { seat_id: "H06" },
              ],
            },
            // col 2
            {
              seats: [
                { seat_id: "H07" },
                { seat_id: "H08" },
                { seat_id: "H09" },
                { seat_id: "H10" },
                { seat_id: "H11" },
                { seat_id: "H12" },
                { seat_id: "H13" },
                { seat_id: "H14" },
                { seat_id: "H15" },
                { seat_id: "H16" },
                { seat_id: "H17" },
                { seat_id: "H18" },
                { seat_id: "H19" },
                { seat_id: "H20" },
              ],
            },
          ],
        },
        {
          rowname: "G",
          cols: [
            // col 1
            {
              seats: [
                { seat_id: "G01" },
                { seat_id: "G02" },
                { seat_id: "G03" },
                { seat_id: "G04" },
                { seat_id: "G05" },
                { seat_id: "G06" },
              ],
            },
            // col 2
            {
              seats: [
                { seat_id: "G07" },
                { seat_id: "G08" },
                { seat_id: "G09" },
                { seat_id: "G10" },
                { seat_id: "G11" },
                { seat_id: "G12" },
                { seat_id: "G13" },
                { seat_id: "G14" },
                { seat_id: "G15" },
                { seat_id: "G16" },
                { seat_id: "G17" },
                { seat_id: "G18" },
                { seat_id: "G19" },
                { seat_id: "G20" },
              ],
            },
          ],
        },
        {
          // row 2
          rowname: "F",
          cols: [
            // col 1
            {
              seats: [
                { seat_id: "F01" },
                { seat_id: "F02" },
                { seat_id: "F03" },
                { seat_id: "F04" },
                { seat_id: "F05" },
                { seat_id: "F06" },
              ],
            },
            // col 2
            {
              seats: [
                { seat_id: "F07" },
                { seat_id: "F08" },
                { seat_id: "F09" },
                { seat_id: "F10" },
                { seat_id: "F11" },
                { seat_id: "F12" },
                { seat_id: "F13" },
                { seat_id: "F14" },
                { seat_id: "F15" },
                { seat_id: "F16" },
                { seat_id: "F17" },
                { seat_id: "F18" },
                { seat_id: "F19" },
                { seat_id: "F20" },
              ],
            },
          ],
        },
      ],
      price: 10,
    },
    {
      // gold
      type: "gold",
      rows: [
        {
          // row 2
          rowname: "E",
          cols: [
            // col 1
            {
              seats: [
                { seat_id: "E01" },
                { seat_id: "E02" },
                { seat_id: "E03" },
                { seat_id: "E04" },
                { seat_id: "E05" },
                { seat_id: "E06" },
              ],
            },
            // col 2
            {
              seats: [
                { seat_id: "E07" },
                { seat_id: "E08" },
                { seat_id: "E09" },
                { seat_id: "E10" },
                { seat_id: "E11" },
                { seat_id: "E12" },
                { seat_id: "E13" },
                { seat_id: "E14" },
                { seat_id: "E15" },
                { seat_id: "E16" },
                { seat_id: "E17" },
                { seat_id: "E18" },
                { seat_id: "E19" },
                { seat_id: "E20" },
              ],
            },
          ],
        },
        {
          rowname: "D",
          cols: [
            // col 1
            {
              seats: [
                { seat_id: "D01" },
                { seat_id: "D02" },
                { seat_id: "D03" },
                { seat_id: "D04" },
                { seat_id: "D05" },
                { seat_id: "D06" },
              ],
            },
            // col 2
            {
              seats: [
                { seat_id: "D07" },
                { seat_id: "D08" },
                { seat_id: "D09" },
                { seat_id: "D10" },
                { seat_id: "D11" },
                { seat_id: "D12" },
                { seat_id: "D13" },
                { seat_id: "D14" },
                { seat_id: "D15" },
                { seat_id: "D16" },
                { seat_id: "D17" },
                { seat_id: "D18" },
                { seat_id: "D19" },
                { seat_id: "D20" },
              ],
            },
          ],
        },
        {
          // row 2
          rowname: "C",
          cols: [
            // col 1
            {
              seats: [
                { seat_id: "C01" },
                { seat_id: "C02" },
                { seat_id: "C03" },
                { seat_id: "C04" },
                { seat_id: "C05" },
                { seat_id: "C06" },
              ],
            },
            // col 2
            {
              seats: [
                { seat_id: "C07" },
                { seat_id: "C08" },
                { seat_id: "C09" },
                { seat_id: "C10" },
                { seat_id: "C11" },
                { seat_id: "C12" },
                { seat_id: "C13" },
                { seat_id: "C14" },
                { seat_id: "C15" },
                { seat_id: "C16" },
                { seat_id: "C17" },
                { seat_id: "C18" },
                { seat_id: "C19" },
                { seat_id: "C20" },
              ],
            },
          ],
        },
      ],
      price: 7,
    },
    {
      // silver - 20 objects
      type: "silver",
      rows: [
        {
          rowname: "B",
          cols: [
            // col 1
            {
              seats: [
                { seat_id: "B01" },
                { seat_id: "B02" },
                { seat_id: "B03" },
                { seat_id: "B04" },
                { seat_id: "B05" },
                { seat_id: "B06" },
              ],
            },
            // col 2
            {
              seats: [
                { seat_id: "B07" },
                { seat_id: "B08" },
                { seat_id: "B09" },
                { seat_id: "B10" },
                { seat_id: "B11" },
                { seat_id: "B12" },
                { seat_id: "B13" },
                { seat_id: "B14" },
                { seat_id: "B15" },
                { seat_id: "B16" },
                { seat_id: "B17" },
                { seat_id: "B18" },
                { seat_id: "B19" },
                { seat_id: "B20" },
              ],
            },
          ],
        },
        {
          // row 2
          rowname: "A",
          cols: [
            // col 1
            {
              seats: [
                { seat_id: "A01" },
                { seat_id: "A02" },
                { seat_id: "A03" },
                { seat_id: "A04" },
                { seat_id: "A05" },
                { seat_id: "A06" },
              ],
            },
            // col 2
            {
              seats: [
                { seat_id: "A07" },
                { seat_id: "A08" },
                { seat_id: "A09" },
                { seat_id: "A10" },
                { seat_id: "A11" },
                { seat_id: "A12" },
                { seat_id: "A13" },
                { seat_id: "A14" },
                { seat_id: "A15" },
                { seat_id: "A16" },
                { seat_id: "A17" },
                { seat_id: "A18" },
                { seat_id: "A19" },
                { seat_id: "A20" },
              ],
            },
          ],
        },
      ],
      price: 5,
    },
  ];

  const [screen, setScreen] = useState({
    name: "",
    location: "",
    seats: tempSeatLayout,
    city: "",
    screenType: "",
  });
        
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setScreen({ ...screen, [name]: value });
  };

  const handleScreenTypeChange = (e) => {
    const { value } = e.target;
    setScreen({ ...screen, screenType: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (
        screen.name === "" ||
        screen.location === "" ||
        screen.seats.length == 0 ||
        screen.city === "" ||
        screen.screenType === ""
      ) {
        toast.error("Please fill all the fields", {
          position: "top-center",
        });
        return;
      }

      const response = await axios.post(
        `${backendUrl}/api/movie/createscreen`,
        screen,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.ok) {
        console.log("Screen creation successful", response.data);
        setShowAddCinema(false)
        toast.success("Screen Created Successfully", {
          position: "top-center",
        });

      } else {
        console.error("Screen creation failed", response.data.message);
        toast.error("Screen Creation Failed", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-6 bg-white border rounded-md shadow-sm">
      <div className="mb-4">
        <label htmlFor="name" className="block mb-1 font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Enter screen name"
          value={screen.name}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="location"
          className="block mb-1 font-medium text-gray-700"
        >
          Location
        </label>
        <input
          type="text"
          name="location"
          id="location"
          placeholder="Enter location"
          value={screen.location}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="city" className="block mb-1 font-medium text-gray-700">
          City
        </label>
        <input
          type="text"
          name="city"
          id="city"
          placeholder="Enter city"
          value={screen.city}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>

      <div className="mb-4">
        <p className="mb-2 font-medium text-gray-700">Screen Type:</p>
        <div className="flex flex-wrap gap-4">
          {["3D", "2D", "4D", "IMAX"].map((type) => (
            <label key={type} className="flex items-center space-x-2">
              <input
                type="radio"
                name="screenType"
                value={type}
                checked={screen.screenType === type}
                onChange={handleScreenTypeChange}
                className="text-blue-500 focus:ring focus:ring-blue-300"
              />
              <span className="text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
      >
        Create Cinema
      </button>
    </div>
  );
};

export default CreateCinemaPage;
