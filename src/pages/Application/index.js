import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Space,Select,Tag } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {
  createApplicationAsync,
    deleteApplicationAsync,
      fetchApplicationsAsync,
        updateApplicationAsync,
} from '../../store/slices/applicationSlice';
import { fetchEmployeesAsync } from '../../store/slices/employeeSlice';
// import { useNotification } from '../../hooks/index';

const { Option } = Select;

const ApplicationTable = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [editMode, setEditMode] = useState(false);

  // const { callNotification } = useNotification();

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  
  const { applications, loading, error } = useSelector(
    (state) => state.application
  );

  const {employees,employee_loading} = useSelector((state)=>state.employee)

  const {branchs,branch_loading} = useSelector((state)=>state.branch)

  // Function to handle opening the modal for adding/editing a record
  const handleEdit = (record) => {
    // Extract emails from applicationOwnerList to set as employeeName
    const employeeNames = record.applicationOwnerList?.map((owner) => owner.email) || [];
    
    // Set fields, including employeeName
    form.setFieldsValue({
      ...record,
      employeeName: employeeNames,
    });
    
    setEditMode(true);
    setIsModalVisible(true);
  };

  const handleAdd = () => {
    setEditMode(false);
    form.setFieldsValue({});
    setIsModalVisible(true);
  };

  // Function to handle deleting a record
  const handleDelete = (record) => {
    dispatch(deleteApplicationAsync(record.id));
    // callNotification('Application deleted Successfully', 'success');
  };

  useEffect(() => {
    dispatch(fetchApplicationsAsync());
    dispatch(fetchEmployeesAsync())
    console.log(applications);
  }, []);

  const dataSource = applications;

  const onFinish = (values) => {
    console.log(values);
    values.CreatedBy = userInfo.userName;
    if (editMode) {
      console.log(values.employeeName)
      const applicationOwnerList = values.employeeName.map((emp)=>{
        return {
          "email":emp,
        }
      })
      values.applicationOwnerList = applicationOwnerList
      dispatch(updateApplicationAsync(values));
      // callNotification('Application Edited Successfully', 'success');
    } else {
      dispatch(createApplicationAsync(values));
      // callNotification('Application Created Successfully', 'success');
    }
    form.resetFields();
    setIsModalVisible(false);
  };

  const columns = [

    

{
  title: 'id',
    dataIndex: 'id',
      key: 'id',
      },



{
  title: 'Application Name',
    dataIndex: 'applicationName',
      key: 'applicationName',
      },
      {
        title: 'Application Owners',
        key: 'applicationOwnerList',
        render: (text, record) => (
          <div>
            {record.applicationOwnerList?.map((request) => (
              <Tag key={request.id} bordered={false} color="geekblue">
                {
                    request.email
                }
                
              </Tag>
            )) || 'No Applications'}
          </div>
        ),
      },



{
  title: 'Action',
    key: 'action',
      render: (_, record) => (
        <Space>
          <Button onClick={() => handleEdit(record)}>Update</Button>
          <Button onClick={() => handleDelete(record)}>Delete</Button>
        </Space>
      ),
    },
  ];

return (
  <div>
    <Button
      type="primary"
      onClick={() => handleAdd()}
      style={{ marginBottom: '16px' }}
    >
      Add
    </Button>
    <Table dataSource={dataSource} columns={columns} />

    {/* Modal for adding/editing a record */}
    <Modal
      title={editMode ? 'Edit Record' : 'Add Record'}
      open={isModalVisible}
      onCancel={() => {
        setIsModalVisible(false);
        form.resetFields();
      }}
      footer={null}
    >
      <Form form={form} onFinish={onFinish}>
        {/* Add form fields here based on your column fields */}
        
        {editMode && (
            <Form.Item name="id" hidden={true}>
              <Input />
            </Form.Item>
          )}
        <Form.Item name="applicationName" label="applicationName">
          <Input />
        </Form.Item>
        {editMode && (
        <Form.Item
                name="employeeName"
                label="Employee Name"
                rules={[
                  { required: false, message: 'Please enter Employee Name' },
                ]}
              >
                <Select
                  placeholder="Select an employee"
                  mode="multiple"
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
              )}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {editMode ? 'Update' : 'Add'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  </div>
);
};

export default ApplicationTable;