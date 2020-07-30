<template>
  <div>
    <!-- 按钮区 -->
    <el-row class='operate-btns mt20'>
      <!-- <el-button size="small" type="success"  icon="el-icon-plus">新增</el-button> -->
    </el-row>
    <!-- 表格 -->
    <el-row class="mt20">
        <el-table max-height="480"  row-key="id" 
            :data="dataList" border tooltip-effect="dark" style="width: 100%"
            v-loading="tableLoading" element-loading-text="拼命加载中">
            <el-table-column type="index" fixed label="序号" width="50" header-align="center" align="center"/>
            <el-table-column prop="appprivatekey"  label="应用私钥" show-overflow-tooltip header-align="center" align="center"/>
            <el-table-column prop="alipaypublickey"  label="阿里公钥" show-overflow-tooltip header-align="center" align="center"/>
            <el-table-column prop="getwayname" label="通道名称" show-overflow-tooltip header-align="center" align="center"/>
            <el-table-column prop="alipayname"  label="姓名" show-overflow-tooltip header-align="center" align="center"/>
            <el-table-column prop="alipayaccount"  label="账户" show-overflow-tooltip header-align="center" align="center"/>
            <el-table-column prop="status"  label="通道状态" show-overflow-tooltip header-align="center" align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.status?"开启":"关闭"}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="notifyurl"  label="支付宝回调地址" show-overflow-tooltip header-align="center" align="center"/>
            <el-table-column prop="systemurl"  label="通道的url首页地址" show-overflow-tooltip header-align="center" align="center"/>
            <el-table-column prop="mdfivekey" label="通道加密" show-overflow-tooltip header-align="center" align="center"/>
            <el-table-column prop="signtype" label="解密格式" show-overflow-tooltip header-align="center" align="center"/>
            <el-table-column prop="serverurl" label="请求阿里支付的路径" show-overflow-tooltip header-align="center" align="center"/>
            <el-table-column prop="object"  label="科目类别" show-overflow-tooltip header-align="center" align="center"/>
            <el-table-column prop="updatedate"  label="修改日期" show-overflow-tooltip header-align="center" align="center"/>
            <el-table-column prop="createdate"  label="创建日期" show-overflow-tooltip header-align="center" align="center"/>

             <el-table-column fixed="right" label="操作" header-align="center" align="center">
                <template slot-scope="scope">
                    <el-button type="text"  size="mini">测试</el-button>
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
</div>
</template>

<script>
export default {
  data() {
    return {
      SeachForm:{//表单
          status:false,
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
          url:'/api/gateway/selectAll?'+that.changAJaxparm(),
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