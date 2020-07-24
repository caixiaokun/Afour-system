<template>
  <div>
    <!-- 表单 -->
    <el-row>
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="SeachForm">
            <el-col :span="6">
                <el-form-item label="银行名称:">
                    <el-input v-model="SeachForm.name" placeholder="所属银行名称" ></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="银行卡卡号:">
                     <el-input v-model="SeachForm.card" placeholder="银行卡卡号" ></el-input>
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
      <el-button size="small" type="success"  icon="el-icon-plus">新增</el-button>
    </el-row>
    <!-- 表格 -->
    <el-row class="mt20">
        <el-table max-height="480"  row-key="id" 
            :data="dataList" border tooltip-effect="dark" style="width: 100%"
            v-loading="tableLoading" element-loading-text="拼命加载中">
            <el-table-column type="index" fixed label="序号" width="50" header-align="center" align="center"/>
            <el-table-column prop="bank" fixed label="所属银行" show-overflow-tooltip header-align="center" align="center"/>
            <el-table-column prop="card" fixed label="卡号" show-overflow-tooltip header-align="center" align="center"/>
            <el-table-column prop="name" fixed label="姓名" show-overflow-tooltip header-align="center" align="center"/>
            <el-table-column prop="addpeople" fixed label="添加人" show-overflow-tooltip header-align="center" align="center"/>
            <el-table-column prop="accounttype" fixed label="账号类型" show-overflow-tooltip header-align="center" align="center"/>
            <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                     <el-button type="text"  size="mini" style="color:green;" @click="EditCard(scope.row)">编辑</el-button>
                    <el-button type="text" size="mini"><span style="color:red;" @click="DelCard(scope.row)">删除</span></el-button>
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
    <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormCard">
        <el-form :model=" CardForm" label-width="85px" >
            <el-form-item label="所属银行:">
                <el-input v-model=" CardForm.accounttype" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="所属银行:">
                <el-input v-model=" CardForm.accounttype" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="所属银行:">
                <el-input v-model=" CardForm.accounttype" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="所属银行:">
                <el-input v-model=" CardForm.accounttype" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="所属银行:">
                <el-input v-model=" CardForm.accounttype" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="dialogFormCard = false">取 消</el-button>
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
          name: "",
          card:"",
          pageIndex:1,
          pageSize:10,
      },
      dialogFormCard:false,
      dialogFormTitle:"添加银行卡",
      CardForm:{
         accounttype: "",
          addpeople: "",
          bank: "",
          card: "",
          id: "",
          name: "",
      },
      total:0,
      dataList:[],
      tableLoading:false
    };
  },
  mounted(){
    this.search()
  },
  methods: {
    search(){
      var that = this
      that.tableLoading =true
      that.Httpclient({
          url:'/api/bank/selectAll?'+that.changAJaxparm(),
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
                that.dialogFormCard = false
                this.$message({ message: '操作成功',type: 'success'})
                this.search()
            }
        })
    },
    // 编辑银行卡
    EditCard(row){
        var that = this
        that.dialogFormTitle = "编辑用户"
        that. CardForm={
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
        that.dialogFormCard = true

    },
    //删除银行卡
    DelCard(row){
        this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           this.Httpclient({
            url:'/api/bank/delete',
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