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
  Select,
} from 'antd';
import { useSelector } from 'react-redux';
import { CaretRightOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import './index.css';
import { fetchBranchsAsync } from '../../../store/slices/branchSlice';
import { updateUserapprovalmasterAsync,fetchUserapprovalmastersByCurrentHandler, saveToCbs } from '../../../store/slices/userapprovalmasterSlice';
import { fetchEmployeesAsync } from '../../../store/slices/employeeSlice';
import { fetchApplicationsAsync } from '../../../store/slices/applicationSlice';


const { Text, Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const UserRequestView = (props) => {
  const { approvalDetail, error, approvalDetail_loading } = useSelector(
    (state) => state.userapprovalmaster
  );
  const [form] = Form.useForm();
  const { applications, loading } = useSelector((state) => state.application);

  const { userInfo } = useSelector((state) => state.user);

  const { roles} = useSelector((state)=> state.role);

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
    setFormVisible(false);
    props.onCancel();
  };

  // Handle radio change
  const handleRadioChange = (e) => {
    setAction(e.target.value);
    setFormVisible(true);
  };

  useEffect(() => {
    fetchBranchsAsync();
    fetchEmployeesAsync();
    fetchApplicationsAsync();
  }, []);

  // Handle form submission
  const handleFormSubmit = (values) => {
    Modal.confirm({
      title: 'Confirm Submission',
      content: `Are you sure you want to submit ${action} this request?`,
      okText: 'Yes',
      cancelText: 'No',
      onOk() {
        console.log('Form values:', values);
        
        // Create a deep copy of the approvalDetail object
        const updatedApprovalDetail = JSON.parse(JSON.stringify(approvalDetail));
        
        // Update the status based on action
        if (action === 'approve') {
          updatedApprovalDetail.status = 'APPROVED';
          updatedApprovalDetail.approvedBy = updatedApprovalDetail.currentHandler;
          updatedApprovalDetail.userApprovalHistories.push({
            status: 'APPROVED',
            remarks: values.comments,
            delFlag: 'N',
            commentedBy: updatedApprovalDetail.currentHandler,
          });
          updatedApprovalDetail.currentHandler = null;
        } else if (action === 'recommend') {
          updatedApprovalDetail.userApprovalHistories.push({
            status: 'RECOMMENDED',
            remarks: values.comments,
            delFlag: 'N',
            commentedBy: updatedApprovalDetail.currentHandler,
          });
          updatedApprovalDetail.currentHandler = values.approverId;
          updatedApprovalDetail.status = 'RECOMMENDED';
          
          console.log(updatedApprovalDetail);
        } else if (action === 'reject') {
          updatedApprovalDetail.status = 'REJECTED';
          updatedApprovalDetail.userApprovalHistories.push({
            status: 'REJECTED',
            remarks: values.comments,
            delFlag: 'N',
            commentedBy: updatedApprovalDetail.currentHandler,
          });
          updatedApprovalDetail.currentHandler = updatedApprovalDetail.requestedBy;
        } else if (action === 'implemented') {
          updatedApprovalDetail.status = 'IMPLEMENTED';
          updatedApprovalDetail.userApprovalHistories.push({
            status: 'IMPLEMENTED',
            remarks: values.comments,
            delFlag: 'N',
            commentedBy: employees.find(emp => emp.email === userInfo.email)?.id || null,
          });
          updatedApprovalDetail.currentHandler = null;

          if(updatedApprovalDetail.accessType === 'T'){
            const updateToCbs = updatedApprovalDetail.applicationRoleRequests.map((request) => {
              return {
                  "exsistingServiceType": request.exsistingServiceType,
                  "fromDate": updatedApprovalDetail.fromDate,
                  "roleTypeId": roles.find((role) => role.id === request.roleTypeId)?.role,
                  "serviceType": request.serviceType,
                  "toDate": updatedApprovalDetail.toDate,
                  "cbsId": updatedApprovalDetail.cbsUserName
              };
          });
          const applicationName = "Finacle";
          const application = applications.find(app => app.applicationName === applicationName);
          if (
            application.id === updatedApprovalDetail.applicationRoleRequests[0]?.applicationId &&
            updatedApprovalDetail.applicationRoleRequests[0]?.requestType === null
          ) {
            dispatch(saveToCbs(updateToCbs));
          }
          
          }

         
        }
        // Dispatch the action with the updated object
        dispatch(updateUserapprovalmasterAsync(updatedApprovalDetail));

        
        // Optionally handle any additional logic after dispatch
        form.resetFields();
        props.onCancel();
      },
    });
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
                {/* <Descriptions.Item label="ID">
                  {' '}
                  <Tag
                    key={approvalDetail.id}
                    bordered={false}
                    color="geekblue"
                  >
                    {applications.map((app) => {
                      if (app.id === approvalDetail.id) {
                        return app.applicationName;
                      }
                    })}
                  </Tag>
                </Descriptions.Item> */}
                <Descriptions.Item label="Access Type">
                  <Tag
                    bordered={false}
                    color={approvalDetail.accessType === 'T' ? 'blue' : 'green'}
                  >
                    {approvalDetail.accessType === 'T'
                      ? 'Temporary'
                      : 'Permanent'}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Tag bordered={false} color="gold">
                    {approvalDetail.status}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Requested By">
                  {employees.map((emp) => {
                    if (emp.id == approvalDetail.requestedBy) {
                      return emp.email;
                    }
                  })}
                </Descriptions.Item>
                <Descriptions.Item label="Current Handler">
                  {/* {approvalDetail.currentHandler} */}
                  {employees.map((emp) => {
                    if (emp.id === approvalDetail.currentHandler) {
                      return emp.email;
                    }
                  })}
                </Descriptions.Item>
                <Descriptions.Item label="Recommended By">
                  {approvalDetail.recommendedBy || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Approved By">
                  {employees.map((emp) => {
                    if (emp.id == approvalDetail.approvedBy) {
                      return emp.email;
                    }
                  })}
                </Descriptions.Item>
                <Descriptions.Item label="Created At">
                  {approvalDetail.createdAt}
                </Descriptions.Item>
                <Descriptions.Item label="Updated At">
                  {approvalDetail.updatedAt}
                </Descriptions.Item>
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
                      title={
                        <Text strong>
                          Application ID:{' '}
                          {applications.map((app) => {
                            if (app.id === item.applicationId) {
                              return app.applicationName;
                            }
                            return null; // To avoid React warning for missing return in map
                          })}
                        </Text>
                      }
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
                // Sort the userApprovalHistories by id in descending order
                dataSource={[
                  ...(approvalDetail.userApprovalHistories ?? []),
                ].sort((a, b) => b.id - a.id)}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={<Text>Status: {item.status}</Text>}
                      description={
                        <Space direction="vertical">
                          <Text>Remarks: {item.remarks}</Text>
                          <Text>
                            Commented By:{' '}
                            {employees.map((emp) => {
                              if (emp.id == item.commentedBy) {
                                return emp.email;
                              }
                            })}
                          </Text>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>

            {/* Radio buttons for actions */}
            {( approvalDetail.currentHandler === userInfo.empId || approvalDetail.currentHandler === null && approvalDetail.requestedBy !== userInfo.empId ) && (
  <>
    {approvalDetail.status !== 'REJECTED' && approvalDetail.status !== 'IMPLEMENTED' && (
      <Radio.Group
        onChange={handleRadioChange}
        value={action}
        style={{ marginBottom: '24px' }}
      >
        {approvalDetail.status === 'APPROVED' ? (
          <Radio value="implemented">
            <Tag color="blue" bordered={false}>
              Implemented
            </Tag>
          </Radio>
        ) : (
          <>
            <Radio value="recommend">
              <Tag color="blue" bordered={false}>
                Recommend
              </Tag>
            </Radio>
            <Radio value="approve">
              <Tag color="green" bordered={false}>
                Approve
              </Tag>
            </Radio>
          </>
        )}

        <Radio value="reject">
          <Tag color="red" bordered={false}>
            Reject
          </Tag>
        </Radio>
      </Radio.Group>
    )}

    <Card
      title={<Title level={5}>Approval</Title>}
      style={{ marginBottom: '24px' }}
    >
      {formVisible && (
        <Form form={form} onFinish={handleFormSubmit}>
          {action === 'recommend' && (
            <Form.Item
              name="approverId"
              label="Approver Address"
              rules={[
                {
                  required: true,
                  message: 'Please select an Approver address!',
                },
              ]}
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
                    branchs.find((b) => b.solId === emp.branch)?.solDescription || 'Unknown Branch'
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
                          {branchs.find((b) => b.solId === emp.branch)?.solDescription || 'Unknown Branch'}
                        </span>
                        <br />
                        <span style={{ color: '#555' }}>
                          {emp.email}
                        </span>
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
            rules={[
              {
                required: true,
                message: 'Please input your comments!',
              },
            ]}
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
)}

            
           
          </>
        ) : (
          <Text>Loading...</Text>
        )}
      </div>
    </Modal>
  );
};

export default UserRequestView;
