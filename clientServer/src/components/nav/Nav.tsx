import { Link } from "react-router-dom";
const Nav = () => {
  const isLoggedIn: boolean = true;
  const user = { firstName: "Omar", lastName: "Ibrahim" };

  return (
    // <nav>
    //   <ul className="firstHalf">
    //     <li className="hideOnMobile logo">
    //       <Link to="/">PLANSTER</Link>
    //     </li>

    //     <li>
    //       <button>
    //         <svg
    //           xmlns="http://www.w3.org/2000/svg"
    //           height="16px"
    //           viewBox="0 -960 960 960"
    //           width="16px"
    //           fill="#000000"
    //         >
    //           <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
    //         </svg>
    //       </button>
    //       <input type="text" placeholder="Search here"/>
    //     </li>
    //     <li>
    //       <Link to="">
    // <svg
    //   xmlns="http://www.w3.org/2000/svg"
    //   height="24px"
    //   viewBox="0 -960 960 960"
    //   width="24px"
    //   fill="#ecf0f1"
    // >
    //   <path d="m480-80-10-120h-10q-142 0-241-99t-99-241q0-142 99-241t241-99q71 0 132.5 26.5t108 73q46.5 46.5 73 108T800-540q0 75-24.5 144t-67 128q-42.5 59-101 107T480-80Zm80-146q71-60 115.5-140.5T720-540q0-109-75.5-184.5T460-800q-109 0-184.5 75.5T200-540q0 109 75.5 184.5T460-280h100v54Zm-101-95q17 0 29-12t12-29q0-17-12-29t-29-12q-17 0-29 12t-12 29q0 17 12 29t29 12Zm-29-127h60q0-30 6-42t38-44q18-18 30-39t12-45q0-51-34.5-76.5T460-720q-44 0-74 24.5T344-636l56 22q5-17 19-33.5t41-16.5q27 0 40.5 15t13.5 33q0 17-10 30.5T480-558q-35 30-42.5 47.5T430-448Zm30-65Z" />
    // </svg>
    //       </Link>
    //     </li>
    //   </ul>
    // </nav>
    <nav>
      <div className="logo">
        <Link to="/">PLANSTER</Link>
      </div>

      <div className="icons" style={{display:"flex"}}>
      <Link to="/info" className="Messages" aria-label="Info">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ecf0f1"><path d="M240-400h320v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z"/></svg>
        </Link>
        <Link to="/info" className="Notification" aria-label="Info">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ecf0f1"><path d="M80-560q0-100 44.5-183.5T244-882l47 64q-60 44-95.5 111T160-560H80Zm720 0q0-80-35.5-147T669-818l47-64q75 55 119.5 138.5T880-560h-80ZM160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z"/></svg>
        </Link>
      

      
      <Link to="/info" className="info-icon" aria-label="Info">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#ecf0f1"
          >
            <path d="m480-80-10-120h-10q-142 0-241-99t-99-241q0-142 99-241t241-99q71 0 132.5 26.5t108 73q46.5 46.5 73 108T800-540q0 75-24.5 144t-67 128q-42.5 59-101 107T480-80Zm80-146q71-60 115.5-140.5T720-540q0-109-75.5-184.5T460-800q-109 0-184.5 75.5T200-540q0 109 75.5 184.5T460-280h100v54Zm-101-95q17 0 29-12t12-29q0-17-12-29t-29-12q-17 0-29 12t-12 29q0 17 12 29t29 12Zm-29-127h60q0-30 6-42t38-44q18-18 30-39t12-45q0-51-34.5-76.5T460-720q-44 0-74 24.5T344-636l56 22q5-17 19-33.5t41-16.5q27 0 40.5 15t13.5 33q0 17-10 30.5T480-558q-35 30-42.5 47.5T430-448Zm30-65Z" />
          </svg>
        </Link>

        <Link to="" className="user-icon" aria-label="User">
          {isLoggedIn ? (
            `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#ecf0f1"
            >
              <path d="M480-720q60 0 101 41.5t41 101.5q0 60-41 101.5t-101 41.5q-60 0-101-41.5T380-577q0-60 41-101.5t101-41.5Zm0 184q-34 0-57-23t-23-57q0-34 23-57t57-23q34 0 57 23t23 57q0 34-23 57t-57 23Zm0 160q51 0 95.5 19.5t78.5 52.5q31 32 48 74.5t17 96.5h-340q0-49 17-96.5t48-74.5q27-33 78.5-52.5t95.5-19.5Z" />
            </svg>
          )}
        </Link>
      </div>
    </nav>
  );
};

export default Nav;
