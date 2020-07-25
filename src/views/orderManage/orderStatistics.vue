<template>
  <div>
    <!-- 表单 -->
    <el-row>
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="SeachForm">
            <el-col>
                <el-form-item label="指定时间:">
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
    <!-- 表格 -->
    <el-row class="mt20">
        <el-table max-height="480"  row-key="id" 
            :data="dataList" border tooltip-effect="dark" style="width: 100%"
            v-loading="tableLoading" element-loading-text="拼命加载中">
            <el-table-column type="index" fixed label="序号" width="50" header-align="center" align="center"/>
            <el-table-column prop="alipayname"  label="账号" show-overflow-tooltip header-align="center" align="center"/>
            <el-table-column prop="shopname"  label="商家名称" show-overflow-tooltip header-align="center" align="center"/>
            <el-table-column prop="successorderPrice"  label="成功金额" show-overflow-tooltip header-align="center" align="center"/>
            <el-table-column prop="totalorderPrice"  label="总订单金额" show-overflow-tooltip header-align="center" align="center"/>
            <el-table-column prop="payuser"  label="通道类型" show-overflow-tooltip header-align="center" align="center"/>
            <el-table-column prop="orderNo"  label="成功率" show-overflow-tooltip header-align="center" align="center"/>
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
</div>
</template>

<script>
export default {
  data() {
    return {
      SeachForm:{//表单
          startcreatedate:"",
          endcreatedate:"",
          pageIndex:1,
          pageSize:10,
      },
      userTypeList:[
        {label:"商户",value:"0"},
        {label:"码商",value:"1"},
        {label:"管理员",value:"2"},
        {label:"通道接口方",value:"3"},
        {label:"开发员",value:"4"},
      ],
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
          url:'/api/orderdetelis/statistics?'+that.changAJaxparm(),
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