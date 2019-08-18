<template>
  <div>
    <div class="header-bar">
      <Input v-model="query.queryStr" placeholder="输入商家名称/手机号搜" search style="width:200px;"/>
    </div>
    <Table stripe :columns="columns1" :data="data1"></Table>
    <div style="padding-top:30px;text-align:center;">
      <Page :total="100" show-total  style=""/>
    </div>
  </div>
</template>
<script>
import {get_table_list} from "@/api/mch"
export default {
  data () {
    return {
      query: {
        pageSize: 10,
        pageNum: 1,
        queryStr: ''//商家名称或手机号
      },
      startRow: 1, // 当前页面
      list: [],//用户桌位列表
      columns1: [
          {
              title: '微信昵称',
              key: 'nickName'
          },
          {
              title: '手机号',
              key: 'phone'
          },
          {
              title: '商家名称',
              key: 'createTime'
          },
          {
              title: '活动区域',
              key: 'area'
          },
          {
              title: '详细地址',
              key: 'address'
          },
          {
              title: '桌位信息',
              key: 'num'
          },
          {
            title: '查看桌位图'
          }
      ],
      data1: [
          {
            nickName: '乌拉拉',
            phone: 13652145214,
            createTime: '2019-04-23',
            tableAppointNum: 324,
            tableQueenNum: 23,
            activityAppointNum: 24
          },
          {
            nickName: '乌拉拉',
            phone: 13652145214,
            createTime: '2019-04-23',
            tableAppointNum: 324,
            tableQueenNum: 23,
            activityAppointNum: 24
          },
           {
            nickName: '乌拉拉',
            phone: 13652145214,
            createTime: '2019-04-23',
            tableAppointNum: 324,
            tableQueenNum: 23,
            activityAppointNum: 24
          },
          {
            nickName: '乌拉拉',
            phone: 13652145214,
            createTime: '2019-04-23',
            tableAppointNum: 324,
            tableQueenNum: 23,
            activityAppointNum: 24
          },
      ]
    }
  },
  methods: {
    getActivityList() {
      get_activity_list(this.query).then(res => {
        console.log(res)
      }).catch(error => {

      })
    }
  },
  mounted () {
    this.getActivityList()
  },
  beforeCreate () {
  },
  created () {
  },
  activated () {
  }
}
</script>
