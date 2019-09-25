<template>
  <div>
    <div class="header-bar">
        <Input v-model="query.queryStr" placeholder="输入用户手机号/活动主题/酒吧名称" search style="width:200px;"/>
        <span class="seach-lable">预定日期：</span>
        <DatePicker type="daterange" placement="bottom-end"
        placeholder="请选择预定日期" style="width: 200px"
        v-model="timeArr" @on-clear='clear_change' @on-change='date_change'></DatePicker>
        <Button type="primary" style="margin-left:20px;" @click="onSerach">搜索</Button>
        <Button  @click="onReset">重置</Button>
    </div>
    <Table stripe :columns="columns1" :data="list" height="450"></Table>
    <div style="padding-top:30px;text-align:center;">
      <Page  :total="dataCount" border show-total :current="startRow" :page-size="query.pageSize" @on-change="changepage"/>
    </div>
  </div>
</template>
<script>
import {get_activity_list} from "@/api/user"
export default {
  data () {
    return {
      query: {
        pageSize: 10,
        pageNum: 1,
        queryStr: '',//酒吧名称或用户手机号
        beginTime: '',//注册日期开始时间
        endTime: '',//注册日期结束时间
        id: this.$route.params.id
      },
      startRow: 1, // 当前页面
      list: [],//列表
      dataCount: 0,//列表条数
      timeArr: [],
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
            title: '酒吧名称',
            key: 'name'
          },
          {
            title: '预定日期',
            key: 'appointDate'
          },
          {
            title: '活动时间',
            width:300,
            render: (h,params) => {
              let text = params.row.beginTime + ' ~ ' + params.row.endTime
              return h('div', text)
            }
          },
          {
            title: '主题活动',
            key: 'theme'
          }
      ],
    }
  },
  methods: {
    getActivityList () {
      get_activity_list(this.query).then(res => {
        this.list = res.data.list
        this.dataCount = res.data.totalSize
      }).catch(error => {

      })
    },
     // 页码改变
    changepage(index) {
      this.query.pageNum = index;
      this.startRow =  index
      this.getActivityList()
    },
    // 搜索按钮事件
    onSerach() {
      this.query.id = ''
      this.query.pageNum = 1
      this.startRow = 1
      this.getActivityList()
    },
    // 重置按钮事件
    onReset() {
      this.query.id = ''
      this.query.queryStr = ''
      this.query.beginTime = ''
      this.query.endTime = ''
      this.query.pageNum = 1
      this.startRow = 1
      this.timeArr = []
      this.getActivityList()
    },
    //清空日历
    clear_change() {
      this.query.beginDate = '';
      this.query.endDate = '';
    },
    //日历改变
    date_change(date) {
      this.query.beginDate = date[0]
      this.query.endDate = date[1]
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
