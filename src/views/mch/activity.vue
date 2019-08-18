<template>
  <div>
    <div class="header-bar">
      <Input v-model="query.queryStr" placeholder="输入商家名称/手机号搜" search style="width:200px;"/>
      <span class="seach-lable">认证日期：</span><DatePicker type="daterange" placement="bottom-end" placeholder="请选择注册日期" style="width: 200px"></DatePicker>
      <span class="seach-lable">审核状态：</span>
      <Select style="width:100px" v-model="query.auditStatus">
        <Option v-for="item in auditStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <span class="seach-lable">活动执行状态：</span>
      <Select style="width:100px" v-model="query.execStatus">
        <Option v-for="item in execStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <span class="seach-lable">上架状态：</span>
      <Select style="width:100px" v-model="query.shelvesStatus">
        <Option v-for="item in shelvesStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
    </div>
    <Table stripe :columns="columns1" :data="data1"></Table>
    <div style="padding-top:30px;text-align:center;">
      <Page :total="100" show-total  style=""/>
    </div>
  </div>
</template>
<script>
import {get_activity_list, merchant_activity_audit} from "@/api/mch"
export default {
  data () {
    return {
      query: {
        pageSize: 10,
        pageNum: 1,
        queryStr: '',//商家名称或手机号
        auditStatus: -1,//审核状态(-1全部  0待审核 1审核通过 2审核未通过)
        execStatus: -1, //活动执行状态（-1全部  0待执行 1执行中 2已结束）
        shelvesStatus: -1,//上架状态(-1全部  0已上架 1已下架)
        beginTime: '',//认证日期开始时间
        endTime: ''//认证日期结束时间
      },
      startRow: 1, // 当前页面
      list: [],//活动列表
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
        }
      ],
      execStatusList: [
        {
          label: '全部',
          value: -1
        },
        {
          label: '待执行',
          value: 0
        },
        {
          label: '执行中',
          value: 1
        },
        {
          label: '已结束',
          value: 2
        }
      ],
      shelvesStatusList: [
        {
          label: '全部',
          value: -1
        },
        {
          label: '已上架',
          value: 0
        },
        {
          label: '已下架',
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
              title: '商家名称',
              key: 'createTime'
          },
          {
              title: '活动主题',
              key: 'createTime'
          },
          {
              title: '活动时间',
              key: 'tableAppointNum'
          },
          {
              title: '活动区域',
              key: 'tableQueenNum'
          },
          {
            title: '详细地址',
            key: 'activityAppointNum'
          },
          {
            title: '嘉宾信息',
            key: 'activityAppointNum'
          },
          {
            title: '开放预定名额',
            
          },
          {
            title: '活动宣传图',
            
          },
          {
            title: '审核状态',
            
          },
          {
            title: '活动状态',
            
          },
          {
            title: '是否下架',
            
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
                        content: '是否已确认商活动信息无误，审核通过后将可以开启预约！',
                        onOk: () => {
                          
                        }
                      });

                    }
                  }}, '审核通过'),
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
                  }}, '审核不通过'),
                  h('a', {
                  props: {
                    href: "javascript:void(0)"
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: '下架确认',
                        content: '是否确认强制将活动下架？请确认已和商家联系！',
                        onOk: () => {
                          
                        }
                      });

                    }
                  }}, '强制下架'),
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
