<template>
  <div>
    <div class="header-bar">
        <Input v-model="query.queryStr" placeholder="输入用户手机号/酒吧名称" search style="width:200px;"/>
        <span class="seach-lable">排位日期：</span>
        <DatePicker type="daterange" placement="bottom-end" placeholder="请选择排位日期" style="width: 200px"></DatePicker>
        <span class="seach-lable">排位状态：</span>
        <Select style="width:100px" v-model="query.status">
          <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
    </div>
    <Table stripe :columns="columns1" :data="data1"></Table>
    <div style="padding-top:30px;text-align:center;">
      <Page :total="100" show-total  style=""/>
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
      },
      startRow: 1, // 当前页面
      list: [],//列表
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
            key: 'appointTime'
          },
          {
            title: '排位手机号',
            keyL: 'remindPhone'
          },
          {
            title: '状态',
            key: 'status'
          }
      ],
      data1: [
          {}
      ]
    }
  },
  methods: {
    getRemindList () {
      get_remind_list(this.query).then(res => {
        console.log(res)
      }).catch(error => {

      })
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
