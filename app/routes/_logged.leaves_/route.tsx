import { useUserContext } from '@/core/context'
import { Api } from '@/core/trpc'
import { PageLayout } from '@/designSystem'
import { useUploadPublic } from '@/plugins/upload/client'
import { notificationService } from '@/services/NotificationService'
import {
    Button,
    Col,
    DatePicker,
    Flex,
    Form,
    Input,
    message,
    Modal,
    Row,
    Table,
    Typography,
    Upload
} from 'antd'
import dayjs from 'dayjs'
import { useState } from 'react'
const { Title, Text } = Typography

export default function LeaveManagementPage() {
  const { user, checkRole } = useUserContext()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [form] = Form.useForm()

  // Queries
  const { data: leaveRequests, refetch: refetchRequests } =
    Api.leaveRequest.findMany.useQuery({
      include: {
        user: true
      },
    })
  const { data: teamMembers } = Api.teamMember.findMany.useQuery({
    where: {
      team: {
        managerId: user?.id,
      },
    },
    include: {
      user: true,
    },
  })

  // Mutations
  const { mutateAsync: deleteLeaveRequest } =
    Api.leaveRequest.delete.useMutation()
  const { mutateAsync: createLeaveRequest } =
    Api.leaveRequest.create.useMutation()
  const { mutateAsync: updateLeaveRequest } =
    Api.leaveRequest.update.useMutation()
  const { mutateAsync: upload } = useUploadPublic()

  interface LeaveRequestFormValues {
    dates: [dayjs.Dayjs, dayjs.Dayjs];
    reason: string;
    document?: { file: File };
  }

  interface LeaveRequestCreateInput {
    data: {
      userId: string;
      startDate: string;
      endDate: string;
      reason: string;
      documentUrl?: string | null;
      status: 'PENDING' | 'APPROVED' | 'REJECTED';
    };
  }

  interface LeaveRequestUpdateInput {
    where: { id: string };
    data: { status: 'PENDING' | 'APPROVED' | 'REJECTED' };
  }

  const handleSubmit = async (values: LeaveRequestFormValues) => {
    setSubmitLoading(true);
    try {
      // Enhanced field validation
      const requiredFields = {
        dates: 'Date range',
        reason: 'Reason'
      };

      const missingFields = Object.entries(requiredFields)
        .filter(([key]) => !values[key])
        .map(([_, label]) => label);

      if (missingFields.length > 0) {
        throw new Error(`Required fields missing: ${missingFields.join(', ')}`);
      }

      // Validate date range
      if (values.dates[0].isAfter(values.dates[1])) {
        throw new Error('Start date cannot be after end date');
      }

      let documentUrl = null;
      if (values.document?.file) {
        try {
          const result = await upload({ file: values.document.file });
          documentUrl = result.url;
        } catch (uploadError) {
          console.error('Document upload failed:', uploadError);
          throw new Error('Failed to upload supporting document');
        }
      }

      const leaveRequest: LeaveRequestCreateInput = {
        data: {
          userId: user?.id,
          startDate: values.dates[0].format('YYYY-MM-DD'),
          endDate: values.dates[1].format('YYYY-MM-DD'),
          reason: values.reason,
          documentUrl,
          status: 'PENDING',
        },
      };

      await createLeaveRequest(leaveRequest);
      message.success('Leave request submitted successfully');
      form.resetFields();
      refetchRequests();
    } catch (error: any) {
      console.error('Leave request submission failed:', {
        error: {
          message: error.message,
          stack: error.stack,
          cause: error.cause,
          timestamp: new Date().toISOString(),
        },
        context: {
          userId: user?.id,
          dates: values.dates?.map(d => d.format('YYYY-MM-DD')),
          formData: values,
        }
      });
      
      if (error.message.includes('timeout') || error.message.includes('network')) {
        message.error('Connection timeout. Please check your internet connection and try again.');
      } else if (error.message.includes('Required fields')) {
        message.error(error.message);
      } else {
        message.error('Failed to submit leave request. Please try again or contact support if the issue persists.');
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId: string, status: 'APPROVED' | 'REJECTED') => {
    const statusUpdate: LeaveRequestUpdateInput = {
      where: { id: requestId },
      data: { status }
    };

    try {
      const updatedRequest = await updateLeaveRequest(statusUpdate);
      
      // Send notification to the employee about leave request status
      if (updatedRequest.userId) {
        await notificationService.sendLeaveStatusNotification(
          updatedRequest.userId,
          status,
          dayjs(updatedRequest.startDate).format('YYYY-MM-DD'),
          dayjs(updatedRequest.endDate).format('YYYY-MM-DD')
        );
      }

      message.success(`Leave request ${status.toLowerCase()} successfully`);
      setSelectedRequest(null);
      setIsModalOpen(false);
      refetchRequests();
    } catch (error: any) {
      console.error('Failed to update leave request status:', {
        error: {
          message: error.message,
          stack: error.stack,
          cause: error.cause,
          timestamp: new Date().toISOString()
        },
        context: {
          requestId,
          status,
          userId: user?.id,
          selectedRequest
        }
      });

      if (error.message.includes('timeout') || error.message.includes('network')) {
        message.error('Connection timeout. Please try again.');
      } else if (error.message.includes('permission')) {
        message.error('You do not have permission to perform this action.');
      } else {
        message.error(`Failed to ${status.toLowerCase()} leave request. Please try again or contact support if the issue persists.`);
      }
    }
  };

  const columns = [
    {
      title: 'Employee',
      dataIndex: ['user', 'name'],
      key: 'employee',
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Text
          type={
            status === 'APPROVED'
              ? 'success'
              : status === 'REJECTED'
              ? 'danger'
              : 'warning'
          }
        >
          {status}
        </Text>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: any) => {
        if (
          checkRole('ADMIN') ||
          (teamMembers?.some(tm => tm.user?.id === record.userId) &&
            record.status === 'PENDING')
        ) {
          return (
            <Button
              type="link"
              onClick={() => {
                setSelectedRequest(record)
                setIsModalOpen(true)
              }}
            >
              Review
            </Button>
          )
        }
        return null
      },
    },
  ]

  return (
    <PageLayout layout="full-width">
      <div className="max-w-[1200px] mx-auto p-6">
        <Title level={2}>
          <i className="las la-calendar-check" style={{ marginRight: 8 }}></i>
          Leave Management
        </Title>

        {!checkRole('ADMIN') && (
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={16}>
              <Title level={4}>Submit Leave Request</Title>
              <Form 
                form={form} 
                onFinish={handleSubmit} 
                layout='vertical'
                initialValues={{
                  dates: null,
                  reason: '',
                  document: null
                }}
              >

                <Form.Item
                  name="dates"
                  label="Date Range"
                  rules={[{ required: true }]}
                >
                  <DatePicker.RangePicker style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                  name="reason"
                  label="Reason"
                  rules={[{ required: true }]}
                >
                  <Input.TextArea rows={4} />
                </Form.Item>

                <Form.Item name="document" label="Supporting Document">
                  <Upload maxCount={1} beforeUpload={() => false}>
                    <Button icon={<i className="las la-upload"></i>}>
                      Upload
                    </Button>
                  </Upload>
                </Form.Item>

                <Button type="primary" htmlType="submit" loading={submitLoading}>
                  Submit Request
                </Button>
              </Form>
            </Col>
          </Row>
        )}

        <Row>
          <Col xs={24}>
            <Flex justify="space-between" align="center">
              <Title level={4}>Leave Requests</Title>
              {checkRole('ADMIN') && (
                <Button
                  danger
                  onClick={() => {
                    Modal.confirm({
                      title: 'Clear All Leave Requests',
                      content:
                        'This will permanently delete all leave requests. Continue?',
                      onOk: async () => {
                        try {
                          await Promise.all(
                            leaveRequests?.map(request =>
                              deleteLeaveRequest({ where: { id: request.id } }),
                            ) || [],
                          )
                          message.success('All leave requests cleared')
                          refetchRequests()
                        } catch (error) {
                          message.error('Failed to clear leave requests')
                        }
                      },
                    })
                  }}
                >
                  Clear All
                </Button>
              )}
            </Flex>
            <Table
              className="overflow-x-auto"
              scroll={{ x: true }}
              columns={columns}
              dataSource={leaveRequests?.filter(request =>
                !checkRole('ADMIN') ? request.userId === user?.id : true,
              )}
              rowKey="id"
            />
          </Col>
        </Row>

        <Modal
          title="Review Leave Request"
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false)
            setSelectedRequest(null)
          }}
          footer={
            <Flex gap="small" justify="end">
              <Button
                key="reject"
                danger
                onClick={() =>
                  handleStatusUpdate(selectedRequest?.id, 'REJECTED')
                }
              >
                Reject
              </Button>
              <Button
                key="approve"
                type="primary"
                onClick={() =>
                  handleStatusUpdate(selectedRequest?.id, 'APPROVED')
                }
              >
                Approve
              </Button>
            </Flex>
          }
        >
          {selectedRequest && (
            <div>
              <p>
                <strong>Employee:</strong> {selectedRequest.user?.name}
              </p>
              <p>
                <strong>Dates:</strong>{' '}
                {dayjs(selectedRequest.startDate).format('MMM DD, YYYY')} -{' '}
                {dayjs(selectedRequest.endDate).format('MMM DD, YYYY')}
              </p>
              <p>
                <strong>Reason:</strong> {selectedRequest.reason}
              </p>
              {selectedRequest.documentUrl && (
                <p>
                  <strong>Document:</strong>{' '}
                  <a
                    href={selectedRequest.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Document
                  </a>
                </p>
              )}
            </div>
          )}
        </Modal>
      </div>
    </PageLayout>
  )
}
