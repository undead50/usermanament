import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Space,Select } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {
  createServiceAsync,
    deleteServiceAsync,
      fetchServicesAsync,
        updateServiceAsync,
} from '../../store/slices/serviceSlice';
import { fetchRolesAsync } from '../../store/slices/roleSlice';
// import { useNotification } from '../../hooks/index';

const ServiceTable = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [editMode, setEditMode] = useState(false);

  const { roles} = useSelector(
    (state) => state.role
  );


  const { applications} = useSelector(
    (state) => state.application
  );


  // Create a lookup for application ID to name
  const applicationLookup = applications.reduce((acc, app) => {
    acc[app.id] = app.applicationName;
    return acc;
  }, {});

   // Create a lookup for role ID to name
   const roleLookup = roles.reduce((acc, app) => {
    acc[app.id] = app.role;
    return acc;
  }, {});


  // const { callNotification } = useNotification();

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);

  const { services, loading, error } = useSelector(
    (state) => state.service
  );

  // Function to handle opening the modal for adding/editing a record
  const handleEdit = (record) => {
    form.setFieldsValue(record);
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
    dispatch(deleteServiceAsync(record.id));
    // callNotification('Service deleted Successfully', 'success');
  };

  useEffect(() => {
    dispatch(fetchServicesAsync());
    dispatch(fetchRolesAsync());
    console.log(services);
  }, []);

  const dataSource = services;

  const onFinish = (values) => {
    console.log(values);
    values.createdBy = userInfo.userName;
    if (editMode) {
      dispatch(updateServiceAsync(values));
      // callNotification('Service Edited Successfully', 'success');
    } else {
      dispatch(createServiceAsync(values));
      // callNotification('Service Created Successfully', 'success');
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
            title: 'applicationId',
              dataIndex: 'applicationId',
                key: 'applicationId',
                render: (text) => applicationLookup[text] || text,
                },


    {
      title: 'roleId',
        dataIndex: 'roleId',
          key: 'roleId',
          render: (text) => roleLookup[text] || text,
          },



{
  title: 'service',
    dataIndex: 'service',
      key: 'service',
      },

      {
        title: 'service_code',
          dataIndex: 'service_code',
            key: 'service_code',
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

<Form.Item name="applicationId" label="Application ID" rules={[{ required: true, message: 'Please select an application.' }]}>
            <Select placeholder="Select an application">
              {applications.map(app => (
                <Select.Option key={app.id} value={app.id}>
                  {app.applicationName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        
        <Form.Item name="roleId" label="Role ID" rules={[{ required: true, message: 'Please select an role.' }]}>
            <Select placeholder="Select an Role">
              {roles.map(role => (
                <Select.Option key={role.id} value={role.id}>
                  {role.role}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        
        <Form.Item name="service" label="service">
          <Input />
        </Form.Item>

        <Form.Item name="service_code" label="service_code">
          <Input />
        </Form.Item>
        
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

export default ServiceTable;