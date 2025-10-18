// app/api/saveMessage/route.ts
import nodemailer from 'nodemailer';
import { Stack, TextInput, Textarea, Button } from '@mantine/core';

export async function POST(req: Request) {
  const { name, phone, message } = await req.json();

  const transporter = nodemailer.createTransport({
    host: 'wednesday.mxrouting.net',
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS || '', // 可以为空，Netlify 部署测试用
    },
  });

  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: process.env.MAIL_USER,
    subject: '新留言',
    text: `名字: ${name}\n电话: ${phone}\n留言: ${message}`,
  });

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
