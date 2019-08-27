<template>
  <div>
    <div class="header-bar">
        <Input v-model="query.queryStr" placeholder="输入用户手机号/酒吧名称" search style="width:200px;"/>
        <span class="seach-lable">排位日期：</span>
         <DatePicker type="daterange" placement="bottom-end"
        placeholder="请选择注册日期" style="width: 200px"
        v-model="timeArr" @on-clear='clear_change' @on-change='date_change'></DatePicker>
        <span class="seach-lable">排位状态：</span>
        <Select style="width:100px" v-model="query.status">
          <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
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
import {get_remind_list} from "@/api/user"
export default {
  data () {
    return {
      query: {
        pageSize: 10,
        pageNum: 1,
        queryStr: '',//酒吧名称或用户手机号
        beginTime: '',//注册日期开始时间
        endTime: '',//注册日期结束时间
        status: -1,//排位状态（-1全部  0自己取消  1系统取消）
        id: this.$route.params.id
      },
      startRow: 1, // 当前页面
      list: [],//列表
      timeArr: [],
      dataCount:0,//总条数
      statusList: [//排位状态
        {
          label: '全部',
          value: -1
        },
        {
          label: '自己取消',
          value: 0
        },
        {
          label: '系统取消',
          value: 1
        }
      ],
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
            title: '排位日期',
            key: 'remindDate'
          },
          {
            title: '排位手机号',
            key: 'remindPhone'
          },
          {
            title: '状态',
            render: (h,params) => {
              let  text = ''
              switch (params.row.status) {
                case 0:
                  text = '排位中'
                  break
                case 1:
                  text = '自己取消'
                  break
                case 2:
                  text = '系统取消'
                  break
              }
              return h('div', text)
            }
          }
      ]
    }
  },
  methods: {
    getRemindList () {
      get_remind_list(this.query).then(res => {
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
      this.getRemindList()
    },
    // 搜索按钮事件
    onSerach() {
      this.query.pageNum = 1
      this.query.id = ''
      this.startRow = 1
      this.getRemindList()
    },
    // 重置按钮事件
    onReset() {
      this.query.queryStr = ''
      this.query.id = ''
      this.query.beginTime = ''
      this.query.endTime = ''
      this.query.status = -1
      this.query.pageNum = 1
      this.startRow = 1
      this.getRemindList()
    }
  },
  mounted () {
    this.getRemindList()
  },
  beforeCreate () {
  },
  created () {
  },
  activated () {
  }
}
</script>
