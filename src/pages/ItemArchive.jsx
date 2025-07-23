import React from "react";
function ItemArchive({ name, date, type, duration, imageUrl }) {
  return (
    <div
      className="flex mx-20 my-2 p-2"
      style={{ direction: "rtl", backgroundColor: "#F8F8F8", borderRadius: "8px" }}
    >
      <div className="w-60">
        <p>{name}</p>
      </div>
      <div className="w-24">
        <p>{date}</p>
      </div>
      <div className="w-24">
        <p>{type}</p>
      </div>
      <div className="w-24">
        <p>{duration}</p>
      </div>
      {imageUrl && (
        <div className="w-24">
          <img
            src={imageUrl}
            alt={name}
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
          />
        </div>
      )}
    </div>
  );
}
export default ItemArchive;
