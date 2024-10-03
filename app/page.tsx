'use client'
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Input, Upload, UploadFile, Image, UploadProps, message, Switch } from "antd";
import ImgCrop from "antd-img-crop";
import { UploadChangeParam } from "antd/es/upload";
import { ChangeEvent, Dispatch, LegacyRef, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import React from "react";

interface textObj {
  textImg: string;
  text: string;
  id: number;
}

interface DataObj {
  titleImg: string;
  name: string;
  textArr: Array<textObj>
  descriptions : string;
}

const uplodBtn = (
  <button style={{ border: 0, background: 'none' }} type="button">
    <PlusOutlined />
    <div style={{ marginTop: 8 }}>上传图片</div>
  </button>)

export default function Home() {
  const [dataobj, setDataObj] = useState<DataObj>({
    titleImg: '',
    name: '',
    textArr: [],
    descriptions : ''
  });

  const [normalImg,setNormalImg] = useState<string>(``)

  const [titleImgList, setTitleImgFileList] = useState<UploadFile[]>([]);
  const capture = useRef<HTMLDivElement | null>(null);

  const [needTitleImg, setNeedTitleImg] = useState<boolean>(true);

  const ImageChange = (imgData: UploadChangeParam<UploadFile<any>>, setFn: Dispatch<SetStateAction<UploadFile<any>[]>>) => {
    const { fileList: newFileList } = imgData
    setFn(newFileList);
  };


  const changeDataObj = (data: any) => {
    setDataObj((prevdata) => {
      return { ...prevdata, ...data }
    })
  }

  const addText = () => {
    const newArr = dataobj.textArr.map(item => item);
    newArr.push({
      id: newArr.length + 1,
      text: '',
      textImg: '',
    })

    changeDataObj({ textArr: newArr })
  }

  const sendTextArrImg = (file: UploadChangeParam<UploadFile<any>>, id: number) => {
    const newArr = dataobj.textArr.map(item => {
      if (item.id === id) {
        item.textImg = file.file.response?.fileUrl || ''
      }
      return item
    })

    changeDataObj({ textArr: newArr })
  }

  const sendTextArrText = (text: string, id: number) => {
    const newArr = dataobj.textArr.map(item => {
      if (item.id === id) {
        item.text = text
      }
      return item
    })

    changeDataObj({ textArr: newArr })
  }

  const deleteTextArrImg = (id: number) => {
    const newArr = dataobj.textArr.map(item => {
      if (item.id === id) {
        item.textImg = ''
      }
      return item
    })

    changeDataObj({ textArr: newArr })
  }

  const deleteTextArrItem = (id: number) => {
    const newArr = dataobj.textArr.filter(item => {
      return item.id !== id
    })

    changeDataObj({ textArr: newArr })
  }

  const postImgDom = async () => {
    if (!capture.current) {
      console.log('出现错误');
      return
    }
    const obj = {
      className: 'capture-area',
      pngname: dataobj.name,
      html: capture.current.innerHTML
    }
    try {
      const response = await fetch('/api/download_img', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj)
      })

      const data = await response.json();

      const imgUrl = data.imgUrl

      console.log(imgUrl)

      if (!imgUrl || !imgUrl.length) {
        return
      }

      const json = JSON.stringify(dataobj, null, 2); // 格式化 JSON
      const blob = new Blob([json], { type: "application/json" });
      const jsonUrl = URL.createObjectURL(blob);

      // 创建下载链接
      const link = document.createElement('a');
      link.href = imgUrl;
      link.download = `${dataobj.name}.jpg`; // 设置下载文件名
      link.click(); // 触发下载

      const linkJson = document.createElement('a');
      linkJson.href = jsonUrl
      linkJson.download = `${dataobj.name}.json`;
      linkJson.click();
      URL.revokeObjectURL(jsonUrl); // 释放内存

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (titleImgList.length) {
      const obj = {
        titleImg: titleImgList[0].response?.fileUrl || ''
      }
      changeDataObj(obj)
    } else {
      const obj = {
        titleImg: ''
      }
      changeDataObj(obj)
    }
  }, [titleImgList])

  useEffect(()=>{
    setNormalImg(`${window.location.href}bg_img/norm_bg.png`)
  },[])


  return (
    <div className=" w-full flex bg-morfonica-2/10 ">
      <div className=" left-part ">
        <div className="flex mb-4 items-center">
          <div className=" text-2xl mr-2">是否使用标题图片</div>
          <Switch
            value={needTitleImg}
            onChange={(value) => {
              setNeedTitleImg(value)
            }}
          ></Switch>
        </div>

        <div className=" mb-4 ">
          <h2 className="title-text">
            标题：
          </h2>
          <Input
            placeholder="这里输入标题"
            onChange={(e) => {
              const obj = {
                name: e.target.value
              }
              changeDataObj(obj)
            }}
          ></Input>
        </div>

        <div className=" mb-4 ">
          <h2 className="title-text">
            标题描述：
          </h2>
          <Input
            placeholder="输入标题描述"
            onChange={(e) => {
              const obj = {
                descriptions : e.target.value
              }
              changeDataObj(obj)
            }}
          ></Input>
        </div>

        {
          needTitleImg ?
            <>
              <div className=" mb-4 ">
                <h2 className="title-text">
                  标题图片：
                </h2>
                <ImgCrop
                  quality={1}
                  aspect={1284 / 384}
                >
                  <Upload
                    listType="picture-card"
                    onChange={(imgData) => {
                      ImageChange(imgData, setTitleImgFileList)
                    }}
                    action={'/api/upload_img'}
                  >
                    {titleImgList.length >= 1 ? null : uplodBtn}
                  </Upload>
                </ImgCrop>
              </div>
            </>
            : null
        }
        {
          dataobj.textArr.length > 0 ? dataobj.textArr.map((item) => {
            return (
              <div key={item.id} className="mb-4">
                <div className="title-text">
                  图片内容:
                  <Button
                    className="ml-4"
                    onClick={() => { deleteTextArrItem(item.id) }}
                  >
                    删除文段
                  </Button>
                </div>
                <div className="my-4">
                  <Input.TextArea
                    onChange={(e) => { sendTextArrText(e.target.value, item.id) }}
                    style={{ resize: 'none' }}
                    placeholder="请输入文本"
                  ></Input.TextArea>
                </div>
                {
                  item.textImg.length ?
                    <div className=" flex items-end ">
                      <Image src={item.textImg} width={240}></Image>
                      <Button className="ml-2" onClick={() => deleteTextArrImg(item.id)}>删除图片</Button>
                    </div>
                    :
                    <Upload
                      listType="picture-card"
                      action={'/api/upload_img'}
                      onChange={(file) => {
                        sendTextArrImg(file, item.id)
                      }}
                      showUploadList={false} // 隐藏上传列表
                      maxCount={1} // 限制最多上传一个文件
                    >
                      {uplodBtn}
                    </Upload>
                }
              </div>
            )
          })
            :
            null
        }
        <div className="my-4 flex">
          <button
            className="add-btn"
            onClick={() => addText()}
          >
            添加文本
          </button>
          <button
            className="add-btn ml-4"
            onClick={() => {
              postImgDom();
            }}
          >
            下载图片
          </button>
        </div>
      </div>
      <div className=" px-4">
        <div className=" capture-area " ref={capture}>
          {
            needTitleImg ?
              <div className="capture-title-main" style={{ backgroundImage: `url('${dataobj.titleImg.length ? dataobj.titleImg : `${normalImg}` }')` }}>
                  <p className=" pt-24 "><span className="capture-title-text" data-storke={dataobj.name} >{dataobj.name}</span></p>
                  <p className=" mt-12 "><span className="capture-title-text capture-title-descriptions" data-storke={dataobj.descriptions} >{dataobj.descriptions}</span></p>
              </div>
              : null
          }
          <div>
          {
            dataobj.textArr.length ? dataobj.textArr.map(item =>
              <div key={item.id} className="capture-text-main">
                <p>{item.text}</p>
                {
                  item.textImg.length ?
                    <div className="capture-img">
                      <img src={item.textImg}></img>
                    </div>
                    :
                    null
                }
              </div>
            )
              : null
          }
          </div>
        </div>
      </div>
    </div>
  );
}
