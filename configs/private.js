//私有配置
module.exports = {
    picPath: 'https://gulu.peersafe.cn/imgofupload/', //图片上传地址（系统部署的对外地址及端口，即后台运行的地址）此为对外开放的图片路径地址
    picUploadPath: '/home/guluchain_web/html/imgofupload/', //图片上传时存储在后台的相对路径

    cocoService: {},
    
    // 数据库配置
    database: {
        DATABASE: 'turbo_dev',
        USERNAME: 'root',
        PASSWORD: 'root',
        PORT: '3306',
        HOST: 'localhost'
    }
};
