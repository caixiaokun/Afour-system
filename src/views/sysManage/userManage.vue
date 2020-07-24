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
      <el-button size="small" type="success" @click="dialogFormUser=true" icon="el-icon-plus">新增</el-button>
      <el-button size="small" type="warning" icon="el-icon-edit">修改</el-button>
      <el-button size="small" type="warning" icon="el-icon-download">导出</el-button>
       <el-button size="small" type="danger" icon="el-icon-delete">删除</el-button>
    </el-row>
    <!-- 表格 -->
    <el-row class="mt20">
        <el-table max-height="680"
            ref="multipleTable" row-key="id"
            :data="dataList" border tooltip-effect="dark" style="width: 100%"
            v-loading="tableLoading" element-loading-text="拼命加载中">
            <el-table-column  type="selection" width="55"></el-table-column>
            <el-table-column type="index" fixed label="序号" width="50" header-align="center" align="center"/>
            <el-table-column prop="id" fixed label="用户id" show-overflow-tooltip header-align="center" align="center"/>
            <el-table-column prop="username" fixed label="登陆名称" show-overflow-tooltip  header-align="center" align="center"/>
            <el-table-column prop="identity" fixed label="身份" show-overflow-tooltip  header-align="center" align="center"/>
             <el-table-column prop="superior" fixed label="上级" show-overflow-tooltip  header-align="center" align="center"/>
            <el-table-column prop="organid" fixed label="上上级" show-overflow-tooltip  header-align="center" align="center"/>
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
                    <el-button type="text"  size="mini">编辑</el-button>
                    <el-button type="text" size="mini"><span style="color:red;">删除</span></el-button>
                    <el-button type="text" size="mini">重置</el-button>
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
    <el-dialog title="添加用户" :visible.sync="dialogFormUser">
        <el-form :model="UserForm" label-width="85px" >
            <el-form-item label="登陆名称:">
                <el-input v-model="UserForm.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="部门名称:" >
                 <el-cascader  v-model="UserForm.regionid" :checkStrictly="false"
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
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="conforim">确 定</el-button>
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
      UserForm:{
        email: "",
        id: "",
        identity: "",
        organid: "",
        password: "",
        phone: "",
        regionid:"",
        remarks: "",
        sex: "",
        status: "",
        superior: "",
        username: ""
    },
      userStauts:[
        {label:"有效",value:1},
        {label:"无效",value:0}
      ],
      sexoptions:[
        {label:"男",value:1},
        {label:"女",value:0}
      ],
      total:0,
      OrganizationTree:[],
      dataList:[],
      tableLoading:false
    };
  },
  mounted(){
    this.search()
    this.getOrganizationTree()
  },
  methods: {
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
    conforim(){
        var that = this
        let ajaxObj = that.UserForm
            ajaxObj.organid = that.UserForm.organid[that.UserForm.organid.length-1]
            ajaxObj.superior ="总公司"
        that.Httpclient({
            url:'/api/user/saveOrUpdate',
            data:ajaxObj,
            method: "POST"
        }).then(res => {
            if(res.code==0){
                that.dialogFormUser = false
                this.$message({ message: '操作成功',type: 'success'})
                console.log(res.data)
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
  }
</style>