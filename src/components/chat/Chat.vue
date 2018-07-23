<template>
    <div class="big-box" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
        <div id="scrollDiv" class="scroll-box" :class="{margin : padding == 'true' }" v-if="previewShow == false">
            <div v-for="(item,index) in list" :key = 'index' :class="{left:item.flow == 'in',right:item.flow == 'out' }" >
                <div class="time" v-if="timeList[index].show">
                    <span>
                        {{timeList[index].time}}
                    </span>
                </div>
                <div class="notice" v-if="item.type == 'audio'">
                    <span>对方发了条音频消息，请<a href="http://www.cdmn.com/appdownload.html">下载关心堂APP</a> 进行查看</span>    
                </div>
                <div class="notice" v-if="item.type == 'notification'">
                    <span v-if="item.attach.type=='addTeamMembers'">{{item.attach.users[1].nick}}邀请你 加入群</span>
                    <span v-if="item.attach.type=='updateTeam'">群头像已更新</span>    

                </div>
                <div class="chat-box" v-if="item.type != 'audio' && item.type != 'notification'">
                    <div class="headImg" v-if="item.flow == 'in'">
                        <img :src="docHeadImg" v-if="docHeadImg !=''">
                        <img src="../../assets/images/userNoSex.png" v-else>
                    </div>
                    <div class="content">
                        <div class="name" v-if="item.flow == 'in'">
                            {{item.fromNick}}
                        </div>
                        <div class="text" v-if="item.type == 'text'" :class="{white:item.flow == 'in',blue:item.flow == 'out' }">
                            {{item.text}}
                        </div>
                        <div class="img-box" v-if="item.type == 'image'">
                            <img :src="item.file.url" @click="preview(item.file.url)" >
                        </div>
                        <div class="video-box" v-if="item.type == 'video'">
                            <div>
                                <img src="../../assets/images/play.png" @click="launchFullScreen($event)" >
                            </div>
                            <video id="video" :src="item.file.url" width="100%" controls>您的手机浏览器不支持播放</video>
                        </div>
                    </div>
                    <div class="headImg" v-if="item.flow == 'out'">
                        <img :src="userHeadImg" v-if="userHeadImg !=''">
                        <img src="../../assets/images/userNoSex.png" v-else>
                    </div>
                </div>
            </div>
        </div>
        <div class="bottom">
            <div class="bottom-top">
                <textarea maxlength="800" v-model="text"></textarea>
                <div></div>
                <div class="bottom-right">
                    <div @click="send">发送</div>
                </div>
                <div class="more" @click="popup">
                    <img src="../../assets/images/icon_tianjia@3x.png">
                </div>
            </div>
            <div class="bottom-bottom" v-if="more">
                <div>
                    <div class="pic">
                        <input type="file" id="file" @change="getImgUrl($event,'image')" ref="inputer">
                        <label for="file">
                            <img src="../../assets/images/icon_tupian@3x.png">
                        </label>   
                    </div>
                    <span>图片</span>
                </div>
                
                <div>
                    <div class="vidoe">
                        <input type="file" id="file1" @change="getImgUrl($event,'video')" ref="inputer">
                        <label for="file1">
                            <img src="../../assets/images/video.png">
                        </label>
                    </div>
                    <span>视频</span>
                </div>
                
            </div>
        </div>
        
        <!-- 图片预览专用 -->
        <div class="image-box" v-if="previewShow == true">
            <div>
                <img src="../../assets/images/icon_gb@3x.png" @click="close">
            </div>
            <img :src="imgUrl" @click="close" @touchend="slide($event,imgUrl)">
        </div>
        <!-- 进度条 -->
        <div class="progress" v-if="percentage>0">
            <mt-progress :value=percentage :bar-height="3"></mt-progress>
        </div>
    </div>
</template>
<script>
    import $http from 'axios'
    import {newPost2,newPost1} from '../../../static/request.js'
    import { Toast, Progress} from 'mint-ui' 
    import NIM from '../../../static/NIM_Web_NIM_v5.2.1.js'

export default {
    data () {
        return {
            // 医生头像
            docHeadImg:'',
            // 用户头像
            userHeadImg:"",
            url:'',
            // 聊天记录列表
            list:[],
            // 发送消息输入框内容
            text:'',
            tid:'',
            // 聊天记录时间数组
            timeList:[],
            // 更多（需要发送非文本的消息）
            more:false,
            // 点击更多时，需要把聊天记录顶上来 (用padding)
            padding:'false',
            // 撤回消息弹出框的显示与隐藏
            popupVisible:false,
            // 是否预览
            previewShow:false,
            // 预览的图片数组
            imageUrls:[],
            imgUrl:'',
            // 进来是否显示加载中
            loading:true,
            // 进度条的百分比
            percentage:0
        }
    },
    methods:{
        // 创建群聊
        chatGroup(docId,tname,icon){
            var userInfo = JSON.parse(localStorage.getItem('userInfo'));
            var token = userInfo.token;
            var userId = userInfo.userId;
            var data2 ={
                "docId":docId,
                "userId":userId,
                "tname":tname,
                "icon":icon
            }
            var param1 ={
                url:this.url+"/system/reservation/circle/group/create",
                data:data2,
                token:token,
                userId:userId,
                server:'circle'
            }
            newPost1(param1).then((res) => {
                console.log("测试")

                console.log(res)
                document.title = res.data.message.tname;
                var tid = res.data.message.tid;
                this.tid = tid;
                this.getHistoryMsgs(tid);
            })
        },
        
        // 初始化SDK
        connectSDK (appkey,account,token,docId) {
            var _this = this;
            const nim = window.nim = NIM.getInstance({
                // 初始化SDK
                // debug: true
                appKey: appkey,
                account: account,
                token: token,
                onconnect: onConnect,
                onerror: onError,
                onwillreconnect: onWillReconnect,
                ondisconnect: onDisconnect,
                // 消息的收发
                onroamingmsgs: onRoamingMsgs,
                onofflinemsgs: onOfflineMsgs,
                onmsg: onMsg,
                // 多端登录
                onloginportschange: onLoginPortsChange,
                // 同步完成
                onsyncdone: onSyncDone
            });
            var _this = this;

            function onConnect() {
                console.log('连接成功');
                nim.connect();
                _this.chatGroup(docId,serviceName,serviceLogo);
            }
            function onWillReconnect(obj) {
                // 此时说明 `SDK` 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接
                console.log('即将重连');
                console.log(obj.retryCount);
                console.log(obj.duration);
            }
            function onDisconnect(error) {
                // 此时说明 `SDK` 处于断开状态, 开发者此时应该根据错误码提示相应的错误信息, 并且跳转到登录页面
                console.log('丢失连接');
                console.log(error);

                // if (error) {
                //     switch (error.code) {
                //     // 账号或者密码错误, 请跳转到登录页面并提示错误
                //     case 302:
                //         break;
                //     // 被踢, 请提示错误后跳转到登录页面
                //     case 'kicked':
                //         break;
                //     default:
                //         break;
                //     }
                // }
            }
            function onError(error) {
                console.log(error);
            }
            function onLoginPortsChange(loginPorts) {
                console.log('当前登录帐号在其它端的状态发生改变了', loginPorts);
            }

            function onRoamingMsgs(obj) {
                console.log('收到漫游消息', obj);
                _this.list.push(obj.msgs)
                _this.timeArray();
                pushMsg(obj.msgs);
                setTimeout(function(){
                    _this.scrollTop();
                },500)
            }
            function onOfflineMsgs(obj) {
                console.log('收到离线消息', obj);
                _this.list.push(obj.msgs)
                _this.timeArray();
                pushMsg(obj.msgs);
                setTimeout(function(){
                    _this.scrollTop();
                },500)
            }
            function onMsg(msg) {
                _this.list.push(msg)
                _this.timeArray();
                console.log('收到消息', msg.scene, msg.type, msg);
                pushMsg(msg);

                setTimeout(function(){
                    _this.scrollTop();
                },500)
                // switch (msg.type) {
                // case 'custom':
                //     onCustomMsg(msg);
                //     break;
                // case 'notification':
                //     // 处理群通知消息
                //     onTeamNotificationMsg(msg);
                //     break;
                // // 其它case
                // default:
                //     break;
                // }
                
            }
            

            function onCustomMsg(msg) {
                // 处理自定义消息
            }
            function pushMsg(msgs) {
                var data = {};
                if (!Array.isArray(msgs)) { msgs = [msgs]; }
                var sessionId = msgs[0].scene + '-' + msgs[0].account;
                data.msgs = data.msgs || {};
                data.msgs[sessionId] = nim.mergeMsgs(data.msgs[sessionId], msgs);
                console.log(data)
            }

            function onSyncDone() {
                console.log('同步完成');
            }
            var service = JSON.parse(sessionStorage.getItem('serviceName'));
            var serviceName = service.serviceName;
            var serviceLogo = service.serviceLogo;

            
        },
        // 获取群组聊天记录
        getHistoryMsgs(id){
            // 获取群聊记录
            nim.getHistoryMsgs({
                scene: 'team',
                to: id,
                asc:true,
                endTime:new Date().valueOf(),
                done: getHistoryMsgsDone
            });
            var _this = this;
            function getHistoryMsgsDone(error, obj) {
                console.log('获取云端历史记录' + (!error?'成功':'失败'), error, obj);
                if (!error) {
                    console.log(obj.msgs);
                    _this.list = obj.msgs;
                    _this.timeArray();

                    var arr = [];
                    if(_this.list.length>0){
                        _this.list.forEach(function(data){
                            if(data.type == 'image'){
                                arr.push({
                                    imageUrl:data.file.url
                                })
                            }
                        })
                    }
                    _this.imageUrls = arr;
                }
                setTimeout(function(){
                    _this.scrollTop();
                    _this.loading=false;
                },300)
            }
        },
        // 聊天记录时间数组
        timeArray(){
            var _this = this;
            var length=_this.list.length; 
            if(length>0){
                var list = _this.list;
                var array = [];
                var newTime = new Date().valueOf(); // 当前时间的时间戳
                console.log(newTime)
                var show = false;
                var time = '';
                for(let i=0;i<length;i++){
                    var time1 = list[i].time;
                    var day =_this.dateDiff(newTime,time1) // 创建时间距离今天的天数
                    if(day==2){
                        time = _this.formatDateTime(time1);
                        time='前天' + time.split(' ')[1].split(":")[0]+":"+time.split(' ')[1].split(":")[1]
                    }else if(day==1){
                        time = _this.formatDateTime(time1);
                        time='昨天' +' ' +time.split(' ')[1].split(":")[0]+":"+time.split(' ')[1].split(":")[1]
                    }else if(day==0){
                        time = _this.formatDateTime(time1);
                        time='今天' +' ' +time.split(' ')[1].split(":")[0]+":"+time.split(' ')[1].split(":")[1]
                    }else {
                        time = _this.formatDateTime(time1);
                    }

                    // 判断是否该显示时间(间隔3分钟的对话不需要显示时间)
                    if(i == 0){
                        console.log("测试时间")
                        if(_this.differenceTimeValue(list[0].time,newTime)>180000 ){ 
                            show = true;
                        }else {
                            show = false;
                        }
                    }else {
                        if(_this.differenceTimeValue(list[i-1].time,list[i].time)>180000 ){
                            show = true;
                        }else {
                            show = false;
                        }
                    }
                    array.push({
                        time,
                        time1,
                        newTime,
                        show
                    })
                }
                _this.timeList = array;
            }else {
                _this.noList = true; // 聊天记录为空
            }
        },
        // 时间戳转换为格式YYYY-MM-DD
        formatDateTime(val) {  
            var date = new Date(val);
            var Y = date.getFullYear() + '-';
            var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
            var D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
            var h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
            var m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes());
            // var s = date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds();
            var val = Y+M+D+h+m;
            return val;
        },
        // 计算两个时间戳之间相差的分钟    时间戳
        differenceTimeValue(val1,val2) {  // val2 为大的时间
            var fz = val2 - val1;
            return fz;
        },
        // 计算时间天数之差
        dateDiff(t1,t2){
            var t1, t2, iDays;
            iDays = parseInt(Math.abs(t1 - t2) / 1000 / 60 / 60 / 24); // 把相差的毫秒数转换为天数

            return iDays;  //返回相差天数
        },
        // 发送消息
        send(){
            var _this = this;
            if(!this.text){
                Toast({
                    message: "发送内容不可为空",
                    duration: 2000
                });
                return
            }
            var msg = nim.sendText({
                scene: 'team',
                to: this.tid,
                text: this.text,
                done: sendMsgDone
            });
            console.log('正在发送p2p text消息, id=' + msg.idClient);
            pushMsg(msg);


            function sendMsgDone(error, msg) {
                console.log(error);
                console.log(msg);
                _this.list.push(msg)
                _this.timeArray();
                console.log('发送' + msg.scene + ' ' + msg.type + '消息' + (!error?'成功':'失败') + ', id=' + msg.idClient);
                pushMsg(msg);

                _this.more = false;
                _this.padding = 'false';

                setTimeout(function(){
                    _this.scrollTop();
                },500)
            }

            function pushMsg(msgs) {
                var data = {};
                if (!Array.isArray(msgs)) { msgs = [msgs]; }
                var sessionId = msgs[0].sessionId;
                data.msgs = data.msgs || {};
                data.msgs[sessionId] = nim.mergeMsgs(data.msgs[sessionId], msgs);
            }
            this.text=""
        },
        //视频全屏幕播放   （仅安卓全屏）
        launchFullScreen(e) {
            // var element = e.target.parentNode.parentNode.childNodes[2];
            var element = e.target.parentNode.parentNode.lastChild;
            var element1 = e.target.parentNode;
            console.log(element1)
           
            if(element.requestFullScreen) {
                element.requestFullScreen();
            } else if(element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if(element.webkitRequestFullScreen) {
                element.webkitRequestFullScreen();
            }else {
                // Toast({
                //     message: "您的手机暂不支持播放",
                //     duration: 2000
                // });
                element.style.display = 'block';
                element1.style.display = 'none';
            }
        },
        // 弹出更多选项（发送消息）
        popup(){
            var _this=this;
            this.more = !this.more;
            if(this.padding == 'false'){
                this.padding = 'true';
            }else {
                this.padding = 'false';
            }
            setTimeout(function(){
                _this.scrollTop();
            },100)
        },
        // 获取即将发送图片的路径  （发送图片与视频）
        getImgUrl(e,type){
            console.log('发送消息')
            var _this = this;
            var imgUpload = e.target;
            
            nim.sendFile({
                scene: 'team',
                to: this.tid,
                type: type,
                fileInput: imgUpload,
                beginupload: function(upload) {
                    // - 如果开发者传入 fileInput, 在此回调之前不能修改 fileInput
                    // - 在此回调之后可以取消图片上传, 此回调会接收一个参数 `upload`, 调用 `upload.abort();` 来取消文件上传
                },
                uploadprogress: function(obj) {
                    console.log('文件总大小: ' + obj.total + 'bytes');
                    console.log('已经上传的大小: ' + obj.loaded + 'bytes');
                    console.log('上传进度: ' + obj.percentage);
                    _this.percentage = obj.percentage;
                    console.log('上传进度文本: ' + obj.percentageText);
                    if(obj.percentage == '100'){
                        setTimeout(function(){
                            _this.percentage = 0;
                        },500)
                    }
                },
                uploaddone: function(error, file) {
                    if(!error){

                    }else {
                        Toast({
                            message: "发送消息失败",
                            duration: 2000
                        });
                    }
                    
                    console.log(error);
                    console.log(file);
                    console.log('上传' + (!error?'成功':'失败'));
                },
                beforesend: function(msg) {
                    console.log('正在发送p2p image消息, id=' + msg.idClient);
                    pushMsg(msg);
                },
                done: sendMsgDone
            });
            function sendMsgDone(error, msg) {
                console.log(error);
                console.log(msg);
                _this.list.push(msg)
                _this.timeArray();
                console.log('发送' + msg.scene + ' ' + msg.type + '消息' + (!error?'成功':'失败') + ', id=' + msg.idClient);
                pushMsg(msg);

                _this.more = false;
                _this.padding = 'false';

                setTimeout(function(){
                    _this.scrollTop();
                },500)
            }
            function pushMsg(msgs) {
                var data = {};
                if (!Array.isArray(msgs)) { msgs = [msgs]; }
                var sessionId = msgs[0].sessionId;
                data.msgs = data.msgs || {};
                data.msgs[sessionId] = nim.mergeMsgs(data.msgs[sessionId], msgs);
            }
        },
        // 删除与撤回消息   （暂时做不了）
        // deleteMsg(){
        //     console.log("显示")
        //     e.preventDefault();
        //     this.popupVisible = true;
        // },
        // 图片预览
        preview(data){
            this.imgUrl = data;
            this.previewShow = true;
        },
        // 关闭图片预览
        close(){
            var _this = this;
            this.previewShow = false;
            setTimeout(function(){
                _this.scrollTop();
            },500)
        },
        // 根据手指滑动方向来判断显示哪一张图片 
        slide(e,data){
            var _this = this;
            console.log(_this.imageUrls)
            var mybody = e.target;
            //滑动处理
            var startX, startY, moveEndX, moveEndY, X, Y;  
            mybody.addEventListener('touchstart', function(event) {
                event.preventDefault();
                startX = event.touches[0].pageX;
                startY = event.touches[0].pageY;
            }, false);
            mybody.addEventListener('touchmove', function(e) {
                e.preventDefault();
                moveEndX = e.changedTouches[0].pageX;
                moveEndY = e.changedTouches[0].pageY;
                X = moveEndX - startX;
                Y = moveEndY - startY;
                var l = _this.imageUrls.length;
                for(let i=0;i<l;i++){
                    if(_this.imageUrls[i].imageUrl == data){
                        _this.index = i;
                    }
                }

                if ( Math.abs(X) > Math.abs(Y) && X > 0 ) {
                    console.log("向右滑动")
                        if(_this.index+1>l-1){
                            // Toast({
                            //     message: "已经为最后一张图片",
                            //     duration: 2000
                            // });
                        }else {
                            _this.imgUrl = _this.imageUrls[_this.index+1].imageUrl;
                            _this.index=_this.index+1;
                        }
                }
                else if ( Math.abs(X) > Math.abs(Y) && X < 0 ) {
                    console.log("向左滑动")
                        if(_this.index-1<0){
                            // Toast({
                            //     message: "已经为第一张图片",
                            //     duration: 2000
                            // });
                        }else {
                            _this.imgUrl = _this.imageUrls[_this.index-1].imageUrl;
                            _this.index=_this.index-1;
                        }
                }
                else{
                    
                }
            });
        },
        // test(){
        //     console.log("长按测试")
        // },
        // 滚动到底部
        scrollTop(){
            console.log("滚动到底部")
            var div = document.getElementById('scrollDiv').lastChild;
            div.scrollIntoView(true);
        }
    },
    mounted(){
        this.url = $http.defaults.baseURL;

        var data = JSON.parse(sessionStorage.getItem('wyyx'));
        var appkey = data.appkey;
        var account= data.account;
        var token = data.token;
        var docId = data.docId;
        this.connectSDK(appkey,account,token,docId);
        var docHeadImg = JSON.parse(sessionStorage.getItem('docHeadImg'));
        if(!!docHeadImg.docHeadImg){
            this.docHeadImg = this.url+docHeadImg.docHeadImg+"?server=image";
        }else {
            this.docHeadImg=""
        }
        
        var userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if(!!userInfo.headImageUrl){
            this.userHeadImg = this.url+userInfo.headImageUrl+"?server=image";
        }else {
            this.userHeadImg=""
        }
    }
}
</script>

<style scoped>
#app {
    height: 100%;
    width: 100%;
    background: #edf2f2 !important;
}
.big-box {
    background: #edf2f2 !important;
    height: 100%;
    width: 100%;
    overflow-y: auto;
}
.big-box>.scroll-box {
    padding-bottom: 15vw ;
    background: #edf2f2;
}
.left {
    text-align: left;
    margin: 2vw 0px;
}
.right {
    text-align: left;
    margin: 2vw 0px;
    overflow: hidden;
}
.left>.chat-box {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
}
.right>.chat-box {
    float: right;
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
}
.notice {
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 3vw 0px;
}
.notice>span {
    background: #CCCCCC;
    color: #FFFFFF;
    max-width: 80%;
    border-radius: 5px;
    padding: 1vw;
}
.notice>span>a {
    color: #18AEEE;
    text-decoration: none;
}
.right>.time,.left>.time{
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    margin-top:3vw;
    margin-bottom:2vw;
}
.right>.time>span,.left>.time>span{
    padding: 1vw;
    background: #CCCCCC;
    border-radius: 5px;
    color: #FFFFFF;
}
.chat-box {
    width: 80%;
}
.chat-box .content{
    max-width: 80%;
}
.headImg {
    width: 30px !important;
    height: 30px;
    border-radius: 50%;
    overflow: hidden;
    margin:0px 2vw;
    box-sizing: border-box;
}
.headImg>img {
    width: 100%;
    height: 100%;
}
.name {
    font-size: 12px;
    margin-bottom: 1vw;
}
.text {
    min-width: 10vw;
    min-height: 5vw;
    line-height: 5vw;
    font-size: 14px;
    text-align: left;
    flex: 1;
    border-radius: 5px;
    padding: 5px;
    word-wrap:break-word;
    word-break:break-all;
}
.img-box {
    flex: 1;
    border-radius: 5px;
    background: #F3F3F3;
}
.img-box>img {
    width: 30vw;
    border-radius: 5px;
}
.video-box {
    flex: 1;
    border-radius: 5px;
    background: #F3F3F3;
}
.video-box video {
    display: none;
}
.video-box>div {
    background: #CCCCCC;
    width: 30vw;
    height: 15vw;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
}
.video-box>div>img {
    width: 15px;
    height: 15px;
}
.bottom {
    position: fixed;
    bottom: 0px;
    width: 100%;
    /*height: 15vw;*/
    z-index: 99;
    background: #edf2f2;
    
}
.bottom-top {
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    padding:2vw;
    /*padding-top: 0px;*/
}
.bottom-top textarea {
    min-width:70%; 
    min-height: 25px;
    max-height: 25px;
    line-height: 25px;
    border: 1px solid #CCCCCC;
    outline: none;
    border-radius: 5px;
}
.bottom-top .bottom-right{
    margin:0px 1vw;
    background: #18AEEE;
    color:#FFFFFF;
    height: 30px;
    line-height: 30px;
    width: 15%;
    border-radius: 5px;
    font-size: 14px;
    padding: 2px 5px;
    border: 1px solid #CCCCCC;
}
.more{
    border: 1px solid #CCCCCC;
    border-radius: 50%;
    height: 20px;
    width: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.more>img {
    width: 70%;
    height: 70%;
}
.bottom-bottom {
    display: flex;
    /*justify-content: center;*/
    justify-content: space-around;
    align-items: center;
}
.bottom-bottom>div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.bottom-bottom>div>span {
    font-size: 12px;
}
.bottom-bottom .pic {
    width: 10vw;
    height: 10vw;
    border-radius: 5px;
    background: #18AEEE;
    display: flex;
    justify-content: center;
    align-items: center;
    /*margin-bottom:2vw;
    margin-right: 2vw;*/
}
.bottom-bottom .pic>input {
    display: none;
}
.bottom-bottom label {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.bottom-bottom .pic img {
    width: 60%;
}
.bottom-bottom .vidoe {
    width: 10vw;
    height: 10vw;
    border-radius: 5px;
    background: #23AFA2;
    display: flex;
    justify-content: center;
    align-items: center;
    /*margin-bottom:2vw;
    margin-right: 2vw;*/
}
.bottom-bottom .vidoe>input {
    display: none;
}
.bottom-bottom .vidoe img {
    width: 60%;
}

.image-box {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #000000;
    position: relative;
    z-index: 999;
}
.image-box>div {
    width: 100%;
    height: 10vw;
    background: #CCCCCC;
    opacity: 0.5;
    position: absolute;
    top: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.image-box>div>img {
    width: 10%;
    position: absolute;
    right: 0px;
}
.image-box>img {
    width: 100%;
}

.progress {
    height: 3px;
    overflow: hidden;
    width: 100%;
    position: fixed;
    top: 0px;
}
.mt-progress {
    height: 3px;
}
.mt-progress-content {
    height: 3px;
}

.white {
    background:  #FFFFFF;
    color: #000000;
}
.blue {
    background: #18AEEE !important;
    color: #FFFFFF !important;
}
.margin {
   padding-bottom: 28vw !important;
}
</style>
