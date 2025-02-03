import React from 'react';
import { useUser } from "../../store/UserStore";


const CollapsedBtn: React.FC = () => {
  const { collapsed, setCollapsed } = useUser();
  
    const toggleCollapsed = () => {
      setCollapsed();
    };

  return (
    <div
      className="collapsedBtn"
      onMouseOver={(e) => {
          (e.currentTarget as HTMLDivElement).classList.add('hover');
        }}
        onMouseOut={(e) => {
            (e.currentTarget as HTMLDivElement).classList.remove('hover');
        }}
        onClick={toggleCollapsed} >
          {collapsed ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="26px"
              viewBox="0 -960 960 960"
              width="26px"
              fill="#1677fe"
            >
              <path d="M480-200 240-440l56-56 184 183 184-183 56 56-240 240Zm0-240L240-680l56-56 184 183 184-183 56 56-240 240Z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="26px"
              viewBox="0 -960 960 960"
              width="26px"
              fill="#1677fe"
            >
              <path d="m296-224-56-56 240-240 240 240-56 56-184-183-184 183Zm0-240-56-56 240-240 240 240-56 56-184-183-184 183Z" />
            </svg>
          )}
            
        
     
    </div>
  );
};

export default CollapsedBtn;
