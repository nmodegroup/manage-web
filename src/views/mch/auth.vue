<template>
  <div>
    <div class="header-bar">
      <Input v-model="query.queryStr" placeholder="输入商家名称/手机号搜" search style="width:200px;"/>
      <span class="seach-lable">认证日期：</span><DatePicker type="daterange" placement="bottom-end" placeholder="请选择注册日期" style="width: 200px"></DatePicker>
      <span class="seach-lable">审核状态：</span>
      <Select style="width:100px" v-model="query.auditStatus">
        <Option v-for="item in auditStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
    </div>
    <Table stripe :columns="columns1" :data="data1"></Table>
    <div style="padding-top:30px;text-align:center;">
      <Page :total="100" show-total  style=""/>
    </div>
  </div>
</template>
<script>
import {get_auth_list} from "@/api/mch"
export default {
  data () {
    return {
      query: {
        pageSize: 10,
        pageNum: 1,
        queryStr: '',//商家名称或手机号
        auditStatus: -1,//审核状态(-1全部  0待审核 1审核通过 2审核未通过)
        beginTime: '',//认证日期开始时间
        endTime: ''//认证日期结束时间
      },
      startRow: 1, // 当前页面
      list: [],//认证列表
      auditStatusList: [
        {
          label: '全部',
          value: -1
        },
        {
          label: '待审核',
          value: 0
        },
        {
          label: '审核通过',
          value: 1
        },
        {
          label: '审核未通过',
          value: 2
        }],
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
              title: '注册日期',
              key: 'createTime'
          },
          {
              title: '申请认证日期',
              key: 'submitTime'
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
            key: 'address'
          },
          {
            title: '所属类型',
            key: 'type'
          },
          {
            title: 'logo',
            key: 'logo'
          },
          {
            title: '人均消费',
            key: 'price'
          },
          {
            title: '店铺封面',
            key: 'price'
          },
          {
            title: '调酒师信息',
            
          },
          {
            title: '调酒师照片',
            
          },
          {
            title: '店铺简介',
            key: 'desc'
          },
          {
            title: '审核状态',
            key: 'auditStatus'
          },
          {
              title: '操作',
              render: (h,params) => {
                return h('div', [
                h('a', {
                  props: {
                    href: "javascript:void(0)"
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: '审核确认',
                        content: '是否已确认商家信息无误，审核通过后将可以开启预约！',
                        onOk: () => {
                          
                        }
                      });

                    }
                  }}, '审核通过')
                ])
              }
          },
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
    getAuthList() {
      get_auth_list(this.query).then(res => {
        console.log(res)
      }).catch(error => {

      })
    }
  },
  mounted () {
    this.getAuthList()
  },
  beforeCreate () {
  },
  created () {
  },
  activated () {
  }
}
</script>
