<template>
  <div>
    <div class="header-bar">
        <Input v-model="query.queryStr" placeholder="输入用户手机号/酒吧名称" search style="width:200px;"/>
        <span class="seach-lable">预定日期：</span>
        <DatePicker type="daterange" placement="bottom-end" placeholder="请选择预定日期" style="width: 200px"></DatePicker>
        <span class="seach-lable">是否到店：</span>
        <Select style="width:100px" v-model="query.arriveStatus">
          <Option v-for="item in arriveStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
        <span class="seach-lable">预定状态：</span>
        <Select style="width:100px"  v-model="query.status">
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
import {get_place_list} from "@/api/user"
export default {
  data () {
    return {
      query: {
        pageSize: 10,
        pageNum: 1,
        queryStr: '',//酒吧名称或用户手机号
        beginTime: '',//注册日期开始时间
        endTime: '',//注册日期结束时间
        arriveStatus: -1,//是否到店（-1全部  0已到店  2未到店）
        status: -1,//预定状态（-1全部  0自己取消 1超时取消 2正常到店 3超时到店）
      },
      startRow: 1, // 当前页面
      list: [],//列表
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
    getPlacelist () {
      get_place_list(this.query).then(res => {
        console.log(res)
      }).catch(error => {
        
      })
    }
  },
  mounted () {
    this.getPlacelist()
  },
  beforeCreate () {
  },
  created () {
  },
  activated () {
  }
}
</script>
