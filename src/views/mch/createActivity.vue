<template>
  <div class="main-block">
    <div class="header-bar">
        <Button type="primary">
            <Icon type="ios-arrow-back" /> 返回
        </Button>
    </div>
    <div class="header-bar">
       <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="110" class="form-block">
           <FormItem label="商家名称" prop="mchId" style="width: 320px">
                <Select v-model="formValidate.mchId" placeholder="请选择商家">
                    <Option 
                     v-for="item in mchOptions" 
                     :value="item.id" 
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
                @on-change="onDateChange"
                ></DatePicker>
            </FormItem>
            <FormItem label="活动区域" prop="area" style="width: 320px">
                <Select v-model="formValidate.area" placeholder="请选择活动区域">
                    <Option 
                     v-for="item in areaOptions" 
                     :value="item.id" 
                     :key="item.id"
                    >{{ item.name }}</Option>
                </Select>
            </FormItem>
            <FormItem label="详细地址" prop="address" style="width: 320px">
                <Input v-model="formValidate.address" 
                 type="textarea" 
                 :autosize="{minRows: 2,maxRows: 5}" 
                 placeholder="请输入活动详细地址"
                />
            </FormItem>
            <FormItem label="联系电话" prop="phone" style="width: 320px">
                <Input v-model="formValidate.phone" placeholder="请输入联系电话"/>
            </FormItem>
            <FormItem label="嘉宾信息" prop="guest" style="width: 320px">
                <Input v-model="formValidate.guest" placeholder="请输入嘉宾姓名（多个用','隔开）"/>
            </FormItem>
            <FormItem label="活动费用" required>
                 <Row>
                    <Col span="6">
                        <FormItem prop="costType">
                            <RadioGroup v-model="formValidate.costType">
                                <Radio label="male">免费参加</Radio>
                                <Radio label="female">付费参加</Radio>
                            </RadioGroup>
                        </FormItem>
                    </Col>
                    <Col span="4">
                        <FormItem prop="ticketPrice">
                            <Input v-model="formValidate.ticketPrice" placeholder="请输入门票价格"/>
                        </FormItem>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="限制预定数量" required>
                 <Row>
                    <Col span="12">
                        <FormItem prop="reservation">
                            <RadioGroup v-model="formValidate.reservation">
                                <Radio value="0">不限</Radio>
                                <Radio value="1">按系统已有桌位限制</Radio>
                                <Radio value="2">按固定名额限制</Radio>
                            </RadioGroup>
                        </FormItem>
                    </Col>
                    <Col span="4">
                        <FormItem prop="quotasNum">
                            <Input v-model="formValidate.quotasNum" placeholder="请输入固定名额数量"/>
                        </FormItem>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="活动图片" required>
                 <Row>
                    <Col span="12">
                        <FormItem prop="banner" style="width: 345px;height: 160px;">
                            <Upload
                            :format="['jpg','jpeg','png']"
                                type="drag"
                                action="//jsonplaceholder.typicode.com/posts/">
                                <div style="width: 345px;height: 160px;">
                                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                                    <p>请上传一张活动宣传banner图</p>
                                </div>
                            </Upload>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem prop="poster" style="height: 600px; width: 345px">
                            <Upload
                                type="drag"
                                action="//jsonplaceholder.typicode.com/posts/">
                                <div style="height: 600px; width: 345px" >
                                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                                    <p>请上传一张活动海报</p>
                                </div>
                            </Upload>
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
  </div>
</template>
<script>
export default {
  data () {
    return {
        mchOptions: [{
            id: "11",
            name: "门没锁"
        }],
        areaOptions: [{
            id: "11",
            name: "吧台"
        }],
        formValidate: {
            mchId: '',
            theme: '',
            date: '',
            area: "",
            address: "",
            phone: "",
            guest: "",
            costType: "",
            ticketPrice: "",
            reservation: "",
            quotasNum: "",
            banner: "",
            poster: "",
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
                    fields: {
                        0: { required: true,  message: "请选择活动时间", trigger: 'change' },
                        1: { required: true,  message: '请选择活动时间', trigger: 'change' }
                    }
                }
            ],
            area: [
                { required: true, message: '请选择活动区域', trigger: 'change' }
            ],
            address: [
                { required: true, message: '请输入活动详细地址', trigger: 'blur' },
            ],
            phone: [
                { required: true, message: '请输入联系电话', trigger: 'blur' },
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
                { required: true, message: '请上传活动宣传banner', trigger: 'change' }
            ],
            poster: [
                { required: true, message: '请上传活动海报', trigger: 'change' }
            ],
        }
    }
  },
  methods: {
      handleSubmit (name) {
        console.log(this.formValidate)
        this.$refs[name].validate((valid) => {
            if (valid) {
                this.$Message.success('Success!');
            } else {
                this.$Message.error('Fail!');
            }
        })
    },
    handleReset (name) {
        this.$refs[name].resetFields();
    },
    onDateChange(val){
        console.log(val)
        this.formValidate.date = val;
    }
  },
  mounted () {
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
</style>
