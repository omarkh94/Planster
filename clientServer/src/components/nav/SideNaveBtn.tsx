import React from "react";
import SideNav from "./SideNav";

const SideNaveBtn: React.FC = () => {
  const handleFloat = () => {
    // TODO: Implement side nav
  };

  return (
    <div
      className="float-btn"
      onClick={handleFloat}
      onMouseOver={(e) => {
        (e.currentTarget as HTMLDivElement).classList.add("hover");
      }}
      onMouseOut={(e) => {
        (e.currentTarget as HTMLDivElement).classList.remove("hover");
      }}
    >
      {" "}
      <SideNav />
    </div>
  );
};

export default SideNaveBtn;
