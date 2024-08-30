import {
  FolderOpenOutlined ,
  CheckCircleOutlined ,
  ClockCircleOutlined,
  PlusOutlined, 
  UserOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { Tag, Avatar, Card, Col, Row, Statistic,Divider } from 'antd';
import { useSelector } from 'react-redux';
import './index.css';
import CountUp from 'react-countup';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchUserapprovalmastersByCurrentHandler } from '../../store/slices/userapprovalmasterSlice';


const Dashboard = () => {
  const [greeting, setGreeting] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const { data } = useSelector((state) => state.auth);

  const {userapprovalmasters_current_handler } = useSelector((state)=>state.userapprovalmaster)

  const {userInfo} = useSelector((state)=>state.user)


  useEffect(() => {
    const updateGreeting = () => {
      const currentHour = new Date().getHours();
      const formatter = (value) => `${value} pending`;

      if (currentHour >= 5 && currentHour < 12) {
        setGreeting('Good morning');
      } else if (currentHour >= 12 && currentHour < 17) {
        setGreeting('Good afternoon');
      } else {
        setGreeting('Good evening');
      }
    };

    updateGreeting(); // Set the initial greeting when the component mounts

    // Update the greeting every minute to handle time changes
    const intervalId = setInterval(updateGreeting, 60000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  // const { changes, changes_approved,my_changes, change_loading, error } = useSelector(
  //   (state) => state.change
  // );
  const formatter = (num) => <CountUp end={num.toString().replace(/,/g, '')} />;

  const handleClick = (param) => {
    navigate(param);
  };

  useEffect(() => {
    // dispatch(fetchMyChangesAsync(data.empData.email));
    // dispatch(fetchChangesAsync(data.empData.email));
    // dispatch(fetchChangesApprovedAsync(data.empData.email));
    dispatch(fetchUserapprovalmastersByCurrentHandler(userInfo.empId));
  }, []);

  return <>
  Dashboard
  <h1>
    <Avatar size="small" icon={<UserOutlined />} />{' '}
    <Tag color="green" size="large">
      {greeting}, Ayush Pradhan 
      {/* {data.empData.name} */}
    </Tag>
  </h1>
  <Row gutter={12}>
    <Col span={6}>
    <Card
        style={{ backgroundColor: '#99cc66' }}
        className="hoverable-card"
        onClick={() => handleClick('/create-approval')}
      >
        <Statistic
          title="Create Request"
          prefix={<PlusOutlined  style={{ marginRight: 8 }} />}
          style={{ fontWeight: 'bold' }}
         
        />
      </Card>
     
    </Col>
    <Col span={6}>
      <Card
        style={{ backgroundColor: '#F0FBEF' }}
        className="hoverable-card"
        onClick={() => handleClick('change-index-approved')}
      >
        <Statistic
          title="Approved & Implemented"
          prefix={<CheckCircleOutlined style={{ marginRight: 8 }} />}
          style={{ fontWeight: 'bold' }}
          // value={changes_approved.length}
          formatter={formatter}
        />
      </Card>
    </Col>
  </Row>
  <Divider type="horizontal" />
  <Row gutter={12}>
    <Col span={6}>
      <Card
        style={{ backgroundColor: '#B2D7ED' }}
        className="hoverable-card"
        onClick={() => handleClick('/myrequest')}
      >
        <Statistic
          title="My Request Chain"
          prefix={<FolderOpenOutlined  style={{ marginRight: 8 }} />}
          style={{ fontWeight: 'bold' }}
          // value={my_changes.length}
          formatter={formatter}
        />
      </Card>
    </Col>
    <Col span={6}>
    <Card
        style={{ backgroundColor: '#F2DEDE' }}
        className="hoverable-card"
        onClick={() => handleClick('approval-index')}
      >
        
        <Statistic
          title="Pending"
          prefix={<ClockCircleOutlined style={{ marginRight: 8 }} />}
          style={{ fontWeight: 'bold' }}
          value={userapprovalmasters_current_handler.length}
          formatter={formatter}
        />
      </Card>
    </Col>

    
  </Row>
</>
};

export default Dashboard;
