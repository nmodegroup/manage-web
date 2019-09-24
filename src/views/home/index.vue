<template>
  <div>
    <div class="header-bar">顶部banner图管理 <span class="tips">提示：未启用的banner才可以编辑</span></div>
    <div class="index-body">
      <div class="banner-item" v-for="(banner, idx)  in bannerList" :key="idx" @click="onSelUpload(idx)">
        <span class="banner-tips" v-show="banner.onStatus !== ''">
          {{ !isNaN(banner.onStatus) && banner.onStatus == 0 ? '已启用' : '未启用'}}
        </span>
        <Upload :action="action" :headers="headers" :show-upload-list="false"
        :on-success="handleSuccess" :data ="uploadForm"
        :before-upload="handleBeforeUpload"
        :on-format-error="handleFormatError"
        :disabled="banner.onStatus === 0"
        :format ="['jpg', 'jpeg']"
        >
          <div class="banner-img-frame">
            <div class="banner-add" v-show="!banner.img">
              <img src="../../../static/img/icon_add.png">
              <div class="banner-add-tips">点击添加图片</div>
            </div>
            <img v-show="banner.img" class="banner-img" :src="staticURL(banner.img)" alt="">
          </div>
        </Upload>
        <div class="banner-btn-frame">
          <div class="btn-join" @click="onJoin(banner, idx)">
            <span :class="[banner.name ? '' : 'arrow']">{{banner.name ? '已选择：' + banner.name : '点击选择banner的跳转链接'}}</span> 
          </div>
          <div class="btn-save-frame">
            <Button style="width:100px;margin-right:10px;" type="primary" @click="onSaveBanner(idx)">保存banner</Button>
            <Button style="width:100px;" @click="onToggleBanner(banner)" v-show="banner.id">{{banner.onStatus ? '启用' : '停用'}}</Button>
          </div>
        </div>
      </div>
    </div>
    <div class="header-bar" style="padding-top: 20px;">人气酒吧管理<span class="tips">提示：未启用的人气酒吧才可以编辑</span></div>
    <div class="index-body">
      <div class="bar-item" v-for="(bar, index)  in barList" :key="index">
        <span class="bar-tips" v-show="bar.onStatus !== ''">
          {{ !isNaN(bar.onStatus) && bar.onStatus == 0 ? '已启用' : '未启用'}}
        </span>
        <div v-show="bar.onStatus !==''">
          <div class="bar-header">
            <div class="bar-header-r">
              <img class="bar-cover" :src="staticURL(bar.img)">
              <div class="bar-content">
                <div class="bar-name">{{bar.name}}</div>
                <div class="bar-time">
                  <img class="icon-time" src="../../../static/img/icon_time.png">
                  <span v-for="(time, idx) in bar.times" :key="idx" style="padding-right:5px;" v-show="idx < 2">{{time.begin}}-{{time.end}}</span>
                </div>
                <div class="bar-address">
                  <img class="icon-adre" src="../../../static/img/icon_location.png">
                  {{bar.address}}
                </div>
              </div>
            </div>
            <div class="bar-header-l">
              <div class="btn-tips">{{bar.type == 1 ? '餐吧' : (bar.type == 2 ? '清吧' : '其他')}}</div>
            </div>
          </div>
          <div class="banner-btn-frame">
            <div class="btn-join"  @click="onSelMch(2, index, bar)">替换</div>
            <div class="btn-save-frame">
              <Button style="width:100px;margin-right:10px;" type="primary" @click="onSaveBar(index)">保存人气酒吧</Button>
              <Button style="width:100px;" @click="onToggleBar(bar)" v-show="bar.id">{{bar.onStatus ? '启用' : '停用'}}</Button>
            </div>
          </div>
          <!-- <div class="bar-btn">
            <Button type="primary" style="width:100px;" @click="onSelMch(2, index)">替换</Button>
            <Button  style="width:100px;" >启用</Button>
          </div> -->
        </div>
        <div class="banner-add" v-show="bar.onStatus === ''" @click="onSelMch(2, index, bar)">
          <img src="../../../static/img/icon_add.png">
          <div class="banner-add-tips">选择一个商家</div>
        </div>
      </div>
    </div>
    <Modal
      v-model="joinModal"
      width="400"
      title="请选择banner关联活动或商家">
      <div class="join-btn-frame">
        <Button @click="onSelActivity">选择活动</Button>
        <Button @click="onSelMch(1)">选择商家</Button>
      </div>
      <div slot="footer"></div>
    </Modal>
    <Modal
      v-model="mchModal"
      @on-ok="onMchOk"
      width="400"
      title="请选择一个商家">
      <div class="join-btn-frame">
        <RadioGroup v-model="selMchIdx">
          <div class="radio-item"  v-for="(item, idx) in list" :key="idx"> 
            <Radio :label="idx">
              <span>{{item.name}}</span>
            </Radio>
          </div>
        </RadioGroup>
      </div>
    </Modal>
    <Modal
      v-model="activityModal"
      width="400"
      @on-ok="onActivityOk"
      title="请选择一个活动 ">
      <div class="join-btn-frame">
        <RadioGroup v-model="selActivityIdx">
          <div class="radio-item" v-for="(item, idx) in list" :key="idx"> 
            <Radio :label="idx">
              <span>{{item.theme}}</span>
            </Radio>
          </div>
        </RadioGroup>
      </div>
    </Modal>
  </div>
</template>
<script>
import {get_homePage, get_mch_list, get_activity_list,
toggle_banner, update_bar, get_mch_info, update_banner,
toggle_bar} from "@/api/index"
import constant from "../../constant.js"
export default {
  data () {
    return {
      switch1: false,
      joinModal: false,
      activityModal: false,
      mchModal: false,
      list: [],//活动、商家列表
      barList: [],//酒吧列表
      bannerList: [],//banner图列表
      roleMch: '',//1:banner选择商家 2：人气酒吧选择商家
      action: '',//上传图片地址
      headers: {//设置上传请求头部
        token: ''
      },
      uploadForm: {//上传文件传的参数
        floder: 'web_image',//保存到的文件夹
        fileName: ''//带扩展的文件名
      },
      selMchIdx: '',//选中的商家列表下标
      selActivityIdx: '',//选中的活动列表下标
      selBannerIdx: '',//选择banner图的下标
      selBarIdx: ''//选择的人气酒吧下标
    }
  },
  methods: {
    //点击关联
    onJoin(banner, idx) {
      this.selBannerIdx = idx
      if (banner.onStatus === 0) {
        this.$Message.warning('停用之后才可以编辑')
        return
      }
      this.joinModal = true
    },
    //点击选择活动
    onSelActivity () {
      this.joinModal  = false
      this.activityModal = true
      this.getActivityList()
    },
    //点击选择商家
    onSelMch (value, index, bar) {
      this.roleMch = value
      this.selBarIdx = index
      this.joinModal = false
      if (bar && bar.onStatus === 0) {
        this.$Message.warning('停用之后才可以编辑')
        return
      }
      this.mchModal = true
      this.getMchList()
    },
    //获取首页信息
    getHomePage () {
      get_homePage().then(res => {
        let barList = res.data.bar
        let bannerList = res.data.banner
        if (bannerList.length < 4) {//四个banner位置
          for (let i = bannerList.length + 1; i < 5; i++) {
            let form = {
                  id: '',//banner id，新增不传，修改必传
                  img: '',//banner url
                  objId: '',//商铺或活动id
                  type: '',//关联类型（0商家 1活动）
                  name: '',//酒吧名称或活动名称
                  onStatus: '',//是否启用展示(0启用  1关闭)
                  order: i//排序 (数值越小越靠前)
                }
            bannerList.push(form)
          }
        }
        if (barList.length < 3) {//三个人气就把位置
          for (let i = barList.length + 1; i < 4; i++) {
            let form = {
                  id: '',//人气酒吧id，新增不传，修改必传
                  mid: '',//商铺id
                  onStatus: '',//是否启用展示(0启用  1关闭)
                  order: i//排序 (数值越小越靠前)
                }
            barList.push(form)
          }
        }
      this.bannerList = bannerList
      this.barList = barList
      }).then(error => {

      })
    },
    //上传图片成功回调
    handleSuccess ( res, file, fileList) {
      this.bannerList[this.selBannerIdx].img = res.data
    },
    //上传图片之前
    handleBeforeUpload (res) {
      this.uploadForm.fileName = res.name
    },
    //上传文件格式错误提示
    handleFormatError(file){
      this.$Message.warning('文件 ' + file.name + ' 格式不正确，请上传.jpg或者.jpeg文件。')
    },
    //获取商家列表
    getMchList () {
      get_mch_list().then(res => {
        this.list = res.data
      }).catch(error => {

      })
    },
    //获取活动列表
    getActivityList () {
      get_activity_list().then(res => {
        this.list = res.data
      }).catch(error => {
        
      })
    },
    //设置上传文件地址
    setFileUrl () {
      this.action = constant.globalData.baseURL + '/common/upload'
    },
    //选择哪个banner
    onSelUpload (idx) {
      this.selBannerIdx = idx
    },
    //启用禁用banner
    onToggleBanner (banner) {
      let text = banner.onStatus == 1 ? '（启用）' : '（停用）'
      let that = this
      this.$Modal.confirm({
          title: '提示',
          content: `是否${text}banner图`,
          onOk: () => {
            toggle_banner({id:banner.id}).then(res => {
              this.$Message.success(`banner图${text}成功`)
              that.getHomePage()
            }).catch(error => {})
          },
          onCancel: () => {
            
          }
      })
    },
    //停用启用bar
    onToggleBar(bar) {
      let text = bar.onStatus == 1 ? '（启用）' : '（停用）'
      let that = this
      this.$Modal.confirm({
          title: '提示',
          content: `是否${text+bar.name}`,
          onOk: () => {
            toggle_bar({id:bar.id}).then(res => {
              this.$Message.success(`人气酒吧${text}成功`)
              that.getHomePage()
            }).catch(error => {})
          },
          onCancel: () => {}
      })
    },
    //选择商家确认
    onMchOk() {
      if (this.roleMch == 1) {
        this.bannerList[this.selBannerIdx].objId =  this.list[this.selMchIdx].id
        this.bannerList[this.selBannerIdx].name =  this.list[this.selMchIdx].name
        this.bannerList[this.selBannerIdx].type = 0
      } else if (this.roleMch == 2) {
        let id =  this.list[this.selMchIdx].id
        this.getMchinfo(id)
      }
    },
    //或选择活动确认
    onActivityOk() {
      this.bannerList[this.selBannerIdx].objId =  this.list[this.selActivityIdx].id
      this.bannerList[this.selBannerIdx].name =  this.list[this.selActivityIdx].theme
      this.bannerList[this.selBannerIdx].type = 1
    },
    //保存banner
    onSaveBanner(idx) {
      if (!this.bannerList[idx].img) {
        this.$Message.warning('请上传图片')
      } else if (!this.bannerList[idx].objId) {
        this.$Message.warning('请选择banner跳转连接')
      } else {
        update_banner(this.bannerList[idx]).then(res => {
          this.$Message.success('banner图保存成功')
          this.getHomePage()
        }).catch(error =>{})
      }
    },
    //保存酒吧
    onSaveBar(idx) {
      let bar = this.barList[idx]
      console.log(bar)
      let form = {
        id: bar.id,
        mid: bar.mid,
        onStatus: bar.onStatus,
        order: bar.order
      }
      update_bar(form).then(res => {
        this.$Message.info('人气酒吧保存成功')
        this.getHomePage()
      }).catch(error => {})
    },
    //根据ID获取商家信息
    getMchinfo(id) {
      get_mch_info({id: id}).then(res => {
        let order = this.barList[this.selBarIdx].order//保存之前order
        let id = this.barList[this.selBarIdx].id//保存之前id
        if (res.data) {
          let form = {
            address : res.data.address,
            mid: res.data.id,
            img: res.data.img,
            name: res.data.name,
            times: res.data.times,
            type: res.data.type,
            id:  id,
            order: order,
            onStatus: 1
          }
          this.$set(this.barList,this.selBarIdx, form)
        }
      }).catch(error => {})
    }
  },
  mounted () {
    this.getHomePage()
    this.setFileUrl()
    this.headers.token = localStorage.getItem("token") || ''
  },
  beforeCreate () {
  },
  created () {
  },
  activated () {
  }
}
</script>
<style scoped>
  .index-body {
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
  }
  .banner-item{
    width:368px;
    height:360px;
    background:rgba(248, 248, 251, 1);
    border-radius:10px;
    margin-right: 20px;
    padding:10px;
    position: relative;
  }
  .banner-img-frame {
    height: 218px;
    border-radius:4px;
    border:1px dashed rgba(0,0,0,.2);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .banner-img{
    width:348px;
    height:218px;
  }
  .banner-add{
    cursor: pointer;
    width:368px;
    text-align: center;
  } 
  .banner-btn-frame{
    padding-top:7px;
    padding-bottom: 5px;
  }
  .btn-join{
    width:255px;
    height: 60px;
    background:rgba(58,124,221,1);
    border-radius:4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    width:348px;
    color:#fff;
  }
  .btn-join span{
    padding-right:11px;
    color:rgba(248, 248, 251, 1);
    font-size: 14px;
    position: relative;
  }
  .btn-join span.arrow::after{
    content: '';
    position:absolute;
    right:0;
    top:0;
    bottom:0;
    width:8px;
    height: 8px;
    margin: auto;
    border:1px solid transparent;
    border-top-color: rgba(248, 248, 251, 1);
    border-right-color: rgba(248, 248, 251, 1);
    transform: rotate(45deg)
  }
  .bar-item {
    background-color: rgba(248, 248, 251, 1);
    width:367px;
    height: 278px;
    margin-right: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .bar-header{
    display: flex;
    padding:30px 11px 16px;
    border-bottom: 1px solid rgba(0, 0, 0, .1);
    align-items: center;
    justify-content: space-between;
    width:367px;
  }
  .bar-header-r{
    display: flex;
  }
  .bar-cover {
    width:104px;
    height:80px;
    border-radius:4px;
  }
  .bar-content {
    padding-left: 8px;
  }
  .bar-name {
    color:rgba(0, 0, 0, 1);
    font-size: 17px;
    padding-bottom: 15px;
  }
  .bar-time{
    display: flex;
    color:rgba(0, 0, 0, .5);
    font-size: 13px;
    padding-bottom: 6px;
    align-items: center;
  }
  .bar-address {
    color:rgba(0, 0, 0, .5);
    font-size: 13px;
    align-items:center;
    width: 170px;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
    height:22px;
  }
  /* .bar-btn {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 11px;
  } */
  .btn-tips {
    width:40px;
    height:20px;
    border-radius:1px;
    opacity:0.8;
    border:1px solid rgba(206,91,235,1);
    font-size:12px;
    color:rgba(228,99,255,1);
    text-align: center;
    line-height: 18px;
  }
  .icon-time {
    width:14px;
    height: 14px;
    margin-right: 4px;
  }
  .icon-adre {
    width:14px;
    height: 14px;
    margin-right: 4px;
    align-self: flex-start;
  }
  .join-btn-frame {
    display: flex;
    justify-content: space-between;
  }
  .radio-item {
    padding-bottom: 15px;
  }
  .btn-save-frame {
    display: flex;
    padding-top: 10px;
    justify-content: center;
  }
  .banner-tips {
    background-color: rgba(0, 0, 0, .5);
    padding: 2px 8px;
    color:#fff;
    position:absolute;
    top:10px;
    left:10px;
    font-size: 11px;
  }
  .bar-tips {
    background-color: rgba(0, 0, 0, .5);
    padding: 2px 8px;
    color:#fff;
    position:absolute;
    top:0;
    left:0;
    font-size: 11px;
  }
  .tips {
    font-size: 10px;
    color:gray;
    padding-left: 20px;
  }
</style>
