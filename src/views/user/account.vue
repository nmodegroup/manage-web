<template>
  <div>
    <div class="header-bar">
        <Input v-model="value" placeholder="输入用户昵称/手机号搜" search style="width:200px;"/>
          <span class="seach-lable">注册日期：</span><DatePicker type="daterange" placement="bottom-end" placeholder="请选择注册日期" style="width: 200px"></DatePicker>
          <span class="seach-lable">注册日期：</span> <DatePicker type="date" placeholder="请选择注册日期" style="width: 200px"></DatePicker>
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
      columns1: [
          {
              title: '头像',
              key: 'portrait'
          },
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
              title: '操作',
              width: 300,
              render: (h,params) => {
                return h('div', [
                h('a', {
                  style: {
                    "margin-right": "5px"
                  },
                  props: {
                    href: "javascript:void(0)"
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: '禁用提示',
                        content: '确认禁用该商家账号吗？禁用后账号将无法使用！',
                        onOk: () => {
                          const data = {
                            audit:2,
                            id: params.row.id,
                          };
                          this.auditOperation(data)
                        }
                      });

                    }
                  }}, '桌位预订信息'),
                h('a', {
                  style: {
                    "margin-right": "5px"
                  },
                  props: {
                    href: "javascript:void(0)"
                  }}, '桌位排位信息'),
                h('a', {
                  style: {
                    "margin-right": "5px"
                  },
                  props: {
                    href: "javascript:void(0)"
                  }}, '桌位预订信息')])
              }
          },
          {
              title: '桌位预订次',
              key: 'tableAppointNum'
          },
          {
              title: '桌位排位次',
              key: 'tableQueenNum'
          },
          {
            title: '活动预订次',
            key: 'activityAppointNum'
          }
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
  },
  beforeCreate () {
  },
  created () {
  },
  activated () {
  }
}
</script>
