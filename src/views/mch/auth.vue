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
      <Button type="primary" style="margin-left:20px;" @click="onSerach">搜索</Button>
      <Button  @click="onReset">重置</Button>
      <Button type="primary" style="margin-left:20px;" @click="onSetDefaultRate">修改默认结算比例</Button>
    </div>
    <Table stripe :columns="columns1" :data="list" height="450"></Table>
    <div style="padding-top:30px;text-align:center;">
      <Page :total="dataCount" border show-total :current="startRow" :page-size="query.pageSize" @on-change="changepage"/>
    </div>
    <!-- 店铺简介  -->
     <Modal :title="layerTitle" v-model="introVisible">
      <p>{{mchIntro}}</p>
      <div slot="footer"></div>
    </Modal>
    <!-- 查看封面 -->
    <Modal :title="layerTitle" v-model="imgVisible">
      <div class="cover-frame">
        <img class="cover-img" v-for="(cover, idx) in coverImgList" :key="idx" :src="staticURL(cover.img)" alt="">
      </div>
      <div slot="footer"></div>
    </Modal>
    <!-- 查看调酒师 -->
    <Modal :title="layerTitle" v-model="bartenderVisible">
      <div class="bartender-frame">
        <div class="bartender-item" v-for="(bartender, idx) in bartenderList" :key="idx">
          <img :src="staticURL(bartender.img)" alt="">
          <div>姓名：{{bartender.chName}}({{bartender.enName}})</div>
          <p>简介：{{bartender.desc}}</p>
        </div>
      </div>
      <div slot="footer"></div>
    </Modal>
    <!-- 查看logo -->
    <Modal :title="imgTitile" v-model="visible">
      <img :src="staticURL(imgSrc)" v-if="visible" style="width: 100%">
      <div slot="footer"></div>
    </Modal>
    <!-- 调整结算比例 -->
    <Modal
      v-model="visibleShow.manualSetShow"
      title="调整结算比例"
      :closable="false"
      cancel-text="暂不修改"
      ok-text="修改并保存"
      @on-ok="manualSetYes"
      @on-cancel="manualSetCancel">
      <p>平台设置的默认结算比例为平台：{{ defaultRate.platformRate }}%，商家：{{ defaultRate.merchantRate }}%；</p>
      <p>您可将此商家还原成默认比例,<a href="javascript:void(0)" style="margin-left: 10px;" @click="restoreRate">立即还原</a></p>
      <p>或自定义结算比例</p>
       <i-form label-position="left" :label-width="80">
         <Form-item label="当前商家：">
            {{ curShop.name }}
        </Form-item>
        <Form-item label="商家收益：">
          <Row>
            <i-col span="18">
              <Input type="number" v-model="manualInput.input1" placeholder="例如占80" />
            </i-col>
            <i-col span="4" offset="1">%</i-col>
          </Row>
        </Form-item>
      </i-form>
      <AccountTips/>
    </Modal>
    <!-- 设置，修改默认结算比例 -->
    <Modal
      v-model="visibleShow.defaultSetShow"
      :title="defalutSetInfo[defalutSetIndex].title"
      :closable="false"
      :cancel-text="defalutSetInfo[defalutSetIndex].cancelText"
      :ok-text="defalutSetInfo[defalutSetIndex].okText"
      @on-ok="defalutSetYes"
      @on-cancel="defalutSetCancel">
      <i-form label-position="left" :label-width="80">
        <Form-item label="商家收益：">
          <Row>
            <i-col span="18">
                <Input type="number" v-model="defaultInput.input1" placeholder="例如占80" />
            </i-col>
            <i-col span="4" offset="1">%</i-col>
          </Row>
        </Form-item>
      </i-form>
      <AccountTips/>
    </Modal>
  </div>
</template>
<script>
import {
  get_auth_list, 
  merchant_audit,
  get_cover, 
  get_bartender,
  modification_default_rate,
  modification_manual_rate,
  get_default_rate,
  post_restore_rate } from "@/api/mch"
import AccountTips from "@/components/AccountTips"
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
      visible: false,//查看logo
      imgTitile: '',//查看logo标题
      startRow: 1, // 当前页面
      list: [],//认证列表
      timeArr: [],
      dataCount:0,//总条数
      //简介
      mchIntro: '',
      introVisible: false,
      layerTitle: '',
      //封面图
      coverImgList: [],
      imgVisible: false,
      //调酒师bartender
      bartenderList: [],
      bartenderVisible: false,
      // 结算比例
      defaultRate: {
        merchantRate: 0,
        platformRate: 0
      },
      visibleShow: {
        manualSetShow: false,
        defaultSetShow: false
      },
      manualInput: {
        input1: ""
      },
      curShop: {
        id: "",
        name: ""
      },
      defalutSetInfo: [
        { 
          title: "设置默认结算比例",
          cancelText: "暂不设置",
          okText: "设置并使用",
          twoTitle: "设置确认",
          content: "确定按照该默认比例与商家进行结算吗？设置后系统在结算时将按照此比例进行拆分付款！"
        },
        { 
          title: "修改默认结算比例",
          cancelText: "暂不修改",
          okText: "修改并使用",
          twoTitle: "修改确认",
          content: "确定修改默认比例与商家进行结算吗？设置后系统在结算时将按照此比例进行拆分付款！"
        }
      ],
      defalutSetIndex: 1,
      defaultInput: {
        input1: ""
      },
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
            key: 'nickName',
            width:100
          },
          {
            title: '手机号',
            key: 'phone',
            width:120
          },
          {
            title: '注册日期',
            key: 'registDate',
            width:100
          },
          {
            title: '申请认证日期',
            key: 'submitDate',
            width:110
          },
          {
            title: '商家名称',
            key: 'name',
            width:100
          },
          {
            title: '所在区域',
            key: 'area',
            width:120
          },
          {
            title: '详细地址',
            key: 'address',
            width:160
          },
          {
            title: '所属类型',
            width:100,
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
            width:100,
            render: (h,params) => {
              return h('img',{
                attrs: {
                  src: this.staticURL(params.row.logo),
                  style: 'width:100%;padding:5px;'
                },
                 on: {
                  click: () => {
                    this.lookBigImg(params.row.logo, params.row.name)
                  }
                }
              })
            }
          },
          {
            title: '人均消费',
            width:100,
            key: 'price'
          },
          {
            title: '店铺封面',
            width:100,
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
                    this.imgVisible = true
                    this.layerTitle = params.row.name
                    this.getCover({id: params.row.id})
                  }
                }}, '查看封面')
              ])
            }
          },
          {
            title: '调酒师',
            width:110,
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
                    this.bartenderVisible = true
                    this.layerTitle = params.row.name
                    this.getBartender({id: params.row.id})
                  }
                }}, '查看调酒师')
              ])
            }
          },
          {
            title: '店铺简介',
            width:100,
            key: 'desc',
            render: (h,params) => {
              return h('a',{
                on: {
                  click: () => {
                    this.mchIntro = params.row.desc
                    this.introVisible = true;
                    this.layerTitle = params.row.name
                  }
                }
              }, '查看简介')
            }
          },
          {
            title: '结算比例',
            width: 100,
            key: 'rate',
            render: (h, params) => {
              const shopRate = params.row.rate;
              let terraceRate = 100 - shopRate;
              terraceRate = terraceRate >= 0?terraceRate: 0;
              return ('div', [
                h('p', `平台：${terraceRate}%`),
                h('p', `商家：${shopRate}%`)
              ])
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
              title: '操作',
              width: 260,
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
                }}, '审核不通过'),
                h('a', {
                  props: {
                    href: "javascript:void(0)"
                  },
                  on: {
                    click: () => {
                      this.curShop.id = params.row.id;
                      this.curShop.name = params.row.name;
                      this.visibleShow.manualSetShow = true;
                    }
                  }
                }, '调整结算比例')
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
        this.startRow = 1
        this.getAuthList()
      }).catch(error => {

      })
    },
    // 搜索按钮事件
    onSerach() {
      this.query.pageNum = 1
      this.startRow = 1
      this.query.id = ''
      this.getAuthList()
    },
    // 重置按钮事件
    onReset() {
      this.query.id = ''
      this.query.queryStr = ''
      this.query.beginTime = ''
      this.query.endTime = ''
      this.query.auditStatus = -1
      this.query.pageNum = 1
      this.startRow = 1
      this.timeArr = []
      this.getAuthList()
    },
    //获取封面图
    getCover(data) {
      get_cover(data).then(res  => {
        this.coverImgList = res.data
      }).catch(error => {

      })
    },
    //查看大图
    lookBigImg (imgUrl, title) {
      this.imgSrc = imgUrl;
      this.imgTitile = title;
      this.visible = true;
    },
    //获取调酒师信息
    getBartender(data) {
      get_bartender(data).then(res => {
        this.bartenderList = res.data
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
      this.query.beginTime = '';
      this.query.beginTime = '';
    },
    //日历改变
    date_change(date) {
      this.query.beginTime = date[0]
      this.query.beginTime = date[1]
    },
    // 调整结算比例
    manualSetYes(){
      this.$Modal.confirm({
      title: '调整确认',
      content: '<p>确定自定义该商家的结算比例吗？调整后系统在结算时将按照此比例向该商家进行拆分付款！</p>',
        onOk: () => {
          this.modificationManualRate({ mid: this.curShop.id, rate: this.manualInput.input1 })
        },
        onCancel: () => {
        }
    });
    },
    manualSetCancel(){
    },
    restoreRate(){
      this.postRestoreRate({
        mid: this.curShop.id
      })
    },
    // 设置，修改默认比例
    onSetDefaultRate(){
      this.visibleShow.defaultSetShow = true;
    },
    defalutSetYes(){
      this.$Modal.confirm({
        title: this.defalutSetInfo[this.defalutSetIndex].twoTitle,
        content: '<p>'+ this.defalutSetInfo[this.defalutSetIndex].content + '</p>',
         onOk: () => {
           this.modificationDefaultRate({ rate: this.defaultInput.input1 })
          },
          onCancel: () => {
          }
      });
    },
    defalutSetCancel(){
    },
    modificationDefaultRate(data){
      modification_default_rate(data).then( res => {
        const tips = this.defalutSetIndex === 0 ? "设置成功" : "修改成功";
        this.getAuthList()
        this.getDefaultRate()
        this.$Message.success(tips);
      }).catch( err => {
        console.error(err)
      })
    },
    modificationManualRate(data){
      modification_manual_rate(data).then( res => {
        this.getAuthList()
        this.$Message.success('修改成功');
      }).catch( err => {
        console.error(err)
      })
    },
    getDefaultRate(){
      get_default_rate().then( res => {
        console.log(res)
        const data = res.data;
        this.defaultRate.merchantRate = data.merchantRate;
        this.defaultRate.platformRate = data.platformRate;
      }).catch( err => {
        console.error(err)
      }) 
    },
    postRestoreRate(data){
      post_restore_rate(data).then( res => {
        this.getAuthList();
        this.visibleShow.manualSetShow = false;
        this.$Message.success('修改成功');
      }).catch( err => {
        console.error(err)
      }) 
    }
    
  },
  mounted () {
    this.getAuthList();
    this.getDefaultRate()
  },
  beforeCreate () {
  },
  created () {
  },
  activated () {
  },
  components: {
    AccountTips
  }
}
</script>
<style scoped>
  .cover-frame {
    overflow-x: auto;
    overflow-y: hidden;
    height:280px;
    white-space: nowrap;
  }
  .cover-img{
    width:auto;
    height:100%;
    margin-right:10px;
  }
  .bartender-frame {
    overflow-x: scroll;
    min-height: 500px;
    display: flex;
  }
  .bartender-item{
    margin-right:10px;
    width: 200px;
    height: 400px;
    font-size: 0;
  }
  .bartender-item img{
    width:200px;
    height:300px;
  }
  .bartender-item p{
    padding-top: 10px;
    width:200px;
    line-height: 20px;
    font-size: 12px;
  }
  .bartender-item div{
    padding-top: 10px;
    font-weight: bold;
    line-height: 20px;
    font-size: 12px;
  }
</style>