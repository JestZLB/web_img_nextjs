import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(request: any) {
    const formData = await request.formData();
    const file = formData.get('file'); // 'file' 是前端上传字段的名称
    const toDay = new Date();
    const formattedDate = `${toDay.getFullYear()}.${toDay.getMonth() + 1}.${toDay.getDate()}`

    const uploadDir = path.join(process.cwd(), `public/uploads/${formattedDate}`);

    // 确保上传目录存在
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 获取文件名和文件数据
    const filename = file.name; // 获取原始文件名
    const fileBuffer = await file.arrayBuffer(); // 将文件数据转换为 ArrayBuffer
    const buffer = Buffer.from(fileBuffer); // 将 ArrayBuffer 转换为 Buffer

    const filePath = path.join(uploadDir, filename); // 构建文件保存路径

    try {
        // 保存文件
        fs.writeFileSync(filePath, buffer); // 同步写入文件
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ msg: "文件上传失败", error: error.message }, { status: 500 });
    }

    // 返回文件的访问地址
    const baseUrl = `${request.headers.get('origin')}/uploads/${formattedDate}/${filename}`;
    return NextResponse.json({ msg: "文件上传成功", fileUrl: baseUrl });
}
