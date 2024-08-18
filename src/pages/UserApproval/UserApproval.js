import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, DatePicker, Select, message, Divider,Row,Col,Table } from 'antd';
import TextArea from 'antd/es/input/TextArea';

const { Option } = Select;

const UserApprovalForm = () => {
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [count, setCount] = useState(0);
  const [accessType, setAccessType] = useState(null);

  const onFinish = (values) => {
    console.log('Form values:', values);
    message.success('User approval submitted successfully!');
  };

  const handleAdd = () => {
    const newData = {
      key: count,
      application: '',
      roleType: '',
      serviceType: '',
      requestType: '',
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  const handleDelete = (key) => {
    setDataSource(dataSource.filter((item) => item.key !== key));
  };

  const handleFieldChange = (value, key, field) => {
    const newData = dataSource.map((item) => 
      item.key === key ? { ...item, [field]: value } : item
    );
    setDataSource(newData);
  };

  const columns = [
    {
      title: <span style={{ color: '#8F0000' }}>Application</span>,
      dataIndex: 'application',
      key: 'application',
      render: (_, { key }) => (
        <Select
          placeholder="Select Application"
          onChange={(value) => handleFieldChange(value, key, 'application')}
          style={{ width: '100%' }}
        >
          <Option value="app1">Finacle</Option>
          <Option value="app2">Card System CMS</Option>
          <Option value="app3">Change Management System</Option>
          {/* Add more options as needed */}
        </Select>
      ),
    },
    {
      title: <span style={{ color: '#8F0000' }}>Role Type</span>,
      dataIndex: 'roleType',
      key: 'roleType',
      render: (_, { key }) => (
        <Select
          placeholder="Select Role Type"
          onChange={(value) => handleFieldChange(value, key, 'roleType')}
          style={{ width: '100%' }}
        >
          
          <Option value="092">Work Class</Option>
          <Option value="093">Finacle Role</Option>
          {/* Add more options as needed */}
        </Select>
      ),
    },
    {
      title: <span style={{ color: '#8F0000' }}>Service Type</span>,
      dataIndex: 'serviceType',
      key: 'serviceType',
      render: (_, { key }) => (
        <Select
          placeholder="Select Service Type"
          onChange={(value) => handleFieldChange(value, key, 'serviceType')}
          style={{ width: '100%' }}
        >
          <Option value="005">CONTRACT STAFF</Option>
          <Option value="006">TELLER</Option>
          <Option value="098">BRANCH MANAGER</Option>
          <Option value="ASSTM">ASSISTANT MANAGER</Option>
          {/* Add more options as needed */}
        </Select>
      ),
    },
    {
      title: <span style={{ color: '#8F0000' }}>Request Type</span>,
      dataIndex: 'requestType',
      key: 'requestType',
      render: (_, { key }) => (
        <Select
          placeholder="Select Request Type"
          onChange={(value) => handleFieldChange(value, key, 'requestType')}
          style={{ width: '100%' }}
        >
          <Option value="type1">User Deactivate</Option>
          <Option value="type2">Password Reset</Option>
          {/* Add more options as needed */}
        </Select>
      ),
    },
    {
      title: <span style={{ color: '#8F0000' }}>Action</span>,
      key: 'action',
      render: (_, { key }) => (
        <Button onClick={() => handleDelete(key)} type="link" danger>
          Delete
        </Button>
      ),
    },
  ];

  useEffect(() => {
    if (accessType !== 'Temporary') {
      form.resetFields(['fromDate', 'toDate']);
    }
  }, [accessType, form]);

  return (
    <>
    <Card
        title={<div style={{ textAlign: 'center', fontSize: '20px',color:'#8F0000' }}>User Approval System</div>}
      />
    <br/>  
    <Card title={<span style={{ color: '#8F0000' }}>Employee Details</span>} >
      {/* Employee Details Section */}
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        {/* <Divider orientation="left">Employee Details</Divider> */}
        <Row>  
          <Col span={6}>      
          <Form.Item
          name="employeeId"
          label="Employee ID"
          rules={[{ required: true, message: 'Please enter Employee ID' }]}
        >
          <Input placeholder="Enter Employee ID" />
        </Form.Item>
        </Col>
        <Col span={2}/>
        <Col span={6}>
        <Form.Item
          name="employeeSolId"
          label="Employee SOL ID"
          rules={[{ required: true, message: 'Please enter Employee SOL ID' }]}
        >
          <Input placeholder="Enter Employee SOL ID" />
        </Form.Item>
        </Col>
        </Row>
        <Row>
          <Col span={6}>
        <Form.Item
          name="employeeName"
          label="Employee Name"
          rules={[{ required: true, message: 'Please enter Employee Name' }]}
        >
          <Input placeholder="Enter Employee Name" />
        </Form.Item>
        </Col>
        <Col span={2}/>
        <Col span={6}>
        <Form.Item
          name="employeeEmail"
          label="Employee Email"
          rules={[{ required: true, message: 'Please enter Employee Email' }, { type: 'email', message: 'Please enter a valid email' }]}
        >
          <Input placeholder="Enter Employee Email" />
        </Form.Item>
        </Col>
        </Row>
        <Row>
          <Col span={6}>
        <Form.Item
          name="employeeBranch"
          label="Employee Branch"
          rules={[{ required: true, message: 'Please enter Employee Branch' }]}
        >
          <Input placeholder="Enter Employee Branch" />
        </Form.Item>
        </Col>
        <Col span={2}/>
        <Col span={6}>
        <Form.Item
          name="finacleId"
          label="Finacle ID"
          rules={[{ required: true, message: 'Please enter Finacle ID' }]}
        >
          <Input placeholder="Enter Finacle ID" />
        </Form.Item>
        </Col>
        </Row>
        {/* <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item> */}
      </Form>
    </Card>
    <br/>
    <Card title={<span style={{ color: '#8F0000' }}>Request Application Role</span>}>
    <Row> 
    <Form.Item
          name="accessType"
          label="Access Type"
          rules={[{ required: true, message: 'Please enter Access Type' }]}
        >   
    <Select
          placeholder="Access Type"
          style={{ width: '100%' }}
          onChange={setAccessType}
        >
          <Option value="Temporary">Temporary</Option>
          <Option value="Permanent">Permanent</Option>
          {/* Add more options as needed */}
        </Select>
        </Form.Item>
        </Row>
        <br/> 
        {accessType === 'Temporary' && (
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                name="fromDate"
                label="From Date"
                rules={[{ required: true, message: 'Please select From Date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="toDate"
                label="To Date"
                rules={[{ required: true, message: 'Please select To Date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        )}   
        <Button
          type="primary"
          onClick={handleAdd}
          style={{ marginBottom: 16 }}
        >
          Add Role
        </Button>
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          bordered
        />


      </Card>
      <br/>
      <Card title={<span style={{ color: '#8F0000' }}>Recomender Details</span>}>
      <Row>
        <Col span={6}>
      <Form.Item
          name="Name"
          label="Name"
          rules={[{ required: true, message: 'Please enter Recomender Detail' }]}
        >
           
        <Select
          placeholder="Name"
          style={{ width: '100%' }}
        >
          <Option value="type1">rajendra.dangol@ebl.com.np</Option>
          <Option value="type2">kiran.mahat@ebl.com.np</Option>
        </Select>
        
        </Form.Item>
        </Col>
        <Col span={3}/>
        <Col span={6}>
        <Form.Item
          name="EmployeeId"
          label="EmployeeId"
          rules={[{ required: true, message: 'Please enter EmployeeId Detail' }]}
        >
           
           <Input placeholder="Enter Employee ID" />
        
        </Form.Item>
        
        </Col>
        </Row>   
        <Row>
        <Col span={6}>
      <Form.Item
          name="Title"
          label="Title"
          rules={[{ required: true, message: 'Please enter Title' }]}
        >
           
           <Input placeholder="Title" />
        
        </Form.Item>
        </Col>
        <Col span={3}/>
        <Col span={6}>
        <Form.Item
          name="Department"
          label="Department"
          rules={[{ required: true, message: 'Please enter Department Detail' }]}
        >
           
           <Input placeholder="Enter Department ID" />
        
        </Form.Item>
        
        </Col>
        </Row>
      </Card>
      <br/>
      <Card title={<span style={{ color: '#8F0000' }}>Remarks</span>}>
       <TextArea></TextArea>
      </Card>
      <br/>
      <div>
      <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>  
      </div>
      </>
  );
};

export default UserApprovalForm;
