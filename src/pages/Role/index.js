import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Space,Select } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {
  createRoleAsync,
    deleteRoleAsync,
      fetchRolesAsync,
        updateRoleAsync,
} from '../../store/slices/roleSlice';
// import { useNotification } from '../../hooks/index';

const RoleTable = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [editMode, setEditMode] = useState(false);

  // const { callNotification } = useNotification();

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);

  const { roles, loading, error } = useSelector(
    (state) => state.role
  );

  const { applications} = useSelector(
    (state) => state.application
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

  // Create a lookup for application ID to name
  const applicationLookup = applications.reduce((acc, app) => {
    acc[app.id] = app.applicationName;
    return acc;
  }, {});


  // Function to handle deleting a record
  const handleDelete = (record) => {
    dispatch(deleteRoleAsync(record.id));
    // callNotification('Role deleted Successfully', 'success');
  };

  useEffect(() => {
    dispatch(fetchRolesAsync());
    console.log(roles);
  }, []);

  const dataSource = roles;

  const onFinish = (values) => {
    console.log(values);
    values.createdBy = userInfo.userName;
    if (editMode) {
      dispatch(updateRoleAsync(values));
      // callNotification('Role Edited Successfully', 'success');
    } else {
      dispatch(createRoleAsync(values));
      // callNotification('Role Created Successfully', 'success');
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
        title: 'applicaitonId',
          dataIndex: 'applicaitonId',
            key: 'applicaitonId',
            render: (text) => applicationLookup[text] || text,
            },



{
  title: 'role',
    dataIndex: 'role',
      key: 'role',
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
        
        <Form.Item name="applicaitonId" label="Application ID" rules={[{ required: true, message: 'Please select an application.' }]}>
            <Select placeholder="Select an application">
              {applications.map(app => (
                <Select.Option key={app.id} value={app.id}>
                  {app.applicationName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>


        
        <Form.Item name="role" label="role">
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

export default RoleTable;