// app/api/saveMessage/route.ts
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  const mailUser = process.env.MAIL_USER;
  const mailPass = process.env.MAIL_PASS;
  
  if (!mailUser || !mailPass) {
    return new Response(
      JSON.stringify({ error: '服务器配置错误' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { name, phone, message } = await req.json();

    if (!name?.trim() || !phone?.trim() || !message?.trim()) {
      return new Response(
        JSON.stringify({ error: '所有字段都是必填的' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const transporter = nodemailer.createTransport({
      host: 'wednesday.mxrouting.net',
      port: 465,
      secure: true,
      auth: { user: mailUser, pass: mailPass },
    });

    await transporter.sendMail({
      from: mailUser,
      to: mailUser,
      subject: '网站新留言',
      text: `姓名: ${name}\n电话: ${phone}\n留言: ${message}`,
    });

    return new Response(
      JSON.stringify({ success: true, message: '留言发送成功' }), 
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('发送邮件失败:', error);
    
    // 简化错误处理，移除调试信息
    return new Response(
      JSON.stringify({ error: '发送失败，请稍后重试' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

    const transporter = nodemailer.createTransport({
      host: 'wednesday.mxrouting.net',
      port: 465,
      secure: true,
      auth: {
        user: mailUser,
        pass: mailPass,
      },
    });

    // 验证连接配置
    await transporter.verify();

    const mailResult = await transporter.sendMail({
      from: mailUser,
      to: mailUser, // 或者你想发送到的其他邮箱
      subject: '网站新留言',
      text: `姓名: ${name}\n电话: ${phone}\n留言: ${message}`,
      html: `
        <h3>新留言通知</h3>
        <p><strong>姓名:</strong> ${name}</p>
        <p><strong>电话:</strong> ${phone}</p>
        <p><strong>留言内容:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <small>发送时间: ${new Date().toLocaleString('zh-CN')}</small>
      `,
    });

    console.log('Email sent successfully:', mailResult.messageId);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: '留言发送成功' 
      }), 
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Email sending failed:', error);
    return new Response(
      JSON.stringify({ 
        error: '发送失败，请稍后重试',
        debug: process.env.NODE_ENV === 'development' ? error.message : undefined
      }), 
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}