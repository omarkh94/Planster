import React, { useState } from 'react';
import { Button, Modal, Input, notification } from 'antd';
import { useUser } from '../store/UserStore';

const ForgitPass: React.FC = () => {
  const { open, setOpen } = useUser();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('Enter your email to reset the password');
  const [email, setEmail] = useState('');

  const showModal = () => {
    setOpen(); // Open the modal
  };

  const handleOk = () => {
    if (!email || !validateEmail(email)) {
      setEmail('');
      notification.error({
        message: 'Invalid Email',
        description: 'Please enter a valid email address.',
      });
      return;
    }

    setModalText('Sending reset email...');
    setConfirmLoading(true);

    setTimeout(() => {
      const emailExists = checkIfEmailExists(email); 
      if (emailExists) {
        setEmail('');
        setModalText('A password reset email has been sent to your email address.');
        notification.success({
          message: 'Success',
          description: 'Password reset email has been sent.',
        });
      } else {
        setEmail('');
        setModalText('Email not found. Please try again.');
        notification.error({
          message: 'Email Not Found',
          description: 'We couldn’t find an account with that email.',
        });
      }
      setConfirmLoading(false);
    }, 2000);
  };

  const handleCancel = () => {
    setOpen(); 
    setEmail(''); 
  };

  
  const checkIfEmailExists = (email: string) => {
    
    const mockEmailList = ['test@example.com', 'user@domain.com'];
    return mockEmailList.includes(email);
  };

 
  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  return (
    <>
      <Button className="openModal" type="primary" onClick={showModal}>
        Forgot Your Password?
      </Button>

      <Modal
        title="Reset Password"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        centered
        okText="Send Email"
        cancelText="Cancel"
        width={400} // Custom width for the modal
      >
        <p>{modalText}</p>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: '15px' }}
          disabled={confirmLoading}
        />
      </Modal>
    </>
  );
};

export default ForgitPass;