<template>
  <div class="container">
    <router-view></router-view>
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
    }
  },
  computed: {
    ...mapGetters([
      'loginStatus'
    ])
  },
  mounted(){
    this.getToken();
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
              Utils.saveToStorage('token', res.data.token)
            }
        }).catch((error) => {
            console.log(error);
        });
    }
  },
  components:{
    Login
  }
}
</script>

<style>
.container{
  padding: 20px 12px 20px 12px;
  background: #f1f2f7;
  position: relative;
  height: 100%;
  overflow: hidden;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  -o-box-sizing: border-box;
  box-sizing: border-box;
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
  width: 100%
}
</style>
