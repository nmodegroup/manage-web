<template>
  <div>
    <div class="header-bar">
      <Input v-model="query.queryStr" placeholder="输入商家名称/手机号搜" search style="width:200px;"/>
      <span class="seach-lable">认证日期：</span>
      <DatePicker type="daterange" placement="bottom-end"
        placeholder="请选择认证日期" style="width: 200px"
        v-model="timeArr" @on-clear='clear_change' @on-change='date_change'></DatePicker>
      <span class="seach-lable">审核状态：</span>
      <Select style="width:100px" v-model="query.auditStatus">
        <Option v-for="item in auditStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
    </div>
    <div class="header-bar">
      <span>活动执行状态：</span>
      <Select style="width:100px" v-model="query.execStatus">
        <Option v-for="item in execStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <span class="seach-lable">上架状态：</span>
      <Select style="width:100px" v-model="query.shelvesStatus">
        <Option v-for="item in shelvesStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
      <Button type="primary" style="margin-left:20px;" @click="onSerach">搜索</Button>
      <Button  @click="onReset">重置</Button>
    </div>
    <div class="list-content">
      <Table  :columns="columns1" :data="list" height="450"></Table>
    </div>
    <div style="padding-top:30px;text-align:center;">
      <Page :total="dataCount" border show-total :current="startRow" :page-size="query.pageSize" @on-change="changepage"/>
    </div>
    <Modal :title="imgTitile" v-model="visible">
      <img :src="staticURL(imgSrc)" v-if="visible" style="width: 100%">
      <div slot="footer"></div>
    </Modal>

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
        endTime: '',//认证日期结束时间
        id: this.$route.params.id
      },
      timeArr: [],
      imgTitile: '',//大图标题
      visible:  false,//显示查看大图弹框
      dataCount:0,//总条数
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
            key: 'nickName',
            width:100
          },
          {
            title: '手机号',
            key: 'phone',
            width:130
          },
          {
            title: '商家名称',
            key: 'name',
            width:130
          },
          {
            title: '活动主题',
            key: 'theme',
            width:130
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
            title: '活动区域',
            key: 'area',
            width:120
          },
          {
            title: '详细地址',
            key: 'address',
            width:200
          },
          {
            title: '嘉宾信息',
            key: 'guest',
            width:130
          },
          {
            title: '开放预定名额',
            width:120,
            render: (h,params) => {
              let  text = params.row.quota == -1 ? '不限' : params.row.quota
              return h('div', text)
            }
          },
          {
            title: '活动宣传图',
            width:130,
            render: (h,params) => {
              return h('a',{
                 on: {
                  click: () => {
                    this.lookBigImg(params.row.post, params.row.nickName)
                  }
                }
              }, '点击查看大图')
            }
          },
          {
            title: '审核状态',
            width:100,
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
            title: '活动状态',
            render: (h,params) => {
              let  text = ''
              switch (params.row.execStatus) {
                case 0:
                  text = '待执行'
                  break
                case 1:
                  text = '执行中'
                  break
                case 2:
                  text = '已结束'
                  break
              }
              return h('div', text)
            }
          },
          {
            title: '是否下架',
            render: (h,params) => {
              let  text = ''
              switch (params.row.shelvesStatus) {
                case 0:
                  text = '已上架'
                  break
                case 1:
                  text = '已下架'
                  break
              }
              return h('div', text)
            }
          },
          {
            title: '操作',
            fixed: 'right',
            width:210,
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
                        this.merchantActivityAudit(data)
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
                        this.merchantActivityAudit(data)
                      },
                      onCancel: () => this.reason = '' // 取消按钮清空不通过原因
                    });
                  }
                }}, '审核不通过'),
                h('a', {
                props: {
                  href: "javascript:void(0)"
                },
                style: {
                  "margin-right": "5px",
                  'color': params.row.shelvesStatus == 1 ? 'gray' : ''
                },
                on: {
                  click: () => {
                    if (params.row.shelvesStatus == 1) {
                      return
                    }
                    this.$Modal.confirm({
                      title: '下架确认',
                      content: '是否确认强制将活动下架？请确认已和商家联系！',
                      onOk: () => {
                        let data = {
                          type: 3,
                          id: params.row.id
                        }
                        this.merchantActivityAudit(data)
                      }
                    })
                  }
                }}, '强制下架'),
              ])
            }
          },
      ]
    }
  },
  methods: {
    getActivityList() {
      get_activity_list(this.query).then(res => {
        this.list = res.data.list
        this.dataCount = res.data.totalSize
      }).catch(error => {

      })
    },
    //活动审核
    merchantActivityAudit (data) {
      merchant_activity_audit(data).then(res => {
        this.query.pageNum = 1
        this.getActivityList()
      }).catch(error => {

      })
    },
     //查看大图
    lookBigImg (imgUrl, title) {
      this.imgSrc = imgUrl;
      this.imgTitile = title;
      this.visible = true;
    },
    // 页码改变
    changepage(index) {
      this.query.pageNum = index;
      this.startRow =  index
      this.getActivityList()
    },
    // 搜索按钮事件
    onSerach() {
      this.query.pageNum = 1
      this.startRow = 1
      this.query.id = ''
      this.getActivityList()
    },
    // 重置按钮事件
    onReset() {
      this.query.id = ''
      this.query.queryStr = ''
      this.query.beginTime = ''
      this.query.endTime = ''
      this.query.auditStatus = -1
      this.query.execStatus = -1
      this.query.shelvesStatus = -1
      this.query.pageNum = 1
      this.startRow = 1
      this.timeArr = []
      this.getActivityList()
    },
    //清空日历
    clear_change() {
      this.query.beginTime = '';
      this.query.endTime = '';
    },
    //日历改变
    date_change(date) {
      this.query.beginTime = date[0]
      this.query.endTime = date[1]
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
