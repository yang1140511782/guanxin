<template>
    <div class="big-box" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
        <div class="top">
            <div class="left">
                <img v-if="!serviceLogo" src="../assets/images/userNoSex.png">
                <img v-else :src="logo">
            </div>
            <div class="right">
                <div>{{serviceName}}</div>
                <div>{{serviceDetail}}</div>
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

        <div class="add-and-doc">
            <div class="address">
                <div>服务地址</div>
                <div> {{address}}</div>
            </div>
            <div class="principal">
                <div>服务主体</div>
                <div>{{bodyType}}</div>
            </div>
        </div>

        <div class="time">
            <div class="time-box">
                <span>服务时间</span>
                <input type="text" readonly="readonly" placeholder="请选择服务时间" v-model="date" @focus="openDate" />
                <img src="../assets/images/xiayiye.png">
            </div>
            <div v-if="bulletin && appLimitFlag>0" class="bulletin">
                <div v-if="totalLimit">
                    <span>已预约： <span>{{num11}}</span>  </span>
                    <span>剩余名额： <span>{{num111}}</span></span>
                </div>
                <div v-if="dayLimit">
                    <span>当日剩余： <span>{{num22}}</span></span>
                    <span>已预约： <span>{{num222}}</span></span>
                </div>
                <div v-if="allLimit">
                    <span>当日剩余： <span>{{num33}}</span></span>
                    <span>已预约： <span>{{num333}}</span></span>
                    <span>剩余名额： <span>{{num3333}}</span></span>
                </div>
            </div>
        </div>

        <div class="user-info">
            <div class="sex">
                <span>服务对象性别</span>
                <input type="text" readonly="readonly" v-model="gender" placeholder="请选择服务对象的性别" @focus="openSex"/>
                <img src="../assets/images/xiayiye.png">
            </div>
            <div class="age">
                <span>服务对象年龄</span>
                <input type="text" readonly="readonly" v-model="age" placeholder="请选择服务对象的年龄" @focus="openAge"/>
                <img src="../assets/images/xiayiye.png">
            </div>
        </div>
        <div class="remarks">
            <div class="remarks-title">服务备注 <span>（选填）</span>   </div>
            <textarea placeholder="请详情描述您的情况 如：（病情、特殊要求等）" maxlength="200" @input="keyup" v-model="remarks">

            </textarea>
            <span>{{textNum}}</span>
        </div>
        <div class="bottom">
            <button @click="submit" class="btn" :disabled="disabled">
                提交预约
            </button>
        </div>
        <!-- 服务时间 -->
        <mt-popup v-model="open" position="bottom" class="mint-popup-4">
            <div class="service-time-title">
                <span>服务时间</span>
                <span v-if="appLimitFlag>0">当日剩余名额:{{num}}</span>
            </div>
            <mt-picker name="t" :slots="slots" v-model="open" @change="onValuesChange"></mt-picker>
            <div class="service-time-bottom">
                <span class="mint-datetime-action mint-datetime-cancel" @click="cancleaddress">取消</span>
                <span class="mint-datetime-action mint-datetime-confirm" @click="selectaddress">确定</span>
            </div>
        </mt-popup>
        <!-- <mt-datetime-picker
          type="date time"
          ref="picker"
          year-format="{value} 年"
          month-format="{value} 月"
          date-format="{value} 日"
          hour-format="{value}:00"
          minutefformat="00"
          @confirm="handleConfirm"
          :startDate="startDate"
          :endDate = "endDate"
        > -->
        </mt-datetime-picker>
        <!-- 性别 -->
        <mt-actionsheet
        :actions= "actions"
        v-model="sheetVisible">
        </mt-actionsheet>
        <!-- 服务年龄 -->
        <mt-popup v-model="openAge1" position="bottom" class="mint-popup-4">
            <mt-picker name="a" :slots="slot" v-model="age" @change="onValuesChange1"></mt-picker>
            <div class="service-time-bottom">
                <span class="mint-datetime-action mint-datetime-cancel" @click="cancleaddress1">取消</span>
                <span class="mint-datetime-action mint-datetime-confirm" @click="selectaddress1">确定</span>
            </div>
        </mt-popup>
    </div>
</template>
<script>
    import $http from 'axios'
    import {newPost2,newPost1} from '../../static/request.js'
    import { Toast } from 'mint-ui'
    export default {
        data () {
            return {
                // 服务器端时间戳
                time:"",
                // 服务信息提示
                bulletin:false,
                // 只开启总限制
                totalLimit:false,
                // 只开启每日限制
                dayLimit:false,
                // 都限制
                allLimit:false,
                // 公共url
                url:'',
                // 当日剩余的预约数量
                num:"10",
                loading:false,
                serviceLogo:"",
                address:"",
                serviceName:"",
                prices:[],
                price:"",
                priceNum:"",
                serviceDetail:"",
                bodyType:"",
                serviceTimeText:"",
                id:"",
                serviceLogo:"",
                logo:"",
                appLimitFlag:"",
                totalNumLimit:"",
                dayNumLimit:"",
                age:"",
                gender:"",
                date:"",
                slot: [
                    {
                      divider: true,
                      className: 'age1'
                    }, {
                      divider: true,
                      className: 'age2'
                    }, {
                      flex: 1,
                      values: ["1岁","2岁","3岁","4岁","5岁","6岁","7岁","8岁","9岁","10岁","11岁","12岁","13岁","14岁","15岁","16岁","17岁","18岁","19岁","20岁","21岁","22岁","23岁","24岁","25岁","26岁","27岁","28岁","29岁","30岁","31岁","32岁","33岁","34岁","35岁","36岁","37岁","38岁","39岁","40岁","41岁","42岁","43岁","44岁","45岁","46岁","47岁","48岁","49岁","50岁","51岁","52岁","53岁","54岁","55岁","56岁","57岁","58岁","59岁","60岁","61岁","62岁","63岁","64岁","65岁","66岁","67岁","68岁","69岁","70岁","71岁","72岁","73岁","74岁","75岁","76岁","77岁","78岁","79岁","80岁","81岁","82岁","83岁","84岁","85岁","86岁","87岁","88岁","89岁","90岁","91岁","92岁","93岁","94岁","95岁","96岁","97岁","98岁","99岁","100岁","101岁","102岁","103岁","104岁","105岁","106岁","107岁","108岁","109岁","110岁","111岁","112岁","113岁","114岁","115岁","116岁","117岁","118岁","119岁","120岁"],
                      className: 'age3',
                      textAlign: 'center'
                    }
                ],
                slots: [
                    {
                      flex: 1,
                      values: [],
                      className: 'slot1',
                      textAlign: 'center',
                      valueKey: 0
                    }, {
                      divider: true,
                      content: '-',
                      className: 'slot2'
                    }, {
                      flex: 1,
                      values: [],
                      className: 'slot3',
                      textAlign: 'center',
                      valueKey: 0
                    }
                ],


                // 性别
                actions:[{
                    name:"男",
                    method : this.setBoy
                },{
                    name:"女",
                    method : this.setGirl
                }],
                sheetVisible:false,

                open:false,
                openAge1:false,
                remarks:"",  // 备注
                num11:'',
                num111:"",
                num22:"",
                num222:"",
                num33:"",
                num333:"",
                num3333:"",
                disabled:false,
                textNum:200


                // dateTime: '',
                // startDate: new Date(this.getNowFormatDate()),
                // endDate: new Date((new Date().getFullYear()+1)+'')
            }
        },
        methods:{
            // handleConfirm (data) {
            //     if(this.num<=0){
            //         Toast({
            //             message: '预约人数已满',
            //             duration: 2000
            //         });
            //         this.date = "";
            //     }else {
            //         var year = new Date().getFullYear();
            //         this.submitDate= year+ "-" + this.date.split(" ")[0].replace(/月/, "-").replace(/日/, "");
            //         this.submitTime = this.submitTime1;
            //     }
            // },
            openDate(){
             //    this.$refs.picker.open();
             //    var d = this.getNowFormatDate();
             //    d = d+" "+"10:00";
             //    console.log(d)
             //    this.startDate = new Date(d);
             //    var parent = document.getElementsByClassName('picker-items');
             //    var childNode = parent[0].children[4];
             //    parent[0].removeChild(childNode);

             //    var parents =document.getElementsByClassName('picker-toolbar');
             //    var newNode = document.createElement("span");
             //    var reforeNode = parents[0].children[1];
             //    newNode.innerHTML = "当前剩余名额:"+this.num;
             // 　 parents[0].insertBefore(newNode,reforeNode);


                this.open = true
                var year = new Date().getFullYear();
                var date= year+ "-" + this.date1.split(" ")[0].replace(/月/, "-").replace(/日/, "");
                this.getAppointmentNum(date);
                this.getNewtime();
            },
            onValuesChange(picker, values) {
                this.date1 = values[0] +" "+ values[1]
                this.submitTime1 = values[1]
                var year = new Date().getFullYear();
                var date = year+ "-" + this.date1.split(" ")[0].replace(/月/, "-").replace(/日/, "");
                this.getAppointmentNum(date);
            },
            cancleaddress(){
                this.open = false;
            },
            selectaddress(){
                if(this.num<=0){
                    Toast({
                        message: '预约人数已满',
                        duration: 2000
                    });
                    this.date = "";
                }else {
                    this.open = false;
                    this.date = this.date1;
                    var year = new Date().getFullYear();
                    this.submitDate= year+ "-" + this.date.split(" ")[0].replace(/月/, "-").replace(/日/, "");
                    console.log(this.submitDate)
                    this.submitTime = this.submitTime1;
                    var date = this.submitDate +" "+this.submitTime+":00";
                    // console.log(date<this.getNowFormatDate1());


                    var time1 = Date.parse(new Date(date));
                    var time2 = Date.parse(new Date(this.getNowFormatDate1()));

                    time1 = time1 / 1000;
                    time2 = time2 / 1000;
                    if(time1<time2){
                        Toast({
                            message: '请选择正确的预约时间',
                            duration: 2000
                        });
                        this.date = "";
                        return
                    }

                }
                this.bulletin = true;
            },
            openSex(){
                this.sheetVisible = true
            },
            setBoy(){
                this.gender = "男"
            },
            setGirl(){
                this.gender = "女"
            },
            openAge(){
                this.openAge1 = true
            },
            onValuesChange1(picker, values) {
                this.age2 = values[0]
                this.age1 = values[0].replace(/岁/, "")
            },
            cancleaddress1(){
                this.openAge1 = false
            },
            selectaddress1(){
                this.openAge1 = false
                this.age = this.age2
            },
            // 获取服务详情
            getServiceDetails(data){
                var id = data;
                var userInfo = JSON.parse(localStorage.getItem('userInfo'));
                var userId = userInfo.userId || "";
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
                    // console.log(res)
                    var msg = res.data.message;
                    // 服务地址
                    var address = msg.address;
                    // 服务名字
                    var serviceName = msg.serviceName;
                    // 服务价格对象
                    var prices = msg.prices;
                    // 服务价格
                    var price = prices[0].price;
                    // 服务砖石数量
                    var priceNum = prices[0].price *2;
                    // 服务详情
                    var serviceDetail = msg.serviceDetail;
                    // 服务主体
                    var bodyType = msg.bodyName;
                    // 服务时间
                    var serviceTimeText = msg.serviceTimeText;
                    // id
                    var id = msg.id;
                    // 服务LOGO
                    var serviceLogo = msg.serviceLogo;
                    // 预约服务限制开关（0表示关，1表示开）
                    var appLimitFlag = msg.appLimitFlag;
                    // 预约服务限制次数总数
                    var totalNumLimit = msg.totalNumLimit;
                    // 预约服务限制每日次数的个数
                    var dayNumLimit = msg.dayNumLimit;

                    var logo = this.url+ serviceLogo + "?server=image";
                    console.log(logo)
                    // if(bodyType == 'type_hosp'){
                    //     bodyType = "机构"
                    // }else {
                    //     bodyType = "团队"
                    // }

                    this.msg = msg;
                    this.address = address;
                    this.serviceName = serviceName;
                    this.price = price;
                    this.priceNum = priceNum;
                    this.serviceDetail = serviceDetail;
                    this.bodyType = bodyType;
                    this.serviceTimeText = serviceTimeText;
                    this.id = id;
                    this.appLimitFlag = appLimitFlag;
                    this.totalNumLimit = totalNumLimit;
                    this.dayNumLimit = dayNumLimit;
                    this.serviceLogo = serviceLogo;
                    this.logo = logo;
                    this.getUserInfo();
                })
            },
            // 获取用户基本信息
            getUserInfo(){

                var data = JSON.parse(localStorage.getItem('userInfo'));
                var token = data.token;
                var userId = data.userId;
                var phone = data.account;
                var data ={
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
                    this.gender = msg.gender;  // 性别
                    this.age1 = msg.age;
                    this.age = msg.age + "岁";  // 年龄
                    this.loading = false;
                })
            },
            // 获取月日 周几 格式的日期
            getAppointmentTime(date){
                if(date == undefined){
                    var date = new Date();
                    var year = date.getFullYear();
                    var month = date.getMonth() + 1;
                    var day = date.getDate();
                    // var hour = 10;
                }else {
                    var year = date.year;
                    var month = date.month;
                    var day = date.day;
                }
                if(month<10){
                    month = "0" + month
                }
                var totaldays = 0;

                for(var i = 1900;i < year;i++) {
                    if((i % 4 == 0 && i % 100 != 0) || (i % 400 == 0)) {
                        totaldays += 366;
                    }else{
                        totaldays += 365;
                    }
                }

                var isrun = ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) ? 1 : 0;

                switch(month - 1) {
                    case 11:
                        totaldays += 30;
                    case 10:
                        totaldays += 31;
                    case 9:
                        totaldays += 30;
                    case 8:
                        totaldays += 31;
                    case 7:
                        totaldays += 31;
                    case 6:
                        totaldays += 30;
                    case 5:
                        totaldays += 31;
                    case 4:
                        totaldays += 30;
                    case 3:
                        totaldays += 31;
                    case 2:
                        isrun ? (totaldays += 29) : (totaldays +=28);
                    case 1:
                        totaldays += 31;
                }

                totaldays += day;
                let week="";

                switch(totaldays % 7) {
                    case 1:
                        week ="周一";
                        break;
                    case 2:
                        week ="周二";
                        break;
                    case 3:
                        week ="周三";
                        break;
                    case 4:
                        week ="周四";
                        break;
                    case 5:
                        week ="周五";
                        break;
                    case 6:
                        week ="周六";
                        break;
                    case 0:
                        week ="周日";
                        break;
                }
                if(day<10){
                    day="0"+day
                }
                // if(hour<10){
                //     hour="0"+hour
                // }
                // console.log(month+"月"+day+"日"+" "+week)
                return date = month+"月"+day+"日"+" "+week;
            },
            // 计算某两个月之间相差多少天
            dateDiff(sDate1, sDate2) { //sDate1和sDate2是2018-6-7格式
                var aDate, oDate1, oDate2, iDays
                aDate = sDate1.split("/")
                oDate1 = new Date(aDate[1] + '/' + aDate[2] + '/' + aDate[0]) //转换为7-6-2018格式
                aDate = sDate2.split("/")
                oDate2 = new Date(aDate[1] + '/' + aDate[2] + '/' + aDate[0])
                iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24) //把相差的毫秒数转换为天数
                return iDays
            },
            // 获取预约时间数组
            getDate(){
                var y = new Date().getFullYear();
                var m = new Date().getMonth()+1;
                var d = new Date().getDate();

                var Y = new Date().getFullYear();
                var M = new Date().getMonth()+2;
                var D = new Date().getDate();
                // new Date(year, month, 0).getDate() 获取某月有多少天
                var toMonthDays = new Date(y,m,0).getDate();
                if(M>12){
                    var Y = new Date().getFullYear() + 1;
                }
                var today = y+"/"+m+"/"+d;
                var nextday = Y+"/"+M+"/"+D;
                var days = this.dateDiff(today,nextday); // 下个月的今天与今天相差的天数
                var array = [];
                for(let i=0;i<days;i++){
                    if(d >toMonthDays){
                        m=m+1;
                        d=1;
                    }
                    if(m>12){
                        y=y+1;
                    }
                    var date={
                        year:y,
                        month:m,
                        day:d
                    }
                    d=d+1;
                    array.push(this.getAppointmentTime(date))
                }
                this.slots[0].values = array;
            },
            //获取当前时间的明天，格式YYYY-MM-DD
            getNowFormatDate() {
                var date = new Date();
                var seperator1 = "/";
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var strDate = date.getDate() + 1;
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = "0" + strDate;
                }
                var currentdate = year + seperator1 + month + seperator1 + strDate;
                return currentdate;
            },
            // 获取当前时间 （time） 格式时 分
            getNewtime(){
                var date = new Date();
                var hour = date.getHours() +1;
                var m = date.getMinutes();
                if(hour<10){
                    hour="0"+hour
                }
                if(m<10){
                    m="0"+m
                }
                var time=hour+":00";
                var values=["00:00","01:00","02:00","03:00","04:00","05:00","06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00","23:00"];
                var index = "";
                for(let i=0;i<values.length;i++){
                    if(time == values[i]){
                        index = i;
                        break;
                    }
                }
                var value1 = values.splice(0,index);
                for(let i=0;i<value1.length;i++){
                    values.push(value1[i]);
                }
                this.slots[2].values = values;
            },
            // 获取当前时间
            getNowFormatDate1() {
                var date = new Date();
                var seperator1 = "-";
                var seperator2 = ":";
                var month = date.getMonth() + 1;
                var strDate = date.getDate();
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = "0" + strDate;
                }
                var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
                        + " " + date.getHours() + seperator2 + date.getMinutes()
                        + seperator2 + date.getSeconds();
                return currentdate;
            },

            // 获取可以预约的个数（判断是否可以进行预约操作）
            getAppointmentNum(date){
                console.log(date)
                if(this.appLimitFlag>0){  // 预约限制开关开启  获取已经预约的数量
                    var userInfo = JSON.parse(localStorage.getItem('userInfo'));
                    var token = userInfo.token;
                    var userId = userInfo.userId;
                    var data2 ={
                        "serviceId":this.id
                    }
                    var param2 ={
                        url:this.url+"/system/reservation/order/num",
                        data:data2,
                        token:token,
                        userId:userId,
                        server:'reservation'
                    }
                    newPost1(param2).then((res) => {
                        console.log("判断是否可以进行预约操作")
                        console.log(res)
                        var msg = res.data.message;
                        // 总的预约数量限制
                        var totalNumLimit = msg.totalNumLimit;
                        // 每天限制预约的数量
                        var dayNumLimit = msg.dayNumLimit;
                        // 已经预约的数量总数
                        var totalNum = msg.totalNum;
                        // 已经预约的详情数组
                        var list = msg.list;
                        // 时间戳
                        var time = msg.time;

                        var num = 0;
                        if(totalNumLimit>0 && dayNumLimit==0){  // 只开启预约总数的限制
                            console.log("只开启预约总数的限制")
                            num = totalNumLimit - totalNum;
                            if(num<0){
                                num = 0;
                            }
                            this.totalLimit = true;
                            this.num11 = totalNum;
                            this.num111 = num;
                        }
                        if(totalNumLimit==0 && dayNumLimit>0){  // 只开启每日预约总数的限制
                            console.log("只开启每日预约总数的限制")
                            console.log(dayNumLimit)
                            // var today = this.getNowFormatDate();
                            var l = list.length
                            console.log("数组长度"+l)
                            if(l>0){  // 查询已经预约的
                                for(let i=0;i<l;i++){
                                    if(date == list[i].date){
                                        num = dayNumLimit-list[i].num;

                                        if(num<0){
                                            num = 0;
                                        }
                                        break
                                    }else {
                                        num = dayNumLimit;
                                    }
                                }
                            }else {
                                num = dayNumLimit;
                            }
                            this.dayLimit = true;
                            this.num22 = num;
                            this.num222 = totalNum;
                            console.log(num)
                        }
                        if(totalNumLimit>0 && dayNumLimit>0){  // 预约总数与每日预约总数都限制
                            console.log("预约总数与每日预约总数都限制")
                            var num1 = totalNumLimit - totalNum;  // 获取还可以预约的总数
                            this.num333 = totalNum;
                            this.num3333 = num1;
                            console.log("剩余："+num1)
                            if(num1>0){
                                var l = list.length;
                                if(l>0){  // 查询已经预约的
                                    for(let i=0;i<l;i++){
                                        if(date == list[i].date){
                                            num = dayNumLimit-list[i].num;
                                            console.log("当日剩余："+num)
                                            this.num33 = num;
                                            if(num<0){
                                                num = 0;
                                            }
                                            break
                                        }
                                        else {
                                            num = dayNumLimit;
                                        }
                                        console.log("查询"+num)
                                    }
                                }else {
                                    num = dayNumLimit;
                                }
                                if(num>num1){
                                    num=num1;
                                }
                                console.log("答案是"+num)
                            }
                            this.allLimit = true;
                            this.num33 = num;
                        }
                        this.num = num;
                    })
                }else {
                    console.log("随便预约")
                }
            },
            // 限制字数
            keyup(){
                var num = 0;  //总个数累加判断
                for (var i = 0; i < this.remarks.length; i++) {
                    //根据charCodeAt来判断输入的是中文还是字母，符号
                    var charCode = this.remarks.charCodeAt(i);
                    if (charCode >= 0 && charCode <= 128){
                        //字符就+1
                        num += 1;
                    }
                    else{
                        //汉子就+2
                        // num += 2;
                         num += 1;
                    }
                };
                this.textNum = 200-num <=0 ? 0 : 200-num;
            },
            // 提交预约
            submit(){
                this.disabled = true;
                if(!this.date){
                    Toast({
                        message: '请选择服务时间',
                        duration: 2000
                    });
                    this.disabled = false;
                    return;
                }
                var data = JSON.parse(localStorage.getItem('userInfo'));
                var token = data.token;
                var userId = data.userId;
                var phone = data.account;
                var name = data.name;
                var data ={
                    "serviceId":this.id,
                    "submitUserId":userId,
                    "submitUserType":"type_user",
                    "submitUserName":name,
                    "submitUserAccount":phone,
                    "serviceDate":this.submitDate,
                    "serviceTime":this.submitTime,
                    "serviceTargetAge":this.age1,
                    "serviceTargetSex":this.gender,
                    "remark":this.remarks,
                    "serviceAddress":this.address,
                    "serviceJson":JSON.stringify(this.msg),
                    'reservationWay':"type_wx"
                }
                var param ={
                    url:this.url+"/system/reservation/order/submit",
                    data:data,
                    token:token,
                    userId:userId,
                    server:'reservation'
                }
                newPost1(param).then((res) => {
                    console.log(res)
                    var msg = res.data.message;
                    var orderId = msg.orderNo;
                    sessionStorage.setItem('orderId', JSON.stringify(orderId));
                    this.$router.push({
                        path: '/submitsuccess',
                        name: 'SubmitSuccess'
                    })
                })
                this.date="";
                this.disabled = false;
            }
        },
        mounted(){
            document.title = this.$route.meta.title;
            var serviceId = JSON.parse(sessionStorage.getItem('serviceId'));
            this.getServiceDetails(serviceId);
            this.getDate();
            this.url = $http.defaults.baseURL;
         //    var parents =document.getElementsByClassName('picker-toolbar');
         //    var newNode = document.createElement("span");
         //    var reforeNode = parents[0].children[1];
         //    newNode.innerHTML = "当前剩余名额:";
         // 　 parents[0].insertBefore(newNode,reforeNode);



        },
        components:{

        }
    }
</script>

<style scoped>
.big-box {
    min-height: 100%;
    width: 100%;
    background: #EFEFF4 !important;
    overflow-y: scroll;
}
.top {
    height: 20vw;
    display: flex;
    align-items: center;
    background: #FFFFFF;
    margin-bottom: 2vw;
    overflow: hidden;
}
.top>.left {
    height: 16vw;
    width: 16vw;
    display: flex;
    align-items: center;
    justify-content: center;
    /*box-sizing: border-box;*/
    padding: 2vw 2vw;

}
.top>.left>img {
    height: 16vw;
    width: 16vw;
}
.top>.right {
    width: 100%;
    flex: 1;
    text-align: left;
}
.top>.right>div:nth-child(1) {
    font-size: 14px;
    color: #616161;
}
.top>.right>div:nth-child(2) {
    width: 80%;
    font-size: 12px;
    color: #b9b9b9;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    margin: 0.5vw 0px;
}
.top>.right>.price {
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
.add-and-doc {
    box-sizing: border-box;
    padding: 0px 2vw;
    background: #FFFFFF;
    margin-bottom: 2vw;
}
.address {
    height: 20vw;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-bottom: 1px solid #F7F7F7;
}
.address>div:nth-child(2) {
    color: #a6a6a6;
    font-size: 14px;
}
.principal {
    height: 20vw;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.principal>div:nth-child(2) {
    color: #a6a6a6;
    font-size: 14px;
}
.time{
    min-height: 15vw;
    background: #FFFFFF;

    box-sizing: border-box;
    padding:0px 2vw;
    margin-bottom: 2vw;
}
.time-box{
    display: flex;
    align-items: center;
    position: relative;
}
.time-box>span {
    width: 24vw;
    text-align: left;
}
.time-box>input {
    flex: 1;
    font-size: 4vw;
    text-align: right;
    box-sizing: border-box;
    padding-right: 6vw;
    height: 15vw;
    border: 0px;
    outline: none;
}
.time-box>img {
    position: absolute;
    top: 5vw;
    right: 2vw;
    height: 5vw;
    width: 5vw;
}
.bulletin {
    height: 10vw;
    line-height: 10vw;
    font-size: 14px;
    display: flex;
    justify-content: flex-start;
    border-top: 2px solid #EFEFF4;
}
.bulletin>div>span {
    color: #a6a6a6;
    margin-right: 5vw;
}
.bulletin>div>span>span {
    color: #88d5f4;
}
.user-info {
    box-sizing: border-box;
    padding: 0px 2vw;
    background: #FFFFFF;
    margin-bottom: 2vw;
}
.sex {
    border-bottom: 1px solid #F7F7F7;
}
.sex,.age {
    height: 15vw;
    background: #FFFFFF;
    display: flex;
    align-items: center;
    position: relative;
}
.sex>span,.age>span {
    width: 28vw;
    text-align: left;
}
.sex>input,.age>input {
    flex: 1;
    font-size: 4vw;
    text-align: right;
    box-sizing: border-box;
    padding-right: 6vw;
    height: 15vw;
    border: 0px;
    outline: none;
}
.sex>img,.age>img {
    position: absolute;
    top: 5vw;
    right: 0px;
    height: 5vw;
    width: 5vw;
}
.remarks {
    background: #FFFFFF;
    box-sizing: border-box;
    padding: 2vw;
    padding-bottom: 0px;
    /*margin-bottom: 22vw;*/
    position: relative;
}
.remarks-title {
    display: flex;
    align-items: flex-end;
    font-size: 18px;
}
.remarks-title>span {
    font-size: 12px;
}
.remarks>textarea {
    width: 100%;
    min-height: 15vw;
    border: none;
    outline: none;
    margin-top: 2vw;
}
.remarks>span {
    position: absolute;
    bottom: 0vw;
    right: 3vw;
    font-size: 14px;
    color: #a6a6a6;
}
.bottom {
    width: 100%;
    /*position: fixed !important;
    bottom: 0px;
    left: 0px;*/
    box-sizing: border-box;
    padding: 2vw 2vw;
}
.btn {
    font-size: 16px;
    outline: none;
    border: 0px;
    width: 100%;
    background: #18AEED;
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
</style>
