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
                      <h4><span>表结构名称(英文)</span><span>表结构名称(中文)</span></h4>
                      <ul ref="addStructureContent">
                        <li v-for="(item, index) in addStructureArr" :key="index">
                          <input type="text"/><input type="text"/>
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
            <p><br>
            &nbsp;&nbsp;&nbsp;&nbsp;包括营业执照/组织机构代码证/信用等级证书、高新技术证书、质量认证证书、信用等级证明等；以及与项目方向相关的重点实验室、国家工程中心、工程实验等。<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;其中，营业执照/组织机构代码证/信用等级证书是所有单位必须要提供的材料。<br>
            &nbsp;&nbsp;&nbsp;&nbsp;项目牵头单位需要提供近两年审计报告。</p>
            <div class="addcontent"><el-button @click="contentTableVisible = true" type="text">添加表内容</el-button></div>
            <el-dialog title="添加表内容" :visible.sync="contentTableVisible">
              <el-form :model="contentform">
                <el-form-item v-for="(item, index) in structureTittleE" :key="index" :label="structureField[item]" :label-width="contentLabelWidth">
                  <el-input v-model="contentform[item]" auto-complete="off"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="contentTableVisible = false">取 消</el-button>
                <el-button type="primary" @click="addTableContent">确 定</el-button>
              </div>
            </el-dialog>
            <el-dialog title="修改表内容" :visible.sync="updatecontentTableVisible">
              <el-form :model="contentform">
                <el-form-item v-for="(item, index) in structureTittleE" :key="index" :label="structureField[item]" :label-width="contentLabelWidth">
                  <el-input v-model="contentform[item]" auto-complete="off"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="updatecontentTableVisible = false">取 消</el-button>
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
                      <h4><span>表结构名称(英文)</span><span>表结构名称(中文)</span></h4>
                      <ul ref="changeStructureContent">
                        <li v-for="(item, index) in changeStructureArr" :key="index">
                          <input type="text"/><input type="text"/>
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
                  </li>
                  <li v-for="(con, max) in tableContent" :key="max">
                    <el-tooltip v-for="(item, index) in structureTittleE" :key="index" effect="dark" :content="con.content[item]" placement="bottom">
                      <b>{{con.content[item]}}</b>
                    </el-tooltip>
                    <el-tooltip effect="dark" content="修改该条目" placement="bottom">
                      <b class="edit" @click="changeTableContent(con._id, con)"><i class="el-icon-edit"></i></b>
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
            <!-- <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              multiple
              :limit="3"
              :on-exceed="handleExceed"
              :file-list="fileList">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload> -->
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
        // fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, 
        // {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}]
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
    this.getTableStructure(this.tabCurrentPage,PageSize)
  },
  methods:{
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
    // 切换内容页面
    handleContentChange(ev){
      this.currentContentPage = ev;
      this.getTableContent(this.structureId, this.currentContentPage, ContentPageSize);
    },
    // 关闭添加表结构弹框
    closeTableStructure(){
      this.tableFormVisible = false;
      this.structureName = '';
      this.addStructureArr = [];
      this.structureForm = {};
    },
    // 添加表结构
    setTableStructure(){
      for(let i=0 ,len = this.$refs['addStructureContent'].children.length; i<len; i++){
        let key = this.$refs['addStructureContent'].children[i].children[0].value;
        let val = this.$refs['addStructureContent'].children[i].children[1].value;
        if( key && val ){
          this.structureForm[key] = val;
        }
      }
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
          this.structureForm = {};
          this.getTableStructure(this.tabCurrentPage, PageSize);
        }
      }).catch((error)=>{
        console.log(error)
      })
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
          }
        }
      }).catch((error)=>{
        console.log(error)
      })
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
    // 添加表内容
    addTableContent(){
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
          this.contentform = {}
        }
      }).catch((error)=>{
        console.log(error)
      })
    },
    //改变表内容
    changeTableContent(id, con){
      this.tableContentId = id;
      this.updatecontentTableVisible = true;
      this.contentform = con.content;
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
            this.$refs['changeStructureContent'].children[i].children[0].value = key;
            this.$refs['changeStructureContent'].children[i].children[1].value = this.changeStructureArr[i][key];
          }
        }
      },200);
    },
    // 修改表结构
    updateTableStructure(){
      for(let i=0 ,len = this.$refs['changeStructureContent'].children.length; i<len; i++){
        let key = this.$refs['changeStructureContent'].children[i].children[0].value;
        let val = this.$refs['changeStructureContent'].children[i].children[1].value;
        if(key && val){
          this.changeStructureForm[key] = val;
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
            setTimeout(()=>{
              if(this.tabIndex != 0){
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
            },200);
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
    //关闭更新表结构弹框
    closeUpdateTableStructure(){
      this.updateStructureTableVisible = false;
      this.changeStructureArr = [];
      this.changeStructureForm = {};
    },
    // 关于文件上传
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
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
        display: flex
        span
          flex: 1
          border-right: 1px solid #d8dce5
          text-align: center
          line-height: 30px
          &:last-child
            border-right: none
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
            padding-left: 5px
            -webkit-box-sizing: border-box
            -moz-box-sizing: border-box
            -o-box-sizing: border-box
            box-sizing: border-box
            border-right: 1px solid #d8dce5
            &:last-child
              border-right: none
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
        display: flex
        span
          flex: 1
          border-right: 1px solid #d8dce5
          text-align: center
          line-height: 30px
          &:last-child
            border-right: none
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
            padding-left: 5px
            -webkit-box-sizing: border-box
            -moz-box-sizing: border-box
            -o-box-sizing: border-box
            box-sizing: border-box
            border-right: 1px solid #d8dce5
            &:last-child
              border-right: none
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
          .edit
            flex: 0 0 60px
            cursor: pointer
        .pages
          border-bottom: 1px solid #999
          border-right: 1px solid #999
          div
            position: relative
            left: 50%
            -webkit-transform: translateX(-50%)
</style>