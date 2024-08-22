import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Card,
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  message,
  Divider,
  Row,
  Col,
  Table,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { fetchApplicationsAsync } from '../../store/slices/applicationSlice';
import {
  fetchRolesDropDownAsync,
  resetStateRole,
} from '../../store/slices/roleSlice';
import {
  fetchServicesDropDownAsync,
  resetStateService,
} from '../../store/slices/serviceSlice';
import {
  fetchRequestDropDownAsync,
  fetchRequestsAsync,
  resetStateRequest,
} from '../../store/slices/requestSlice';
import { MinusCircleOutlined } from '@ant-design/icons';
import { fetchEmployeesAsync } from '../../store/slices/employeeSlice';

const { Option } = Select;

const UserApprovalForm = () => {
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [count, setCount] = useState(0);
  const [accessType, setAccessType] = useState(null);

  const { branchs, branch_loading, branch_error } = useSelector(
    (state) => state.branch
  );

  const { applications, loading, error } = useSelector(
    (state) => state.application
  );

  const { requests } = useSelector((state) => state.request);

  const [selectedApplication, setSelectedApplication] = useState(null);

  const [selectedRole, setSelectedRole] = useState(null);

  const [roleDisable, setRoleDisable] = useState(false);

  const [serviceDisable, setServiceDisable] = useState(false);

  const [requestDisable, setRequestDisable] = useState(false);

  const { service_dropdown, service_dropdown_loading } = useSelector(
    (state) => state.service
  );

  const { roles_dropdown, roles_dropdown_loading } = useSelector(
    (state) => state.role
  );

  const { requests_dropdown } = useSelector((state) => state.request);

  const { employees, employee_loading, employee_error } = useSelector(
    (state) => state.employee
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchApplicationsAsync());
    dispatch(fetchRequestsAsync());
    dispatch(fetchEmployeesAsync());
  }, []);

  useEffect(() => {
    if (selectedRole) {
      const role = {
        id: selectedRole,
      };
      dispatch(fetchServicesDropDownAsync(role)); // Fetch roles based on selected application
    }
  }, [selectedRole, dispatch, form]);

  useEffect(() => {
    if (selectedApplication) {
      const application = {
        id: selectedApplication,
      };
      dispatch(fetchRequestDropDownAsync(application));
      dispatch(fetchRolesDropDownAsync(application)); // Fetch roles based on selected application
    }
  }, [selectedApplication, dispatch]);

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
    const newData = dataSource.map((item) => {
      if (item.key === key) {
        if (field === 'application') {
          // resetStateRole()
          // resetStateRequest()
          resetStateService();
          setRoleDisable(false);
          setServiceDisable(false);
          setRequestDisable(false);
          return { ...item, [field]: value, roleType: '', serviceType: '' };
        }
        if (field === 'roleType') {
          setRequestDisable(true);
          return { ...item, [field]: value, serviceType: '', requestType: '' }; // Clear serviceType when roleType is changed
        }
        if (field === 'serviceType') {
          setRequestDisable(true);
          return { ...item, [field]: value, requestType: '' };
        }
        if (field === 'requestType') {
          setRoleDisable(true);
          setServiceDisable(true);
          return { ...item, [field]: value, roleType: '', serviceType: '' };
        }
        return { ...item, [field]: value };
      }
      return item;
    });
    setDataSource(newData);
    console.log(newData);
  };

  const columns = [
    {
      title: <span style={{ color: '#8F0000' }}>Application</span>,
      dataIndex: 'application',
      key: 'application',
      render: (_, { key }) => (
        <Select
          placeholder="Select Application"
          onChange={(value) => {
            handleFieldChange(value, key, 'application');
            setSelectedApplication(value); // Update selected application
          }}
          style={{ width: '100%' }}
        >
          {applications.map((app) => (
            <Select.Option key={app.id} value={app.id}>
              {app.applicationName}
            </Select.Option>
          ))}
          {/* Add more options as needed */}
        </Select>
      ),
    },
    {
      title: <span style={{ color: '#8F0000' }}>Role Type</span>,
      dataIndex: 'roleType',
      key: 'roleType',
      render: (_, { key, roleType }) => (
        <Select
          value={roleType}
          disabled={roleDisable}
          placeholder="Select Role Type"
          onChange={
            (value) => {
              handleFieldChange(value, key, 'roleType');
              setSelectedRole(value);
            } // Update selected application
          }
          style={{ width: '100%' }}
        >
          {/* <Option value="092">Work Class</Option>
          <Option value="093">Finacle Role</Option> */}
          {/* Add more options as needed */}
          {roles_dropdown.map((role) => (
            <Option key={role.id} value={role.id}>
              {role.role}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: <span style={{ color: '#8F0000' }}>Service Type</span>,
      dataIndex: 'serviceType',
      key: 'serviceType',
      render: (_, { key, serviceType }) => (
        <Select
          placeholder="Select Service Type"
          disabled={serviceDisable}
          onChange={(value) => {
            handleFieldChange(value, key, 'serviceType');
          }}
          value={serviceType}
          style={{ width: '100%' }}
        >
          {service_dropdown.map((service) => (
            <Option key={service.service_code} value={service.service_code}>
              {service.service}
            </Option>
          ))}
          {/* Add more options as needed */}
        </Select>
      ),
    },
    {
      title: <span style={{ color: '#8F0000' }}>Request Type</span>,
      dataIndex: 'requestType',
      key: 'requestType',
      render: (_, { key, requestType }) => (
        <Select
          value={requestType}
          disabled={requestDisable}
          placeholder="Select Request Type"
          onChange={(value) => handleFieldChange(value, key, 'requestType')}
          style={{ width: '100%' }}
        >
          {requests_dropdown.map((request) => (
            <Option key={request.id} value={request.id}>
              {request.requestType}
            </Option>
          ))}
          {/* Add more options as needed */}
        </Select>
      ),
    },
    {
      title: <span style={{ color: '#8F0000' }}>Action</span>,
      key: 'action',
      render: (_, { key }) => (
        <Button onClick={() => handleDelete(key)} type="link" danger>
          <MinusCircleOutlined /> (Delete)
        </Button>
      ),
    },
  ];

  // Function to format the option label
  const getOptionLabel = (employee, branchs) => {
    const branch = branchs.find((b) => b.solId === employee.branch);
    return `${employee.name} - ${
      branch ? branch.solDescription : 'Unknown Branch'
    } - ${employee.email}`;
  };
  useEffect(() => {
    if (accessType !== 'Temporary') {
      form.resetFields(['fromDate', 'toDate']);
    }
  }, [accessType, form]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        padding: '30px',
        backgroundColor: '#FFFFE0',
      }}
    >
      <Card
        title={
          <div
            style={{ textAlign: 'center', fontSize: '20px', color: '#8F0000' }}
          >
            User Approval System
          </div>
        }
      />
      <br />
      <Card title={<span style={{ color: '#8F0000' }}>Employee Details</span>}>
        {/* Employee Details Section */}
        <Form form={form} layout="vertical" onFinish={onFinish}>
          {/* <Divider orientation="left">Employee Details</Divider> */}
          <Row>
            <Col span={6}>
              <Form.Item
                name="employeeId"
                label="Employee ID"
                rules={[
                  { required: true, message: 'Please enter Employee ID' },
                ]}
              >
                <Input placeholder="Enter Employee ID" />
              </Form.Item>
            </Col>
            <Col span={2} />
            <Col span={6}>
              <Form.Item
                name="employeeSolId"
                label="Employee SOL ID"
                rules={[
                  { required: true, message: 'Please enter Employee SOL ID' },
                ]}
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
                rules={[
                  { required: true, message: 'Please enter Employee Name' },
                ]}
              >
                <Select
                  placeholder="Select an employee"
                  style={{ width: '100%' }}
                  allowClear
                  showSearch
                  filterOption={(input, option) => {
                    const fullLabel = option.props['data-label'].toLowerCase();
                    return fullLabel.includes(input.toLowerCase());
                  }}
                  optionLabelProp="label" // Use the email as the label when an option is selected
                >
                  {employees.map((emp) => {
                    const optionLabel = `${emp.name} - ${
                      branchs.find((b) => b.solId === emp.branch)
                        ?.solDescription || 'Unknown Branch'
                    } - ${emp.email}`;
                    return (
                      <Option
                        key={emp.id}
                        value={emp.email} // Store the email as the selected value
                        label={emp.email} // Display email when selected
                        data-label={optionLabel} // For filtering purposes
                      >
                        <div>
                          <strong>{emp.name}</strong>
                          <br />
                          <span style={{ color: '#888' }}>
                            {branchs.find((b) => b.solId === emp.branch)
                              ?.solDescription || 'Unknown Branch'}
                          </span>
                          <br />
                          <span style={{ color: '#555' }}>{emp.email}</span>
                        </div>
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={2} />
            <Col span={6}>
              <Form.Item
                name="employeeEmail"
                label="Employee Email"
                rules={[
                  { required: true, message: 'Please enter Employee Email' },
                  { type: 'email', message: 'Please enter a valid email' },
                ]}
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
                rules={[
                  { required: true, message: 'Please enter Employee Branch' },
                ]}
              >
                <Input placeholder="Enter Employee Branch" />
              </Form.Item>
            </Col>
            <Col span={2} />
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
      <br />
      <Card
        title={
          <span style={{ color: '#8F0000' }}>Request Application Role</span>
        }
      >
        <Row>
          <Col span={6}>
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
          </Col>
        </Row>
        <br />
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
        {accessType && (
          <>
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
          </>
        )}
      </Card>
      <br />
      <Card
        title={<span style={{ color: '#8F0000' }}>Recomender Details</span>}
      >
        <Row>
          <Col span={6}>
            <Form.Item
              name="Name"
              label="Name"
              rules={[
                { required: true, message: 'Please select a recommender' },
              ]}
            >
              <Select
                placeholder="Select an employee"
                style={{ width: '100%' }}
                allowClear
                showSearch
                filterOption={(input, option) => {
                  const fullLabel = option.props['data-label'].toLowerCase();
                  return fullLabel.includes(input.toLowerCase());
                }}
                optionLabelProp="label" // Use the email as the label when an option is selected
              >
                {employees.map((emp) => {
                  const optionLabel = `${emp.name} - ${
                    branchs.find((b) => b.solId === emp.branch)
                      ?.solDescription || 'Unknown Branch'
                  } - ${emp.email}`;
                  return (
                    <Option
                      key={emp.id}
                      value={emp.email} // Store the email as the selected value
                      label={emp.email} // Display email when selected
                      data-label={optionLabel} // For filtering purposes
                    >
                      <div>
                        <strong>{emp.name}</strong>
                        <br />
                        <span style={{ color: '#888' }}>
                          {branchs.find((b) => b.solId === emp.branch)
                            ?.solDescription || 'Unknown Branch'}
                        </span>
                        <br />
                        <span style={{ color: '#555' }}>{emp.email}</span>
                      </div>
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={3} />
          <Col span={6}>
            <Form.Item
              name="EmployeeId"
              label="EmployeeId"
              rules={[
                { required: true, message: 'Please enter EmployeeId Detail' },
              ]}
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
          <Col span={3} />
          <Col span={6}>
            <Form.Item
              name="Department"
              label="Department"
              rules={[
                { required: true, message: 'Please enter Department Detail' },
              ]}
            >
              <Input placeholder="Enter Department ID" />
            </Form.Item>
          </Col>
        </Row>
      </Card>
      <br />
      <Card title={<span style={{ color: '#8F0000' }}>Remarks</span>}>
        <TextArea></TextArea>
      </Card>
      <br />
      <div>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </div>
    </div>
  );
};

export default UserApprovalForm;
