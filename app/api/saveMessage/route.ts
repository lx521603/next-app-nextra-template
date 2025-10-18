// app/api/saveMessage/route.ts
import { NextResponse } from 'next/server' // 也可以使用原生 Response
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  // 检查环境变量
  const mailUser = process.env.MAIL_USER;
  const mailPass = process.env.MAIL_PASS;
  if (!mailUser || !mailPass) {
    return NextResponse.json(
      { error: '服务器配置错误' },
      { status: 500 }
    );
  }

  try {
    // 解析请求体
    const { name, phone, message } = await request.json();

    // 验证必要字段
    if (!name?.trim() || !phone?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: '所有字段都是必填的' },
        { status: 400 }
      );
    }

    // 配置邮件传输器
    const transporter = nodemailer.createTransport({
      host: 'wednesday.mxrouting.net',
      port: 465,
      secure: true,
      auth: {
        user: mailUser,
        pass: mailPass,
      },
    });

    // 发送邮件
    await transporter.sendMail({
      from: mailUser,
      to: mailUser, // 或您想发送到的其他邮箱
      subject: '网站新留言',
      text: `姓名: ${name}\n电话: ${phone}\n留言: ${message}`,
      html: `
        <h3>新留言通知</h3>
        <p><strong>姓名:</strong> ${name}</p>
        <p><strong>电话:</strong> ${phone}</p>
        <p><strong>留言内容:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    // 返回成功响应
    return NextResponse.json(
      { success: true, message: '留言发送成功' },
      { status: 200 }
    );

  } catch (error) {
    console.error('发送邮件失败:', error);
    return NextResponse.json(
      { error: '发送失败，请稍后重试' },
      { status: 500 }
    );
  }
}