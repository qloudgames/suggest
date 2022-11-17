import { Button, Checkbox, Modal } from 'antd';
import * as React from 'react';
import { ExclamationCircleFilled } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import { ReportReasons } from 'common/reporting';
import { ReportEntryRequest } from 'common/types';
import { ApiService } from './services/api_service';

type Props = {
  entryId: number
  apiService: ApiService
}

export const ReportModal = ({entryId, apiService}: Props) => {
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [reasons, setReasons] = React.useState<string[]>([]);
  const [issueDescription, setIssueDescription] = React.useState<string>("");

  React.useEffect(() => {
    return () => {
      if (!isModalOpen) {
        setReasons([]);
        setIssueDescription("");
      }
    }
  }, [isModalOpen])

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    const payload: ReportEntryRequest = {
      entryId,
      reportedOn: Date.now(),
      reasons,
      issue: issueDescription
    }

    await apiService.reportEntry(payload);

    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleChange = (checkedValues: string[]) => {
    setReasons(checkedValues);
  };

  const handleIssueDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setIssueDescription(value);
  }

  const reportReasons = [
    { label: 'It does not follow the community guidelines.', value: ReportReasons.GUIDELINES },
    { label: 'I find it offensive or inappropriate', value: ReportReasons.OFFENSIVE },
    { label: 'It\'s scam or misleading', value: ReportReasons.SCAM },
  ]

  return (
    <>
      <Button
        key={`entry-${entryId}`}
        type="dashed"
        size="small"
        shape="circle" 
        icon={<ExclamationCircleFilled />}
        danger
        onClick={showModal}
      />
      <Modal title="Report Post" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>Why are you reporting this post? </p>
        <Checkbox.Group onChange={handleChange} >
          {reportReasons.map((reason, idx) => (
            <div key={idx}><Checkbox value={reason.value}>{reason.label}</Checkbox></div>
          ))}
        </Checkbox.Group>
        <br/>
        <br/>
        <p>Can you help us understand the issue in more details?</p>
        <TextArea value={issueDescription} onChange={handleIssueDescription}/>
      </Modal>
    </>
  )
}
