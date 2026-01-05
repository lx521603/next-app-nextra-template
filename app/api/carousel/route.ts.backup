import { NextResponse, type NextRequest } from 'next/server';
import path from 'path';
import * as fs from 'fs/promises';

// --- 接口定义（保持不变） ---
interface CarouselImage {
  url: string;
  alt: string;
  title: string;
  link: string;
}

// 路径定义
// 1. 标准路径：适用于本地开发/大部分服务器环境
const STANDARD_PATH = path.join(process.cwd(), 'public', 'carousel_data.json'); 
// 2. Vercel 回退路径：public 文件夹内容有时直接位于函数根目录
const VERCEL_FALLBACK_PATH = path.join(process.cwd(), 'carousel_data.json'); 

// 保持动态，确保在运行时执行 I/O 操作
export const dynamic = 'force-dynamic'; 

// --- Next.js App Router GET 请求处理函数 ---
export async function GET(request: NextRequest) {
  let dataContent: string;
  let triedPaths: string = ''; // 用于错误日志记录
  
  try {
    // 1. 尝试读取标准路径
    try {
      dataContent = await fs.readFile(STANDARD_PATH, 'utf8');
      triedPaths = `SUCCESS: ${STANDARD_PATH}`;
    } catch (standardError) {
      // 2. 如果标准路径失败，尝试回退路径
      try {
        dataContent = await fs.readFile(VERCEL_FALLBACK_PATH, 'utf8');
        triedPaths = `SUCCESS: ${VERCEL_FALLBACK_PATH}`;
      } catch (fallbackError) {
        // 两次尝试都失败，抛出错误以进入外层 catch 块
        triedPaths = `FAILED: ${STANDARD_PATH} and ${VERCEL_FALLBACK_PATH}`;
        
        // 提取主要错误信息，避免日志过长
        const stdErrMsg = (standardError as Error).message.split(',')[0];
        const fallErrMsg = (fallbackError as Error).message.split(',')[0];
        
        throw new Error(
            `File not found after two tries. (Standard: ${stdErrMsg}, Fallback: ${fallErrMsg})`
        );
      }
    }
    
    // 3. 解析 JSON 数据
    // 注意：dataContent 在成功读取后必然有值
    const carouselData = JSON.parse(dataContent) as CarouselImage[];
    
    // console.log(`[API/Carousel] Data loaded successfully from: ${triedPaths}`);
    return NextResponse.json(carouselData);

  } catch (error) {
    // 捕获读取文件失败或 JSON 解析失败的错误
    console.error(`❌ [API/Carousel] Fatal Error loading static data. Tried Paths: ${triedPaths}`, error);
    
    // 返回一个 500 响应，详细信息有助于客户端调试
    return new NextResponse(JSON.stringify({ 
      status: 500,
      error: 'Failed to load carousel data. Static file error on server.',
      detail: (error instanceof Error) ? error.message : 'Unknown error during file operation.'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}