<template>
    <div class="big-box" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
        <div class="top">
            <div class="stop" v-if="status != 3">
                <div>
                    <img src="../assets/images/icon_tzfw@3x.png">
                    <span>服务已停止</span>
                </div>
                <div>
                    服务已停止，无法再进行预约
                </div>
            </div>
            <div class="block">
                <el-carousel trigger="click" height="65vw">
                    <el-carousel-item v-for="(item,index) in pics" :key="index">
                        <img :src="item.imgUrl">
                    </el-carousel-item>
                </el-carousel>
            </div>
            <div class="service-title">
                <div class="title">{{serviceName}}</div>
                <div class="price-box">
                    <div class="price">
                        <div class="zs">
                            <img src="../assets/images/icon_zs@3x.png">
                            <span>{{priceNum}}</span>
                        </div>
                        <div>
                            <span>￥</span>
                            <span>{{price}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="contacts">
                <div class="contacts-title">
                    服务联系人
                </div>
                <div class="contacts-list" v-for="item in contacts">
                    <div class="contacts-list-left">
                        <img v-show="!!item.docHeadImg" :src="url+item.docHeadImg+'?server=image'">
                        <img v-show="!item.docHeadImg" src="../assets/images/userNoSex.png">
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
            <div class="service-type">
                <span>服务类型</span>
                <span>{{serviceType}}</span>
            </div>
            <div class="service-add">
                <div class="service-add-title">
                    <span>服务地点</span>
                </div>
                <div class="service-address">
                    <div class="mode">
                        <div>服务方式</div>
                        <div>{{serviceMethod}}</div>
                    </div>
                    <div class="doctor-location">
                        <div>医生位置</div>
                        <div>{{address}}</div>
                    </div>
                    <div class="coverage">
                        <div>服务区域</div>
                        <div>{{area}}</div>
                    </div>
                </div>
            </div>
            <div class="introduce">
                <div class="introduce-title">
                    <span>服务介绍</span>
                </div>
                <div class="introduce-box">
                    <div>
                        <div>服务详情</div>
                        <div>{{serviceDetail}}</div>
                    </div>
                    <div>
                        <div>服务主体</div>
                        <div>{{bodyType}}</div>
                    </div>
                    <div>
                        <div>服务时间</div>
                        <div>{{serviceTimeText}}</div>
                    </div>
                    <div>
                        <div>预约规则</div>
                        <div>{{appointmentRule}}</div>
                    </div>
                    <div>
                        <div>适用人群及说明</div>
                        <div>{{suitablePeople}}</div>
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
            <div class="evaluation">
                <div class="evaluation-title">
                    <span>服务评价</span>
                </div>
                <div class="evaluation-big-box">
                    <div class="evaluation-box" v-for="item in commentList">
                        <div class="evaluation-box-left">
                            <img v-if="!!item.img" v-bind:src=item.userHeadImg>
                            <img v-if="!item.img" src="../assets/images/userNoSex.png">
                        </div>
                        <div class="evaluation-box-right">
                            <div class="name">{{item.userName}}
                                <span>
                                    {{item.xx}}
                                </span>
                            </div>
                            <div class="score">
                                <el-rate
                                  v-model=item.totalAvgScore
                                  disabled
                                  text-color="#ff9900"
                                  score-template="{value}">
                                </el-rate>
                            </div>
                            <div class="content">
                                {{item.content}}
                            </div>
                            <div class="time">{{item.createTime}}</div>
                            <div class="revert" v-if="item.commentReplies.length>0">
                                <div class="triangle"></div>
                                <div class="revert-box" v-for="iten in item.commentReplies">医生回复：{{iten.content}}</div>
                            </div>
                        </div>
                    </div>
                     <div class="center" v-if="commentList.length<1">
                        暂无数据
                    </div>
                </div>
            </div>
        </div>
        <div class="bottom" v-if="status == 3">
            <div class="left" @click="collection(collectFlag)">
                <img v-show="collectFlag == 0" src="../assets/images/icon_sc@3x.png">
                <img v-show="collectFlag == 1" src="../assets/images/icon_sc_s@3x.png">
                <span>收藏</span>
            </div>
            <div class="right">
                <div @click="contactDoctor">联系医生</div>
                <div @click="appointment">立即预约</div>
            </div>
        </div>

        <!-- 投诉弹框 -->
        <mt-actionsheet
        :actions= "phoneList">
        </mt-actionsheet>
        <!-- 联系医生 -->
        <mt-actionsheet
        :actions= "contactDoc"
        v-model="open">
        </mt-actionsheet>
    </div>
</template>
<script>
    import $http from 'axios'
    import {newPost2,newPost1} from '../../static/request.js'
    import { Toast } from 'mint-ui';
    import { MessageBox } from 'mint-ui';
    import NIM from '../../static/NIM_Web_NIM_v5.2.1.js'
    export default {
        data () {
            return {
                loading:true,
                // 服务状态
                status:"",
                url:'',
                open:false,
                contactDoc:[],
                value5:3.8,
                // 服务图片对象
                pics:[],
                // 服务地址
                address:"",
                // 服务名字
                serviceName:"",
                prices:[],
                // 服务价格
                price:"",
                // 服务砖石
                priceNum:"",
                // 服务联系人对象
                contacts:[],
                // 服务类型
                serviceType:"",
                // 服务方式
                serviceMethod:"",
                // 服务区域
                area:"",
                // 服务详情
                serviceDetail:"",
                // 服务主体
                bodyType:"",
                // 服务时间
                serviceTimeText:"",
                // 服务预约规则
                appointmentRule:"",
                // 适用人群
                suitablePeople:"",
                // 收藏
                collectFlag:0,
                // 联系医生电话列表
                phoneList:[],
                // 服务评价
                commentList:[]
            }
        },
        methods:{
            contact(){
                console.log("111")
            },
            // 获取服务详情
            getServiceDetails(data){
                var id = data;
                var userInfo = JSON.parse(localStorage.getItem('userInfo'));
                if(!userInfo){
                    var userId ="";
                }else {
                    var userId =userInfo.userId;
                }

                var data1 ={
                    "id":id,
                    "userId":userId
                }
                var param1 ={
                    url:this.url+"/medcare/reservation/service/detail",
                    data:data1,
                    server:'reservation'
                }
                newPost2(param1).then((res) => {
                    var msg = res.data.message;
                    console.log(res)
                    // 服务状态
                    var status = msg.status;
                    // 服务地址
                    var address = msg.address;
                    // 服务名字
                    var serviceName = msg.serviceName;
                    // 服务LOGO
                    var serviceLogo = msg.serviceLogo;
                    // 服务价格对象
                    var prices = msg.prices;
                    // 服务价格
                    var price = prices[0].price;
                    // 服务砖石数量
                    var priceNum = prices[0].num;
                    // 服务联系人对象
                    var contacts = msg.contacts;
                    var contactDoc = [];
                    document.title = serviceName;
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
                        console.log(this.contactDoc)
                        // })
                    }

                    // 服务类型
                    var serviceType = msg.serviceType;
                    // 服务方式
                    var serviceMethod = msg.serviceMethod;
                    // 服务区域
                    var area = msg.area;
                    // 服务详情
                    var serviceDetail = msg.serviceDetail;
                    // 服务主体
                    var bodyType = msg.bodyName;
                    // 服务时间
                    var serviceTimeText = msg.serviceTimeText;
                    // 服务预约规则
                    var appointmentRule = msg.appointmentRule;
                    // 适用人群
                    var suitablePeople = msg.suitablePeople;
                    // 收藏
                    var collectFlag = msg.collectFlag;
                    // 服务图片对象
                    var pics = msg.pics;
                    // id
                    var id = msg.id;
                    // if(bodyType == 'type_hosp'){
                    //     bodyType = "机构"
                    // }else {
                    //     bodyType = "团队"
                    // }
                    var _this = this;
                    if(pics.length>0){
                        var arr = [];
                        pics.forEach(function(e){
                            var imgUrl = e.imgUrl;
                            imgUrl = _this.url+imgUrl+"?server=image"
                            arr.push({
                                imgUrl
                            })
                        })
                        pics = arr;
                    }

                    sessionStorage.setItem('serviceName', JSON.stringify({
                        serviceName,
                        serviceLogo
                    }));
                    this.status = status;
                    this.address = address;
                    this.serviceName = serviceName;
                    this.serviceLogo = serviceLogo;
                    this.price = price;
                    this.priceNum = price*2;
                    this.contacts = contacts;
                    this.contactDoc = contactDoc;
                    this.serviceType = serviceType;
                    this.serviceMethod = serviceMethod;
                    this.area = area;
                    this.serviceDetail = serviceDetail;
                    this.bodyType = bodyType;
                    this.serviceTimeText = serviceTimeText;
                    this.appointmentRule = appointmentRule;
                    this.collectFlag = collectFlag;
                    this.pics = pics;
                    this.id = id;
                    this.suitablePeople = suitablePeople;
                    this.getCommentList(id);  // 获取评论列表
                    console.log(contacts)
                    this.loading = false;
                })
            },
            // 获取评论列表
            getCommentList(data){
                var id = data;
                var data1 ={
                    "serviceId":id,
                    "page":1,
                    "pageSize":1000
                }
                var param1 ={
                    url:this.url+"/medcare/reservation/service/comment/list",
                    data:data1,
                    server:'reservation'
                }
                newPost2(param1).then((res) => {
                    console.log(res)
                    var msg = res.data.message;
                    var list = msg.list;
                    var l = list.length;
                    var commentList = [];
                    var _this = this;
                    if(l>0){
                        list.forEach(function(e){
                            // 内容
                            var content = e.content;
                            // 创建时间
                            var createTime = e.createTime;

                            var newTime = new Date().getTime();
                            var day =_this.dateDiff(newTime,createTime) // 创建时间距离今天的天数


                            if(day==2){
                                createTime = _this.time(createTime);
                                createTime='前天' + createTime.split(' ')[1].split(":")[0]+":"+createTime.split(' ')[1].split(":")[1]
                            }else if(day==1){
                                createTime = _this.time(createTime);
                                createTime='昨天' +' ' +createTime.split(' ')[1].split(":")[0]+":"+createTime.split(' ')[1].split(":")[1]
                            }else if(day==0){
                                createTime = _this.time(createTime);
                                createTime='今天' +' ' +createTime.split(' ')[1].split(":")[0]+":"+createTime.split(' ')[1].split(":")[1]
                            }else {
                                createTime = _this.time(createTime);
                            }
                            // 评论者
                            var userName = e.userName;
                            var length = userName.length;
                            var xx = ""
                            for(let i=0;i<length-1;i++){
                                xx+="*"
                            }
                            userName = userName.substr(0,1)
                            // 评论者头像
                            var userHeadImg = e.userHeadImg;
                            var img = userHeadImg;
                            userHeadImg = _this.url+userHeadImg+"?server=image";
                            // 回复数组
                            var commentReplies = e.commentReplies;
                            // 评分分数
                            var totalAvgScore= e.totalAvgScore;
                            commentList.push({
                                commentReplies,
                                userHeadImg,
                                img,
                                userName,
                                createTime,
                                content,
                                totalAvgScore,
                                xx
                            })
                        })
                    }
                    this.commentList = commentList;
                })
            },
            // 时间戳转换为时间
            time(val){
                var date = new Date(val);
                var Y = date.getFullYear() + '-';
                var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                var D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
                var h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
                var m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
                var s = date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds();
                var val = Y+M+D+h+m+s;
                return val;
            },
            // 计算时间天数之差
            dateDiff(t1,t2){
                var t1, t2, iDays;
                iDays = parseInt(Math.abs(t1 - t2) / 1000 / 60 / 60 / 24); // 把相差的毫秒数转换为天数

                return iDays;  //返回相差天数
            },
            // 收藏
            collection(data){
                var userInfo = JSON.parse(localStorage.getItem('userInfo'));
                if(!userInfo){
                    this.$router.push({
                        path: '/login',
                        name: 'Login'
                    })
                }else {
                    var token = userInfo.token;
                    var name = userInfo.name;
                    var userId = userInfo.userId;
                    if(data>0){  // 删除
                        console.log("删除")
                        var data1 ={
                            "userId":userId,
                            "serviceId":this.id
                        }
                        var param1 ={
                            url:this.url+"/system/user/reservation/service/collection/delete",
                            data:data1,
                            token:token,
                            userId:userId,
                            server:'reservation'
                        }
                        newPost1(param1).then((res) => {
                            console.log(res)
                            this.collectFlag=0;
                            Toast({
                                message: "删除成功",
                                duration: 2000
                            });
                        })
                    }else {  // 保存
                        console.log("保存")
                        var data1 ={
                            "userId":userId,
                            "userName":name,
                            "serviceId":this.id,
                            "serviceName":this.serviceName
                        }
                        var param1 ={
                            url:this.url+"/system/user/reservation/service/collection/save",
                            data:data1,
                            token:token,
                            userId:userId,
                            server:'reservation'
                        }
                        newPost1(param1).then((res) => {
                            console.log(res)
                            this.collectFlag=1;
                            Toast({
                                message: "收藏成功",
                                duration: 2000
                            });
                        })
                    }
                }
            },
            // 拨打电话
            cell(docName,phone){
                window.location.href="tel:"+phone;
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
            // 联系医生
            contactDoctor(){
                this.open=true
            },
            // 立即预约
            appointment(){
                var data = JSON.parse(localStorage.getItem('userInfo'));
                if(!!data){  // 已登录
                    var token = data.token;
                    var userId = data.userId;
                    var phone = data.account;
                    var data = {
                        userId,
                        phone
                    }
                    var param ={
                        url:this.url+"/system/client/user/info/get",
                        data:data,
                        token:token,
                        userId:userId,
                        server:'info'
                    }
                    newPost1(param).then((res) => {
                        console.log(res)
                        var msg = res.data.message;
                        if(!!msg.gender && !!msg.realName && !!msg.idCard){ // 资料完整
                            this.$router.push({
                                path: '/confirmanappointment',
                                name: 'ConfirmAnAppointment',
                                params: {
                                    "id":this.id
                                }
                            })
                        }else { // 资料不完整
                            MessageBox({
                              title: '温馨提示',
                              message: '您的个人资料不完整，请完善后再试',
                              showCancelButton: true,
                              confirmButtonText:"完善资料",
                              cancelButtonText:"暂不完善",
                              confirmButtonClass:'blue',
                              cancelButtonClass:'blue'
                            }).then(action => {
                                if(action == 'confirm'){
                                    this.$router.push({
                                        path: '/myinfo',
                                        name: 'MyInfo'
                                    })
                                }
                            });
                        }
                    })
                }else {  // 未登录
                    this.$router.push({
                        path: '/login',
                        name: 'Login'
                    })
                }

            }
        },
        mounted(){
            document.title = this.$route.meta.title;
            var serviceId = JSON.parse(sessionStorage.getItem('serviceId'));
            this.getServiceDetails(serviceId);
            this.url = $http.defaults.baseURL;
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
    overflow-y: scroll;
    background: #F7F7F7;
    display: flex;
    flex-direction: column;
    font-size: 16px;
}
.top {
    flex: 1;
    overflow-y: scroll;
}
.stop{
    background: #FFFFFF;
    font-size: 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 20vw;
}
.stop>div:nth-child(1){
    display: flex;
    justify-content: center;
    align-items: center;
}
.stop>div:nth-child(1)>img {
    height: 4vw;
    width: 4vw;
    margin-right: 1vw;
}
.stop>div:nth-child(1)>span {
    color: #808080;
}
.stop>div:nth-child(2){
    font-size: 12px;
    color: #C4C4C4;
}
.block {
    height: 100vw;
}
.el-carousel {
    height: 100vw;
}
.el-carousel__item {
    height: 100vw;
}
.el-carousel__item> img {
    height: 100%;
    width: 100%;
}
.service-title {
    height: 15vw;
    background: #FFFFFF;
    box-sizing: border-box;
    padding-left: 3vw;
    font-size: 14px;
}
.title {
    text-align: left;
    height: 8vw;
    line-height: 8vw;
}
.price {
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
    height: 18vw;
    background: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1px;
    box-sizing: border-box;
    padding-left: 3vw;
}
.contacts-list-left {
    height: 18vw;
    width: 18vw;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    /*border-radius: 50%;
    overflow: hidden;*/
}
.contacts-list-left>img {
    height: 15vw;
    width: 15vw;
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
.service-type {
    height: 8vw;
    background: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 0px 3vw;
    margin-bottom: 3vw;
}
.service-type>span:nth-child(2) {
    color: #80d2f3;
}
.service-add {
    margin-bottom: 3vw;
}
.service-add-title {
    text-align: left;
    height: 8vw;
    background: #FFFFFF;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 0px 3vw;
    margin-bottom: 1px;
}
.service-address {
    background: #FFFFFF;
    box-sizing: border-box;
    padding: 3vw;
}
.service-address .mode,.service-address .doctor-location,.service-address .coverage{
    height: 15vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: left;
}
.mode>div:nth-child(2),.doctor-location>div:nth-child(2),.coverage>div:nth-child(2) {
    color: #919191;
    font-size: 12px;
    height: 7vw;
    line-height: 7vw;
}
.introduce {
    margin-bottom: 3vw;
}
.introduce-title {
    text-align: left;
    height: 8vw;
    background: #FFFFFF;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 0px 3vw;
    margin-bottom: 1px;
}
.introduce .introduce-box {
    background: #FFFFFF;
    box-sizing: border-box;
    padding: 3vw;
}
.introduce .introduce-box>div{
    min-height: 15vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: left;
}
.introduce-box>div>div:nth-child(2){
    color: #919191;
    font-size: 12px;
    min-height: 7vw;
    line-height: 5vw;
    margin: 1vw 0px;
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
    flex: 1;
    border-right: 1px solid #F4F4F4;
    box-sizing: border-box;
    padding-right: 3vw;
    text-align: left;
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
.evaluation {
    margin-bottom: 3vw;
    background: #FFFFFF;
}
.evaluation-title {
    text-align: left;
    height: 8vw;
    background: #FFFFFF;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    padding: 0px 3vw;
    border-bottom: 1px solid #EFEFF4;
}
.evaluation-box {
    display: flex;
    background: #FFFFFF;
}
.evaluation-box-left {
    width: 15vw;
    height: 15vw;
    margin-right: 1vw;
    border-radius: 50% !important;
    position: relative;
    top: 0px;
}
.evaluation-box-left>img {
    width: 12vw;
    height: 12vw;
    border-radius: 50%;
}
.evaluation-box-right {
    flex: 1;
    text-align: left;
}
.evaluation-big-box {
    box-sizing: border-box;
    padding: 2vw 2vw;
}
.evaluation-box-right .name {
    height: 6vw;
    font-size: 14px;
    display: flex;
    align-items: center;
}
.evaluation-box-right .name>span {
    font-size: 16px;
    height: 6vw;
    display: flex;
    align-items: center;
    margin-top: 2vw;
}
.evaluation-box-right .score {
    margin: 0.5vw 0px;
}
.evaluation-box-right .content {
    font-size: 16px;
    line-height: 8vw;
    word-wrap:break-word;
    word-break:break-all;
}
.evaluation-box-right .time {
    font-size: 12px;
    color: #D7D7D7;
    height: 5vw;
    line-height: 5vw;
}
.evaluation-box-right .revert {
    width: 100%;
    margin-top: 1vw;
    position: relative;
    background: #EFEFF4;
    border-radius: 5px;
    box-sizing: border-box;
    padding: 1vw 2vw;
    font-size: 12px;
    color: #858585;
}
.evaluation-box-right .revert>.triangle {
    position: absolute;
    top: -2.5vw;
    left: 2vw;
    width: 0px;
    height: 0px;
    position: absolute;
    border-top: 6px solid rgba(0,0,0,0);
    border-right: 6px solid rgba(0,0,0,0);
    border-bottom: 6px solid #EFEFF4;
    border-left: 6px solid rgba(0,0,0,0);
}
.evaluation-box-right .revert>.revert-box {
    width: 100%;
    /*height: 6vw;*/
    line-height: 6vw;
}
.bottom {
    height: 15vw;
    background: #FFFFFF;
    display: flex;
    align-items: center;
}
.bottom>.left {
    font-size: 12px;
    width: 20%;
    box-sizing: border-box;
    padding: 0px 1.5vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.bottom>.left> img {
    height: 8vw;
    width: 8vw;
}
.bottom>.right {
    width: 80%;
    padding: 0px 1.5vw;
    display: flex;
    align-items: center;
}
.bottom>.right>div {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50%;
    height: 10vw;
    color: #FFFFFF;
}
.bottom>.right>div:nth-child(1) {
    background: #EDA165 ;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
}
.bottom>.right>div:nth-child(2) {
    background: #F7856A ;
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
}

.center {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
