<template>
    <div class="login-register">
      <div class="card-content">
        <div class="card-title"><span @click="selectType(1)" :class="selected == 1 ? 'checked' : ''">登录</span><span @click="selectType(2)" :class="selected == 2 ? 'checked' : ''">注册</span></div>
        <div class="login" v-show="selected == 1">
          <el-input placeholder="请输入邮箱" v-model="Lemail" class="input">
          </el-input>
          <el-input v-model="Lpassword" placeholder="请输入密码" type="password" class="input" @keyup.enter.native="login"></el-input>
          <div class="primary">
            <el-button type="primary" class="btn" @click="login">登录</el-button>
          </div>
        </div>
        <div class="register" v-show="selected == 2">
          <el-input placeholder="请输入邮箱" v-model="Remail" class="input">
          </el-input>
          <el-input v-model="Rpassword" placeholder="请输入密码" type="password" class="input" @keyup.enter.native="register"></el-input>
          <div class="primary">
            <el-button type="primary" class="btn" @click="register">注册</el-button>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import API from 'api/api'
import Utils from 'common/js/utils'
import {mapMutations} from 'vuex'

const querystring = require('querystring');

export default {
  data(){
    return {
      Lemail: '',
      Lpassword: '',
      Remail : '',
      Rpassword: '',
      selected: 1
    }
  },
  computed: {
    getToken(){
      return Utils.getFromStorage('token')
    }
  },
  mounted() {
    if(Utils.getFromStorage('userId')){
      this.changeLoginShow(false);
    }
  },
  methods: {
    selectType(type){
      this.selected = type
    },
    login(){
      if(this.Lemail.length && this.Lpassword.length){
        this.$http({
          url: API.Interface.login(this.getToken),
          method: 'POST',
          data: querystring.stringify({
            email: this.Lemail,
            password: this.Lpassword
          })
        }).then((res)=>{
            if(res.data.code == 0){
              this.$message({
                message: '登陆成功!',
                type: 'success'
              });
              this.changeLoginShow(false);
              Utils.saveToStorage('userId', res.data.userId);
            }else if(res.data.code == 10003){
              this.$message.error('找不到用户!');
            }else if(res.data.code == 10007){
              this.$message.error('密码错误!');
            }
            
        }).catch((error)=>{
            console.log(error)
        });
      }else{
        this.$message.error('邮箱和密码不能为空!');
      }
      
    },
    register(){
      this.$http({
        url: API.Interface.register(this.getToken),
        method: 'POST',
        data: querystring.stringify({
          email: this.Remail,
          password: this.Rpassword,
          type: 'none',
          site: 'izhixue.cn'
        })
      }).then((res)=>{
        if(res.data.code == 0){
          this.$message({
            message: '恭喜你，注册成功!',
            type: 'success'
          });
          Utils.saveToStorage('userId', res.data.userId)
          this.changeLoginShow(false);
        }else if(res.data.code == 10008){
          this.$message.error('用户已存在!');
        }
      }).catch((error)=>{
        console.log(error)
      })
    },
    ...mapMutations({
      changeLoginShow: 'SET_LOGIN'
    })
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.login-register
  position: absolute
  top: 0
  left: 0
  bottom: 0
  width: 100%
  z-index: 999
  background: #e1e1e1
  background-size: auto
  display: flex
  justify-content: center
  align-items: center
  .card-content
    width: 268px
    height: 285px
    background: #fff
    padding: 20px;
    border-radius: 0 0 2px 2px
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, .05), 0 3px 1px -2px rgba(0, 0, 0, .08), 0 1px 5px 0 rgba(0, 0, 0, .08);
    .card-title
      span
        line-height: 24px
        font-size: 13px
        font-weight: 700
        display: inline-block
        margin-right: 30px
        margin-bottom: 20px
        border-bottom: 2px solid #fff
        text-transform: uppercase
        color: rgba(0, 0, 0, .54)
        cursor: pointer
        padding-left: 10px
        padding-right: 10px
      .checked
        border-bottom: 2px solid #409eff
    .input
      margin-bottom: 25px
    .primary
      text-align: right
      .btn
        letter-spacing: 1px
        font-size: 13px
</style>
