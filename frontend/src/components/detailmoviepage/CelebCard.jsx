import React from "react";

const CelebCard = (data) => {
  return (
    <div className="flex flex-col justify-center items-center w-full mb-10">
      <div className="w-40 h-40 rounded-full overflow-hidden mb-4">
        <img
          src={data.imageUrl}
          alt={data.name}
          width={200}
          height={200}
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="text-white text-center">{data.name}</h3>
      <h4 className="text-white text-center">{data.role}</h4>
    </div>
  );
};

export default CelebCard;
