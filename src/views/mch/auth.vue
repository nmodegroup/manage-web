<template>
  <div>
    <div class="header-bar">
      <Input v-model="query.queryStr" placeholder="输入商家名称/手机号搜" search style="width:200px;"/>
      <span class="seach-lable">认证日期：</span>
      <DatePicker type="daterange" placement="bottom-end"
        placeholder="请选择注册日期" style="width: 200px"
        v-model="timeArr" @on-clear='clear_change' @on-change='date_change'></DatePicker>
      <span class="seach-lable">审核状态：</span>
      <Select style="width:100px" v-model="query.auditStatus">
        <Option v-for="item in auditStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
    </div>
    <Table stripe :columns="columns1" :data="list"></Table>
    <div style="padding-top:30px;text-align:center;">
      <Page :total="dataCount" border show-total :current="startRow" :page-size="query.pageSize" @on-change="changepage"/>
    </div>
  </div>
</template>
<script>
import {get_auth_list, merchant_audit,
get_cover, get_bartender} from "@/api/mch"
export default {
  data () {
    return {
      query: {
        pageSize: 10,
        pageNum: 1,
        queryStr: '',//商家名称或手机号
        auditStatus: -1,//审核状态(-1全部  0待审核 1审核通过 2审核未通过)
        beginTime: '',//认证日期开始时间
        endTime: '',//认证日期结束时间
        id: this.$route.params.id
      },
      startRow: 1, // 当前页面
      list: [],//认证列表
      timeArr: [],
      dataCount:0,//总条数
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
            key: 'registDate'
          },
          {
            title: '申请认证日期',
            key: 'submitDate'
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
            render: (h,params) => {
              let  text = ''
              switch (params.row.type) {
                case 0:
                  text = '其他'
                  break
                case 1:
                  text = '餐吧'
                  break
                case 2:
                  text = '清吧'
                  break
              }
              return h('div', text)
            }
          },
          {
            title: 'logo',
            render: (h,params) => {
              return h('img',{
                attrs: {
                  src: params.row.logo,
                  style: 'width:100%;padding:5px;'
                }
              })
            }
          },
          {
            title: '人均消费',
            key: 'price'
          },
          {
            title: '店铺封面',
            render: (h,params) => {
              return h('div', [
              h('a', {
                props: {
                  href: "javascript:void(0)"
                },
                style: {
                  "margin-right": "5px"
                },
                on: {
                  click: () => {
                    
                  }
                }}, '查看封面')
              ])
            }
          },
          {
            title: '调酒师',
            render: (h,params) => {
              return h('div', [
              h('a', {
                props: {
                  href: "javascript:void(0)"
                },
                style: {
                  "margin-right": "5px"
                },
                on: {
                  click: () => {
                    
                  }
                }}, '查看调酒师')
              ])
            }
          },
          {
            title: '店铺简介',
            key: 'desc'
          },
          {
            title: '审核状态',
            render: (h,params) => {
              let  text = ''
              switch (params.row.auditStatus) {
                case 0:
                  text = '待审核'
                  break
                case 1:
                  text = '审核通过'
                  break
                case 2:
                  text = `审核未通过(${params.row.reason})`
                  break
              }
              return h('div', text)
            }
          },
          {
              title: '操作',
              width:200,
              render: (h,params) => {
              return h('div', [
              h('a', {
                props: {
                  href: "javascript:void(0)"
                },
                style: {
                  "margin-right": "5px",
                  'color': params.row.auditStatus == 0 ? '' : 'gray'
                },
                on: {
                  click: () => {
                    if (params.row.auditStatus != 0) {
                      return
                    }
                    this.$Modal.confirm({
                      title: '审核确认',
                      content: '是否已确认商活动信息无误，审核通过后将可以开启预约！',
                      onOk: () => {
                        let data = {
                          type: 1,
                          id: params.row.id
                        }
                        this.merchantAudit(data)
                      }
                    });

                  }
                }}, '审核通过'),
                h('a', {
                props: {
                  href: "javascript:void(0)"
                },
                style: {
                "margin-right": "5px",
                'color': params.row.auditStatus == 0 ? '' : 'gray'
                },
                on: {
                  click: () => {
                    if (params.row.auditStatus != 0) {
                      return
                    }
                    this.$Modal.confirm({
                      render: (h) => {
                        return h('Input', {
                            props: {
                              title: '不通过原因',
                              value: this.reason,
                              autofocus: true,
                              placeholder: '请填写审核不通过原因，最多填写25个字',
                              type: 'textarea',
                              maxlength: 25
                            },
                            on: {
                              input: (val) => this.reason = val
                            }
                        })
                      },
                      onOk: () => {
                        const data = {
                          type:2,
                          reason: this.reason,
                          id: params.row.id
                        }
                        this.merchantAudit(data)
                      },
                      onCancel: () => this.reason = '' // 取消按钮清空不通过原因
                    });
                  }
                }}, '审核不通过')
              ])
            }
          },
      ]
    }
  },
  methods: {
    getAuthList() {
      get_auth_list(this.query).then(res => {
        this.list = res.data.list
        this.dataCount = res.data.totalSize
      }).catch(error => {

      })
    },
    //审核
    merchantAudit(data) {
      merchant_audit(data).then(res => {
        this.query.pageNum = 1
        this.getAuthList()
      }).catch(error => {

      })
    },
    //获取封面图
    getCover() {
      get_cover(data).then(res  => {

      }).catch(error => {

      })
    },
     // 页码改变
    changepage(index) {
      this.query.pageNum = index;
      this.startRow =  index
      this.getAuthList()
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
