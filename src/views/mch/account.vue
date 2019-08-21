<template>
  <div>
    <div class="header-bar">
      <Input v-model="query.queryStr" placeholder="输入商家名称/手机号搜" search style="width:200px;"/>
      <span class="seach-lable">注册日期：</span><DatePicker type="daterange" placement="bottom-end"
        placeholder="请选择注册日期" style="width: 200px"
        v-model="timeArr" @on-clear='clear_change' @on-change='date_change'></DatePicker>
      <span class="seach-lable">账号状态：</span>
      <Select style="width:100px" v-model="query.userStatus">
        <Option v-for="item in userStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <Button type="primary" style="margin-left:20px;" @click="onSerach">搜索</Button>
      <Button  @click="onReset">重置</Button>
    </div>
    <Table stripe :columns="columns1" :data="list" height="450"></Table>
    <div style="padding-top:30px;text-align:center;">
      <Page :total="dataCount" border show-total :current="startRow" :page-size="query.pageSize" @on-change="changepage"/>
    </div>
  </div>
</template>
<script>
import {get_account_list, on_switch} from "@/api/mch"
export default {
  data () {
    return {
      query: {
        pageSize: 10,
        pageNum: 1,
        queryStr: '',//商家名称或手机号
        userStatus: -1,//账号状态(-1全部  0正常 1已禁用)
        beginTime: '',//注册日期开始时间
        endTime: ''//注册日期结束时间
      },
      timeArr: [],
      dataCount:0,//总条数
      startRow: 1, // 当前页面
      list: [],//用户账号列表
      userStatusList: [
        {
          label: '全部',
          value: -1
        },
        {
          label: '正常',
          value: 0
        },
        {
          label: '已禁用',
          value: 1
        }],
      columns1: [
          {
            title: '头像',
            width:100,
            render: (h,params) => {
              return h('img',{
                attrs: {
                  src: params.row.portrait,
                  style: 'width:100%;padding:5px;'
                }
              })
            }
          },  
          {
            title: '微信昵称',
            key: 'nickName'
          },
          {
            title: '手机号',
            key: 'phone'
          },
          {
            title: '注册日期',
            key: 'registDate'
          },
          {
            title: '商家名称',
            key: 'name'
          },
          {
            title: '所在区域',
            key: 'area'
          },
          {
            title: '详细地址',
            key: 'address',
            width:200
          },
          {
            title: '所属类型',
            render: (h,params) => {
              let  text = ''
              switch (params.row.type) {
                case 0:
                  text = '其他'
                  break
                case 1:
                  text = '餐吧'
                  break
                case 2:
                  text = '清吧'
                  break
              }
              return h('div', text)
            }
          },
          {
            title: '账号状态',
            render: (h,params) => {
              let  text = ''
              switch (params.row.userStatus) {
                case 0:
                  text = '已启用'
                  break
                case 1:
                  text = '已禁用'
                  break
              }
              return h('div', text)
            }
          },
          {
              title: '操作',
              width: 250,
              render: (h,params) => {
                let btntext = ''
                let title = ''
                let content = ''
                let userStatus = ''
                if (params.row.userStatus == 1) { //根据状态显示禁用账号还是启用账号
                  btntext = '启用账号'
                  title = '启用确认'
                  content = '确认启用该商家账号吗？启用后账号将允许登录！'
                } else {
                  btntext = '禁用账号'
                  title = '禁用确认'
                  content = '确认禁用该商家账号吗？禁用后账号将无法使用！'
                }
                return h('div', [
                h('a', {
                  style: {
                    "margin-right": "5px"
                  },
                  props: {
                    href: "javascript:void(0)"
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: title,
                        content: content,
                        onOk: () => {
                          this.onSwitch({id: params.row.id})
                        }
                      });

                    }
                  }}, btntext),
                h('a', {
                        style: {
                          "margin-right": "5px"
                        },
                        props: {
                          href: "javascript:void(0)"
                        },
                        on: {
                          click: () => {
                            this.$goto('MchAuth', '', {id: params.row.id})
                            sessionStorage.setItem('activeName', '商家管理, 商家认证')
                            sessionStorage.setItem('menuItemText', '商家认证')
                            this.$emit('listenToChildEvent')
                          }
                        }
                      }, '认证信息'),
                h('a', {
                  style: {
                    "margin-right": "5px"
                  },
                  props: {
                    href: "javascript:void(0)"
                  },
                  on: {
                    click: () => {
                      this.$goto('MchActivity', '', {id: params.row.id})
                      sessionStorage.setItem('activeName', '商家管理, 活动管理')
                      sessionStorage.setItem('menuItemText', '活动管理')
                      this.$emit('listenToChildEvent')
                    }
                  }
                  }, '活动信息'),
                h('a', {
                  style: {
                    "margin-right": "5px"
                  },
                  props: {
                    href: "javascript:void(0)"
                  },
                   on: {
                    click: () => {
                      this.$goto('MchPlace', '', {id: params.row.id})
                      sessionStorage.setItem('activeName', '商家管理, 桌位管理')
                      sessionStorage.setItem('menuItemText', '桌位管理')
                      this.$emit('listenToChildEvent')
                    }
                  }
                  }, '桌位信息'),
                ])
              }
          },
      ]
    }
  },
  methods: {
    getAccountList() {
      get_account_list(this.query).then(res => {
        this.list = res.data.list
        this.dataCount = res.data.totalSize
      }).catch(error => {

      })
    },
    //清空日历
    clear_change() {
      this.query.beginTmie = '';
      this.query.endTime = '';
    },
    //日历改变
    date_change(date) {
      this.query.beginTime = date[0]
      this.query.endTime = date[1]
    },
    //查看大图
    lookBigImg (imgUrl, title) {
      this.imgSrc = imgUrl;
      this.imgTitile = title;
      this.visible = true;
    },
    //禁用账号启用账号切换
    onSwitch (data) {
      on_switch(data).then(res => {
        this.query.pageNum = 1
        this.getAccountList()
      }).catch(error => {

      })
    },
    // 页码改变
    changepage(index) {
      this.query.pageNum = index;
      this.startRow =  index
      this.getAccountList()
    },
    // 搜索按钮事件
    onSerach() {
      this.query.pageNum = 1
      this.startRow = 1
      this.getAccountList()
    },
    // 重置按钮事件
    onReset() {
      this.query.queryStr = ''
      this.query.beginTime = ''
      this.query.endTime = ''
      this.query.userStatus = -1
      this.query.pageNum = 1
      this.startRow = 1
      this.getAccountList()
    }
  },
  mounted () {
    this.getAccountList()
  },
  beforeCreate () {
  },
  created () {
  },
  activated () {
  }
}
</script>
