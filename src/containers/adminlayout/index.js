import React, { useState } from 'react';
import {
  Layout,
  Breadcrumb,
  Button,
  Menu,
  Avatar,
  Row,
  Popover,
  Typography,
  Image,
  theme 
} from 'antd';
import {
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, Navigate } from 'react-router-dom';
import SideBar from '../../components/Sidebar';
import { useSelector, useDispatch } from 'react-redux';
import MenuBar from '../../components/Menubar';
// import { logout } from '../../store';
// import { setUser, FlushUserData } from '../../store';

const { Header, Content, Footer, Sider } = Layout;
const { Text } = Typography;

const AdminLayout = () => {

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();



  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  // const { userInfo } = useSelector((state) => state.user);

  const handleCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  // const base64Image = `data:image/png;base64,${userInfo.image}`;

  const content = (
    <div style={{ width: 'auto', paddingLeft: '2px', paddingRight: '2px' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'start',
            gap: '0px',
          }}
        >
          {/* <Image src={base64Image} alt="Base64 Image" />  */}
          <Text style={{ marginTop: '0px', fontSize: 18, fontWeight: '500' }}>
            {/* {userInfo?.userName} */}
          </Text>
          <Text style={{ marginTop: '1px', fontSize: 13, color: '#606060' }}>
            {/* {userInfo?.solDesc} */}
          </Text>
          {/* <Text   style={{marginTop:'-1px', fontSize:12, color:"#6D6D6D"}}>Employee Id: 1923</Text> */}
          <Text style={{ fontSize: 13, color: '#606060' }}>
            {/* {userInfo?.email} */}
          </Text>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignContent: 'right',
        }}
      >
        <Button
          onClick={() => handleLogout()}
          type="primary"
          style={{ marginTop: '12px', width: 'auto' }}
        >
          Log out
        </Button>
      </div>
    </div>
  );

  const handleLogout = () => {
    // Handle logout logic here
    // dispatch(
    //   setUser({
    //     userName: null,
    //     solId: null,
    //     email: null,
    //     departmentName: null,
    //     token: null,
    //   })
    // );
    // dispatch(FlushUserData());
    // alert('removed from localstorage')
    navigate('/login');
  };

  return (
    <Layout>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor:"#8F0000"
        }}
      >
        <div className="demo-logo">
          <Image
            src="/images/everest_bank_logo_main.png" // Replace with the path to your logo
            alt="Logo"
            preview={false}
            style={{ height: 70 }} // Adjust the height to fit your layout
          />
        </div>
        <MenuBar/>
      </Header>
      <Content
        style={{
          padding: '0 48px',
        }}
      >
        <Breadcrumb
          style={{
            margin: '16px 0',
          }}
        >
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet/>
        </div>
      </Content>
      <Footer
        style={{
          textAlign: 'center',
        }}
      >
        Everest Bank Ltd ©{new Date().getFullYear()} Created by IT Department
      </Footer>
    </Layout>
  );
};

export default AdminLayout;
