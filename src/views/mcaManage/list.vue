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
            <el-form-item label="码商类型">
              <el-select v-model="SeachForm.optType" clearable>
                <el-option
                  v-for="(item, index) in status"
                  :key="index"
                  :label="item.dictName"
                  :value="item.dictId"
                ></el-option>
              </el-select>
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
      <!-- <el-button size="small" type="danger" icon="el-icon-setting" >绑定码商</el-button > -->
    </el-row>
    <!-- 表格 -->
    <el-row class="mt20">
      <el-table max-height="480" ref="multipleTable" row-key="id" :data="dataList"
        border tooltip-effect="dark"  style="width: 100%"
        v-loading="tableLoading" element-loading-text="拼命加载中" >
        <el-table-column type="index"  fixed label="用户id" width="50" header-align="center" align="center" />
        <el-table-column  prop="templateCode" label="登录账号"  show-overflow-tooltip />
        <el-table-column prop="shopname" label="用户名称" show-overflow-tooltip/>
        <el-table-column prop="templateCode" label="账户类型" show-overflow-tooltip/>
        <el-table-column prop="templateCode" label="上级编号" show-overflow-tooltip />
        <el-table-column  prop="status" label="状态" show-overflow-tooltip />
        <el-table-column prop="mdfivekey" label="秘钥" show-overflow-tooltip />
        <el-table-column prop="templateCode" label="余额" show-overflow-tooltip />
        <el-table-column prop="templateCode" label="冻结金额" show-overflow-tooltip />
        <el-table-column prop="createdate" label="创建时间" show-overflow-tooltip />
        <el-table-column  prop="templateCode" label="操作"  show-overflow-tooltip/>
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
      status: [],
      total: 0,
      dataList: [],
      tableLoading: false
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
</style>
