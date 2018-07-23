<template>
    <div class="big-box" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
        <div>
            <div class="top-box">
                <div class="btn-info" :class="{blue1:status==2,gray1:status==3,gray:status==4,orange:status==5,green:status==6,orange1:status==7}" >
                    <div>{{statusText}}</div>
                    <div v-if="status == 1">订单已提交等待确认</div>
                    <div v-if="status == 2">您已成功预约该服务，请安排好时间准时前往</div>
                    <div v-if="status == 3">{{failReason}}</div>
                    <div v-if="status == 4">{{failReason}}</div>
                    <div v-if="status == 5">该服务已到约定时间，如服务结束可进行评论</div>
                    <div v-if="status == 6">医生已确认完成</div>
                    <div v-if="status == 7">医生未确完成，订单已超时</div>
                </div>
                <div class="info">
                    <span class="time">服务时间</span>
                    <span>{{date}}</span>
                </div>
                <div class="address">
                    <span>服务地址</span>
                    <span>{{serviceAddress}}</span>
                </div>
                <div class="remarks">
                    <span>备注信息</span>
                    <span>{{remark}}</span>
                </div>
            </div>
            <div class="contacts">
                <div class="contacts-title">
                    服务联系人
                </div>
                <div class="contacts-list" v-for="item in contacts">
                    <div class="contacts-list-left">

                        <img v-if="!item.docHeadImg" src="../assets/images/userNoSex.png">
                        <img v-else :src="url+item.docHeadImg+'?server=image'">
                    </div>
                    <div class="contacts-list-right">
                        <div>
                            <p>{{item.docName}} <span>{{item.docSectionName}}</span> <span>{{item.jobTitle}}</span></p>
                            <p>{{item.docHosppitalName}}</p>
                        </div>
                        <div>
                            <img @click="complain(0,item.docId,item.docHeadImg)" src="../assets/images/icon_lt@3x.png">
                            <img @click="cell(item.docName,item.docAccount)" src="../assets/images/icon_dh@3x.png">
                        </div>
                    </div>
                </div>
            </div>
            <div class="type">
                <div class="left">
                    <img v-if="!serviceLogo" src="../assets/images/mr_fw_dt@3x.png">
                    <img v-else :src="url+serviceLogo+'?server=image'">
                </div>
                <div class="right">
                    <div class="service-name">{{serviceName}}</div>
                    <div class="service-detail">{{serviceDetail}}</div>
                    <div class="price">
                        <div class="zs">
                            <img src="../assets/images/icon_zs@3x.png">
                            <span>{{priceNum}}</span>
                        </div>
                        <div>
                            <span>￥</span>
                            <span>{{servicePrice}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="complain">
                <div>您对该服务有任何疑问和反馈都可在此填写反馈哦！</div>
                <div @click="complain(1)">
                    <img src="../assets/images/icon_ts@3x.png">
                    <span>投诉</span>
                </div>
            </div>
            <div class="bottom" v-if="status==1|| status==2 || status==3 || status==4 || (status==5 && commentFlag==0) || (status==6 && commentFlag==0) || (status==7 && commentFlag==0)">
                <div v-if="status==1 || status==2" class="btn" :class="{orange1:status==1 || status==2 }" @click="changeStatus('4')">
                    取消预约
                </div>
                <div @click="restart" class="btn" v-if="status==3 || status==4" :class="{blue1:status==3 || status==4 }">
                    重新预约
                </div>
                <div @click="appraise" class="btn" v-if="(status==5 && commentFlag==0) || (status==6 && commentFlag==0) || (status==7 && commentFlag==0)" :class="{blue1:status==5 || status==6 || status==7}">
                    评论服务
                </div>
            </div>
        </div>



        <mt-popup v-model="cancel" position="bottom" class="mint-popup-4">
            <div class="mint-popup-4-title">取消原因</div>
            <mt-picker :slots="slots" @change="onValuesChange"></mt-picker>
            <div class="reason" v-if="reason == '其他原因'">
                <input placeholder="其他原因" v-model="excuse" />
            </div>
            <div class="service-time-bottom">
                <span class="mint-datetime-action mint-datetime-cancel" @click="cancleaddress">取消</span>
                <span class="mint-datetime-action mint-datetime-confirm" @click="selectaddress">确定</span>
            </div>
        </mt-popup>

        <!-- 联系医生 -->
        <mt-actionsheet
        :actions= "contactDoc"
        :closeOnClickModal='closeOnClickModal'
        v-model="isPhone">
        </mt-actionsheet>
    </div>
</template>
<script>
    import $http from 'axios';
    import {newPost2,newPost1} from '../../static/request.js'
    import {orderStatus} from '../../static/orderStatus.js'
    import { MessageBox } from 'mint-ui';
    import { Toast } from 'mint-ui';
    export default {
        data () {
            return {
                closeOnClickModal:false,
                loading:true,
                serviceLogo:"",
                contactDoc:[],
                url:"",
                statusText:"",
                selected:"",
                status:"",
                date:'',
                serviceAddress:"",
                remark:"",
                contacts:[],
                serviceName:"",
                serviceDetail:"",
                servicePrice:"",
                serviceId:"",
                priceNum:"",
                failReason:"",
                commentFlag:"",
                cancel:false,
                // 订单号
                orderNo:"",
                slots: [
                    {
                      divider: true,
                      className: 'slot1'
                    }, {
                      divider: true,
                      className: 'slot2'
                    }, {
                      flex: 1,
                      values: ["临时有事，需取消预约","信息填写错误，重新预约","我不想预约了","与医生沟通，没有预约名额","无需预约，直接可服务","其他原因"],
                      className: 'slot3',
                      textAlign: 'center'
                    }
                ],
                reason:"",
                excuse:"",
                isPhone:false
            }
        },
        methods:{
            // 获取订单详情
            getOrderInfo(d){
                var data1 = JSON.parse(localStorage.getItem('userInfo'));
                var token = data1.token;
                var userId = data1.userId;
                if(!d){
                    var data2 = JSON.parse(sessionStorage.getItem('orderId'));
                    var orderId = data2;
                    var data ={
                        "orderNo":orderId
                    }
                }else {
                    var data ={
                        "orderNo":d
                    }
                }
                var param ={
                    url:this.url+"/system/reservation/order/detail",
                    data:data,
                    token:token,
                    userId:userId,
                    server:'reservation'
                }
                newPost1(param).then((res) => {
                    var msg = res.data.message;
                    console.log(msg)
                    // LOGO
                    var serviceLogo = msg.serviceLogo;
                    // 订单号
                    var orderNo = msg.orderNo;
                    // 订单状态
                    var status = msg.status;
                    // 服务日期
                    var serviceDate = msg.serviceDate;
                    // 服务时间
                    var serviceTime = msg.serviceTime;
                    // 服务地址
                    var serviceAddress = msg.serviceAddress;
                    // 备注信息
                    var remark = msg.remark;
                    if(remark==""){
                        remark="暂无"
                    }
                    // 服务联系人对象
                    var contacts = msg.contacts;
                    var contactDoc = [];
                    if(contacts.length>0){
                        // contacts.forEach(function(data){
                        for(let i=0;i<contacts.length;i++){
                            contactDoc.push({
                                'name':contacts[i].docName+' '+contacts[i].docAccount,
                                'method': function(){
                                    window.location.href="tel:"+contacts[i].docAccount;
                                }
                            })
                        }
                        this.contactDoc = contactDoc;
                        // })
                    }
                    // 服务价格
                    var servicePrice = msg.servicePrice;
                    // 服务砖石数量
                    var priceNum = msg.servicePrice*2;
                    // 服务名字
                    var serviceName = msg.serviceName;
                    // 服务详情
                    var serviceDetail = msg.serviceDetail;
                    // 服务ID
                    var serviceId = msg.serviceId;
                    // 拒绝理由
                    var failReason = msg.failReason;
                    // 可评论标志
                    var commentFlag = msg.commentFlag;
                    // 服务状态
                    var serviceStatus= msg.serviceStatus;

                    this.statusText = orderStatus(status);
                    // this.statusText = orderStatus(6);

                    this.status = status;
                    // this.status = 6;


                    this.date = serviceDate+" "+serviceTime;
                    this.serviceAddress = serviceAddress;
                    this.remark = remark;
                    this.contacts = contacts;
                    this.servicePrice = servicePrice;
                    this.priceNum = priceNum;
                    this.serviceName = serviceName;
                    this.serviceDetail = serviceDetail;
                    this.failReason = failReason;
                    this.commentFlag = commentFlag;
                    this.serviceId = serviceId;
                    this.serviceLogo = serviceLogo;
                    this.orderNo = orderNo;
                    this.serviceStatus = serviceStatus;
                    this.loading = false;
                    if(this.$route.params.isPhone){
                        this.isPhone = this.$route.params.isPhone;
                    }

                })
            },
            // 投诉
            complain(data,docId,docHeadImg){
                if(data>0 && !docId){
                    var title = '投诉'
                    var message = "如需投诉，请下载关心堂APP端进行投诉"

                    var _this = this;
                    MessageBox({
                      title: title,
                      message: message,
                      showCancelButton: true,
                      confirmButtonText:"前往下载",
                      cancelButtonText:"暂不下载",
                      confirmButtonClass:'blue',
                      cancelButtonClass:'blue'
                    }).then(action => {
                        if(action == 'confirm'){
                           window.location.href='http://www.cdmn.com/appdownload.html';
                        }
                    });
                    
                }else {
                    // var title = '即时聊天'
                    // var message = "如需即时聊天，请下载关心堂APP端进行"

                    sessionStorage.setItem('docHeadImg', JSON.stringify({docHeadImg}));

                    var userInfo = JSON.parse(localStorage.getItem('userInfo'));
                    console.log(!userInfo)
                    
                    if(!userInfo){
                        this.$router.push({
                            path: '/login',
                            name: 'Login'
                        })
                        return
                    }
                    var token = userInfo.token;
                    var userId = userInfo.userId;

                    var data2 ={
                    "type":"type_doc",
                    "userId":docId
                    }
                    var param1 ={
                        url:this.url+"/system/medcare/member/info",
                        data:data2,
                        token:token,
                        userId:userId,
                        server:'circle'
                    }
                    newPost1(param1).then((res) => {
                        console.log("同步医生云信息")


                        var data3 ={
                            "type":"type_user",
                            "userId":userId
                        }
                        var param1 ={
                            url:this.url+"/system/medcare/member/info",
                            data:data3,
                            token:token,
                            userId:userId,
                            server:'circle'
                        }
                        newPost1(param1).then((res) => {
                            console.log("同步云信息")
                            console.log(res)
                            var msg = res.data.message;
                            var account = msg.accountId;
                            var token = msg.easeToken;

                            
                            // var appkey = "d4802c4b946ad399d387fa9fd58b124b"; // 测试
                            var appkey = "c065bc7dda6fbe95adb25041f3449f7f"; // 正式

                            sessionStorage.setItem('wyyx', JSON.stringify({
                                appkey,
                                token,
                                account,
                                docId
                            }));
                            this.$router.push({ 
                                path: '/chat',
                                name:'Chat'
                            })

                            // this.connectSDK(appkey,msg.accountId,msg.easeToken,docId)

                        })

                    })

                    // var _this = this;
                    // MessageBox({
                    //   title: title,
                    //   message: message,
                    //   showCancelButton: true,
                    //   confirmButtonText:"前往下载",
                    //   cancelButtonText:"暂不下载",
                    //   confirmButtonClass:'blue',
                    //   cancelButtonClass:'blue'
                    // }).then(action => {
                    //     if(action == 'confirm'){
                    //        window.location.href='http://www.cdmn.com/appdownload.html';
                    //     }
                    // });
                }
            },
            onValuesChange(picker, values) {
                this.reason = values[0];
            },
            cancleaddress(){
                this.cancel = false;
            },
            selectaddress(){
                // 取消预约
                this.cancel = false;
                var remark = ""
                if(this.reason == '其他原因' && this.excuse==""){
                    Toast({
                      message: '原因不可为空',
                      duration: 2000
                    });
                    return
                }else if(this.reason == '其他原因' && this.excuse!=""){
                     remark = this.excuse;
                }else {
                    remark = this.reason;
                }
                this.cancelAndReject(4,remark);
            },
            // 改变订单状态
            changeStatus(status){

                // 取消预约
                if(status == '4'){
                    this.cancel = true;

                }
            },
            // 取消预约
            cancelAndReject(status,remark){
                var data = JSON.parse(localStorage.getItem('userInfo'));
                var data1 = JSON.parse(sessionStorage.getItem('orderId'));
                var token = data.token;
                var userId = data.userId;
                var orderId = data1;
                var data ={
                    "orderNo":orderId,
                    "status":status,
                    "userType":"type_user",
                    "failReason":remark
                }
                console.log(data)
                var param ={
                    url:this.url+"/system/reservation/order/update",
                    data:data,
                    token:token,
                    userId:userId,
                    server:'reservation'
                }
                console.log(param)
                newPost1(param).then((res) => {
                    var msg = res.data.message;
                    console.log(msg)
                    this.getOrderInfo("");
                })
            },
            // 重新预约
            restart(){
                sessionStorage.setItem('serviceId', JSON.stringify(this.serviceId));
                if(this.serviceStatus!= 3){
                    Toast({
                      message: '该服务已下架',
                      duration: 2000
                    });
                }else {
                    this.$router.push({
                        path: '/confirmanappointment',
                        name: 'ConfirmAnAppointment'
                    })
                }
            },
            // 评价服务
            appraise(){
                var orderNo = this.orderNo;
                sessionStorage.setItem('serviceId', JSON.stringify(this.serviceId));
                sessionStorage.setItem('orderNo', JSON.stringify(orderNo));

                this.$router.push({
                    path: '/appraise',
                    name: 'Appraise'
                })
            },
             // 拨打电话
            cell(docName,phone){
                window.location.href="tel:"+phone;
            }
        },
        mounted(){
            document.title = this.$route.meta.title;
            if(!this.$route.params.id){
                this.getOrderInfo("");
            }else {
                this.getOrderInfo(this.$route.params.id);
            }
            // this.isPhone = this.$route.params.isPhone;
            this.url = $http.defaults.baseURL;
            // var e = document.getElementsByClassName('big-box');
            // console.log(e)
            // e[0].addEventListener('touchmove',function(event){
            //     console.log("...........")
            //     event.returnValue = true;    
            // })

            document.addEventListener('touchmove', function (event) {
                window.event.returnValue = true;
            }, false);

            // e[0].addEventListener('click',function(){
            //     window.location.reload();
            //     // document.addEventListener('touchmove', function (event) {
            //     //     window.event.returnValue = true;
            //     // }, false);
            // })
        },
        components:{

        }
    }
</script>

<style scoped>
.big-box {
    height: 100%;
    width: 100%;
    background: #EFEFF4 !important;
    /*pointer-events: none;*/
    overflow-y: scroll;
    -webkit-overflow-scrolling: auto;
}
.top-box {
    background: #FFFFFF;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    padding: 3vw;
}
.top-box>.btn-info {
    width: 100%;
    background: #C8C8C8 ;
    min-height: 25vw;
    color: #FFFFFF;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    border-radius: 10px;
    box-sizing: border-box;
    padding: 3vw;
    margin-bottom: 3vw;
    text-align: left;
}
.top-box>.btn-info>div:nth-child(1) {
    font-size: 20px;
    margin-bottom: 1vw;
}
.top-box>.btn-info>div:nth-child(2) {
    font-size: 12px;
}
.info,.address,.remarks{
    font-size: 14px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: left;
    margin-bottom: 3vw;
}
.info>span:nth-child(2) {
    font-size: 12px;
    margin-top: 0.5vw;
}
.address>span:nth-child(2) {
    margin-top: 0.5vw;
    font-size: 12px;
    color: #c1c1c1;
}
.remarks {
    margin-bottom: 0px;
}
.remarks>span:nth-child(2) {
    margin-top: 0.5vw;
    font-size: 12px;
    color: #e8e8e8;
}
.contacts {
    margin: 3vw 0px;
}
.contacts .contacts-title {
    height: 8vw;
    box-sizing: border-box;
    padding-left: 3vw;
    text-align: left;
    display: flex;
    align-items: center;
    margin-bottom: 1px;
    background: #FFFFFF;
}
.contacts .contacts-list {
    height: 16vw;
    background: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1px;
    /*box-sizing: border-box;*/
    padding-left: 2vw;
}
.contacts-list-left {
    height: 16vw;
    width: 16vw;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    /*border-radius: 50%;
    overflow: hidden;*/
}
.contacts-list-left>img {
    height: 14vw;
    width: 14vw;
    border-radius: 50%;
}
.contacts-list-right {
    height: 15vw;
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.contacts-list-right p {
    height: 6vw;
    line-height: 6vw;
    color: #454545 ;
    font-size: 16px;
    text-align: left;
    margin: 0px;
}
.contacts-list-right p>span {
    color: #919191;
    font-size: 12px;
}
.contacts-list-right p:nth-child(2){
    color: #919191;
    font-size: 12px;
}
.contacts-list-right>div:nth-child(2) {
    box-sizing: border-box;
    padding-right: 3vw;
    height: 100%;
    display: flex;
    height: 15vw;
    width: 22vw;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.contacts-list-right>div>img{
    height: 8vw;
    width: 8vw;
}

.type {
    height: 20vw;
    display: flex;
    align-items: center;
    background: #FFFFFF;
    margin-bottom: 2vw;
    overflow: hidden;
}
.type>.left {
    height: 16vw;
    width: 16vw;
    display: flex;
    align-items: center;
    justify-content: center;
    /*box-sizing: border-box;*/
    padding: 0px 2vw;
}
.type>.left>img {
    height: 16vw;
    width: 16vw;
}
.type>.right {
    width: 90%;
    flex: 1;
    text-align: left;
}
.type>.right>.service-name {
    font-size: 14px;
    color: #616161;
}
.type>.right>.service-detail {
    width: 80%;
    font-size: 12px;
    color: #b9b9b9;
    margin:1vw 0px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.type>.right>.price {
    display: flex;
    align-items: center;
    font-size: 14px;
}
.price>.zs {
    height: 5vw;
    display: flex;
    align-items: center;
    margin-right: 5vw;
    font-size: 16px;
    color: #F48568 ;
}
.price>.zs>img {
    width: 16px;
    height: 16px;
    margin-right: 1vw;
}
.price>div:nth-child(2) {
    height: 5vw;
    display: flex;
    align-items: center;
    color: #EDA56D ;
}
.price>div:nth-child(2)>span:nth-child(1) {
    font-size: 10px;
}
.price>div:nth-child(2)>span:nth-child(2) {
    font-size: 16px;
}
.complain {
    height: 20vw;
    box-sizing: border-box;
    padding: 0px 3vw;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #FFFFFF;
    margin-bottom: 3vw;
}
.complain>div:nth-child(1) {
    text-align: left;
    flex: 1;
    border-right: 1px solid #919191;
    box-sizing: border-box;
    padding-right: 3vw;
}
.complain>div:nth-child(2) {
    height: 20vw;
    width: 20vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #b6b6b6;
}
.complain>div:nth-child(2)>img {
    height: 7vw;
    width: 7vw;
}
.bottom {
    background: #FFFFFF;
    box-sizing: border-box;
    padding: 2vw 2vw;
}
.btn {
    color: #FFFFFF;
    border-radius: 5px;
    height: 12vw;
    display: flex;
    align-items: center;
    justify-content: center;
}


.mint-popup,.mint-popup-4,.mint-popup-bottom {
    width: 100%;
}
.mint-popup-4-title {
    text-align: center;
    font-size: 16px;
    height: 10vw;
    line-height: 10vw;
    border-bottom: 1px solid #eaeaea;
}
.service-time-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 15vw;
    border-bottom: 1px solid #eaeaea;
    box-sizing: border-box;
    padding: 0px 3vw;
}
.service-time-title>span:nth-child(1) {
    font-size: 16px;
}
.service-time-title>span:nth-child(2) {
    font-size: 12px;
}
.reason {
    height: 8vw;
    width: 100%;
}
.reason >input {
    width: 100%;
    text-align: center;
    height: 100%;
    outline: none;
    box-sizing: border-box;
    padding: 0px 10vw;
}
.service-time-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 15vw;
    border-top: 1px solid #eaeaea;
}
.picker {
    width: 100%;
}

.picker-slot,.picker-slot-left,.slot1 {
    text-align: center !important;
}



.blue1 {
    background: #18AEED !important;
}
.gray1 {
    background: #6e6e6e !important;
}
.gray {
    background: #6E6E6E !important;
}
.orange {
    background: #EDA165 !important;
}
.green {
    background: #00BCAE !important;
}
.orange1 {
    background: #F7856A !important;
}
</style>
