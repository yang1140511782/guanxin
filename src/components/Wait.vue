<template>
    <div class="big-box" :class="{FFF:length<=0}">
        <!-- <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" :max-distance="150" @top-status-change="handleTopChange" ref="loadmore">
            <p slot="top" class="mint-loadmore-top">
                <span v-show="topStatus === 'pull'" :class="{ 'rotate': topStatus === 'drop' }">↓</span>
                <span v-show="topStatus === 'loading'">Loading...</span>
                <span v-show="topStatus === 'drop'">释放更新</span>
            </p>
            <div class="list-box " v-for="item in list" @click="toOrderInfo(item.orderNo)">
                <div class="left">
                    <div class="string">
                        <div>
                            <div class="middle">
                                <div></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="right">
                    <div class="right-box" >
                        <div class="top">
                            <span>{{item.serviceDateTime}}</span>
                            <span :class="{gray1:item.status==1,blue1:item.status==2,gray:item.status==3 || item.status==4,orange:item.status==5,green:item.status==6,orange1:item.status==7}">{{item.statu}}</span>

                        </div>
                        <div class="center">
                            <div class="center-left">
                                <img src="../assets/images/symr.jpg">
                            </div>
                            <div class="center-right">
                                <div class="title">{{item.serviceName}}</div>
                                <div class="address">服务地址：{{item.serviceAddress}}</div>
                            </div>
                        </div>
                        <div class="bottom">
                            <div class="bottom-left">
                                <img src="../assets/images/mr_zt@3x.png">
                                <span>{{item.hospitalName}}</span>
                            </div>
                            <div class="bottom-right">
                                <img src="../assets/images/icon_dh@3x.png">
                            </div>
                        </div>
                    </div>
                    <div class="triangle">
                    </div>
                </div>
            </div>
        </mt-loadmore> -->



          <mt-loadmore :top-method="loadTop" @top-status-change="handleTopChange"       :bottom-method="loadBottom" @bottom-status-change="handleBottomChange" :bottom-all-loaded="allLoaded" :auto-fill="false" ref="loadmore">
            <div class="list-box " v-if="length > 0" v-for="(item,index) in list" @click="toOrderInfo(item.orderNo)">
                <div class="left">
                    <div class="string">
                        <span v-show="index == 0"></span>
                        <span v-show="index == list.length-1"></span>
                        <div>
                            <div class="middle">
                                <div></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="right">
                    <div class="right-box" >
                        <div class="top">
                            <span>{{item.serviceDateTime}}</span>
                            <span :class="{gray1:item.status==1,blue1:item.status==2,gray:item.status==3 || item.status==4,orange:item.status==5,green:item.status==6,orange1:item.status==7}">{{item.statu}}</span>

                        </div>
                        <div class="center">
                            <div class="center-left">
                                <img src="../assets/images/symr.jpg">
                            </div>
                            <div class="center-right">
                                <div class="title">{{item.serviceName}}</div>
                                <div class="address">服务地址：{{item.serviceAddress}}</div>
                            </div>
                        </div>
                        <div class="bottom">
                            <div class="bottom-left">
                                <img src="../assets/images/mr_zt@3x.png">
                                <span>{{item.hospitalName}}</span>
                            </div>
                            <div class="bottom-right">
                                <img @click.stop="cell(item.orderNo)" src="../assets/images/icon_dh@3x.png">
                            </div>
                        </div>
                    </div>
                    <div class="triangle">
                    </div>
                </div>
            </div>
            

           <div slot="top" class="mint-loadmore-top">
              <span v-show="topStatus !== 'loading'" :class="{ 'is-rotate': topStatus === 'drop' }">↓</span>
              <span v-show="topStatus === 'loading'" class="center">
                <!-- 拼命加载中... -->
                <mt-spinner type="snake"></mt-spinner>
              </span>
            </div>


            <div slot="bottom" class="mint-loadmore-bottom">
             <!--  <span v-show="bottomStatus !== 'loading'" :class="{ 'is-rotate': bottomStatus === 'drop' }">↑</span> -->
              <span v-show="bottomStatus === 'loading'" class="center">
                <mt-spinner type="snake"></mt-spinner>
              </span>
            </div>
          </mt-loadmore>
          <div v-if="length <= 0"  class="zj">
                <img src="../assets/images/kong.jpg">
                <span>暂无相关记录</span>
            </div>
        </div>
</template>
<script>
    import $http from 'axios'
    import { Toast } from 'mint-ui';
    import { Loadmore } from 'mint-ui';
    import {newPost2,newPost1} from '../../static/request.js'
    import {orderStatus} from '../../static/orderStatus.js'

export default {
    data () {
        return {
            // topStatus: '',
            // list:[],
            // list1:[],
            // allLoaded: false,
            url:"",
            page1:0,
            page:1,
            list: [],
            length:[],
            allLoaded: false,
            bottomStatus: '',
            // wrapperHeight: 0,
            topStatus: '',
            //wrapperHeight: 0,
            moveTranslate: 0
        }
    },
    // created() {
    //   for (let i = 1; i <= 10; i++) {
    //     this.list.push(i);
    //   }
    // },
    methods:{
        handleBottomChange(status) {
            this.bottomStatus = status;
          },
          loadBottom() {
            setTimeout(() => {
                console.log("上拉")
              // let lastValue = this.list[this.list.length - 1];
              // if (lastValue < 40) {
              //   for (let i = 1; i <= 10; i++) {
              //     this.list.push(lastValue + i);
              //   }
              // } else {
              //   this.allLoaded = true;
              // }
                var d = new Date();
                if(d.getMonth()+1<10){
                    var m = "0"+(d.getMonth()+1)
                }
                if(d.getDate()<10){
                    var d1 = "0"+d.getDate()
                }else {
                    var d1 = d.getDate()
                }
                // var date=d.getFullYear() + '-' + m + '-' + d1 + ' ' + '08' + ':' + '00' + ':' + '00';
                var date=d.getFullYear() + '-' + m + '-' + d1;
                console.log(date)
                // var date = this.getNowFormatDate();
                this.page+=1;
                this.getOrderList(this.page,date,'');
                this.$refs.loadmore.onBottomLoaded();
            }, 1500);
          },

          handleTopChange(status) {
            this.topStatus = status;
          },
          loadTop() {
            setTimeout(() => {
                console.log("下拉")

              // let firstValue = this.list[0];
              // for (let i = 1; i <= 10; i++) {
              //   this.list.unshift(firstValue - i);
              // }
              // this.list.splice(0, this.list.length);
                var d = new Date();
                if(d.getMonth()+1<10){
                    var m = "0"+(d.getMonth()+1)
                }

                if(d.getDate()<10){
                    var d1 = "0"+d.getDate()
                }else {
                    var d1 = d.getDate()
                }
                if(d.getHours()<10){
                    var h = "0"+d.getHours()
                }else {
                    var h = d.getHours()
                }

                if(d.getMinutes()<10){
                    var m1 = "0"+d.getMinutes()
                }else {
                    var m1 = d.getMinutes()
                }

                if(d.getSeconds()<10){
                    var s = "0"+d.getSeconds()
                }else {
                    var s = d.getSeconds()
                }

                // var date=d.getFullYear() + '-' + m + '-' + d1 + ' ' + h + ':' + m1 + ':' +s;
                var date=d.getFullYear() + '-' + m + '-' + d1;

                console.log(date)
                // var date = this.getNowFormatDate();
                this.page1+=1;
                this.getOrderList(this.page1,'',date);
                this.$refs.loadmore.onTopLoaded();
            }, 1500);
          },
        /*loadTop() {  // 刷新数据的操作  （下拉）
            var _this = this;
            console.log("下拉")
            _this.list.splice(0, _this.list.length);
            var date = _this.getNowFormatDate();
            _this.page+=1;
            _this.getOrderList(_this.page,'',date);
            _this.$refs.loadmore.onTopLoaded();
        },
        loadBottom() { // 加载更多数据的操作  （上拉）
            var _this = this;
            var date = _this.getNowFormatDate();
            _this.page+=1;
            _this.getOrderList(_this.page,date,'');
            console.log("上拉")
            // _this.$refs.loadmore.onBottomLoaded();
        },
        handleTopChange: function (status) {
            console.log(status)
            this.topStatus = status;
        },*/
        // 获取当前时间
        // getNowFormatDate() {
        //     var date = new Date();
        //     var seperator1 = "-";
        //     var year = date.getFullYear();
        //     var month = date.getMonth() + 1;
        //     var strDate = date.getDate();
        //     if (month >= 1 && month <= 9) {
        //         month = "0" + month;
        //     }
        //     if (strDate >= 0 && strDate <= 9) {
        //         strDate = "0" + strDate;
        //     }
        //     var currentdate = year + seperator1 + month + seperator1 + strDate;
        //     return currentdate;
        // },

        // 获取服务的订单
        getOrderList(page,time1,time2){   // time1:开始时间   time2:结束时间
            var data = JSON.parse(localStorage.getItem('userInfo'));
            console.log('userInfo')
            console.log(data)
            var token = data.token;
            var userId = data.userId;
            var data ={
                "serviceId":"",
                "userId":userId,
                "status":'1,2',
                "beginTime":time1,
                "endTime":time2,
                "page":page,
                "pageSize":5
            }
            var param ={
                url:this.url+"/system/user/reservation/service/order/list",
                data:data,
                token:token,
                userId:userId,
                server:'reservation'
            }
            newPost1(param).then((res) => {
                console.log(res)
                var _this = this;
                var msg = res.data.message;
                var list = msg.list;
                // if(page ==1 && !time2){
                    var length = list.length;
                    console.log(length)
                    this.length = length;
                // }else {
                //     this.length = 1;
                // }
                
                var arr=[]
                if(!time2 && list.length>0){
                    list.forEach(function(data){
                        // 日期
                        var serviceDate = data.serviceDate;
                        // 时间
                        var serviceTime = data.serviceTime;
                        var newDate = new Date().get;
                        var sDate = serviceDate.split("-")[2];
                        var a = new Date().toLocaleDateString();
                        a=a.split("/")[2];
                        var iDays = sDate - a;
                        if(iDays == 0){
                            serviceDate = "今天"
                        }else if(iDays == 1){
                            serviceDate = "明天"
                        }else if(iDays == 2){
                            serviceDate = "后天"
                        }
                        var serviceDateTime = serviceDate+" "+serviceTime;
                        // 订单状态
                        var status = data.status;
                        // var status = 7;

                        var statu =  orderStatus(status);
                        // 服务LOGO
                        var serviceLogo = data.serviceLogo;
                        // 服务名称
                        var serviceName = data.serviceName;
                        // 服务地址
                        var serviceAddress = data.serviceAddress;
                        // 服务单位
                        var hospitalName = data.hospitalName;
                        // 订单号
                        var orderNo = data.orderNo;
                        _this.list.push({
                            serviceDateTime,
                            statu,
                            status,
                            serviceLogo,
                            serviceName,
                            serviceAddress,
                            hospitalName,
                            orderNo
                        })
                    })
                }
                if(!time1 && list.length>0){
                    var l = list.length;
                    for(let i=0;i<l;i++){
                        // 日期
                        var serviceDate = list[i].serviceDate;
                        // 时间
                        var serviceTime = list[i].serviceTime;
                        var newDate = new Date().get;
                        var sDate = serviceDate.split("-")[2];
                        var a = new Date().toLocaleDateString();
                        a=a.split("/")[2];
                        var iDays = sDate - a;
                        if(iDays == 0){
                            serviceDate = "今天"
                        }else if(iDays == 1){
                            serviceDate = "明天"
                        }else if(iDays == 2){
                            serviceDate = "后天"
                        }
                        var serviceDateTime = serviceDate+" "+serviceTime;

                        // 订单状态
                        var status = list[i].status;
                        var statu =  orderStatus(status);
                        // 服务LOGO
                        var serviceLogo = list[i].serviceLogo;
                        // 服务名称
                        var serviceName = list[i].serviceName;
                        // 服务地址
                        var serviceAddress = list[i].serviceAddress;
                        // 服务单位
                        var hospitalName = list[i].hospitalName;
                        // 订单号
                        var orderNo = list[i].orderNo;
                        var param1={
                            serviceDateTime,
                            statu,
                            status,
                            serviceLogo,
                            serviceName,
                            serviceAddress,
                            hospitalName,
                            orderNo
                        }
                        this.list.splice(0,0,param1);
                        // this.list.push(param1)
                    }
                }
                if(!time2 && list.length<1){
                    Toast({
                      message: '暂无数据',
                      duration: 2000
                    });
                    this.allLoaded = true;
                }
                if(!time1 && list.length<1){
                    Toast({
                      message: '暂无数据',
                      duration: 2000
                    });
                }
            })
        },
        // 跳转订单详情
        toOrderInfo(data){
            console.log(data)
            sessionStorage.setItem('orderId', JSON.stringify(data));
            this.$router.push({
                path: '/orderinfo',
                name: 'OrderInfo'
            })
        },
        // 拨打电话
        cell(data){
            console.log(data)
            console.log("拨打电话")

            sessionStorage.setItem('orderId', JSON.stringify(data));
            this.$router.push({
                path: '/orderinfo',
                name: 'OrderInfo',
                params:{
                    'isPhone':true
                }
            })
        }
    },
    mounted(){
        var d = new Date();
        if(d.getMonth()+1<10){
            var m = "0"+(d.getMonth()+1)
        }
        if(d.getDate()<10){
            var d1 = "0"+d.getDate()
        }else {
            var d1 = d.getDate()
        }
        // var date=d.getFullYear() + '-' + m + '-' + d1 + ' ' + '08' + ':' + '00' + ':' + '00';
        var date=d.getFullYear() + '-' + m + '-' + d1;
        console.log(date)
        this.getOrderList(this.page,date,'');
        this.url = $http.defaults.baseURL;
        // this.getOrderList(1,'','');
    },
    components: {
      'mt-loadmore':Loadmore  // 为组件起别名，vue转换template标签时不会区分大小写，例如：loadMore这种标签转换完就会变成loadmore，容易出现一些匹配问题
                              // 推荐应用组件时用a-b形式起名
    }
}
</script>

<style scoped>
.big-box {
    min-height: 100%;
    width: 100%;
    background: #EFEFF4;
    overflow:auto;
}
.zj {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: fixed;
    bottom: 50%;
}
.zj>img {
    width: 50px;
    margin-bottom: 1vw;
}
.zj>span {
    font-size: 12px;
    color: #D7D7D7;
}
.list-box {
    height: 40vw;
    width: 100%;
    display: flex;
}
.left {
    width: 10vw;
    height: 100%;
    box-sizing: border-box;
    padding-left: 4.5vw;
}
.left>.string {
    height: 100%;
    width: 1px;
    position: relative;
    border-left: 1px solid #18AEED;
    border-right: 1px solid #18AEED;
    background: #18AEED;
}
.left>.string>span:nth-child(1) {
    display: block;
    position: absolute;
    top: 0px;
    left: -2px;
    width: 5px;
    height: 4.1vw;
    background: #EFEFF4;
    z-index: 555;
}
.left>.string>span:nth-child(2) {
    display: block;
    position: absolute;
    top: 10vw;
    left: -2px;
    width: 5px;
    height: 30vw;
    background: #EFEFF4;
    z-index: 555;
}
.left>.string>div{
    position: absolute;
    top: 4vw;
    left: -3vw;
    width: 6vw;
    height: 6vw;
    background: #EFEFF4;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.string>div>.middle {
    width: 5vw;
    height: 5vw;
    background: #B4E1F4;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}
.middle>div {
    width: 2vw;
    height: 2vw;
    background: #18AEED;
    border-radius: 50%;
}
.right {
    flex: 1;
    box-sizing: border-box;
    padding-right: 4vw;
    padding-top: 2vw;
    position: relative;
}
.right-box {
    height: 100%;
    width: 100%;
    background: #FFFFFF;
    border-radius: 10px;
    box-sizing: border-box;
    padding: 0px 2vw;
    display: flex;
    flex-direction: column;
}
.right-box>.top {
    height: 9vw;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.right-box>.top>span:nth-child(1) {
    font-size: 16px;
}
.right-box>.top>span:nth-child(2) {
    display: inline-block;
    /*background: #18AEEE ;*/
    color: #FFFFFF;
    font-size: 12px;
    padding:1vw 2vw;
    border-bottom-left-radius: 15px;
    border-top-left-radius: 15px;
}
.right-box>.center {
    width: 100%;
    height: 15vw;
    background: #EFEFF4;
    border-radius: 10px;
    box-sizing: border-box;
    padding: 2vw;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 1vw;
}
.right-box>.center>.center-left {
    height: 11vw;
    width: 11vw;
    border-radius: 10px;
    overflow: hidden;
}
.center>.center-left>img {
    height: 100%;
    width: 100%;
}
.center>.center-right {
    flex: 1;
    box-sizing: border-box;
    padding-left: 2vw;
    text-align: left;
}
.center>.center-right>.title {
    font-size: 14px;
}
.center>.center-right>.address {
    font-size: 12px;
}
.right-box>.bottom {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.bottom>.bottom-left {
    display: flex;
    align-items: center;
}
.bottom>.bottom-left>img {
    height: 6vw;
    width: 6vw;
}
.bottom>.bottom-left>span {
    flex: 1;
    text-align: left;
    box-sizing: border-box;
    padding-left: 2vw;
}
.bottom>.bottom-right {
    display: flex;
    display: flex;
    justify-content: center;
    align-items: center;
}
.bottom>.bottom-right> img {
    height: 6vw;
    width: 6vw;
}
.triangle {
    width: 0px;
    height: 0px;
    position: absolute;
    top: 5vw;
    left: -3vw;
    border-top: 1.5vw solid rgba(0,0,0,0);
    border-right: 1.5vw solid #FFFFFF;
    border-bottom: 1.5vw solid rgba(0,0,0,0);
    border-left: 1.5vw solid rgba(0,0,0,0);
}




.blue1 {
    background: #18AEED !important;
}
.gray {
    background: #6E6E6E !important;
}
.gray1 {
    background: #C8C8C8 !important;
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
.FFF {
    background: #FFFFFF !important;
}
</style>
