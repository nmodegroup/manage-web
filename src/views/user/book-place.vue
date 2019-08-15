<template>
  <div>
    <div class="header-bar">
        <Input v-model="value" placeholder="输入用户手机号/酒吧名称" search style="width:200px;"/>
        <span class="seach-lable">预定日期：</span>
        <DatePicker type="daterange" placement="bottom-end" placeholder="请选择预定日期" style="width: 200px"></DatePicker>
        <span class="seach-lable">是否到店：</span>
        <Select style="width:100px">
          <Option v-for="item in arriveStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <span class="seach-lable">预定状态：</span>
        <Select style="width:100px">
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
export default {
  data () {
    return {
      value: '',
      arriveStatusList: [//是否到店
        {
          label: '全部',
          value: -1
        },
        {
          label: '已到店',
          value: 0
        },
        {
          label: '未到店',
          value: 2
        }
      ],
      statusList: [//预定状态
        {
          label: '全部',
          value: -1
        },
        {
          label: '自己取消',
          value: 0
        },
        {
          label: '超时取消',
          value: 1
        },
        {
          label: '正常到店',
          value: 2
        },
        {
          label: '超时到店',
          value: 3
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
            title: '预定日期',
            key: 'appointTime'
          },
          {
            title: '预定到店时间',
            keyL: 'appointArriveTime'
          },
          {
            title: '实际到店时间',
            key: 'arriveTime'
          },
          {
            title: '座位类型',
            key: 'tableAreaName'
          },
          {
            title: '是否到店',
            key: 'activityAppointNum'
          },
           {
            title: '预定状态',
            key: 'status'
          }
      ],
      data1: [
          {}
      ]
    }
  },
  methods: {
  },
  beforeCreate () {
  },
  created () {
  },
  activated () {
  }
}
</script>
