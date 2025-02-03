import {
  DashboardOutlined,
  HomeOutlined,
  PlusSquareOutlined,
  ProjectOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../store/UserStore";
const CollapsedMenu: React.FC = () => {
  const navigate = useNavigate();
  const { collapsed, setDialogOpen } = useUser();

  type MenuItem = Required<MenuProps>["items"][number];
  const handleCreateProject = () => {
    setDialogOpen(true);
  };

  const items: MenuItem[] = [
    {
      key: "1",
      icon: <HomeOutlined />,
      label: "Home",
      onClick: () => navigate("/"),
    },
    {
      key: "5",
      label: "Projects",
      onClick: () => navigate("/projects"),
      icon: <DashboardOutlined />,
      children: [
        {
          key: "19",
          icon: <PlusSquareOutlined />,
          label: "New Project",
          onClick: handleCreateProject,
        },
        {
          key: "20",
          label: "Your Projects",
          icon: <ProjectOutlined />,
          onClick: () => navigate("/projects"),
        },
      ],
    },
    // TODO: ${users.id} make that work dynamically
    {
      key: "11",
      icon: <SettingOutlined />,
      label: "Profile",
      onClick: () => navigate(`/profile/u2`),
    },
  ];

  return (
    <>
      <div style={{ maxWidth: "225px" }}>
        <Menu
          className="menu"
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={[]}
          mode="inline"
          theme="dark"
          inlineCollapsed={collapsed}
          items={items}
        />
      </div>
    </>
  );
};

export default CollapsedMenu;
