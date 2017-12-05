<template>
  <div class="container">
    <div class="header">
      <div class="logo">项目申报管理</div>
      <div class="user">
        <div class="user-handle">
          <div class="user-name" @mouseenter="showQuit" @mouseleave="hideQuit">
            <span>{{userName ? userName : '用户名'}}</span>
            <i class="el-icon-caret-bottom"></i>
          </div>
          <div class="user-quit" v-show="quitShow" @mouseenter="clearTimer" @mouseleave="hideQuit">
            <span @click="quitSystem">退出登录</span>
          </div>
        </div>
      </div>
    </div>
    <router-view></router-view>
    <div class="footer">关于我们</div>
    <login v-show="loginStatus"></login>
  </div>
</template>

<script>
import Login from 'components/login/login'
import Utils from 'common/js/utils'
import API from 'api/api'
import {mapMutations, mapGetters} from 'vuex'

const Base64 = require('js-base64').Base64;
const timeStr = Math.round(new Date().getTime() / 1000);

export default {
  data(){
    return {
      quitShow: false,
      timer: '',
      userName: ''
    }
  },
  computed: {
    ...mapGetters([
      'loginStatus',
    ])
  },
  mounted(){
    this.getToken();
    this.getUserName();
  },
  methods:{
    getToken(){
      this.$http.get(API.Interface.getToken(),{
          params: {
            userId: API.USERID,
            sign: Base64.encode(API.SECRET + timeStr)
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((res)=>{
            if(res.data.code == 0){
              Utils.saveToStorage('token', res.data.token);
            }
        }).catch((error) => {
            console.log(error);
        });
    },
    showQuit(){
      this.quitShow = true;
    },
    hideQuit(){
      this.timer = setTimeout(()=>{
        this.quitShow = false;
      },500)
    },
    clearTimer(){
      clearTimeout(this.timer)
    },
    quitSystem(){
      this.changeLoginShow(true);
      Utils.saveToStorage('userEmail', '');
      Utils.saveToStorage('userId', '');
    },
    getUserName(){
      if(Utils.getFromStorage('userEmail')){
        this.userName = (Utils.getFromStorage('userEmail')).split('@')[0]
      }
    },
    ...mapMutations({
      changeLoginShow: 'SET_LOGIN'
    })
  },
  components:{
    Login
  },
  watch:{
    loginStatus(){
      this.getUserName();
    }
  }
}
</script>

<style>
.container{
  background: #f5f5f6;
  position: relative;
  height: 100%;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  -o-box-sizing: border-box;
  box-sizing: border-box;
}
.container .header{
  height: 50px;
  line-height: 50px;
  background: #373d41;
  padding-left: 22px;
  padding-right: 22px;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  -o-box-sizing: border-box;
  box-sizing: border-box;
  display: flex;
}
.container .header .logo{
  flex: 1;
  font-size: 14px;
  color: #fff;
}
.container .header .user{
  flex: 0 0 120px;
  text-align: center;
  color: #fff;
}
.container .header 
.user .user-handle{
  cursor: pointer;
  position: relative;
}
.container .header 
.user .user-name:hover{
  background: #2b2f32;
}
.container .header 
.user .user-handle
.user-quit{
  position: absolute;
  top: 100%;
  right: 0px;
  width: 150px;
  background: #fff;
  z-index: 100;
}
.container .header 
.user .user-handle
.user-quit span{
  height: 50px;
  line-height: 50px;
  display: block;
  font-size: 14px;
  cursor: pointer;
  text-align: center;
  color: #333;
}
.container .header 
.user .user-handle
.user-quit span:hover{
  color:#999;
}
.container .footer{
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40px;
  line-height: 40px;
  letter-spacing: 1px;
  background: #42485B;
  font-size: 16px;
  color: #fff;
  text-align: center;
}
.self-button{
  display: inline-block;
  height: 26px;
  line-height: 24px;
  border: 1px solid #00c1de;
  display: inline-block;
  padding: 0 16px;
  cursor: pointer;
  font-size: 12px;
  color: #00c1de;
  border-radius: 4px;
}
.self-button:hover{
  background: #00c1de;
  color: #fff;
}
.el-table th, .el-table td{
  padding: 0;
}
.el-table__body-wrapper{
  overflow: hidden;
}
.el-table .cell{
  line-height: 30px;
}
.el-table th>.cell{
  overflow: hidden;
  white-space: nowrap;
}
.el-table td>.cell{
  overflow: hidden;
  white-space: nowrap;
}
.el-date-editor.el-input, 
.el-date-editor.el-input__inner{
  width: 100%;
}
.el-pager li.active{
  color: #00c1de;
}
</style>
