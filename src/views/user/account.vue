<template>
  <div>
    <div class="header-bar">
      <Input v-model="query.queryStr" placeholder="输入用户昵称/手机号搜" search style="width:200px;"/>
      <span class="seach-lable">注册日期：</span>
      <DatePicker type="daterange" placement="bottom-end"
        placeholder="请选择注册日期" style="width: 200px"
        v-model="timeArr" @on-clear='clear_change' @on-change='date_change'></DatePicker>
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
import {get_account_list} from "@/api/user"
export default {
  data () {
    return {
      query: {
        pageSize: 10,
        pageNum: 1,
        queryStr: '',//用户 昵称或手机号
        beginTime: '',//注册日期开始时间
        endTime: ''//注册日期结束时间
      },
      startRow: 1, // 当前页面
      list: [],//用户账号列表
      timeArr: [],
      dataCount:0,//总条数
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
              title: '操作',
              width: 300,
              render: (h,params) => {
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
                      this.$goto('UserBookPlace', '', {id: params.row.id})
                      sessionStorage.setItem('activeName', '用户管理, 桌位预订')
                      sessionStorage.setItem('menuItemText', '桌位预订')
                      this.$emit('listenToChildEvent')
                    }
                  }}, '桌位预订信息'),
                h('a', {
                  style: {
                    "margin-right": "5px"
                  },
                  props: {
                    href: "javascript:void(0)"
                  },
                  on: {
                    click: () => {
                      this.$goto('UserBookRemind', '', {id: params.row.id})
                      sessionStorage.setItem('activeName', '用户管理, 桌位排位')
                      sessionStorage.setItem('menuItemText', '桌位排位')
                      this.$emit('listenToChildEvent')
                    }
                  }}, '桌位排位信息'),
                h('a', {
                  style: {
                    "margin-right": "5px"
                  },
                  props: {
                    href: "javascript:void(0)"
                  },
                   on: {
                    click: () => {
                      this.$goto('UserBookActivity', '', {id: params.row.id})
                      sessionStorage.setItem('activeName', '用户管理, 活动预订')
                      sessionStorage.setItem('menuItemText', '活动预订')
                      this.$emit('listenToChildEvent')
                    }
                  }}, '桌位预订信息')])
              }
          },
          {
              title: '桌位预订次数',
              key: 'tableAppointNum'
          },
          {
              title: '桌位排位次数',
              key: 'tableQueenNum'
          },
          {
            title: '活动预订次数',
            key: 'activityAppointNum'
          }
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
      this.query.pageNum = 1
      this.startRow = 1
      this.timeArr = []
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
