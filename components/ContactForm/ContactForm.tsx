// components/ContactForm.tsx
'use client';
import { useState } from 'react';
import { TextInput, Textarea, Button, Stack, Notification } from '@mantine/core';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    try {
      await fetch('/api/saveMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, message }),
      });
      setSuccess(true);
      setName(''); setPhone(''); setMessage('');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Stack spacing="sm">
      <TextInput label="名字" value={name} onChange={(e) => setName(e.target.value)} required />
      <TextInput label="电话" value={phone} onChange={(e) => setPhone(e.target.value)} required />
      <Textarea label="留言" value={message} onChange={(e) => setMessage(e.target.value)} required />
      <Button onClick={handleSubmit}>提交</Button>
      {success && <Notification color="green">提交成功！已发送到邮箱</Notification>}
    </Stack>
  );
}
