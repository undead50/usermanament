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
  theme,
} from 'antd';
import { Modal, Input, Form } from 'antd';
import {
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, Navigate } from 'react-router-dom';
import SideBar from '../../components/Sidebar';
import { useSelector, useDispatch } from 'react-redux';
import MenuBar from '../../components/Menubar';
import './login.css';
import { useEffect } from 'react';
import { postLoginData } from '../../store/slices/authSlice';
import { useNotification } from '../../hooks/index';
import { logout } from '../../store';
import { setUser, FlushUserData } from '../../store';

const { Header, Content, Footer, Sider } = Layout;
const { Text } = Typography;

const AdminLayout = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [form] = Form.useForm();

  const { callNotification } = useNotification();

  const { data, loading, error } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  

  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(()=>{
    if(data === null){
      setVisible(true);
    }
  },[data])

  useEffect(() => {
    if (data) {
      if (data.code === 0) {
        dispatch(
          setUser({
            userName: data.empData.domainName,
            solId: data.empData.branch,
            email: data.empData.email,
            departmentName: "IT",
            employeeName: data.empData.name,
            isSuperAdmin: true,
            image: "",
            solDesc: "",
            employeeId:data.empData.employeeId,
            cbsId:data.empData.cbsUsername
          })
        );
        console.log(data)
        navigate('/');
        setVisible(false)
        callNotification('Login Success', 'success');
      } else {
        callNotification('Login Denied', 'error');
      }
    }
  }, [data]);


  const showModal = () => {
    setVisible(true);
  };

  const handleOk = (values) => {
    dispatch(postLoginData(values))
    form.resetFields();
  };

  const handleCancel = () => {
    setVisible(false);
  };

  // const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);

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
            {userInfo?.userName}
          </Text>
          <Text style={{ marginTop: '1px', fontSize: 13, color: '#606060' }}>
            {userInfo?.solDesc}
          </Text>
          {/* <Text   style={{marginTop:'-1px', fontSize:12, color:"#6D6D6D"}}>Employee Id: 1923</Text> */}
          <Text style={{ fontSize: 13, color: '#606060' }}>
            {userInfo?.email}
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
    dispatch(
      setUser({
        userName: null,
        solId: null,
        email: null,
        departmentName: null,
        token: null,
      })
    );
    dispatch(FlushUserData());

  };

  return (
    <Layout>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#8F0000',
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
        <MenuBar />
        <div
              style={{ flex: '50%', textAlign: 'right', marginRight: '18px' }}
            >
              <Popover
                overlayStyle={{ position: 'fixed' }}
                content={content}
                title=""
                trigger="click"
                placement="topRight"
              >
                <Avatar
                  size={40}
                  icon={<UserOutlined />}
                  style={{ cursor: 'pointer', marginTop: -3 }}
                />
              </Popover>
            </div>
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
          {/* <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item> */}
        </Breadcrumb>
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </div>
      </Content>
      <Footer
        style={{
          textAlign: 'center',
        }}
      >
        Everest Bank Ltd ©{new Date().getFullYear()} Created by IT Department
      </Footer>
      {/* <Button type="primary" onClick={showModal}>
        Open Login Modal
      </Button> */}
      {visible && (
        <>
      <div className="modal-blurred-background" >
      <div className="modal-content">
      <Modal
        title=""
        open={visible}
        onOk={handleOk}
        onCancel={null}
        footer={null} // No default footer (Ok/Cancel buttons)
        // className="blur-background"
        maskClosable={false}
        width={'350px'}
      >
        {/* <Image
                className="modal-image"
                src={process.env.PUBLIC_URL + '/images/everest_bank_logo_main.png'}
                alt="Login"
                preview={false}
              /> */}
        <br/>
        <Text
          level={1}
          style={{
            textAlign: 'center',
            // marginBottom: '15px',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
          }}
        >
          <h3>User Approval System</h3>
        </Text>
        <Text style={{fontSize:'9px'}}>(Login with AD username & password)</Text>
        <Form
          name="login"
          form={form}
          initialValues={{ remember: true }}
          onFinish={handleOk}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" loading={loading} htmlType="submit" style={{ width: '100%' }}>
              Login
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      </div>
      </div>
      </>
      )}
    </Layout>
  );
};

export default AdminLayout;
