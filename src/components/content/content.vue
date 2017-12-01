<template>
    <div class="content">
        <div class="tab">
            <div class="add-item">
                <div @click="tableFormVisible = true">创建表结构</div>
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
                    <div class="add-table-title" ref="addStructureContent">
                      <h4><span>选择类型</span><span>结构名称</span></h4>
                      <draggable element="ul" v-model="addStructureArr" :options="dragOptions" :move="onMove" @start="isDragging=true" @end="isDragging=false">
                        <li v-for="item in addStructureArr" :key="item.timestr" >
                          <select>
                            <option value="text">短文本</option>
                            <option value="textarea">长文本</option>
                            <option value="date">日期</option>
                            <option value="accessory">附件</option>
                          </select>
                          <input type="text"/>
                        </li>
                      </draggable>
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
            <div class="addcontent"><span @click="showAddTable">添加表内容</span></div>
            <el-dialog title="添加表内容" :visible.sync="contentTableVisible" :show-close="false">
              <el-form :model="contentform">
                <el-form-item v-for="(item, index) in structureTittleE" :key="index" :label="structureField[item].value" :label-width="contentLabelWidth">
                  <el-input v-if="structureField[item].type == 'text'" v-model="contentform[item]" auto-complete="off"></el-input>
                  <el-input type="textarea" :rows="3" placeholder="请输入内容" 
                  v-if="structureField[item].type == 'textarea'" 
                  v-model="contentform[item]" auto-complete="off"></el-input>
                  <el-date-picker v-if="structureField[item].type == 'date'"
                    v-model="addDate" value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                  <div v-if="structureField[item].type == 'accessory'">
                    <el-upload
                      class="upload-demo"
                      :action="'http://cms.izhixue.cn/FileManagement/GetUploadUrl?id=' + fileName + '&ssotoken=' + uploadtoken"
                      :on-change="handleChange"
                      :file-list="fileList">
                      <el-button size="small" type="primary">点击上传</el-button>
                      <div slot="tip" class="el-upload__tip">根据需要选择上传,支持多个</div>
                    </el-upload>
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
                <el-form-item v-for="(item, index) in structureTittleE" :key="index" :label="structureField[item].value" :label-width="contentLabelWidth">
                  <el-input v-if="structureField[item].type == 'text'" v-model="contentform[item]" auto-complete="off"></el-input>
                  <el-input type="textarea" :rows="3" placeholder="请输入内容" 
                  v-if="structureField[item].type == 'textarea'" 
                  v-model="contentform[item]" auto-complete="off"></el-input>
                  <el-date-picker v-if="structureField[item].type == 'date'"
                    v-model="changeDate" value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                  <div v-if="structureField[item].type == 'accessory'">
                    <el-upload
                      class="upload-demo"
                      :action="'http://cms.izhixue.cn/FileManagement/GetUploadUrl?id=' + updatefileName + '&ssotoken=' + uploadtoken"
                      :on-change="updatehandleChange"
                      :file-list="updatefileList">
                      <el-button size="small" type="primary">点击上传</el-button>
                      <div slot="tip" class="el-upload__tip">根据需要上传,支持上传多个</div>
                    </el-upload>
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
                      <h4><span>结构类型</span><span>结构名称</span></h4>
                      <ul ref="changeStructureContent">
                        <li v-for="(item, index) in changeStructureArr" :key="index">
                          <select>
                            <option value="text">短文本</option>
                            <option value="textarea">长文本</option>
                            <option value="date">日期</option>
                            <option value="accessory">附件</option>
                          </select>
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
                    <el-tooltip v-for="(item, index) in structureTittleE"  :key="index" effect="dark" :content="structureField[item].type != 'accessory' ? con.content[item]: '下载后查看'" placement="bottom">
                      <b v-if="structureField[item].type != 'accessory'">{{con.content[item]}}</b><b :class="{'download': con.content[item]}" v-if="structureField[item].type == 'accessory'" @click="downloadFile(con.content[item])">{{con.content[item] ? '下载':'无'}}</b>
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
import draggable from 'vuedraggable'
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
      addDate: '',
      changeDate: '',
      editable:true,
      isDragging: false,
      delayedDragging: false,
      fileList: [],
      fileName: '',
      fileids: '',
      updatefileList: [],
      updatefileName: '',
      updatefileids: ''
    }
  },
  computed:{
    dragOptions () {
      return  {
        disabled: !this.editable
      };
    },
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
    // 添加时的图片上传
    handleChange(file, fileList) {
        this.fileName = file.name;
        this.fileList = fileList.slice(-3);
        let idStr = '';
        for(let i = 0; i< this.fileList.length; i++){
          idStr += `,${this.fileList[i].uid}`
        }
        this.fileids = idStr.substring(1);
    },
    // 更新时的图片上传
    updatehandleChange(file, fileList) {
        this.updatefileName = file.name;
        this.updatefileList = fileList.slice(-3);
        let idStr = '';
        for(let i = 0; i< this.updatefileList.length; i++){
          idStr += `,${this.updatefileList[i].uid}`
        }
        this.updatefileids = idStr.substring(1);
    },
    // 拖拽改变位置
    onMove ({relatedContext, draggedContext}) {
      const relatedElement = relatedContext.element;
      const draggedElement = draggedContext.element;
      return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
    },
    // 获取上传时的token
    getuploadToken(){
      this.$http({
        url: API.Interface.getuploadToken('sizhiqian@izhixue.cn','JQmvuu4y1fnSd'),
        method: 'GET'
      }).then((res)=>{
        this.uploadtoken = res.data
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
          this.structureTittleC.push(this.structureField[title].value);
          this.contentform[title] = ''
        };
        this.selectTableStructure = item;
    },
    // 添加表结构条目
    addItem(){
      this.addStructureArr.push({
          timestr: Math.random(), 
          fixed: false
      })
    },
    // 修改表结构条目
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
              this.structureTittleC.push(this.structureField[title].value);
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
                this.structureTittleC.push(this.structureField[title].value);
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
      for(let i = 0, len = this.$refs['addStructureContent'].children[1].children.length; i<len; i++){
          let type = this.$refs['addStructureContent'].children[1].children[i].children[0].value;
          let val = this.$refs['addStructureContent'].children[1].children[i].children[1].value;
          let obj = {};
          obj['type'] = type;
          obj['value'] = val;
          if(val){
            count += 1;
            this.structureForm[`th${count}`] = obj;
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
            this.$refs['changeStructureContent'].children[i].children[0].value = this.changeStructureArr[i][key].type;
            this.$refs['changeStructureContent'].children[i].children[1].value = this.changeStructureArr[i][key].value;
          }
        }
      },200);
    },
    // 修改表结构
    updateTableStructure(){
      let count = 0;
      for(let i=0 ,len = this.$refs['changeStructureContent'].children.length; i<len; i++){
        let type = this.$refs['changeStructureContent'].children[i].children[0].value;
        let val = this.$refs['changeStructureContent'].children[i].children[1].value;
        let obj = {};
        obj['type'] = type;
        obj['value'] = val;
        if(val){
          count += 1;
          this.changeStructureForm[`th${count}`] = obj;
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
            this.selectTableStructure.structure_name = '';
            this.getTableStructure(this.tabCurrentPage,PageSize);
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
      this.structureName = '';
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
    },
    // 关闭添加表内容弹框
    closeTableContent(){
      this.contentTableVisible = false;
      this.contentform = {};
      this.addDate = '';
      this.fileList = [];
      this.fileName = '';
      this.fileids = '';
    },
    // 添加表内容
    addTableContent(){
      for(let item in this.structureField){
        if(this.structureField[item].type == "date"){
          this.contentform[item] = this.addDate;
        }
        if(this.structureField[item].type == "accessory"){
          this.contentform[item] = this.fileids;
        }
      }
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
          this.addDate = '';
          this.fileList = [];
          this.fileName = '';
          this.fileids = '';
        }
      }).catch((error)=>{
        console.log(error)
      })
    },
    // 关闭修改表内容弹框
    closeUpdateTableContent(){
        this.updatecontentTableVisible = false;
        this.contentform = {};
        this.changeDate = '';
        this.updatefileList = [];
        this.updatefileName = '';
        this.updatefileids = '';
    },
    // 改变表内容
    changeTableContent(id, con){
      this.tableContentId = id;
      this.contentform = con.content;
      this.updatecontentTableVisible = true;
      for(let item in this.structureField){
        if(this.structureField[item].type == "date"){
          this.changeDate = this.contentform[item];
        }
      }
    },
    // 实际修改表内容
    updateTableContent(){
      for(let item in this.structureField){
        if(this.structureField[item].type == "date"){
          this.contentform[item] = this.changeDate;
        }
        if(this.structureField[item].type == "accessory"){
          if(this.updatefileids){
            this.contentform[item] = this.updatefileids;
          }
        }
      }
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
          this.contentform = {};
          this.changeDate = '';
          this.updatefileList = [];
          this.updatefileName = '';
          this.updatefileids = '';
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
        let arr = [];
        arr = id.split(',');
        for (let i = 0; i < arr.length; i++) {
          window.location.href = `http://cms.izhixue.cn/FileManage/DownLoad?resourceID=${arr[i]}`;
        }
      }
    }
  },
  components: {
    draggable,
  },
  watch:{
    isDragging (newValue) {
      if (newValue){
        this.delayedDragging= true
        return
      }
      this.$nextTick( () =>{
           this.delayedDragging =false
      })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.content
  padding: 20px 12px 20px 12px
  -webkit-box-sizing: border-box
  -moz-box-sizing: border-box
  -o-box-sizing: border-box
  box-sizing: border-box
  position: absolute
  top: 50px
  bottom: 0
  left: 0
  right: 0
  .tab
    width: 180px
    background: #fff
    height: 100%
    float: left
    position: relative
    overflow-y: auto
    -webkit-box-sizing: border-box
    -moz-box-sizing: border-box
    -o-box-sizing: border-box
    box-sizing: border-box
    .add-item
      height: 43px
      border-bottom: 1px solid #f1f2f7
      text-align: center
      line-height: 43px
      div
        display: inline-block
        height: 26px
        line-height: 24px
        border: 1px solid #00c1de
        display: inline-block
        padding: 0 16px
        cursor: pointer
        font-size: 12px
        color: #00c1de
        &:hover
          background: #00c1de
          color: #fff
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
        display: flex
        span
          flex: 1
          text-align: center
          line-height: 30px
          border-right: 1px solid #d8dce5
          &:last-child
            border-right: none
      ul
        li
          display: flex
          border-top: 1px solid #d8dce5
          font-size:0
          height: 30px
          select
            flex: 1
            border: none
            background: #fff
            outline: none
            font-size: 14px
          input
            flex: 1
            outline: none
            font-size: 14px
            text-align: center
            border-left: 1px solid #d8dce5
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
      bottom: 20px
      left: 10px
  .detail
    margin-left: 200px
    p   
      font-size: 14px
      color: #666
      line-height: 20px
    .addcontent
      margin-top: 10px
      span
        display: inline-block
        height: 26px
        line-height: 24px
        border: 1px solid #00c1de
        display: inline-block
        padding: 0 16px
        cursor: pointer
        font-size: 12px
        color: #00c1de
        &:hover
          background: #00c1de
          color: #fff
    .change-table-title
      border: 1px solid #d8dce5
      border-radius: 4px
      h4
        display: flex
        span
          flex: 1
          text-align: center
          line-height: 30px
          border-right: 1px solid #d8dce5
          &:last-child
            border-right: none
      ul
        li
          display: flex
          border-top: 1px solid #d8dce5
          font-size:0
          height: 30px
          select
            flex: 1
            border: none
            background: #fff
            outline: none
            font-size: 14px
          input
            flex: 1
            outline: none
            font-size: 14px
            text-align: center
            border-left: 1px solid #d8dce5
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
            color: #00c1de
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