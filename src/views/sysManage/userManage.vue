<template>
  <div>
    <!-- 表单 -->
    <el-row>
        <el-col :span="24" class="toolbar">
            <el-form :inline="true" :model="SeachForm">
            <el-col :span="6">
                <el-form-item label="模板名称">
                    <el-input v-model="SeachForm.templateName" placeholder="模板名称" ></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="模板分类">
                    <el-select v-model="SeachForm.templateType" clearable >
                        <el-option v-for="(item, index ) in userStauts" :key="index"  :label="item.dictName" :value="item.dictId"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
             <el-col :span="6">
                <el-form-item label="模板名称">
                    <el-input v-model="SeachForm.templateName" placeholder="模板名称" ></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="模板分类">
                    <el-select v-model="SeachForm.templateType" clearable >
                        <el-option v-for="(item, index ) in userStauts" :key="index"  :label="item.dictName" :value="item.dictId"></el-option>
                    </el-select>
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
      <el-button size="small" type="warning" icon="el-icon-edit">修改</el-button>
      <el-button size="small" type="warning" icon="el-icon-download">导出</el-button>
       <el-button size="small" type="danger" icon="el-icon-delete">删除</el-button>
    </el-row>
    <!-- 表格 -->
    <el-row class="mt20">
        <el-table max-height="480" 
            ref="multipleTable" row-key="id" 
            :data="dataList" border tooltip-effect="dark" style="width: 100%"
            v-loading="tableLoading" element-loading-text="拼命加载中">
            <el-table-column type="index" fixed label="序号" width="50" header-align="center" align="center"/>
            <el-table-column label="" width="50" fixed header-align="center" align="center">
              <template slot-scope="scope">
                <el-radio-group v-model="selectRowdata">
                  <el-radio :label="scope.row" class="transparentRadio"> </el-radio>
                </el-radio-group>
              </template>
            </el-table-column>
            <el-table-column prop="templateCode" fixed label="模板编号" show-overflow-tooltip min-width="200"/>
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
          templateName: "",
          templateType:"",
          pageSize:10,
          pageNum:1,
      },
      userStauts:[],
      total:0,
      dataList:[],
      tableLoading:false
    };
  },
  mounted: {
    
  },
  methods: {
    //表格每页显示数据量变更
    handleSizeChange: function (val) {
        this.SeachForm.pageSize = val;
        this.search(1);
    },
    //第几页切换
    handleCurrentPageChange(val) {
        this.SeachForm.pageNum= val;
        this.search(1);
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