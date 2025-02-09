// import React from 'react'

import { Link } from "react-router-dom";

const HomePage = () => {

  return (
    <>
      <h1 className="text-4xl font-bold text-black p-1 bg-[#58C0C9]/50   -rotate-12  absolute start-[5%] ">
        Start Your Journey to Success
      </h1>
      <h1 className="text-4xl font-bold text-black absolute end-[15%]  rotate-12 bg-[#58C0C9]/50 ">
        With Planster
      </h1>
      <Link to="/welcome" className="scale-[2] text-4xl font-bold text-black bg-secondary p-1 rounded-lg relative bottom-0"
      >
        Start now
      </Link>
    </>
  );
};

export default HomePage;
