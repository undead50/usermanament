import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Space,
  Tag,
} from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {
  createUserapprovalmasterAsync,
  deleteUserapprovalmasterAsync,
  fetchUserapprovalmastersAsync,
  fetchUserapprovalmastersByCurrentHandler,
  fetchUserapprovalmastersById,
  updateUserapprovalmasterAsync,
} from '../../store/slices/userapprovalmasterSlice';
import UserRequestView from './model/UserRequestView';
import { fetchApplicationsAsync } from '../../store/slices/applicationSlice';
import { EyeOutlined, DeleteOutlined, EditOutlined,PlusCircleTwoTone } from '@ant-design/icons';
import { fetchEmployeesAsync } from '../../store/slices/employeeSlice';
import { useNavigate } from 'react-router-dom';



// import { useNotification } from '../../hooks/index';

const UserapprovalmasterTable = () => {


  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  // const { callNotification } = useNotification();

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);

  const {
    userapprovalmasters,
    userapprovalmaster_approved,
    loading,
    error,
    userapprovalmasters_current_handler,
  } = useSelector((state) => state.userapprovalmaster);

  const { applications, application_loading, application_error } = useSelector(
    (state) => state.application
  );

  // Function to handle opening the modal for adding/editing a record
  const handleEdit = (record) => {
    form.setFieldsValue(record);
    setEditMode(true);
    setIsModalVisible(true);
  };

  const handleView = (record) => {
    dispatch(fetchUserapprovalmastersById(record.id));
    setVisible(true);
  };

  const onCancel = () => {
    setVisible(false);
  };

  const handleAdd = () => {
    setEditMode(false);
    form.setFieldsValue({});
    setIsModalVisible(true);
  };

  // Function to handle deleting a record
  const handleDelete = (record) => {
    dispatch(deleteUserapprovalmasterAsync(record.id));
    // callNotification('Userapprovalmaster deleted Successfully', 'success');
  };

  useEffect(() => {
    // dispatch(fetchUserapprovalmastersAsync());
    dispatch(fetchUserapprovalmastersByCurrentHandler(userInfo.empId));
    dispatch(fetchApplicationsAsync());
    dispatch(fetchEmployeesAsync());
    console.log(userapprovalmasters);
  }, []);

  // Run this effect only once after `userapprovalmasters_current_handler` is set
  // useEffect(() => {
  //   dispatch(fetchUserapprovalmastersByCurrentHandler(userInfo.empId));
  // }, [visible]);

  const dataSource = userapprovalmasters_current_handler;

  const onFinish = (values) => {
    console.log(values);
    values.createdBy = userInfo.userName;
    if (editMode) {
      dispatch(updateUserapprovalmasterAsync(values));
      // callNotification('Userapprovalmaster Edited Successfully', 'success');
    } else {
      dispatch(createUserapprovalmasterAsync(values));
      // callNotification('Userapprovalmaster Created Successfully', 'success');
    }
    form.resetFields();
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: 'Work Flow Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Application Name',
      key: 'applicationId',
      render: (text, record) => (
        <div>
          {record.applicationRoleRequests?.map((request) => (
            <Tag key={request.id} bordered={false} color="geekblue">
              {applications.map((app) => {
                if (app.id === request.applicationId) {
                  return app.applicationName;
                }
              })}
            </Tag>
          )) || 'No Applications'}
        </div>
      ),
    },
    {
      title: 'Created at',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Access Type',
      dataIndex: 'accessType',
      key: 'accessType',
      render: (text) => (
        <Tag color={text === 'T' ? 'blue' : 'green'} bordered={false}>
          {text === 'T' ? 'Temporary' : 'Permanent'}
        </Tag>
      ),
    },

    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'geekblue';
        if (status === 'APPROVED') {
          color = 'green';
        } else if (status === 'REJECTED') {
          color = 'volcano';
        } else if (status === 'RECOMMENDED') {
          color = 'gold';
        }
        return (
          <Tag bordered={false} color={color}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },

    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          {/* <Button onClick={() => handleEdit(record)}>
            <EditOutlined />
          </Button>
          <Button onClick={() => handleDelete(record)}>
            <DeleteOutlined />
          </Button> */}
          <Button onClick={() => handleView(record)}>
            {' '}
            <EyeOutlined />
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          navigate('/create-approval')
        }}
        style={{ marginBottom: '16px' }}
      >
        Create Approval
        <PlusCircleTwoTone />
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

          <Form.Item name="id" label="id">
            <Input />
          </Form.Item>

          <Form.Item name="accessType" label="accessType">
            <Input />
          </Form.Item>

          <Form.Item name="status" label="status">
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editMode ? 'Update' : 'Add'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <UserRequestView visible={visible} onCancel={onCancel} />
    </div>
  );
};

export default UserapprovalmasterTable;
