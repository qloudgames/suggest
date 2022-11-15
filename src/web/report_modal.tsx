import { Button, Checkbox, Modal } from 'antd';
import * as React from 'react';
import { ExclamationCircleFilled } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';

type Props = {
  entryId: number
}

export const ReportModal = ({entryId}: Props) => {
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [reasons, setReasons] = React.useState<CheckboxValueType[]>([]);
  const [issueDescription, setIssueDescription] = React.useState<string>("");

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    const payload = {
      entryId,
      reportedOn: Date.now(),
      reasons,
      issue: issueDescription
    }

    console.log(payload) // store this payload to 
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleChange = (checkedValues: CheckboxValueType[]) => {
    setReasons(checkedValues);
  };

  const handleIssueDescription = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;

    setIssueDescription(value);
  }

  const reportReasons = [
    { label: 'It does not follow the community guidelines.', value: 'It does not follow the community guidelines.' },
    { label: 'I find it offensive or inappropriate', value: 'I find it offensive or inappropriate' },
    { label: 'It\'s scam or misleading', value: 'I find it offensive' },
    { label: 'It refers to a political candidate or issue', value: 'It refers to a political candidate or issue' },
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
