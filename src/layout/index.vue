<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar @showUserinfo="showUserinfo"></navbar>
      </div>
      <app-main></app-main>
    </div>
    <el-dialog title="用户基本信息" :visible.sync="userInfodetail"
        width="50%">
        <p> <span> 用户名: {{userInfoobj.username}}</span></p>
        <p> <span> 创建时间: {{userInfoobj.createdate}}</span></p>
        <p> <span> 邮箱: {{userInfoobj.email}}</span></p>
        <p> <span> 身份: {{userInfoobj.identity}}</span></p>
        <p> <span> 部门: {{userInfoobj.organid}}</span></p>
        <p> <span> 电话: {{userInfoobj.phone}}</span></p>
        <p> <span> 性别: {{userInfoobj.sex=="1"?"男":"女"}}</span></p>
        <p> <span> 状态: {{userInfoobj.status=="1"?"正常":"失效"}}</span></p>
         
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="userInfodetail = false">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  data(){
    return {
      userInfodetail:false,
      userInfoobj:{}
    }
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    showUserinfo(){
      let userInfo = JSON.parse(localStorage.getItem('userInfo'))
      var that = this
      that.Httpclient({
          url:'/api/user/findOne?id='+userInfo.id,
          data:{},
          method: "get"
      }).then(res => {
          that.userInfodetail =true
          if(res.code==0){  
            that.userInfoobj =  res.data
          }
      })      
    }

  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
