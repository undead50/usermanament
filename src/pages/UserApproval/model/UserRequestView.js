import React, { useEffect, useState } from 'react';
import {
  Modal,
  Card,
  Descriptions,
  List,
  Tag,
  Space,
  Typography,
  Button,
  Radio,
  Form,
  Input,
  Select
} from 'antd';
import { useSelector } from 'react-redux';
import { CaretRightOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import './index.css';
import { fetchBranchsAsync } from '../../../store/slices/branchSlice';
import { updateUserapprovalmasterAsync } from '../../../store/slices/userapprovalmasterSlice';
import { fetchEmployeesAsync } from '../../../store/slices/employeeSlice';

const { Text, Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;


const UserRequestView = (props) => {
  const { approvalDetail, error, approvalDetail_loading } = useSelector(
    (state) => state.userapprovalmaster
  );

  const dispatch = useDispatch();

  const { employees, employee_loading, employee_error } = useSelector(
    (state) => state.employee
  );

  const { branchs, branch_loading, branch_error } = useSelector(
    (state) => state.branch
  );


  // State for managing radio selection and form visibility
  const [action, setAction] = useState(null);
  const [formVisible, setFormVisible] = useState(false);

  const handleCancel = () => {
    setFormVisible(false)
    props.onCancel();
  };


  // Handle radio change
  const handleRadioChange = (e) => {
    setAction(e.target.value);
    setFormVisible(true);
  };

  useEffect(()=>{
    fetchBranchsAsync();
    fetchEmployeesAsync();
  },[])

  // Handle form submission
  const handleFormSubmit = (values) => {
    console.log('Form values:', values);
   // Create a new copy of the approvalDetail object
   const updatedApprovalDetail = { ...approvalDetail };
    
    // Update the status based on action
    if (action === 'approve') {
        updatedApprovalDetail.status = 'APPROVED';
    } else if (action === 'recommend') {
        alert(values.approverId)
        updatedApprovalDetail.currentHandler = values.approverId
        updatedApprovalDetail.status = 'RECOMMENDED';
        console.log(updatedApprovalDetail)
    } else if (action === 'reject') {
        updatedApprovalDetail.status = 'REJECTED';
    }

    // Dispatch the action with the updated object
    dispatch(updateUserapprovalmasterAsync(updatedApprovalDetail));
    props.onCancel();
    // Logic to handle the form submission based on the action
  };

  return (
    <Modal
      title="User Request Detail"
      destroyOnClose={true}
      open={props.visible}
      onCancel={handleCancel}
      footer={null}
      width="1000px"
      styles={{ padding: '5px', backgroundColor: '#edf0fgreen' }}
    >
      <div className="custom-scrollbar" style={{ padding: 5 }}>
        {approvalDetail ? (
          <>
            <Card
              title={<Title level={5}>Request Information</Title>}
              style={{ marginBottom: '24px' }}
              loading={approvalDetail_loading}
            >
              <Descriptions
                bordered
                column={2}
                layout="horizontal"
                size="small"
                style={{ marginBottom: '24px' }}
              >
                <Descriptions.Item label="ID">{approvalDetail.id}</Descriptions.Item>
                <Descriptions.Item label="Access Type">
                  <Tag bordered={false} color={approvalDetail.accessType === 'T' ? 'blue' : 'green'}>
                    {approvalDetail.accessType === 'T' ? 'Temporary' : 'Permanent'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Tag bordered={false} color="gold">{approvalDetail.status}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Requested By">{approvalDetail.requestedBy}</Descriptions.Item>
                <Descriptions.Item label="Current Handler">{approvalDetail.currentHandler}</Descriptions.Item>
                <Descriptions.Item label="Recommended By">{approvalDetail.recommendedBy || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Approved By">{approvalDetail.approvedBy || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Created At">{approvalDetail.createdAt}</Descriptions.Item>
                <Descriptions.Item label="Updated At">{approvalDetail.updatedAt}</Descriptions.Item>
              </Descriptions>
            </Card>

            <Card
              title={<Title level={5}>Application Role Requests</Title>}
              style={{ marginBottom: '24px' }}
            >
              <List
                itemLayout="horizontal"
                dataSource={approvalDetail.applicationRoleRequests}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={<Text strong>Application ID: {item.applicationId}</Text>}
                      description={
                        <Space direction="vertical">
                          <Text>Role Type ID: {item.roleTypeId}</Text>
                          <Text>Service Type: {item.serviceType}</Text>
                          <Text>Request Type: {item.requestType || 'N/A'}</Text>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
            <Card
              title={<Title level={5}>User Approval Histories</Title>}
              style={{ marginBottom: '24px' }}
            >
              <List
                itemLayout="horizontal"
                dataSource={approvalDetail.userApprovalHistories}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={<Text strong>Status: {item.status}</Text>}
                      description={
                        <Space direction="vertical">
                          <Text>Remarks: {item.remarks}</Text>
                          <Text>Commented By: {item.commentedBy}</Text>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>

            {/* Radio buttons for actions */}
            <Radio.Group onChange={handleRadioChange} value={action} style={{ marginBottom: '24px' }}>
                    <Radio value="recommend"><Tag color='blue' bordered={false}>Recommend</Tag></Radio>
                    <Radio value="approve"><Tag color='green' bordered={false}>Approve</Tag></Radio>
                    <Radio value="reject"><Tag color='red' bordered={false}>Reject</Tag></Radio>
                    </Radio.Group>

            <Card
            title={<Title level={5}>Approval</Title>}
            style={{ marginBottom: '24px' }}
            >
            {formVisible && (
              <Form onFinish={handleFormSubmit}>

                {action === 'recommend' && (
                    <Form.Item
                      name="approverId"
                      label="Approver Address"
                      rules={[{ required: true, message: 'Please select an Approver address!' }]}
                    >
                      <Select
                  placeholder="Select an Approver"
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
                        value={emp.id} // Store the email as the selected value
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

                <Form.Item
                  name="comments"
                  label="Comments"
                  rules={[{ required: true, message: 'Please input your comments!' }]}
                >
                  <TextArea rows={4} />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            )}
            </Card>
          </>
        ) : (
          <Text>Loading...</Text>
        )}
      </div>
    </Modal>
  );
};

export default UserRequestView;
