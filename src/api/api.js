const DOMAIN = 'http://ucenter.izhixue.cn:666';
// const DOMAIN = 'http://192.168.0.88:8090';
const iZhixue = {
    USERID : '5a03b049088bb628386215f9',
    SECRET : 'XzpJyyIvnx0EAkgy',
    // USERID : '59af60e7524ac5661865b709',
    // SECRET : 'CF98zGDLJ5btq4o7',
    Interface: {
        // 获取token
        getToken(){
            return `${DOMAIN}/token/create`
        },
        // 登录
        login(token){
            return `${DOMAIN}/sessions/create?token=${token}`
        },
        // 注册
        register(token){
            return `${DOMAIN}/users/create?token=${token}`
        },
        // 获取所有表结构
        getTableS(page, count){
            return `${DOMAIN}/table/structure/getall?page=${page}&count=${count}`
        },
        // 创建表
        createTableS(token){
            return `${DOMAIN}/table/structure/create?token=${token}`
        },
        // 更新表结构
        updateTableS(token){
            return `${DOMAIN}/table/structure/update?token=${token}`
        },
        // 删除表
        delTableS(id,token){
            return `${DOMAIN}/table/structure/remove?id=${id}&token=${token}`
        },
        // 获取表下内容
        getTableC(structureId,page,count){
            return `${DOMAIN}/table/content/bystructure?structureId=${structureId}&page=${page}&count=${count}`
        },
        // 添加表内容
        createTableC(token){
            return `${DOMAIN}/table/content/create?token=${token}`
        },
        // 修改表内容
        updateTableC(token){
            return `${DOMAIN}/table/content/update?token=${token}`
        },
        // 删除表内容
        delTableC(id, author, token){
            return `${DOMAIN}/table/content/remove?id=${id}&author=${author}&token=${token}`
        },
        // 获取上传时的token
        getuploadToken(email, password){
            return `http://api.izhixue.cn/Account/Login?email=${email}&password=${password}`
        }
    },
}

export default iZhixue;