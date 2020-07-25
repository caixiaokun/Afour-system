<template>
  <div>
    <!-- 表单 -->
    <el-row>
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="SeachForm">
            <el-col :span="6">
                <el-form-item label="操作人员:">
                    <el-input v-model="SeachForm.optuser" placeholder="操作人员" ></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="操作类型:">
                     <el-select v-model="SeachForm.opttype" clearable >
                        <el-option v-for="(item, index ) in opttypeList" :key="index"  :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="操作时间:">
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
      <el-button size="small" type="success"  icon="el-icon-download">导出</el-button>
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
                    <el-button type="text"  size="mini" @click="detailShow(scope.row)">详情</el-button>
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
    <el-dialog title="详情" :visible.sync="detaildialogVisible"
      width="30%">
      <p> <span> 操作时间:{{detailobj.createdate}}</span></p>
      <p> <span> ip:{{detailobj.ip}}</span></p>
      <p> <span> 操作模块:{{detailobj.modular}}</span></p>
      <p> <span> 操作地址:{{detailobj.optplace}}</span></p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="detaildialogVisible = false">确 定</el-button>
      </span>
</el-dialog>
</div>
</template>

<script>
export default {
  data() {
    return {
      SeachForm:{//表单
          optuser:"",
          opttype:"",
          startcreatedate:"",
          endcreatedate:"",
          pageIndex:1,
          pageSize:10,
      },
      opttypeList:[ 
        {label:"增加",value:"0"},
        {label:"删除",value:"1"},
        {label:"修改 ",value:"2"},
        {label:"登录",value:"3"},
        {label:"登出",value:"4"},
      ],
      detailobj:{},
      total:0,
      dataList:[],
      tableLoading:false,
      detaildialogVisible:false
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
    // 详情
    detailShow(raw){
      var that = this
      that.Httpclient({
          url:'/api/operationlog/selectOne?id='+raw.id,
          data:{},
          method: "get"
      }).then(res => {
          that.detaildialogVisible =true
          if(res.code==0){  
            that.detailobj =  res.data
            console.log(res)
          }
      })
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