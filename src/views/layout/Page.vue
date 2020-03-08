<template>
  <div class="layout">
    <Sider :style="{position: 'fixed', height: '100vh', left: 0, overflow: 'auto'}">
      <div class="login-frame">NIGHT MODE</div>
      <Menu :active-name="activeNme" theme="dark" width="auto" 
          :open-names="openName"
          @on-select="onMenuItem"
          >
          <Submenu name="用户管理">
            <template slot="title">
              <Icon type="md-person" />
              用户管理
            </template>
            <MenuItem name="用户管理,账号管理" to="/user/account">账号管理</MenuItem>
            <MenuItem name="用户管理, 桌位预订" to="/user/book/place">桌位预订</MenuItem>
            <MenuItem name="用户管理, 桌位排位" to="/user/book/remind">桌位排位</MenuItem>
            <MenuItem name="用户管理, 活动预订" to="/user/book/activity">活动预订</MenuItem>
          </Submenu>
          <Submenu name="商家管理">
            <template slot="title">
              <Icon type="ios-keypad"></Icon>
              商家管理
            </template>
            <MenuItem name="商家管理, 商家账号管理" to="/mch/account">商家账号管理</MenuItem>
            <MenuItem name="商家管理, 商家认证" to="/mch/auth">商家认证</MenuItem>
            <MenuItem name="商家管理, 活动管理" to="/mch/activity">活动管理</MenuItem>
            <MenuItem name="商家管理, 桌位管理" to="/mch/place">桌位管理</MenuItem>
            <MenuItem name="商家管理, 提现管理" to="/mch/deposit">提现管理</MenuItem>
            <MenuItem name="商家管理, 背景审核" to="/mch/backdrop">背景审核</MenuItem>
            </Submenu>
          <Submenu name="平台管理">
            <template slot="title">
              <Icon type="md-settings" />
              平台管理
            </template>
            <MenuItem name="平台管理, 首页管理" to="/home/index">首页管理</MenuItem>
          </Submenu>
        </Menu>
    </Sider>
    <Layout :style="{marginLeft: '200px'}">
      <Header :style="{background: '#fff', boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)'}">
        <Dropdown style="float:right;">
          <a href="javascript:void(0)">
            你好系统管理员
            <Icon type="ios-arrow-down"></Icon>
          </a>
          <DropdownMenu slot="list">
            <DropdownItem @click.native="loginOut">退出登录</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </Header>
      <Content :style="{padding: '0 16px 16px'}">
        <Breadcrumb :style="{margin: '16px 0'}">
          <BreadcrumbItem>{{menuText}}</BreadcrumbItem>
         <BreadcrumbItem>{{menuItemText}}</BreadcrumbItem>
        </Breadcrumb>
        <Card>
          <router-view v-on:listenToChildEvent="showMsgFromChild"/>
        </Card>
      </Content>
    </Layout>
  </div>
</template>
<script>
import {login_out} from "@/api/login"
export default {
  data() {
    return {
      menuItemText: '账号管理',
      menuText: '用户管理',
      activeNme: '用户管理,账号管理',
      openName: ['用户管理']
    }
  },
  methods: {
    onMenuItem (name) {
      let idx = name.indexOf(',')
      if ( idx != -1) {
        sessionStorage.setItem('activeName', name)
        sessionStorage.setItem('openName', name.slice(0, idx))
        sessionStorage.setItem('menuItemText', name.slice(idx + 1))
        this.menuText = name.slice(0, idx)
        this.menuItemText = name.slice(idx + 1)
      }
    },
    loginOut () {
      login_out().then(res => {
        this.$goto('login')
      }).catch(error => {})
    },
    initMenu () {
      this.activeNme = sessionStorage.getItem('activeName') || '用户管理,账号管理'
      this.menuText = this.openName[0] = sessionStorage.getItem('openName') || '用户管理'
      this.menuItemText = sessionStorage.getItem('menuItemText') || '账号管理'
    },
    showMsgFromChild () {
      this.initMenu()
    }
  },
  created () {
    this.initMenu()
  },
  mounted() {
  }
}
</script>
<style  scoped>
.login-frame {
  height: 117px;
  line-height: 117px;
  padding-left: 30px;
  color:#fff;
  font-size: 21px;
  font-weight: bold;
}
</style>

