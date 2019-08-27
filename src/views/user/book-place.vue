<template>
  <div>
    <div class="header-bar">
      <Input v-model="query.queryStr" placeholder="输入用户手机号/酒吧名称" search style="width:200px;"/>
      <span class="seach-lable">预定日期：</span>
       <DatePicker type="daterange" placement="bottom-end"
        placeholder="请选择注册日期" style="width: 200px"
        v-model="timeArr" @on-clear='clear_change' @on-change='date_change'></DatePicker>
      <span class="seach-lable">是否到店：</span>
      <Select style="width:100px" v-model="query.arriveStatus">
        <Option v-for="item in arriveStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
    </div>
    <div calss="header-bar">
      <span>预定状态：</span>
      <Select style="width:100px"  v-model="query.status">
        <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <Button type="primary" style="margin-left:20px;" @click="onSerach">搜索</Button>
      <Button  @click="onReset">重置</Button>
    </div>
    <div class="list-content">
      <Table stripe :columns="columns1" :data="list" height="450"></Table>
    </div>
    <div style="padding-top:30px;text-align:center;">
      <Page :total="dataCount" border show-total :current="startRow" :page-size="query.pageSize" @on-change="changepage"/>
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
        id: this.$route.params.id
      },
      startRow: 1, // 当前页面
      list: [],//列表
      timeArr: [],
      dataCount:0,//总条数
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
            key: 'appointDate'
          },
          {
            title: '预定到店时间',
            key: 'appointArriveTime'
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
            render: (h,params) => {
              let text  = ''
              if (params.row.status <=4) {
                text = '未到店'
              } else if (params.row.status >= 5) {
                text = '已到店'
              }
              return h('div', text)
            }
          },
           {
            title: '预定状态',
            render: (h,params) => {
              let  text = ''
              switch (params.row.status) {
                case 0:
                  text = '待确认'
                  break
                case 1:
                  text = '确认通过'
                  break
                case 2:
                  text = '确认不通过'
                  break
                case 3:
                  text = '用户取消'
                  break
                case 4:
                  text = '超时取消'
                  break
                case 5:
                  text = '已到店'
                  break
                case 6:
                  text = '到店超时'
                  break
              }
              return h('div', text)
            }
          }
      ]
    }
  },
  methods: {
    getPlacelist () {
      get_place_list(this.query).then(res => {
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
      this.getPlacelist()
    },
    // 搜索按钮事件
    onSerach() {
      this.query.pageNum = 1
      this.startRow = 1
      this.query.id = ''
      this.getPlacelist()
    },
    // 重置按钮事件
    onReset() {
      this.query.queryStr = ''
      this.query.id = ''
      this.query.beginTime = ''
      this.query.endTime = ''
      this.query.arriveStatus = -1
      this.query.status = -1
      this.query.pageNum = 1
      this.startRow = 1
      this.getPlacelist()
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
