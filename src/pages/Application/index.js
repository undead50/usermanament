import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Space } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {
  createApplicationAsync,
    deleteApplicationAsync,
      fetchApplicationsAsync,
        updateApplicationAsync,
} from '../../store/slices/applicationSlice';
// import { useNotification } from '../../hooks/index';

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
    dispatch(deleteApplicationAsync(record.id));
    // callNotification('Application deleted Successfully', 'success');
  };

  useEffect(() => {
    dispatch(fetchApplicationsAsync());
    console.log(applications);
  }, []);

  const dataSource = applications;

  const onFinish = (values) => {
    console.log(values);
    values.CreatedBy = userInfo.userName;
    if (editMode) {
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
  title: 'applicationName',
    dataIndex: 'applicationName',
      key: 'applicationName',
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