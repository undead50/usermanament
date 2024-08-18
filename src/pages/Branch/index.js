import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Space } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {
  createBranchAsync,
    deleteBranchAsync,
      fetchBranchsAsync,
        updateBranchAsync,
} from '../../store/slices/branchSlice';
// import { useNotification } from '../../hooks/index';

const BranchTable = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [editMode, setEditMode] = useState(false);

  // const { callNotification } = useNotification();

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);

  const { branchs, branch_loading, error } = useSelector(
    (state) => state.branch
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
    dispatch(deleteBranchAsync(record.id));
    // callNotification('Branch deleted Successfully', 'success');
  };

  useEffect(() => {
    dispatch(fetchBranchsAsync());
    console.log(branchs);
  }, []);

  const dataSource = branchs;

  const onFinish = (values) => {
    console.log(values);
    values.CreatedBy = userInfo.userName;
    if (editMode) {
      dispatch(updateBranchAsync(values));
      // callNotification('Branch Edited Successfully', 'success');
    } else {
      dispatch(createBranchAsync(values));
      // callNotification('Branch Created Successfully', 'success');
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
  title: 'solId',
    dataIndex: 'solId',
      key: 'solId',
      },



{
  title: 'solDescription',
    dataIndex: 'solDescription',
      key: 'solDescription',
      },



{
  title: 'isActive',
    dataIndex: 'isActive',
      key: 'isActive',
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
    <Table loading={branch_loading} dataSource={dataSource} columns={columns} />

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
        
        <Form.Item name="solId" label="solId">
          <Input />
        </Form.Item>
        
        <Form.Item name="solDescription" label="solDescription">
          <Input />
        </Form.Item>
        
        <Form.Item name="isActive" label="isActive">
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

export default BranchTable;