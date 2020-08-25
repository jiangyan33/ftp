const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uuidv4 = require('uuid/v4');
const http = require('http');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let date = new Date();
        let folder = req.query.path ? req.query.path : `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`;
        // 判断环境
        if (!req.query.path) {
            let env = req.query.env ? 'img_prod' : 'img_dev';

            folder = `${env}/${folder}`;
        }
        folder = path.join(__dirname, `./public/upload/${folder}`);
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }
        cb(null, path.join(folder));
    },
    filename: function (req, file, cb) {
        var fileName = undefined;
        if (req.query.path) {
            fileName = file.originalname;
            // 如果文件已经存在，会自动覆盖文件
        } else {
            fileName = uuidv4() + "." + file.originalname.substring(file.originalname.lastIndexOf('.') + 1);
        }
        cb(null, fileName);
    }
})

let upload = multer({ storage: storage });

let app = express();

const server = http.createServer(app);

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    //跨域问题, 有个第三方库https://github.com/expressjs/cors
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "token,Content-Type");
    res.header("Access-Control-Max-Age", 1728000);
    if (req.method == 'OPTIONS') {
        res.send(true);
    } else {
        next();
    }
});

app.use('/uploadFile', upload.single('file'), (req, res) => {
    let return_data = {
        success: 1, //0表示上传失败;1表示上传成功
        message: "上传成功",
        // url: "图片地址" //上传成功时才返回
    };
    try {
        return_data['url'] = 'http://120.79.185.158:3999' + req.file.path.substring(req.file.path.indexOf('/upload'));
        console.log(`文件上传成功,完成时间:${new Date().toLocaleString()}`);
    } catch (error) {
        return_data.success = 0;
        return_data.message = error;
    }
    return res.json(return_data);
});

server.on('error', console.error);

// 启动服务
server.listen(3999, () => console.log(`文件服务器项目启动成功,启动时间:${new Date().toLocaleString()} please click\n http://127.0.0.1:3999`));

// 进程事件的监听
process.on('uncaughtException', error => { // 未捕获的异常事件
    console.log(`[App] 发现一个未处理的异常: ${error}`);
}).on('unhandledRejection', (reason, p) => { // 未处理的rejection事件
    console.log(`[App] 发现一个未处理的rejection: ${p},原因: ${reason}`);
});