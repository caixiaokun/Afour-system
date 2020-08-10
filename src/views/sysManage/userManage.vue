<template>
  <div>
    <!-- 表单 -->
    <el-row>
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="SeachForm">
            <el-col :span="6">
                <el-form-item label="登陆名称:">
                    <el-input v-model="SeachForm.username" placeholder="登陆名称" ></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="手机号码:">
                     <el-input v-model="SeachForm.phone" placeholder="手机号码" ></el-input>
                </el-form-item>
            </el-col>
             <el-col :span="6">
                <el-form-item label="上级id:">
                    <el-input v-model="SeachForm.templateName" placeholder="上级id" ></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="用户状态:">
                    <el-select v-model="SeachForm.status" clearable >
                        <el-option v-for="(item, index ) in userStauts" :key="index"  :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="创建时间:">
                   <el-date-picker v-model="SeachForm.startcreatedate" type="date" placeholder="选择开始日期"></el-date-picker>
                   <el-date-picker v-model="SeachForm.endcreatedate" type="date" placeholder="选择结束日期"></el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="opeattionClass">
                  <el-button size="small" type="info" icon="el-icon-search" @click="search()">查询</el-button>
                  <el-button size="small" type="success" icon="el-icon-refresh">重置</el-button>
              </el-form-item>
            </el-col>
            </el-form>
        </el-col>
    </el-row>
    <!-- 按钮区 -->
    <el-row class='operate-btns mt20'>
      <el-button size="small" type="success" @click="Opendialog" icon="el-icon-plus">新增</el-button>
      <el-button size="small" type="danger" @click="moreDel" icon="el-icon-delete">批量删除</el-button>
    </el-row>
    <!-- 表格 -->
    <el-row class="mt20">
        <el-table max-height="680"
            ref="multipleTable" row-key="id"  @selection-change="handleSelectionChange"
            :data="dataList" border tooltip-effect="dark" style="width: 100%"
            v-loading="tableLoading" element-loading-text="拼命加载中">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column type="index" fixed label="序号" width="50" header-align="center" align="center"/>
            <el-table-column prop="id" fixed label="用户id" show-overflow-tooltip header-align="center" align="center"/>
            <el-table-column prop="username" fixed  label="登陆名称" show-overflow-tooltip  header-align="center" align="center"/>
            <el-table-column prop="identity"  label="身份" show-overflow-tooltip :formatter="formatDel" header-align="center" align="center"/>
            <el-table-column prop="superior"  label="上级"   show-overflow-tooltip  header-align="center" align="center"/>
            <el-table-column prop="organname"  label="部门名称" show-overflow-tooltip  header-align="center" align="center"/>
            <el-table-column label="状态" align="center">
                <template slot-scope="scope">
                    <el-button type="text" v-if="scope.row.status==1" size="mini">正常</el-button>
                    <el-button type="text" v-else size="mini">失效</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="createdate" label="创建时间" show-overflow-tooltip  header-align="center" align="center"/>
            <el-table-column prop="remarks" label="备注" show-overflow-tooltip  header-align="center" align="center"/>
            <el-table-column fixed="right" label="操作" min-width="200" align="center">
                <template slot-scope="scope" >
                    <el-button type="text"  size="mini" style="color:green;" @click="EditUser(scope.row)">编辑</el-button>
                    <el-button type="text" size="mini"><span style="color:red;" @click="DelUser(scope.row)">删除</span></el-button>
                    <el-button type="text" size="mini" @click="OpendRateialog(scope.row)">修改汇率</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" class="toolbar col-pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentPageChange"
            :current-page="SeachForm.pageNum"
            :page-sizes="[10, 50, 100, 200]"
            :page-size="SeachForm.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </el-col>
    </el-row>
    <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormUser">
        <el-form :model="UserForm" label-width="85px" >
            <el-form-item label="登陆名称:">
                <el-input v-model="UserForm.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="部门名称:" >
                 <el-cascader  v-model="UserForm.organid" :checkStrictly="false"
                    :emitPath="false"
                    :props="OrganizaProps" :options="OrganizationTree">
                 </el-cascader>
            </el-form-item>
            <el-form-item label="密码:" >
                <el-input v-model="UserForm.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="手机:" >
                <el-input v-model="UserForm.phone" autocomplete="off"></el-input>
            </el-form-item>
             <el-form-item label="邮箱:" >
                <el-input v-model="UserForm.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="性别:" >
                <el-select v-model="UserForm.sex" clearable >
                     <el-option v-for="(item, index ) in sexoptions" :key="index"  :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态:" >
                <el-select v-model="UserForm.status" clearable >
                     <el-option v-for="(item, index ) in userStauts" :key="index"  :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="身份:">
                <el-radio-group v-model="UserForm.identity">
                    <el-radio label="0">商户</el-radio>
                    <el-radio label="1">码商</el-radio>
                    <el-radio label="2">管理员</el-radio>
                    <el-radio label="3">通道接口方</el-radio>
                    <el-radio label="4">开发员</el-radio>
                </el-radio-group>
            </el-form-item>
             <el-form-item label="备注:" >
                <el-input v-model="UserForm.remarks" type="textarea" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="dialogFormUser = false">取 消</el-button>
                <el-button type="primary" @click="conforim">确 定</el-button>
            </el-form-item>
        </el-form>
       
    </el-dialog>
    <!-- 修改费率 -->
    <el-dialog title="修改汇率" :visible.sync="dialogFormRate">
      <el-form label-width="115px" class="upadteClass">
       <div v-for="(obj,kk) in RateObj" :key="kk" >
        <el-form-item :label='obj.getwayname+": "' >
           <el-input v-model="obj.exchangeRate" type="number" autocomplete="off"></el-input>
        </el-form-item>
       </div>
        <el-form-item>
            <el-button @click="dialogFormRate = false">取 消</el-button>
            <el-button type="primary" @click="Rateconforim">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
</div>
</template>

<script>
export default {
  data() {
    return {
        SeachForm:{//表单
            username: "",
            phone:"",
            status:"",
            startcreatedate:"",
            endcreatedate:"",
            pageIndex:1,
            pageSize:10,
        },
        OrganizaProps:{
        children:"childDept",
        value: 'id',
        label: 'name',

        },
        dialogFormUser:false,
        dialogFormTitle:"添加用户",
        UserForm:{
            email: "",
            id: "",
            identity: "",
            organid: "",
            password: "",
            phone: "",
            remarks: "",
            sex: "",
            status: "",
            superior: "",
            username: ""
        },
        userStauts:[
        {label:"正常",value:"1"},
        {label:"无效",value:"0"}
        ],
        sexoptions:[
        {label:"男",value:"1"},
        {label:"女",value:"0"}
        ],
        total:0,
        OrganizationTree:[],
        dataList:[],
        tableLoading:false,
        multipleData:[],
        dialogFormRate:false,
        RateObj:{},
        
    };
  },
  mounted(){
    this.search()
    this.getOrganizationTree()
  },
  methods: {
    formatDel(row, column){
        if(column.property=="identity"){
          if( row.identity ==0  ){
            return "商户";
          }else if( row.identity == 1 ){
            return "码商";
          }else if( row.identity == 2 ){
            return "管理员";
          }else if( row.identity == 3 ){
            return "通道接口方";
          }else if( row.identity == 4 ){
            return "开发员";
          }
        }
    },
    handleSelectionChange(val){
        this.multipleData = val
    },
    OpendRateialog(row){
        var that = this
        that.Httpclient({
                url:'/api/user/findExchangeRate?userId='+row.id,
                data:{},
                method: "get"
            }).then(res => {
                if(res.code==0){
                that.RateObj = res.data
                that.dialogFormRate = true
                }
        })
    },
    Rateconforim(){
      var that = this
      let　ajaxObj = that.RateObj
      that.Httpclient({
          url:'/api/user/updateExchangeRate',
          data:ajaxObj,
          method: "POST"
      }).then(res => {
          if(res.code==0){
              this.$message({ message: '操作成功',type: 'success'})
              that.dialogFormRate = false
              this.search()
          }
      })
    },
    // 获取机构数据
    getOrganizationTree(){
        var that = this
        that.Httpclient({
                url:'/api/organization/selectTree',
                data:{},
                method: "get"
        }).then(res => {
            if(res.code==0){
                console.log(res.data)
                that.OrganizationTree = that.delgetTreeData(res.data)
            }
        })
    },
    // 递归判断列表，把最后的children设为undefined
    delgetTreeData(data){
      for(var i=0;i<data.length;i++){
        if(data[i].childDept.length<1){
          // children若为空数组，则将children设为undefined
          data[i].childDept=undefined;
        }else {
          // children若不为空数组，则继续 递归调用 本方法
          this.delgetTreeData(data[i].childDept);
        }
      }
      return data;
    },
    // 寻找父节点id
    findAncestry (arr, id) {
        let stack = [];
        let going = true;
        let walker = (arr, id) => {
            arr.forEach(item => {
                if (!going) return;
                stack.push(item['id']);
                if (item['id'] === id) {
                    going = false;
                } else if (item['childDept']) {
                    walker(item['childDept'], id);
                } else {
                    stack.pop();
                }
            });
            if (going) stack.pop();
        }
        walker(arr, id);
        return stack
    },
    Opendialog(){
        this.dialogFormTitle = "添加用户"
        this.UserForm={
            email: "",
            id: "",
            identity: "",
            organid: "",
            password: "",
            phone: "",
            remarks: "",
            sex: "",
            status: "",
            superior: "",
            username: ""
        }
        this.dialogFormUser = true

    },
    // 编辑用户
    EditUser(row){
        var that = this
        that.dialogFormTitle = "编辑用户"
        that.UserForm={
            email: row.email,
            id: row.id,
            identity: row.identity,
            organid: that.findAncestry(that.OrganizationTree,row.organid),
            password: row.password,
            phone: row.phone,
            remarks: row.remarks,
            sex: row.sex,
            status: row.status,
            superior: row.superior,
            username: row.username
        }
        that.dialogFormUser = true

    },
    //删除用户
    DelUser(row){
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           this.Httpclient({
            url:'/api/user/delete',
            data: row.id,
            method: "delete"
            }).then(res => {
                if(res.code==0){
                    this.$message({ message: '操作成功',type: 'success'})
                    this.search()
                }
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    //批量删除
    moreDel(){
        var  that = this
        if(that.multipleData.length==0){
            that.$message.warning('请先勾选需要删除的记录')
            return false
        }
        let objData = []
        that.multipleData.forEach(element => {
            objData.push(element.id)
        });
        that.Httpclient({
            url:'/api/user/deleteByIds',
            data:objData,
            method: "POST"
        }).then(res => {
            if(res.code==0){
                that.dialogFormUser = false
                this.$message({ message: '批量操作成功',type: 'success'})
                this.search()
            }
        })
    },
    conforim(){
        var that = this
        let ajaxObj = that.UserForm
            ajaxObj.organid = that.UserForm.organid[that.UserForm.organid.length-1]
            ajaxObj.superior =""
        
        that.Httpclient({
            url:'/api/user/saveOrUpdate',
            data:ajaxObj,
            method: "POST"
        }).then(res => {
            if(res.code==0){
                that.dialogFormUser = false
                this.$message({ message: '操作成功',type: 'success'})
                this.search()
            }
        })
    },
    search(){
        var that = this
        that.tableLoading =true
        that.Httpclient({
            url:'/api/user/selectAll?'+that.changAJaxparm(),
            data:{},
            method: "get"
        }).then(res => {
            that.tableLoading =false
            if(res.code==0){
                that.dataList = res.data.list
                that.total = res.data.total
            }
        })
    },
    changAJaxparm(){
        let ss = ""
        for(let key in this.SeachForm){
            if(this.SeachForm[key]!=""){
                ss+=key+"="+this.SeachForm[key]+"&"
            }
        }
        return ss.slice(0,ss.length-1)
    },
    //表格每页显示数据量变更
    handleSizeChange (val) {
        this.SeachForm.pageSize = val;
        this.search();
    },
    //第几页切换
    handleCurrentPageChange(val) {
        this.SeachForm.pageNum= val;
        this.search();
    },

  }
};
</script>

<style>
  /*表格的操作按钮样式的*/
  .operate-btns{
    margin-top: 12px;
  }

  .operate-btns button.el-button{
    float: left;
    margin-right: 8px;
    margin-left: 0;
    margin-bottom: 12px;
  }
  .operate-btns .tips{
    vertical-align: middle;
  }
  .opeattionClass{
    margin-left: 20px;
  }
  .mt20{
    margin-left: 20px;
    min-width: 0;
  }
</style>