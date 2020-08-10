<template>
  <div>
    <!-- 表单 -->
    <el-row>
      <el-col :span="24" class="toolbar">
        <el-form :inline="true" :model="SeachForm">
          <el-col :span="10" style="height: 40px;">
            <el-form-item label="创建时间">
              <el-date-picker
                v-model="SeachForm.startcreatedate"
                type="date"
                placeholder="选择开始日期"
              ></el-date-picker>
              <el-date-picker
                v-model="SeachForm.endcreatedate"
                type="date"
                placeholder="选择结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="编号">
              <el-input
                v-model="SeachForm.templateName"
                placeholder=""
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="上游编号">
              <el-input
                v-model="SeachForm.templateName"
                placeholder=""
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item class="opeattionClass">
              <el-button
                size="small"
                type="info"
                icon="el-icon-search"
                @click="search"
                >查询</el-button
              >
              <el-button size="small" type="success" icon="el-icon-refresh"
                >重置</el-button
              >
            </el-form-item>
          </el-col>
        </el-form>
      </el-col>
    </el-row>
    <!-- 按钮区 -->
    <el-row class="operate-btns mt20">
      <el-button size="small" type="success" icon="el-icon-plus" @click="Opendialog">新增</el-button >
    </el-row>
    <!-- 表格 -->
    <el-row class="mt20">
      <el-table max-height="680" ref="multipleTable" row-key="id" :data="dataList"
        border tooltip-effect="dark"  style="width: 100%"
        v-loading="tableLoading" element-loading-text="拼命加载中" >
        <el-table-column type="index"  fixed label="用户id" width="50" header-align="center" align="center" />
        <el-table-column  prop="templateCode" label="登录账号" header-align="center" align="center" show-overflow-tooltip />
        <el-table-column prop="shopname" label="用户名称" header-align="center" align="center" show-overflow-tooltip/>
        <el-table-column prop="templateCode" label="账户类型" header-align="center" align="center" show-overflow-tooltip/>
        <!-- <el-table-column prop="templateCode" label="上级编号" header-align="center" align="center" show-overflow-tooltip /> -->
         <el-table-column prop="gatewayid" label="通道id" header-align="center" align="center" show-overflow-tooltip />
        <el-table-column  prop="status" label="状态" header-align="center" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
              <span v-if="scope.row.status==1" style="color:green;" >正常</span>
              <span v-else style="color:red;">失效</span>
          </template>
        </el-table-column>
        <el-table-column prop="mdfivekey" label="秘钥" show-overflow-tooltip header-align="center" align="center"/>
        <!-- <el-table-column prop="templateCode" label="余额" show-overflow-tooltip header-align="center" align="center"/> -->
        <!-- <el-table-column prop="templateCode" label="冻结金额" show-overflow-tooltip header-align="center" align="center"/> -->
        <el-table-column prop="createdate" label="创建时间" show-overflow-tooltip header-align="center" align="center"/>
        <el-table-column  prop="templateCode" label="操作" min-width='150'  show-overflow-tooltip header-align="center" align="center">
          <template slot-scope="scope"  >
            <el-button type="text" size="mini" style="color:green;" >编辑</el-button>
            <el-button type="text"  size="mini">修改</el-button>
            <el-button type="text" @click="OpendRateialog(scope.row)" style="color:skyblue;" size="mini">修改费率</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--工具条-->
      <el-col :span="24" class="toolbar col-pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentPageChange"
          :current-page="SeachForm.pageIndex"
          :page-sizes="[10, 50, 100, 200]"
          :page-size="SeachForm.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </el-col>
    </el-row>
    <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormShop">
        <el-form :model="ShopForm" label-width="85px" >
            <el-form-item label="店铺名称:">
                <el-input v-model="ShopForm.shopname" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="通道id:" >
                <el-input v-model="ShopForm.gatewayid" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="秘钥:" >
                <el-input v-model="ShopForm.mdfivekey" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="状态:">
                <el-radio-group v-model="ShopForm.status">
                    <el-radio label="0">失效</el-radio>
                    <el-radio label="1">正常</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item>
                <el-button @click="dialogFormShop = false">取 消</el-button>
                <el-button type="primary" @click="conforim">确 定</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
    <el-dialog title="修改费率" :visible.sync="dialogFormRate">
      <el-form label-width="115px" class="upadteClass">
       <div v-for="(obj,kk) in RateObj" :key="kk" >
        <el-form-item :label='obj.getwayname+": "' >
           <el-input v-model="obj.exchangeRate" autocomplete="off"></el-input>
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
  name: "settlement",
  data() {
    return {
      SeachForm: {
        shopname:"",
        startcreatedate:"",
        endcreatedate:"",
        pageIndex: 1,
        pageSize: 10
      },
      dialogFormTitle:"",
      status: [],
      total: 0,
      dataList: [],
      tableLoading: false,
      dialogFormShop:false,
      dialogFormRate:false,
      ShopForm:{
        createdate: "",
        gatewayid: "",
        id: null,
        mdfivekey: "",
        shopname: "",
        status: "",
        updatedate: ""
      },
      RateObj:{}
    };
  },
  mounted() {
    this.search();
  },
  methods: {
    //表格每页显示数据量变更
    handleSizeChange: function(val) {
      this.SeachForm.pageSize = val;
      this.search(1);
    },
    //第几页切换
    handleCurrentPageChange(val) {
      this.SeachForm.pageNum = val;
      this.search(1);
    },
    Opendialog(){
       this.dialogFormTitle = "添加商户"
        this.UserForm={
          createdate: "",
          gatewayid: "",
          id: null,
          mdfivekey: "",
          shopname: "",
          status: "",
          updatedate: ""
        }
        this.dialogFormShop = true
    },
    OpendRateialog(row){
      var that = this
      that.Httpclient({
            url:'/api/shop/findExchangeRate?shopId='+row.id,
            data:{},
            method: "get"
        }).then(res => {
            if(res.code==0){
              that.RateObj = res.data
              that.dialogFormRate = true
            }
        })
    },
    conforim(){
        var that = this
        that.Httpclient({
            url:'/api/shop/saveOrUpdate',
            data:that.ShopForm,
            method: "POST"
        }).then(res => {
            if(res.code==0){
                that.dialogFormShop = false
                this.$message({ message: '操作成功',type: 'success'})
                this.search()
            }
        })
    },
    Rateconforim(){
      var that = this
      let　ajaxObj = that.RateObj
      that.Httpclient({
          url:'/api/shop/updateExchangeRate',
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
    // 查询
    search() {
      var that = this
      that.tableLoading =true
      that.Httpclient({
            url:'/api/shop/selectAll?'+that.changAJaxparm(),
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
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/public.scss";
.upadteClass{
  min-height:200px;
}
</style>
