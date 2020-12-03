<template>
  <div class="main-block">
    <div class="header-bar">
        <Button type="primary" @click="$router.back(-1)">
            <Icon type="ios-arrow-back" /> 返回
        </Button>
    </div>
    <div class="header-bar">
       <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="110" class="form-block">
           <FormItem label="商家名称" prop="mchId" style="width: 320px">
                <Select v-model="formValidate.mchId" placeholder="请选择商家" filterable>
                    <Option 
                     v-for="item in mchOptions" 
                     :value="String(item.id)" 
                     :key="item.id"
                    >{{ item.name }}</Option>
                </Select>
            </FormItem>
            <FormItem label="活动主题" prop="theme" style="width: 320px">
                <Input v-model="formValidate.theme" placeholder="请输入活动主题"/>
            </FormItem>
            <FormItem label="起止时间" prop="date" style="width: 320px">
                <DatePicker type="datetimerange" 
                placeholder="请选择活动时间" 
                style="width: 280px"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                v-model="formValidate.date"
                :value="formValidate.date"
                :options="disabledDateOptions"
                @on-change="onDateChange"
                ></DatePicker>
            </FormItem>
            <FormItem label="活动区域" required style="width: 620px">
                 <Row>
                    <Col span="6">
                        <FormItem prop="provinceId">
                            <Select v-model="formValidate.provinceId" placeholder="请选择省" @on-change="onChangeProvince">
                                <Option 
                                v-for="item in provinceOptions" 
                                :value="item.id" 
                                :key="item.id"
                                >{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem prop="cityId">
                            <Select v-model="formValidate.cityId" placeholder="请选择市" @on-change="onChangeCity">
                                <Option 
                                v-for="item in cityOptions" 
                                :value="item.id" 
                                :key="item.id"
                                >{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem prop="districtId">
                            <Select v-model="formValidate.districtId" placeholder="请选择区" @on-change="onChangeDistrict">
                                <Option 
                                v-for="item in districtOptions" 
                                :value="item.id" 
                                :key="item.id"
                                >{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                 </Row>
            </FormItem>
            <FormItem label="详细地址" prop="address" style="width: 320px">
                <Input v-model="formValidate.address" 
                 type="textarea" 
                 :autosize="{minRows: 2,maxRows: 5}" 
                 placeholder="请输入活动详细地址"
                />
            </FormItem>
            <FormItem label="联系电话" prop="phone" style="width: 320px">
                <Input v-model="formValidate.phone" type="number" placeholder="请输入联系电话" :minlength="11" :maxlength="11"/>
            </FormItem>
            <FormItem label="嘉宾信息" prop="guest" style="width: 320px">
                <Input v-model="formValidate.guest" placeholder="请输入嘉宾姓名（多个用'|'隔开）"/>
            </FormItem>
            <FormItem label="活动费用" required>
                 <Row>
                    <Col span="6">
                        <FormItem prop="costType">
                            <RadioGroup v-model="formValidate.costType" @on-change="onChangeCost">
                                <Radio label="0">免费参加</Radio>
                                <Radio label="1">付费参加</Radio>
                            </RadioGroup>
                        </FormItem>
                    </Col>
                    <Col span="4">
                        <FormItem prop="ticketPrice" v-if="formValidate.costType==='1'">
                            <Input v-model="formValidate.ticketPrice" type="number" placeholder="请输入门票价格"/>
                        </FormItem>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="限制预定数量" required>
                 <Row>
                    <Col :span="formValidate.costType!=='1'? '12': '6'">
                        <FormItem prop="reservation">
                            <RadioGroup v-model="formValidate.reservation">
                                <Radio label="0">不限</Radio>
                                <Radio label="1" v-if="formValidate.costType!=='1'">按系统已有桌位限制</Radio>
                                <Radio label="2">按固定名额限制</Radio>
                            </RadioGroup>
                        </FormItem>
                    </Col>
                    <Col span="5">
                        <FormItem prop="quotasNum" v-if="formValidate.reservation==='2'">
                            <Input v-model="formValidate.quotasNum" type="number" placeholder="请输入固定名额数量"/>
                        </FormItem>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="活动图片" required>
                 <Row>
                    <Col span="12">
                        <FormItem prop="banner" style="width: 345px;height: 160px;">
                            <Upload
                            type="drag"
                                :format="['jpg','jpeg','png']"
                                action=""
                                :show-upload-list="false"
                                :before-upload="handleBeforeUpload"
                                :on-format-error="handleFormatError"
                                >
                                <div class="banner-upload" v-if="!bannerPath">
                                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                                    <p>请上传一张活动宣传banner图</p>
                                </div>
                                <img :src="bannerPath" class="banner-upload" v-else/>
                            </Upload>
                            <Spin fix v-if="bannerLoading">
                                <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                                <div>上传中...</div>
                            </Spin>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem prop="poster" style="height: 600px; width: 345px">
                            <Upload
                            type="drag"
                            :format="['jpg','jpeg','png']"
                            action=""
                            :show-upload-list="false"
                            :before-upload="handleBeforeUploadPoster"
                            :on-format-error="handleFormatError"
                            >
                                <div class="detail-upload" v-if="!posterPath">
                                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                                    <p>请上传一张活动海报</p>
                                </div>
                                <img :src="posterPath" class="detail-upload" v-else/>
                            </Upload>
                             <Spin fix v-if="posterLoading">
                                <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                                <div>上传中...</div>
                            </Spin>
                        </FormItem>
                    </Col>
                </Row>
            </FormItem>
            <FormItem>
                <Button type="primary" style="width: 230px; margin-left: 20px" @click="handleSubmit('formValidate')">确认创建</Button>
                <!-- <Button @click="handleReset('formValidate')" style="margin-left: 8px">Reset</Button> -->
            </FormItem>
        </Form>
    </div>
 <!-- vueCropper 剪裁图片实现-->
        <Modal
        v-model="dialogVisible"
        title="图片剪裁"
        @on-ok="finish"
        @on-cancel="dialogVisible = false">
      <div class="cropper-content">
        <div class="cropper" style="text-align:center">
        <vueCropper
            ref="cropper"
            :img="option.img"
            :outputSize="option.size"
            :outputType="option.outputType"
            :info="true"
            :full="option.full"
            :canMove="option.canMove"
            :canMoveBox="option.canMoveBox"
            :original="option.original"
            :autoCrop="option.autoCrop"
            :fixed="option.fixed"
            :fixedNumber="option.fixedNumber"
            :centerBox="option.centerBox"
            :infoTrue="option.infoTrue"
            :fixedBox="option.fixedBox"
          ></vueCropper>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
import { get_mch_shops, post_update_activity, get_mch_shops_detail } from "@/api/mch"
import { get_city_all, get_city_list, get_city_district, getOssFileSign, uploadImage, getGeolocation } from "@/api/common"
export default {
  data () {
    return {
        id: this.$route.query.id || "",
        mchOptions: [],
        provinceOptions: [],
        cityOptions: [],
        districtOptions: [],
        provinceName: "",
        cityName: "",
        districtName: "",
        uploadHost: '',// 上传图片地址
        uploadData: {}, // 上传携带参数
        bannerPath: "",
        posterPath: "",
        jumpDate: [],
        disabledDateOptions: {
            disabledDate (date) {
                return date && date.valueOf() < (Date.now() - 24*3600*1000) ;
            }
        },
        formValidate: {
            mchId: '',
            theme: '',
            date: "",
            provinceId: "",
            cityId: "",
            districtId: "",
            address: "",
            phone: "",
            guest: "",
            costType: "",
            ticketPrice: "",
            reservation: "",
            quotasNum: "",
            banner: "",
            poster: "",
            lng: "",
            lat: ""
        },
        ruleValidate: {
            mchId: [
                { required: true, message: '请选择商家', trigger: 'change' }
            ],
            theme: [
                { required: true, message: '请输入活动主题', trigger: 'blur' }
            ],
            date: [
                { required: true, type: 'array', message: '请选择活动时间', trigger: 'change',
                    // fields: {
                    //     0: { required: true, message: "请选择活动时间", trigger: 'change' },
                    //     1: { required: true, message: '请选择活动时间', trigger: 'change' }
                    // }
                }
            ],
            provinceId: [
                { required: true, message: '请选择活动区域', trigger: 'change' }
            ],
            cityId: [
                { required: true, message: '请选择活动区域', trigger: 'change' }
            ],
            districtId: [
                { required: true, message: '请选择活动区域', trigger: 'change' }
            ],
            address: [
                { required: true, message: '请输入活动详细地址', trigger: 'blur' },
            ],
            phone: [
                { required: true, message: '请输入联系电话', trigger: ['blur', 'change'] },
                { min: 11, max: 11, message: '请输入11位数字', trigger: 'blur' }
            ],
            guest: [
                { required: true, message: '请输入嘉宾姓名', trigger: 'blur' },
            ],
            costType: [
                { required: true, message: '请选择活动费用类型', trigger: 'change' }
            ],
            reservation: [
                { required: true, message: '请选择限制预定数量类型 ', trigger: 'change' }
            ],
            banner: [
                { required: true, message: '请上传活动宣传banner', trigger: 'blur' }
            ],
            poster: [
                { required: true, message: '请上传活动海报', trigger: 'blur' }
            ],
            ticketPrice: [
                { required: true, message: '请输入门票价格', trigger: ['blur', 'change'] }
            ],
            quotasNum: [
                { required: true, message: '请输入固定名额数量', trigger: ['blur', 'change'] }
            ]
        },
        option: {
            img: '', // 裁剪图片的地址
            info: true, // 裁剪框的大小信息
            outputSize: 0.8, // 裁剪生成图片的质量
            outputType: 'jpeg', // 裁剪生成图片的格式
            canScale: false, // 图片是否允许滚轮缩放
            autoCrop: true, // 是否默认生成截图框
            // autoCropWidth: 300, // 默认生成截图框宽度
            // autoCropHeight: 200, // 默认生成截图框高度
            fixedBox: true, // 固定截图框大小 不允许改变
            fixed: true, // 是否开启截图框宽高固定比例
            fixedNumber: [7, 5], // 截图框的宽高比例
            full: true, // 是否输出原图比例的截图
            canMoveBox: false, // 截图框能否拖动
            original: false, // 上传图片按照原始比例渲染
            centerBox: false, // 截图框是否被限制在图片里面
            infoTrue: true // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
        },
        dialogVisible: false,
        fileinfo: "",
        uploadType: "",
        posterLoading: false,
        bannerLoading: false
    }
  },
  methods: {
      getMchShops(){
          get_mch_shops({
              queryStr: ""
          }).then(res => {
              this.mchOptions = res.data
          }).catch(error =>{})
      },
      async getMchShopsDetail(){
          const result = await get_mch_shops_detail({
              actId: this.id
          })
          this.jumpDate = result.date
          this.formValidate = { ... result }
          this.bannerPath = this.staticURL(result.banner)
          this.posterPath = this.staticURL(result.poster)
          await this.getCityList()
          await this.getCityDistrict()
          this.provinceName = this.getWantResult(this.provinceOptions, result.provinceId)
          this.cityName = result.cityName;
          this.districtName = result.districtName;
      },
      async postUpdateActivity(){
          let { mchId,
            theme,
            date,
            provinceId,
            cityId,
            districtId,
            address,
            phone,
            guest,
            costType,
            ticketPrice,
            reservation,
            quotasNum,
            lat,
            lng,
            banner,
            poster, } = this.formValidate
        let beginTime = this.jumpDate.length > 0 ? this.jumpDate[0]: date[0];
        let endTime = this.jumpDate.length > 0 ? this.jumpDate[1]: date[1];
        ticketPrice = costType==="0" ? "" : ticketPrice;
        quotasNum = reservation==="2" ? quotasNum : "";
        await post_update_activity({
            id: this.id,
            mid: mchId,
            theme,
            beginTime: beginTime,
            endTime: endTime,
            provinceId,
            cityId,
            areaId: districtId,
            cityName: "",
            areaName: "",
            address,
            phone,
            guest,
            quotaType: reservation,
            quota: quotasNum,
            isCharge: costType,
            charges: ticketPrice,
            banner,
            post: poster,
            lng,
            lat,
        })
      },
    handleSubmit (name) {
        this.$refs[name].validate(async (valid) => {
            if (valid) {
                const location = await this.geolocation()
                this.formValidate.lng = location.lng;
                this.formValidate.lat = location.lat;
                try{
                    await this.postUpdateActivity()
                    this.$Message.success('操作成功');
                    this.$router.push("/mch/activity")
                }catch(error){
                    console.log(error)
                    this.$Message.error(error.msg);
                }
            } else {
                return false
            }
        })
    },
    handleReset (name) {
        this.$refs[name].resetFields();
    },
    onDateChange(val){
        this.jumpDate = [];
        this.formValidate.date = [...val];
    },
    onChangeCost(val){
    },
    async getCityAll(){
        this.provinceOptions = await get_city_all()
    },
    async getCityList(){
        this.cityOptions = await get_city_list({
            id: this.formValidate.provinceId
        })
    },
    async getCityDistrict(){
        this.districtOptions = await get_city_district({
            id: this.formValidate.cityId
        })
    },
    onChangeProvince(val){
        this.getCityList()
        this.provinceName = this.getWantResult(this.provinceOptions, val)
    },
    onChangeCity(val){
        this.getCityDistrict()
        this.cityName = this.getWantResult(this.cityOptions, val)
    },
    onChangeDistrict(val){
        this.districtName = this.getWantResult(this.districtOptions, val)
    },
    getWantResult(arr, id){
        let name = "";
        arr.map( item => {
            if (item.id === id) {
                name = item.name
            }
        })
        return name
    },
    async handleBeforeUpload(file){
        const URL = this.getObjectURL(file)
        this.$nextTick(() => {
            this.option.img =  URL
            this.dialogVisible = true
        })
        this.fileinfo = file;
        this.uploadType = "banner";
        this.option.fixedNumber = [69, 32]
    },
    getObjectURL (file) {  
      let url = null ;   
      if (window.createObjectURL!=undefined) { // basic  
        url = window.createObjectURL(file) ;  
      } else if (window.URL!=undefined) { // mozilla(firefox)  
        url = window.URL.createObjectURL(file) ;  
      } else if (window.webkitURL!=undefined) { // webkit or chrome  
        url = window.webkitURL.createObjectURL(file) ;  
      }  
      return url ;  
    },  
    async handleBeforeUploadPoster(file){
        const URL = this.getObjectURL(file)
        this.$nextTick(() => {
            this.option.img =  URL
            this.dialogVisible = true
        })
        this.fileinfo = file
        this.uploadType = "poster";
        this.option.fixedNumber = [23, 40]
    },
    async handleUploadBanner(data, file){
        this.bannerLoading = true
        const result = await this.handleUploadImage("merchant/activity/banner", data, file)
        this.bannerPath = result.url;
        this.formValidate.banner = result.key;
        this.bannerLoading = false
    },
    async handleUploadPoster(data, file){
        this.posterLoading = true
        const result = await this.handleUploadImage("merchant/activity/poster", data, file)
        this.posterPath = result.url;
        this.formValidate.poster = result.key;
        this.posterLoading = false;
    },
    async handleUploadImage(floder, data, file){
        const result = await getOssFileSign({
            floder,
            fileName: file.name
        })
        let FormDatas = new FormData();
        FormDatas.append('key', result.key);
        FormDatas.append('policy', result.policy);
        FormDatas.append('OSSAccessKeyId', result.OSSAccessKeyId);
        FormDatas.append('success_action_status', result.success_action_status);
        FormDatas.append('signature', result.signature);
        FormDatas.append('file', data);
        try{
            await uploadImage(FormDatas)
            return result
        }catch(error){
            return result
        }
    },
    finish() {
      this.$refs.cropper.getCropBlob(async (data) => {
            if (this.uploadType === "banner") {
                this.handleUploadBanner(data, this.fileinfo)
            } else {
                this.handleUploadPoster(data, this.fileinfo)
            }
      })
    },
    handleFormatError(file){
      this.$Message.warning('文件 ' + file.name + ' 格式不正确，请上传.jpg或者.jpeg或者.png文件。')
    },
    geolocation(){
        const key = "S64BZ-C23KU-JWBVI-22WUI-FQW75-WTB44";
        const address =  this.provinceName + this.cityName + this.districtName + this.formValidate.address; //"北京市海淀区彩和坊路海淀西大街74号";
        const url = `https://apis.map.qq.com/ws/geocoder/v1/`
        return new Promise((resove, reject) => {
            this.$jsonp(url,{
	          key,
              output:'jsonp',
              address,
	        })
			.then(json => {
                if(json.status === 0){
                    const location = json.result.location;
                    resove(location)
                } else {
                    resove({
                        lng: "",
                        lat: ""
                    })
                }
			})
		    .catch(err => {
                console.log(err)
                reject({
                    lng: "",
                    lat: ""
                })
			})
        })
    }
         
  },
  async mounted () {
    this.mchOptions = await get_mch_shops({ queryStr: ""})
    this.provinceOptions = await get_city_all()
    if (this.id){
        this.getMchShopsDetail()
    }
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
.header-bar {
}
.main-block{
    /* min-width: 800px; */
    overflow-y: auto;
}
.form-block {
    width: 820px;
}
.banner-upload{
    width: 345px;
    height: 160px;
    display: flex;
    justify-content: center;
    flex-direction: column;
}
.detail-upload {
    width: 345px;
    height: 600px; 
    display: flex;
    justify-content: center;
    flex-direction: column;
}
.cropper-content .cropper {
    width: auto;
    height: 500px;
}
</style>
