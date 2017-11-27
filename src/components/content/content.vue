<template>
    <div class="content">
        <div class="tab">
            <div class="tab-item">
                <el-button type="text" @click="tableFormVisible = true">创建新的表结构</el-button>
            </div>
            <div class="tab-item" v-for="(item,index) in tableList" :key="index" @click="selectTable(index,item)" :class="{'actived' : index == tabIndex }">
                <span class="tab-link">{{item.structure_name}}</span>
            </div>
            <el-dialog title="添加表结构" :visible.sync="tableFormVisible" :show-close="false">
              <el-form>
                  <el-form-item label="添加表名称" :label-width="formLabelWidth">
                  <el-input v-model="structureName" auto-complete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="添加表结构" :label-width="formLabelWidth">
                    <div class="add-table-title">
                      <h4><span>表结构名称</span></h4>
                      <ul ref="addStructureContent">
                        <li v-for="(item, index) in addStructureArr" :key="index">
                          <input type="text"/>
                        </li>
                        <li>
                          <input type="text" value="附件" readonly="true"/>
                        </li>
                      </ul>
                      <div class="add-item" @click="addItem">
                        <i class="el-icon-plus"></i>
                      </div>
                    </div>
                  </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                  <el-button @click="closeTableStructure">取 消</el-button>
                  <el-button type="primary" @click="setTableStructure">确 定</el-button>
              </div>
            </el-dialog>
            <div class="pages">
            <el-pagination
                small
                layout="prev, pager, next"
                @current-change="handleCurrentChange"
                :page-size="10"
                :total="tabTotal">
            </el-pagination>
            </div>
        </div>
        <div class="detail">
            <div class="addcontent"><el-button @click="showAddTable" type="text">添加表内容</el-button></div>
            <el-dialog title="添加表内容" :visible.sync="contentTableVisible" :show-close="false">
              <el-form :model="contentform">
                <el-form-item v-for="(item, index) in structureTittleE" :key="index" :label="structureField[item]" :label-width="contentLabelWidth">
                  <el-input v-if="(structureField[item] != '附件' && (structureField[item] != '日期' && structureField[item] != '时间'))" v-model="contentform[item]" auto-complete="off"></el-input>
                  <el-date-picker v-if="(structureField[item] == '日期'|| structureField[item] == '时间')"
                    v-model="date" value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                  <div v-if="structureField[item] == '附件'">
                    <div class="row">
                        <input id="fileAttach" type="file" name="file"  style="display: none" />
                        <button id="btnAttach" type="button" >选择附件</button>
                        <input id="AttachFilename" readonly="true" type="text"/>
                    </div>
                    <div class="row">
                        <div class="progress">
                            <div id="Attachbar">
                                根据需要，选择是否上传
                            </div>
                        </div>
                    </div>
                  </div>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="closeTableContent">取 消</el-button>
                <el-button type="primary" @click="addTableContent">确 定</el-button>
              </div>
            </el-dialog>
            <el-dialog title="修改表内容" :visible.sync="updatecontentTableVisible" :show-close="false">
              <el-form :model="contentform">
                <el-form-item v-for="(item, index) in structureTittleE" :key="index" :label="structureField[item]" :label-width="contentLabelWidth">
                  <el-input v-if="structureField[item] != '附件'" v-model="contentform[item]" auto-complete="off"></el-input>
                  <div v-if="structureField[item] == '附件'">
                    <div class="row">
                        <input id="fileAttachChange" type="file" name="file"  style="display: none" />
                        <button id="btnAttachChange" type="button" >选择附件</button>
                        <input id="AttachFilenameChange" readonly="true" type="text"/>
                    </div>
                    <div class="row">
                        <div class="progress">
                            <div id="AttachbarChange">
                                根据需要，选择是否重新上传
                            </div>
                        </div>
                    </div>
                  </div>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="closeUpdateTableContent">取 消</el-button>
                <el-button type="primary" @click="updateTableContent">确 定</el-button>
              </div>
            </el-dialog>
            <el-dialog title="修改表结构" :visible.sync="updateStructureTableVisible" :show-close="false">
              <el-form :model="selectTableStructure">
                  <el-form-item label="名称" :label-width="formLabelWidth">
                    <el-input v-model="selectTableStructure.structure_name" auto-complete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="表结构" :label-width="formLabelWidth">
                    <div class="change-table-title">
                      <h4><span>表结构名称</span></h4>
                      <ul ref="changeStructureContent">
                        <li v-for="(item, index) in changeStructureArr" :key="index">
                          <input type="text"/>
                        </li>
                      </ul>
                      <div class="add-item" @click="changeItem">
                        <i class="el-icon-plus"></i>
                      </div>
                    </div>
                  </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                  <el-button @click="closeUpdateTableStructure">取 消</el-button>
                  <el-button type="primary" @click="updateTableStructure">确 定</el-button>
              </div>
            </el-dialog>
            <div class="table">
                <ul>
                  <li>
                    <el-tooltip v-for="(item, index) in structureTittleC" :key="index" effect="dark" :content="item" placement="bottom">
                      <b>{{item}}</b>
                    </el-tooltip>
                    <el-tooltip effect="dark" content="修改表结构" placement="bottom">
                      <b @click="changeTableStructure()" class="edit"><i class="el-icon-edit"></i></b>
                    </el-tooltip>
                    <el-tooltip effect="dark" content="删除该表" placement="bottom">
                      <b @click="delTableStructure()" class="edit"><i class="el-icon-delete"></i></b>
                    </el-tooltip>
                  </li>
                  <li v-for="(con, max) in tableContent" :key="max">
                    <el-tooltip v-for="(item, index) in structureTittleE"  :key="index" effect="dark" :content="structureTittleC[index] != '附件'?con.content[item]: '下载后查看'" placement="bottom">
                      <b v-if="structureTittleC[index] != '附件'">{{con.content[item]}}</b><b :class="{'download': con.content[item]}" v-if="structureTittleC[index] == '附件'" @click="downloadFile(con.content[item])">{{con.content[item] ? '下载':'无'}}</b>
                    </el-tooltip>
                    <el-tooltip effect="dark" content="修改该条目" placement="bottom">
                      <b class="edit"><i @click="changeTableContent(con._id, con)" class="el-icon-edit"></i></b>
                    </el-tooltip>
                    <el-tooltip effect="dark" content="删除该条目" placement="bottom">
                      <b class="edit"><i @click="delTableContent(con._id)" class="el-icon-delete"></i></b>
                    </el-tooltip>
                  </li>
                  <li class="pages">
                    <div>
                      <el-pagination
                        @current-change="handleContentChange"
                        :current-page.sync="currentContentPage"
                        :page-size="15"
                        layout="total, prev, pager, next"
                        :total="contentPageTotal">
                      </el-pagination>
                    </div>
                  </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import Utils from 'common/js/utils'
import API from 'api/api'

const PageSize = 10;
const ContentPageSize = 15;
const querystring = require('querystring');

export default {
  data () {
    return {
      tableFormVisible : false,
      tabIndex : 0,
      tableList :[],
      formLabelWidth : '110px',
      tabTotal : 0,
      tabCurrentPage : 1,
      structureId : '',
      structureAuthorID : '',
      structureField : {},
      structureTittleC : [],
      structureTittleE : [],
      tableContent : [],
      tableContentId : '',
      contentTableVisible : false,
      updatecontentTableVisible: false,
      updateStructureTableVisible: false,
      contentform : {},
      contentLabelWidth : '110px',
      currentContentPage : 1,
      contentPageTotal : 0,
      selectTableStructure : {},
      addStructureArr: [],
      structureForm: {},
      structureName: '',
      changeStructureArr: [],
      changeStructureForm: {},
      uploadtoken: '',
      date: ''
    }
  },
  computed:{
    token(){
      return Utils.getFromStorage('token')
    },
    userId(){
      return Utils.getFromStorage('userId')
    }
  },
  mounted(){
    this.getTableStructure(this.tabCurrentPage,PageSize);
    this.getuploadToken();
  },
  methods:{
    // 获取上传时的token
    getuploadToken(){
      this.$http({
        url: API.Interface.getuploadToken('sizhiqian@izhixue.cn','JQmvuu4y1fnSd'),
        method: 'GET'
      }).then((res)=>{
        this.uploadtoken = res.data;
      }).catch((error)=>{
        console.log(error)
      })
    },
    // 选择tab
    selectTable(index,item){
        this.structureTittleC = [];
        this.structureTittleE = [];
        this.tabIndex = index;
        this.structureId = item._id;
        this.structureAuthorID = item.author._id;
        this.structureField = item.structure;
        this.getTableContent(this.structureId, this.currentContentPage, ContentPageSize);
        for (let title in this.structureField) {
          this.structureTittleE.push(title);
          this.structureTittleC.push(this.structureField[title]);
          this.contentform[title] = ''
        };
        this.selectTableStructure = item;
    },
    // 添加表结构条目
    addItem(){
      this.addStructureArr.push('')
    },
    // 修改表结构
    changeItem(){
      this.changeStructureArr.push('')
    },
    // 切换表页码
    handleCurrentChange(ev){
      this.tabCurrentPage = ev;
      this.tabIndex = 0;
      this.getTableStructure(this.tabCurrentPage, PageSize)
    },
    // 关闭添加表结构弹框
    closeTableStructure(){
      this.tableFormVisible = false;
      this.structureName = '';
      this.addStructureArr = [];
      this.structureForm = {};
    },
    // 获取表结构
    getTableStructure(page,count){
      this.structureTittleC = [];
      this.structureTittleE = [];
      this.$http({
        url: API.Interface.getTableS(page,count),
        method: 'GET'
      }).then((res)=>{
        if(res.data.code == 0){
          this.tabTotal = res.data.total;
          this.tabCurrentPage = res.data.page;
          this.tableList = res.data.tss;
          if(this.tabIndex == 0){
            this.structureId = this.tableList[0]._id;
            this.structureAuthorID = this.tableList[0].author._id;
            this.selectTableStructure = this.tableList[0];
            this.structureField = this.tableList[0].structure;
            this.getTableContent(this.structureId, this.currentContentPage, ContentPageSize);
            for (let title in this.structureField) {
              this.structureTittleE.push(title);
              this.structureTittleC.push(this.structureField[title]);
              this.contentform[title] = '';
            }
          }else if(this.tabIndex != 0){
              this.structureId = this.tableList[this.tabIndex]._id;
              this.structureAuthorID = this.tableList[this.tabIndex].author._id;
              this.selectTableStructure = this.tableList[this.tabIndex];
              this.structureField = this.tableList[this.tabIndex].structure;
              this.getTableContent(this.structureId, this.currentContentPage, ContentPageSize);
              for (let title in this.structureField) {
                this.structureTittleE.push(title);
                this.structureTittleC.push(this.structureField[title]);
                this.contentform[title] = '';
              }
          }
        }
      }).catch((error)=>{
        console.log(error)
      })
    },
    // 添加表结构
    setTableStructure(){
      let count = 0;
      for(let i = 0, len = this.$refs['addStructureContent'].children.length; i<len; i++){
          let val = this.$refs['addStructureContent'].children[i].children[0].value;
          if(val){
            count += 1;
            this.structureForm[`th${count}`] = val;
          }
      };
      if(this.structureName == ''){
        this.$message({
          message: '表名称不能为空！',
          type: 'warning'
        })
        return;
      };
      this.$http({
        url: API.Interface.createTableS(this.token),
        method: 'POST',
        data: querystring.stringify({
            "name": this.structureName,
            "structure": JSON.stringify(this.structureForm),
            "author": this.userId
        })
      }).then((res)=>{
        if(res.data.code == 0){
          this.$message({
            message: '添加成功!',
            type: 'success'
          });
          this.tableFormVisible = false;
          this.structureName = '';
          this.addStructureArr = [];
          this.getTableStructure(this.tabCurrentPage, PageSize);
        }
      }).catch((error)=>{
        console.log(error)
      })
    },
    // 修改表结构数据处理
    changeTableStructure(){
      this.updateStructureTableVisible = true;
      for(let item in this.selectTableStructure.structure){
        let obj = {};
            obj[item] = this.selectTableStructure.structure[item];
        this.changeStructureArr.push(obj)
      }
      setTimeout(()=>{
        for(let i=0 ,len = this.$refs['changeStructureContent'].children.length; i<len; i++){
          for(let key in this.changeStructureArr[i]){
            this.$refs['changeStructureContent'].children[i].children[0].value = this.changeStructureArr[i][key];
          }
        }
      },200);
    },
    // 修改表结构
    updateTableStructure(){
      let count = 0;
      for(let i=0 ,len = this.$refs['changeStructureContent'].children.length; i<len; i++){
        let val = this.$refs['changeStructureContent'].children[i].children[0].value;
        if(val){
          count += 1;
          this.changeStructureForm[`th${count}`] = val;
        }
      }
      if(Object.getOwnPropertyNames(this.changeStructureForm).length>0){
        this.$http({
          url: API.Interface.updateTableS(this.token),
          method: 'POST',
          data: querystring.stringify({
            "name": this.selectTableStructure.structure_name,
            "structure": JSON.stringify(this.changeStructureForm),
            "id": this.structureId
          })
        }).then((res)=>{
          if(res.data.code==0){
            this.updateStructureTableVisible = false;
            this.$message({
              message: '修改成功!',
              type: 'success'
            });
            this.getTableStructure(this.tabCurrentPage,PageSize)
            this.changeStructureArr = [];
            this.changeStructureForm = {};
          }
        }).catch((error)=>{
          console.log(error)
        })
      }else{
        this.$message({
          message: '表结构内容不能为空!',
          type: 'warning'
        });
      }
    },
    // 删除这张表
    delTableStructure(){
      this.$http({
        url: API.Interface.delTableS(this.structureId, this.token),
        method: 'GET',
      }).then((res)=>{
        if(res.data.code == 0){
          this.$message({
              message: '删除成功!',
              type: 'success'
          });
          if(this.tabIndex == this.tableList.length - 1){
            this.tabIndex = this.tableList.length - 2;
          }
          this.getTableStructure(this.tabCurrentPage,PageSize);
        }
      }).catch((error)=>{
        console.log(error)
      })
    },
    // 关闭更新表结构弹框
    closeUpdateTableStructure(){
      this.updateStructureTableVisible = false;
      this.changeStructureArr = [];
      this.changeStructureForm = {};
    },
    // 获取表结构下内容
    getTableContent(structureId, page, count){
      this.$http({
        url: API.Interface.getTableC(structureId, page, count),
        methods: 'GET'
      }).then((res)=>{
        if(res.data.code==0){
          this.tableContent = res.data.tcs;
          this.contentPageTotal = res.data.total;
          this.currentContentPage = res.data.page;
        }
      }).catch((error)=>{
        console.log(error)
      })
    },
    // 切换内容页面
    handleContentChange(ev){
      this.currentContentPage = ev;
      this.getTableContent(this.structureId, this.currentContentPage, ContentPageSize);
    },
    // 显示表内容弹框
    showAddTable(){
      this.contentTableVisible = true;
      let that = this;
      //选择文件
      this.$nextTick(()=>{
        $('#btnAttach').on('click',function () {
            $('#fileAttach').click();
        })
        //执行上传
        $('#fileAttach').hexUpload({
            cms: 'http://cms.izhixue.cn/',
            token: that.uploadtoken,
            add: function (data) {
                $('#AttachFilename').val(data.files[0].name);
            },
            done: function (data) {
                $('#Attachbar').text('100%');
                that.structureTittleC.forEach((item,index)=>{
                  if(item == "附件"){
                    that.contentform[that.structureTittleE[index]] = '' + data.result.ResourceID;
                  }
                })
            },
            progress: function (data) {
                //执行回调
                var percentVal = Math.round((data.loaded * 100) / data.total).toFixed(2) + '%';
                $('#Attachbar').text(percentVal);
            }
        });
      });
    },
    // 关闭添加表内容弹框
    closeTableContent(){
      this.contentTableVisible = false;
      this.contentform = {};
      this.date = '';
    },
    // 添加表内容
    addTableContent(){
      this.structureTittleC.forEach((item, index)=>{
        if(item == '日期' || item == '时间'){
          this.contentform[this.structureTittleE[index]] = ''+ this.date;
        }
      });
      this.$http({
          url: API.Interface.createTableC(this.token),
          method: 'POST',
          data: querystring.stringify({
              "structureId": this.structureId,
              "content": JSON.stringify(this.contentform),
              "author": this.structureAuthorID
          })
      }).then((res)=>{
        if(res.data.code == 0){
          this.$message({
            message: '添加成功!',
            type: 'success'
          })
          this.contentTableVisible = false;
          this.getTableContent(this.structureId, this.currentContentPage, ContentPageSize);
          this.contentform = {};
          this.date = '';
        }
      }).catch((error)=>{
        console.log(error)
      })
    },
    // 关闭修改表内容弹框
    closeUpdateTableContent(){
        this.updatecontentTableVisible = false;
        this.contentform = {};
    },
    // 改变表内容
    changeTableContent(id, con){
      this.tableContentId = id;
      this.updatecontentTableVisible = true;
      this.contentform = con.content;
      let that = this;
      this.$nextTick(()=>{
        $('#btnAttachChange').on('click',function () {
            $('#fileAttachChange').click();
        })
        //执行上传
        $('#fileAttachChange').hexUpload({
            cms: 'http://cms.izhixue.cn/',
            token: that.uploadtoken,
            add: function (data) {
                $('#AttachFilenameChange').val(data.files[0].name);
            },
            done: function (data) {
                $('#AttachbarChange').text('100%');
                that.structureTittleC.forEach((item,index)=>{
                  if(item == "附件"){
                    that.contentform[that.structureTittleE[index]] = '' + data.result.ResourceID;
                  }
                })
            },
            progress: function (data) {
                //执行回调
                var percentVal = Math.round((data.loaded * 100) / data.total).toFixed(2) + '%';
                $('#Attachbar').text(percentVal);
            }
        });
      });
    },
    // 实际修改表内容
    updateTableContent(){
      this.$http({
        url: API.Interface.updateTableC(this.token),
        method: 'POST',
        data: querystring.stringify({
          "author" : this.userId,
          "content" : JSON.stringify(this.contentform),
          "id" : this.tableContentId,
        })
      }).then((res)=>{
        if(res.data.code == 0){
          this.$message({
            message: '修改成功!',
            type: 'success'
          })
          this.updatecontentTableVisible = false;
          this.getTableContent(this.structureId, this.currentContentPage, ContentPageSize);
          this.contentform = {}
        }
      }).catch((error)=>{
        console.log(error)
      })
    },
    // 删除该条表内容
    delTableContent(id){
      this.$http({
        url: API.Interface.delTableC(id, this.userId, this.token),
        method: 'GET'
      }).then((res)=>{
        if(res.data.code == 0){
          this.$message({
            message: '删除成功!',
            type: 'success'
          })
          this.getTableContent(this.structureId, this.currentContentPage, ContentPageSize);
        }
      }).catch((error)=>{
        console.log(error);
      })
    },
    // 下载文件
    downloadFile(id){
      if(id){
        window.location.href = `http://cms.izhixue.cn/FileManage/DownLoad?resourceID=${id}`;
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.content
  overflow: hidden
  height: 100%
  .tab
    width: 200px
    background: #fff
    float: left
    height: 100%
    position: relative
    overflow-y: auto
    padding-bottom: 24px 
    -webkit-box-sizing: border-box
    -moz-box-sizing: border-box
    -o-box-sizing: border-box
    box-sizing: border-box
    .tab-item
      height: 43px
      padding-left: 10px
      border-bottom: 1px solid #f1f2f7
      line-height: 43px
      color: #333
      font-size: 14px
      cursor: pointer
      -webkit-box-sizing: border-box
      -moz-box-sizing: border-box
      -o-box-sizing: border-box
      box-sizing: border-box
    .add-table-title
      border: 1px solid #d8dce5
      border-radius: 4px
      h4
        span
          display: inline-block
          width: 100%
          text-align: center
          line-height: 30px
      ul
        li
          display: flex
          border-top: 1px solid #d8dce5
          font-size:0
          input
            flex: 1
            height: 30px
            outline: none
            font-size: 14px
            width: 100%
            text-align: center
            -webkit-box-sizing: border-box
            -moz-box-sizing: border-box
            -o-box-sizing: border-box
            box-sizing: border-box
      .add-item
        height: 30px
        line-height: 30px
        text-align: center
        border-top: 1px solid #d8dce5
        cursor: pointer
    .actived
      background: #fafafa
    .pages
      position: fixed
      bottom: 22px
      left: 10px
  .detail
    margin-left: 220px
    p   
      font-size: 14px
      color: #666
      line-height: 20px
    .addcontent
      margin-top: 10px
    .change-table-title
      border: 1px solid #d8dce5
      border-radius: 4px
      h4
        span
          text-align: center
          line-height: 30px
          width: 100%
          display: inline-block
      ul
        li
          display: flex
          border-top: 1px solid #d8dce5
          font-size:0
          input
            flex: 1
            height: 30px
            outline: none
            font-size: 14px
            width: 100%
            text-align: center
            -webkit-box-sizing: border-box
            -moz-box-sizing: border-box
            -o-box-sizing: border-box
            box-sizing: border-box
      .add-item
        height: 30px
        line-height: 30px
        text-align: center
        border-top: 1px solid #d8dce5
        cursor: pointer
    .table
      margin-top: 20px
      background: #fff
      font-size: 16px
      color: #666
      overflow: hidden 
      ul
        border-top: 1px solid #999
        border-left: 1px solid #999
        li
          display: flex
          overflow: hidden
          position: relative
          b 
            flex: 1
            height: 36px
            line-height: 36px
            font-size: 14px
            overflow: hidden
            text-overflow: ellipsis
            white-space: nowrap 
            padding-left: 6px
            padding-right: 6px
            -webkit-box-sizing: border-box
            -moz-box-sizing: border-box
            -o-box-sizing: border-box
            box-sizing: border-box
            text-align: center
            border-right: 1px solid #999
            border-bottom: 1px solid #999
          .download
            color:#409EFF
            cursor: pointer
          .edit
            flex: 0 0 50px
            cursor: pointer
            i
              padding: 10px
        .pages
          border-bottom: 1px solid #999
          border-right: 1px solid #999
          div
            position: relative
            left: 50%
            -webkit-transform: translateX(-50%)
</style>