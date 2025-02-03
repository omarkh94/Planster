import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import {  Drawer, Space } from 'antd';
import { createStyles, useTheme } from 'antd-style';
import type { DrawerClassNames, DrawerStyles } from 'antd/es/drawer/DrawerPanel';

const useStyle = createStyles(({ token }) => ({
  'my-drawer-body': {
    background: "#000c17",
    color:"#ecf0f1",
  },
  'my-drawer-mask': {
    boxShadow: `inset 0 0 15px #fff`,
  },
  'my-drawer-header': {
    background: token.green1,
  },
  'my-drawer-footer': {
    color: token.colorPrimary,
  },
  'my-drawer-content': {
    borderLeft: `1px solid ${token.colorPrimary}`,
  },
}));

const SideNav: React.FC = () => {
  const [open, setOpen] = useState([false, false]);
  const { styles } = useStyle();
  const token = useTheme();

  const toggleDrawer = (idx: number, target: boolean) => {
    setOpen((p) => {
      p[idx] = target;
      return [...p];
    });
  };

  const classNames: DrawerClassNames = {
    body: styles['my-drawer-body'],
    mask: styles['my-drawer-mask'],
    header: styles['my-drawer-header'],
    footer: styles['my-drawer-footer'],
    content: styles['my-drawer-content'],
  };

  const drawerStyles: DrawerStyles = {
    mask: {
      backdropFilter: 'blur(10px)',
    },
    content: {
      boxShadow: '-10px 0 10px #666',
    },
    header: {
      borderBottom: `1px solid ${token.colorPrimary}`,
    },
    body: {
      fontSize: token.fontSizeLG,
    },
    footer: {
      borderTop: `1px solid ${token.colorBorder}`,
    },
  };

  const handleLinkClick = () => {
    toggleDrawer(0, false); 
  };
  return (
    <>
      <Space>
        <span  onClick={() => toggleDrawer(0, true)}>
        <svg
        className="float-btn-icon"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -960 960 960"
      >
        <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
      </svg>
        </span>
        
      </Space>
      <Drawer
        className="my-drawer"
        title="Planster"
        width="190"
        placement="right"
        footer="©1903 Planster project management, All rights reserved"
        onClose={() => toggleDrawer(0, false)}
        open={open[0]}
        classNames={classNames}
        styles={drawerStyles}
      >
        <ul className="sidebar" >
                     <li>
                       <Link to="/" onClick={handleLinkClick}>Home</Link>
                    </li>
                     <li>
                       <Link to="" onClick={handleLinkClick}>Projects</Link>
                     </li>
                     <li>
                       <Link to="" onClick={handleLinkClick}>About</Link>
                     </li>
                     <li>
                       <Link to="" onClick={handleLinkClick}>Support</Link>
                     </li>
                     <li>
                       <Link to="/login" onClick={handleLinkClick}>Login</Link>
                     </li>
                     <li>
                       <Link to="/register" onClick={handleLinkClick}>Register</Link>
                     </li>
                  </ul>
      </Drawer>
      
    </>
  );
};

export default SideNav;