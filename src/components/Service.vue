<template>

    <div class="big-box" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
      <section class="floatImg">
        <a href="http://www.cdmn.com/appdownload.html"><img src="../assets/images/float.png" class="imgHos"></a>
      </section>
      <section class="headerImg">
        <img v-if="bannerurl.length <= 0" src="../assets/images/symr.jpg">
        <img v-if="bannerurl.length > 0" :src="bannerurl">
      </section>

        <!--<div class="img-box">-->
            <!--<div class="block">-->
                <!--<el-carousel trigger="click" arrow="never">-->
                    <!--<el-carousel-item v-if="bannerurl.length>0" v-for="item in bannerurl" :key="item">-->
                        <!--<img :src="item">-->
                    <!--</el-carousel-item>-->
                    <!--<img v-if="bannerurl.length <= 0" src="../assets/images/symr.jpg">-->
                <!--</el-carousel>-->
            <!--</div>-->
        <!--</div>-->
        <div class="intro">
            <div class="title">{{name}}</div>
            <div class="location">
                <img src="../assets/images/icon_dw@3x.png">
                <span>{{address}}</span>
            </div>
            <div class="main-intro" v-html="mainText"></div>
        </div>
        <div class="Services">
            <div>服务项目</div>
            <ul>
                <li v-for="(item,index) in serviceList" :key="index" @click="getServiceContent(item.id,index)" :class="{blue2:index == idx}">{{item.name}}</li>
            </ul>
                <div class="collect-list-box center" v-show="collectList.length<1">
                    暂无服务
                </div>
            <!-- <div class="collect-list"> -->
                <div class="collect-list-box" v-for="item in collectList" @click="toServiceDetail(item.id)">
                    <div class="top">
                        <div class="left">
                            <img v-show="!!item.img" :src="item.logo">
                            <img v-show="!item.img" src="../assets/images/mr_fw_dt@3x.png">
                        </div>
                        <div class="right">
                            <div class="right-title">{{item.name}}</div>
                            <div class="comment">
                                <el-rate
                                  v-model="item.score"
                                  disabled
                                  text-color="#ff9900">
                                </el-rate>
                                <span>{{item.commentNum}}条评论</span>
                            </div>
                            <div class="right-center ellipsis" >{{item.serviceDetail}}</div>
                        </div>
                    </div>
                    <div class="bottom">
                        <div class="group">
                            <span>{{item.bodyType}} - {{item.address}}</span>
                        </div>
                        <div class="price">
                            <div class="zs">
                                <img src="../assets/images/icon_zs@3x.png">
                                <span>{{item.priceNum}}</span>
                            </div>
                            <div>
                                <span>￥</span>
                                <span>{{item.price}}</span>
                            </div>
                        </div>
                        <div class="pic-box">
                            <img src="../assets/images/icon_zjyy@3x.png" @click.stop="appointment(item.id)">
                        </div>
                    </div>
                </div>
        </div>
        <tab class="footer"></tab>
    </div>
</template>
<script>
    import $http from 'axios'
    import {newPost2} from '../../static/request.js'
    import tab from './Tab'
    import { Toast } from 'mint-ui';
    export default {
        data () {
            return {
                bannerurl:[],
                name:"某某服务中心",
                address:"成华区猛追湾",
                mainText:"治疗慢性咽炎",
                serviceList:[{"name":"全部"}],
                collectList:[],
                loading:true,
                idx:0,
                url:''
            }
        },
        methods:{
            // 获取url上指定的参数
            getParameter(name){
                var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
                var r = window.location.search.substr(1).match(reg);

                if(r!=null){
                    return  unescape(r[2]);
                }

                return null;
            },
            // 获取医院简介
            getHospitalInfo(){
                // var url1 = "http://10.2.2.2/medcare2/base/hospital/get?server=info";
                var hospitalId = JSON.parse(sessionStorage.getItem('hospitalId'));
                var data ={
                    "hospitalId":hospitalId
                }
                var param ={
                    url:this.url+"/medcare2/base/hospital/get",
                    data:data,
                    server:'info'
                }
                newPost2(param).then((res) => {
                  console.log('医院简介')
                    console.log(res)
                    var msg = res.data.message;
                    var banner = msg.hospitalImage;
                    if(!!banner){
                        var banner = banner.split(",");
                        var bannerurl = [];
                        var _this = this;
                        banner.forEach(function(data){
                            bannerurl.push(_this.url+data+"?server=image");
                        })
                    }
                    this.bannerurl = bannerurl;
                    this.name = msg.name;
                    sessionStorage.setItem('hospitalName', JSON.stringify(msg.name));
                    this.address = msg.address;
                    this.mainText = msg.informDesc;
                    document.title = msg.name;

                    // 获取服务类型列表
                    var data1 ={
                        "searchText":"",
                        "page":"1",
                        "pageSize":"100",
                        "hospitalId":hospitalId

                    }
                    var param1 ={
                        url:this.url+"/medcare/reservation/service/type/list",
                        data:data1,
                        server:'reservation'
                    }
                    newPost2(param1).then((res) => {
                        console.log("服务")
                        console.log(res)
                        var msg = res.data.message;
                        var list = msg.list;
                        var _this = this;
                        list.forEach(function(data){
                             _this.serviceList.push({"name":data.name,"id":data.id})
                        })
                        this.getServiceContent("",0);
                    })
                });
            },
            // 获取服务列表内容
            getServiceContent(id,index){
                var hospitalId = JSON.parse(sessionStorage.getItem('hospitalId'));
                var data2 ={
                    "hospitalId":hospitalId,
                    "serviceTypeId":id,
                    "bodyType":"",
                    "bodyId":"",
                    "searchText":'',
                    "status":"3",
                    "province":"",
                    "city":"",
                    "country":"",
                    "beginTime":"",
                    "endTime":"",
                    "orderBy":"type_score",
                    "longitude":"",
                    "latitude":"",
                    "page":"",
                    "pageSize":""
                }
                var param2 ={
                    url:this.url+"/medcare/reservation/service/list",
                    data:data2,
                    server:'reservation'
                }
                newPost2(param2).then((res) => {
                    console.log(res)
                    var msg = res.data.message;
                    var list = msg.list;
                    var array = [];
                    var _this = this;
                    list.forEach(function(data){
                        // 医疗机构名字
                        var hospitalName = data.hospitalName;
                        // 医疗机构LOGO
                        var logo = data.serviceLogo;
                        var img = logo;
                        // 服务名字
                        var name = data.serviceName;
                        // 服务评分
                        var score = data.score;
                        // 评论数量
                        var commentNum = data.commentNum;
                        // 服务详情
                        var serviceDetail = data.serviceDetail;
                        // 服务主体类型 (团队或者医院)
                        var bodyType = data.bodyName;
                        // 服务地址
                        var address = data.address;
                        // 砖石的数量
                        var priceNum = data.price*2;
                        // 服务价格
                        var price = data.price;
                        // 服务ID
                        var id = data.id;
                        // if(bodyType == 'type_hosp'){
                        //     bodyType = "医院"
                        // }else {
                        //     bodyType = "团队"
                        // }
                        logo = _this.url + logo + "?server=image";
                        array.push({
                            hospitalName,
                            logo,
                            name,
                            score,
                            commentNum,
                            serviceDetail,
                            bodyType,
                            address,
                            priceNum,
                            price,
                            id,
                            img
                        })
                    })
                    this.collectList = array;
                    this.loading = false;
                    this.idx = index;
                    var _this = this;
                    setTimeout(function(){
                        if(array.length>0){
                            var e = document.getElementsByClassName('ellipsis');
                            for(let i=0;i<e.length;i++){
                                var h = e[i].clientHeight;

                                if(h>=32){
                                    console.log("OK")
                                    e[i].className +=" ellipsis1";
                                    _this.loadStyleString(".ellipsis1::after{content: '...'; position: absolute; bottom: 0; right: 0; padding-left: 2px;background:#fff");
                                }
                            }

                        }
                    },500);



                })
            },
            loadStyleString(css){
                var style = document.createElement("style");
                style.type = "text/css";
                try{
                    style.appendChild(document.createTextNode(css));
                }catch(ex){
                    style.styleSheet.cssText = css;
                }
                var head = document.getElementsByTagName('head')[0];

                head.appendChild(style);
            },
            // 跳转服务详情
            toServiceDetail(data){
                sessionStorage.setItem('serviceId', JSON.stringify(data));
                this.$router.push({
                    path: '/servgetdetails',
                    name: 'ServGetDetails'
                })
            },
            // 跳转确认预约
            appointment(data){
                var userInfo = JSON.parse(localStorage.getItem('userInfo'));
                sessionStorage.setItem('serviceId', JSON.stringify(data));
                if(!!userInfo){
                    this.$router.push({
                        path: '/confirmanappointment',
                        name: 'ConfirmAnAppointment',
                        params: {
                            "id":data
                        }
                    })
                }else {
                    this.$router.push({
                        path: '/login',
                        name: 'Login'
                    })
                }
            }
        },
        mounted(){
            document.title = this.$route.meta.title;
            var hospitalId = this.getParameter('hospitalId');
            sessionStorage.setItem('hospitalId', JSON.stringify(hospitalId));
            this.getHospitalInfo();
            this.url = $http.defaults.baseURL;
        },
        components:{
            tab
        }
    }
</script>

<style scoped>
  .headerImg img{
    width: 100%;
    overflow: hidden;
  }
.ellipsis {
    position: relative;
    line-height: 16px;
    max-height: 32px;
    overflow: hidden;
}
.big-box {
    height: 100%;
    width: 100%;
    background: #EFEFF4 !important;
    overflow-y: scroll;
    background: #F7F7F7;
}
.big-box .img-box {

}
.big-box .img-box>.block {

}
.block img {
    height: 100%;
    width: 100%;
}
.intro {
    background: #FFFFFF;
    margin-bottom: 3vw;
    box-sizing: border-box;
    padding: 0px 3vw;
}
.intro .title {
    text-align: left;
    height: 8vw;
    line-height: 8vw;
    font-size: 18px;
    color: #2B2B2B;
}
.intro .location {
    height: 5vw;
    display: flex;
    align-items: center;
    margin: 3vw 0px;
}
.intro .location>img {
    height: 3vw;
    width: 3vw;
}
.intro .location>span {
    height: 5vw;
    margin-left: 1vw;
    font-size: 12px;
    color: #9B9B9B;
}
.main-intro {
    text-align: left;
    margin-bottom: 1vw;
    font-size: 14px;
}
.Services {
    text-align: left;
    background: #FFFFFF;
    box-sizing: border-box;
    padding: 0px 3vw;
    margin: 3vw 0px;
    margin-bottom: 2px;
    margin-bottom: 18vw;
}
.Services>div:nth-child(1) {
    height: 10vw;
    line-height: 10vw;
}
.Services>ul {
    padding: 3vw 0px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    margin: 0px;
    border-bottom: 1px solid #F4F4F4;
}
.Services>ul>li {
    font-size: 14px;
    text-align: center;
    list-style: none;
    /*width: 17vw;*/
    border: 1px solid #F4F4F4;
    margin-right: 1vw;
    border-radius: 20px;
    margin-bottom: 2vw;
    padding: 1vw 2vw;
}
/*.Services>div>.top {
    text-align: left;
    display: flex;
    align-items: center;
}*/
.collect-list {
    box-sizing: border-box;
    padding: 3vw;
    background: #FFFFFF;
    margin-bottom: 2px;
}
.collect-list-box {
    box-sizing: border-box;
    padding: 3vw;
    background: #FFFFFF;
    margin-bottom: 3vw;
    border-bottom: 1px solid #F4F4F4;
}
.top {
    text-align: left;
    display: flex;
}
.top>.left {
    height: 15vw;
    width: 15vw;
    display: flex;
    align-items: center;
}
.top>.left>img {
    height: 15vw;
    width: 15vw;
}
.top>.right {
    box-sizing: border-box;
    padding-left: 3vw;
    flex: 1;
}
.right>.comment {
    display: flex;
    align-items: center;
    font-size: 14px;
}
.right>.comment>span {
    color: #C2C2C2;
    font-size: 12px;
    margin-left: 2vw;
}
.right-title {
    font-size: 16px;
    margin-bottom: 1vw;
}
.right-center {

    /*text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;*/

    margin-top:1vw;
    font-size: 12px;
}
.bottom {
    box-sizing: border-box;
    padding-left: 18vw;
    margin-top: 2vw;
    position: relative;
}
.group {
    margin-bottom: 2vw;
    display: flex;
    justify-content: flex-start;
}
.group>span {
    font-size: 12px;
    padding: 1vw;
    border-radius: 5px;
    border: 1px solid #F4F4F4;
    color: #8C8C8C ;
    margin-right: 8vw;
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
.pic-box {
    height: 24px;
    width: 24px;
    position: absolute;
    right: 0px;
    bottom: 0vw;
}
.pic-box>img {
    height: 100%;
    width: 100%;
}

.blue2 {
    background: #18AEED;
    color: #FFFFFF;
}
.center {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
