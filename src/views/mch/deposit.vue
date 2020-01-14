<template>
    <div>
        <div class="header-bar">
            <Select style="width:100px" v-model="query.status">
                <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Input v-model="query.queryStr" placeholder="输入商家名称/手机号搜" search style="width:200px;"/>
            <span class="seach-lable">提现时间：</span>
            <DatePicker type="daterange" placement="bottom-end"
             placeholder="请选择提现日期" style="width: 200px"
             v-model="timeArr" @on-clear='clearChange' @on-change='dateChange'>
            </DatePicker>
            <Button type="primary" style="margin-left:20px;" @click="onSerach">搜索</Button>
            <Button  @click="onReset">重置</Button>
        </div>
        <Table stripe :columns="columns1" :data="list" height="450"></Table>
        <div style="padding-top:30px;text-align:center;">
        <Page :total="dataCount" border show-total :current="startRow" :page-size="query.pageSize" @on-change="changepage"/>
        </div>
    </div>
</template>
<script>
import { get_extract_record, audit_extract_state } from "@/api/mch"
export default {
    data(){
        return {
            query: {
                pageSize: 10,
                pageNum: 1,
                status: -1,
                queryStr: "",
                extractTime: "",
                beginTime: "",
                endTime: ""
            },
            timeArr: [],
            statusList: [
                {
                    label: '不限',
                    value: -1
                },
                {
                    label: '待审核',
                    value: 0
                },
                {
                    label: '审核未通过',
                    value: 1
                },
                {
                    label: '转账中',
                    value: 2
                },
                {
                    label: '已到账',
                    value: 3
                },
                {
                    label: '转账失败',
                    value: 4
                },
            ],
            columns1: [
                {
                    title: '提现日期',
                    key: 'extractTime',
                    width: 150
                },
                 {
                    title: '提现人头像',
                    key: 'img',
                    width: 100,
                    render: (h,params) => {
                        return h('img',{
                            attrs: {
                                src: params.row.img,
                                style: 'width:100%; padding:5px;'
                            },
                        })
                    }
                },
                 {
                    title: '提现人昵称',
                    key: 'nickName',
                },
                 {
                    title: '商家名称',
                    key: 'shopName',
                },
                 {
                    title: '商家电话',
                    key: 'phone',
                    width: 120
                },
                 {
                    title: '账户余额',
                    key: 'balance',
                    width: 120
                },
                 {
                    title: '提现金额',
                    key: 'amount',
                    width: 120
                },
                 {
                    title: '收款账户',
                    key: 'payeeType',
                    width: 130,
                    render: (h, params) => {
                        let tip = ""
                        if (params.row.payeeType == 1) {
                            tip = "微信零钱";
                        } else if (params.row.payeeType == 2) {
                            tip = "银行卡";
                        } 
                        return h('span', tip)
                    }
                },
                 {
                    title: '到账日期',
                    key: 'extractTime',
                    width: 140
                },
                {
                    title: '提现状态',
                    key: 'status',
                    width: 130,
                    render: (h, params) => {
                        let  tip = ''
                        switch (params.row.status) {
                            case 0:
                                tip = '待审核'
                            break
                            case 1:
                                tip = `审核未通过(${params.row.reason})`
                            break
                            case 2:
                                tip = `转账中`
                            break
                            case 3:
                                tip = `已到账`
                            break
                            case 4:
                                tip = `转账失败(${params.row.reason})`
                            break
                        }
                        return h('span', tip)
                    }
                },
                {
                    title: '操作',
                    width: 180,
                    render: (h, params) => {
                        return h('div', [
                            h('a', {
                                props: {
                                    href: "javascript:void(0)"
                                },
                                style: {
                                    "margin-right": "5px",
                                    'color': params.row.status == 0 ? '' : 'gray'
                                },
                                on: {
                                    click: () => {
                                        if (params.row.status != 0) return
                                         this.$Modal.confirm({
                                            title: "审核确认",
                                            content: "确定该商家提现信息无误吗？审核通过后将直接付款至商家微信账户零钱。",
                                            onOk: () => {
                                                const data = {
                                                    type: 1,
                                                    reason: "",
                                                    id: params.row.id
                                                }
                                                console.log(data)
                                                this.auditExtractState(data)
                                            },
                                         })
                                    }
                                }
                            }, '审核通过'),
                            h('a', {
                                props: {
                                    href: "javascript:void(0)"
                                },
                                style: {
                                    "margin-right": "5px",
                                    'color': params.row.status == 0 ? '' : 'gray'
                                },
                                on: {
                                    click: () => {
                                        if (params.row.status != 0) return
                                        this.$Modal.confirm({
                                            title: "不通过原因",
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
                                                    type: 2,
                                                    reason: this.reason,
                                                    id: params.row.id
                                                }
                                                 console.log(data)
                                                this.auditExtractState(data)
                                            },
                                            onCancel: () => this.reason = '' // 取消按钮清空不通过原因
                                        });
                                    }
                                }
                            }, '审核不通过')
                        ])
                    }
                },
            ],
            list: [],
            // 总条数
            dataCount: 0,
            // 当前页
            startRow: 1,
            reason: ""
        }
    },
    mounted() {
        this.getExtractRecord()
    },
    methods: {
         // 清空日历
        clearChange() {
            this.query.beginTime = '';
            this.query.endTime = '';
        },
        // 日历改变
        dateChange(date) {
            console.log(date)
            this.query.beginTime = date[0]
            this.query.endTime = date[1]
        },
        onSerach(){
            this.query.pageNum = 1;
            this.startRow = 1;
            this.getExtractRecord()
        },
        // 重置按钮事件
        onReset() {
            this.query.queryStr = ''
            this.query.extractTime = ""
            this.query.beginTime = ''
            this.query.endTime = ''
            this.query.status = -1
            this.query.pageNum = 1
            this.startRow = 1
            this.timeArr = []
            this.getExtractRecord()
        },
        // 页码改变
        changepage(index) {
            this.query.pageNum = index;
            this.startRow =  index;
            this.getExtractRecord()
        },
        getExtractRecord(){
            get_extract_record(this.query).then( res => {
                const data = res.data
                this.list = data.list;
                this.dataCount = data.totalNum;
            }).catch( err => {
                console.error(err)
            })
        },
        auditExtractState(data){
            audit_extract_state(data).then( res => {
                console.log(res)
                this.$Message.success('提交成功');
                this.query.pageNum = 1
                this.startRow = 1
                this.getExtractRecord()
            }).catch( err => {
                console.error(err)
            })
        }
    },
}
</script>
<style scoped>
    
</style>