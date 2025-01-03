import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer'
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { replaceTxt } from '@/public/methods';

//直接截图但是无法截取动态生成的代码
const screenshotFn1 = async (url: string, className: string, name: string) => {
    try {
        if (!name) {
            name = 'dom截图'
        }
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
        // 等待元素加载
        await page.waitForSelector(`.${className}`);
        // 获取元素的位置和尺寸
        const element = await page.$(`.${className}`);
        if (!element) {
            NextResponse.json({ msg: "元素不存在" }, { status: 400 })
            return
        }
        const boundingBox = await element.boundingBox();
        // 截图特定元素并保存为 resume.png
        if (!boundingBox) {
            NextResponse.json({ msg: "截图出现错误" }, { status: 400 })
            return
        }
        // 截图特定元素并保存
        const screenshotBuffer = await page.screenshot({
            path: `${name}.png`,
            clip: {
                x: boundingBox.x,
                y: boundingBox.y,
                width: boundingBox.width,
                height: boundingBox.height
            }
        });

        await browser.close();

        const compressedBuffer = await sharp(screenshotBuffer)
            .jpeg({ quality: 80 }) // 设置压缩质量
            .toBuffer(); // 获取压缩后的 Buffer

        const screenshotsDir = path.join(process.cwd(), 'public/screenshots');
        // 确保上传目录存在
        if (!fs.existsSync(screenshotsDir)) {
            fs.mkdirSync(screenshotsDir, { recursive: true });
        }
        const filePath = path.join(process.cwd(), 'public', 'screenshots', `${name}.jpg`)
        await fs.promises.writeFile(filePath, compressedBuffer);
        const baseUrl = `${url}/screenshots/${name}.jpg`;
        return baseUrl
    } catch (error) {
        NextResponse.json({ msg: "截图函数出现错误", data: error }, { status: 400 })
        return
    }
}

//通过api获取html代码生成动态页面
const screenshotFn2 = async (url: string, pngname: string, html: string) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1284, height: 0 });
    const newPngName = replaceTxt(pngname);
    console.log(newPngName);
    await page.setContent(`
        <html>
            <head>
                <link rel="stylesheet" href="http://localhost:3000/_next/static/css/app/layout.css?v=1727418313062">  <!-- 替换为实际的样式文件 URL -->
            </head>
            <body>
                ${html}
            </body>
        </html>
    `); // 将内容设置到页面中
    const screenshotBuffer = await page.screenshot({
        type: 'png',
        fullPage : true
    });
    await browser.close();
    const compressedBuffer = await sharp(screenshotBuffer)
        .jpeg({ quality: 80 }) // 设置压缩质量
        .toBuffer(); // 获取压缩后的 Buffer
    const screenshotsDir = path.join(process.cwd(), 'public/screenshots');
    // 确保上传目录存在
    if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir, { recursive: true });
    }
    const filePath = path.join(process.cwd(), 'public', 'screenshots', `${newPngName}.jpg`)
    await fs.promises.writeFile(filePath, compressedBuffer);
    const baseUrl = `${url}/screenshots/${newPngName}.jpg`;
    return baseUrl
}

export async function POST(request: NextRequest) {
    const { className, pngname, html } = await request.json(); // 接收 JSON 数据
    // 校验参数
    if (typeof className !== 'string' || typeof pngname !== 'string' || typeof html !== 'string') {
        return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    const url = request.headers.get('origin');
    if (!url) {
        return NextResponse.json({ error: "出现错误" }, { status: 400 })
    }

    const imgUrl = await screenshotFn2(url, pngname, html);

    return NextResponse.json({ imgUrl }, { status: 200 })
}