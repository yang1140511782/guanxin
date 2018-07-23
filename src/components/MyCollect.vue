<template>
    <div class="big-box" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" >
        <div class="collect-list" :class="{margin1:isRedact}">
            <div v-for="(item,index) in collectLists" style="width: 100%;" :class="{ccc:item.status !=3}">
                <div @click="toServiceDetail(item.serviceId,item.status)" v-bind:class="{ margin: isRedact }" style="width: 100%;" >
                    <div class="top">
                        <div class="left">
                            <img v-if="haveImg" src="../assets/images/mr_fw_dt@3x.png">
                            <img v-else :src="item.logo">
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
                            <div class="right-detail ellipsis">{{item.serviceDetail}}</div>
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
                            <img v-if="item.status ==3" @click.stop="appointment(item.serviceId)" src="../assets/images/icon_zjyy@3x.png">
                        </div>
                        <div class="pic-box1" v-if="item.status !=3">服务已停止</div>
                    </div>
                </div>

                <div v-show="isRedact" class="redact" @click="pitchOn(index,item.id)">
                    <img v-show="item.pitch" src="../assets/images/icon_wancheng@3x.png">
                </div>
            </div>
        </div>
        <div class="footer" v-if="collectLists.length>0 && isRedact == false">
            <div class="btn" @click="redact">编辑</div>
        </div>
        <div v-if="isRedact == true" class="del-box">
            <div @click="cancel">取消</div>
            <div @click="delCollect">删除<span>({{ids.length}})</span> </div>
        </div>
        <div class="center" v-if="collectLists.length<1">
            暂无数据
        </div>
    </div>
</template>
<script>
    import $http from 'axios';
    import { Toast } from 'mint-ui';
    import doSign from '../../static/md5.js'
    import {newPost1} from '../../static/request.js'
    export default {
        data () {
            return {
                url:"",
                collectLists:[],
                loading:true,
                isRedact:false,
                ids:[],
                haveImg:''
            }
        },
        methods:{
            // 获取收藏列表
            getCollectList(){
                var data = JSON.parse(localStorage.getItem('userInfo'));
                var token = data.token;
                var userId = data.userId;
                var data ={
                    "userId":userId,
                    "page":1,
                    "pageSize":1000
                }
                var param ={
                    url:this.url+"/system/user/reservation/service/collection/list",
                    data:data,
                    token:token,
                    userId:userId,
                    server:'reservation'
                }
                newPost1(param).then((res) => {
                    console.log(res)
                    if(res.data.code == '1011'){
                        this.loading=false;
                    }
                    var list = res.data.message.list;
                    var array = [];
                    var _this = this;
                    if(list.length>0){
                        list.forEach(function(data){
                            // 医疗机构名字
                            var hospitalName = data.hospitalName;
                            // 医疗机构LOGO
                            var logo = data.serviceLogo;
                            // 服务名字
                            var name = data.serviceName;
                            // 服务评分
                            var score = data.score;
                            // 评论数量
                            var commentNum = data.commentNum;
                            // 服务详情
                            var serviceDetail = data.serviceDetail;
                            // 服务主体类型 (团队或者医院)
                            var bodyType = data.bodyType;
                            // 服务地址
                            var address = data.address;

                            // 服务价格
                            var price = data.price;
                            // 砖石的数量
                            var priceNum = price*2;
                            // 服务ID
                            var serviceId = data.serviceId;
                            var id = data.id;
                            // 服务状态
                            var status = data.status;
                            var haveImg = logo;
                            console.log(!haveImg)
                            if(bodyType == 'type_hosp'){
                                bodyType = "医院"
                            }else {
                                bodyType = "团队"
                            }
                            var pitch = false
                            logo = _this.url + logo + "?server=image"
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
                                status,
                                pitch,
                                haveImg,
                                serviceId
                            })
                        })
                        this.collectLists = array;
                    }
                    this.loading=false;
                    var _this = this;
                    setTimeout(function(){
                        if(array.length>0){
                            var e = document.getElementsByClassName('ellipsis');
                            for(let i=0;i<e.length;i++){
                                var h = e[i].clientHeight;

                                if(h>=32){
                                    console.log("OK")
                                    e[i].className +=" ellipsis1";
                                    _this.loadStyleString(".ellipsis1::after{content: '...'; position: absolute; bottom: 0; right: 0; padding-left: 40px;background: -webkit-linear-gradient(left, transparent, #fff 55%);background: -o-linear-gradient(right, transparent, #fff 55%);background: -moz-linear-gradient(right, transparent, #fff 55%);background: linear-gradient(to right, transparent, #fff 55%);}");
                                }
                            }

                        }
                    },2500);
                });
            },
            // 编辑
            redact(){
                console.log("可以的")
                this.isRedact = true
            },
            //  选中
            pitchOn(index,id){
                console.log(index)
                console.log(id)
                console.log(this.ids)
                if(this.collectLists[index].pitch){ // 取消选中
                    var length =  this.ids.length;
                    for(let i =0; i<length; i++){
                        if(id == this.ids[i].id){
                            this.ids.splice(i,1)
                            this.collectLists[index].pitch = !this.collectLists[index].pitch
                            return
                        }
                    }
                }else {  // 选中
                    this.collectLists[index].pitch = !this.collectLists[index].pitch
                    this.ids.push({
                        "id":id
                    })
                }
                console.log(this.ids)
            },
             // 跳转服务详情
            toServiceDetail(data,status){
                console.log(data)
                console.log(status)

                // if(status!=3){
                //     Toast({
                //         message: "该服务已下架",
                //         duration: 2000
                //     });
                // }else {
                sessionStorage.setItem('serviceId', JSON.stringify(data));
                this.$router.push({
                    path: '/servgetdetails',
                    name: 'ServGetDetails'
                })
                // }
            },
            // 跳转确认预约
            appointment(data){
                sessionStorage.setItem('serviceId', JSON.stringify(data));
                this.$router.push({
                    path: '/confirmanappointment',
                    name: 'ConfirmAnAppointment'
                })
            },
            // 取消
            cancel(){
                this.isRedact = false
            },
            // 删除
            delCollect(){
                var userInfo = JSON.parse(localStorage.getItem('userInfo'));
                var token = userInfo.token;
                var name = userInfo.name;
                var userId = userInfo.userId;
                var ids = this.ids;
                if(ids.length<1){
                     Toast({
                        message: "请选择删除项",
                        duration: 2000
                    });
                     return
                }
                var id = '';
                for(let i=0;i<ids.length;i++){
                    if(i<1){
                        id = ids[i].id
                    }else {
                        id =id+','+ ids[i].id
                    }
                }
                var data1 ={
                        "id":id
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
                        console.log("")
                        this.getCollectList();
                        this.$router.go(0);
                        window.location.reload();
                    })
            }
        },
        mounted(){
            document.title = this.$route.meta.title;
            this.getCollectList();
            this.url = $http.defaults.baseURL;
        },
        components:{

        }
    }
</script>

<style scoped>
.ccc {
    color: #8C8C8C !important;
}
.ellipsis {
    position: relative;
    line-height: 16px;
    max-height: 32px;
    overflow: hidden;
}
.margin1 {
    margin-bottom: 2vw !important;
}
.big-box {
    height: 100%;
    width: 100%;
    background: #F7F7F7 !important;
    display: flex;
    flex-direction: column;
}
.collect-list {
   flex:1;
   overflow: hidden;
   margin-bottom: 16vw;
   overflow-y: scroll;
}
.collect-list>div {
    position: relative;
    box-sizing: border-box;
    padding: 3vw;
    background: #FFFFFF;
    margin-bottom: 2px;
}
.top {
    text-align: left;
    display: flex;
}
.top>.left {
    height: 18vw;
    width: 18vw;
    display: flex;
    align-items: center;
}
.top>.left>img {
    height: 18vw;
    width: 18vw;
}
.top>.right {
    box-sizing: border-box;
    padding-left: 3vw;
    flex: 1;
}
.right>.right-detail {
    font-size: 12px;
    display:-webkit-box;
    -webkit-line-clamp:2;
    overflow:hidden;
    -webkit-line-break:auto;
    -webkit-box-orient:vertical;
}
.right>.comment {
    display: flex;
    align-items: center;
    margin: 0.5vw 0px;
}
.right>.comment>span {
    color: #C2C2C2;
    font-size: 12px;
    margin-left: 2vw;
}
.bottom {
    width: 100%;
    box-sizing: border-box;
    padding-left: 18vw;
    margin-top: 2vw;
    position: relative;
    overflow: hidden;
}
.group {
    text-align: left;
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
.pic-box1 {
    height: 24px;
    line-height: 24px;
    position: absolute;
    right: 0px;
    bottom: 0vw;
    font-size: 12px;
}
.redact {
    height: 5vw;
    width: 5vw;
    position: absolute;
    left: 3vw;
    bottom: 50%;
    border:1px solid #e9e9ea;
    border-radius: 50%;
}
.redact>img {
    height: 100%;
    width: 100%;
}

.footer {
    width: 100%;
    box-sizing: border-box ;
    padding:2vw;
}
.footer>.btn {
    height: 12vw;
    width: 100%;
    background: #18AEED;
    color: #FFFFFF;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
}
.del-box {
    height: 12vw;
    width: 100%;
    background: #FFFFFF;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: 0px 2vw;
}
.del-box>div:nth-child(2) {
    color: #EDA56D ;
}





.margin {
    margin-left: 8vw;
}

.border {
    border:1px solid;
}
.center {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.span {
    display: block;
}
</style>
