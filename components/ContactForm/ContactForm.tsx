import { useState } from 'react';
import { Stack, TextInput, Textarea, Button, Notification } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim() || !message.trim()) {
      setError('请填写所有字段');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/saveMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, phone, message }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '提交失败');
      }

      setSuccess(true);
      setName(''); 
      setPhone(''); 
      setMessage('');
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      console.error('提交错误:', e);
      // 修复类型错误
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('提交失败，请稍后重试');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack gap="sm">
      <TextInput 
        label="名字" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        required 
        disabled={loading}
      />
      <TextInput 
        label="电话" 
        value={phone} 
        onChange={(e) => setPhone(e.target.value)} 
        required 
        disabled={loading}
      />
      <Textarea 
        label="留言" 
        value={message} 
        onChange={(e) => setMessage(e.target.value)} 
        required 
        disabled={loading}
        minRows={4}
      />
      
      <Button 
        onClick={handleSubmit} 
        loading={loading}
        disabled={loading}
      >
        提交
      </Button>
      
      {success && (
        <Notification 
          icon={<IconCheck size="1.1rem" />} 
          color="teal" 
          title="成功"
          onClose={() => setSuccess(false)}
        >
          提交成功！我们会尽快联系您。
        </Notification>
      )}
      
      {error && (
        <Notification 
          icon={<IconX size="1.1rem" />} 
          color="red" 
          title="错误"
          onClose={() => setError('')}
        >
          {error}
        </Notification>
      )}
    </Stack>
  );
}