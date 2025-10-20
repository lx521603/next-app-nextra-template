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

// 静态数据路径：在 Vercel 运行时，public 目录会被映射为根目录 '/'
const DATA_FILE_PATH = path.join(process.cwd(), 'public', 'carousel_data.json'); 
// Fallback path for Vercel Environment (where /public is not needed in path.join)
const FALLBACK_DATA_FILE_PATH = path.join(process.cwd(), 'carousel_data.json'); 

// --- Next.js App Router GET 请求处理函数 ---
export async function GET(request: NextRequest) {
  let carouselData: CarouselImage[] = [];
  
  try {
    let dataContent: string;
    
    // 1. 尝试读取 DATA_FILE_PATH
    try {
      dataContent = await fs.readFile(DATA_FILE_PATH, 'utf8');
    } catch (e) {
      // 2. 如果失败，尝试读取 FALLBACK_DATA_FILE_PATH (Vercel有时直接将public文件放在根)
      dataContent = await fs.readFile(FALLBACK_DATA_FILE_PATH, 'utf8');
    }
    
    // 3. 解析 JSON 数据
    carouselData = JSON.parse(dataContent) as CarouselImage[];
    
    // Console log is now safe and fast
    // console.log(`✅ [API/Carousel] Successfully loaded ${carouselData.length} carousel items from static file.`);
    
    return NextResponse.json(carouselData);

  } catch (error) {
    console.error(`❌ [API/Carousel] Failed to read or parse static carousel data file (${DATA_FILE_PATH}):`, error);
    
    // 如果无法加载预生成的数据文件，返回一个 500 响应
    return new NextResponse(JSON.stringify({ 
      error: 'Failed to load carousel data. Static file not found or invalid JSON.',
      detail: (error as Error).message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

// 保持动态，但现在它会很快
export const dynamic = 'force-dynamic'; 
