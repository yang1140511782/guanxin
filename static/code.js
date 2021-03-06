var HOST_INFO={
    //主机
    // HOST:"sc1.cdmn.com",
    // HOST:"10.2.2.2",
    HOST:"cluster.cardiochina.net",
    //端口
    //PORT:"8080/guanxing_medical-2.0",
    //PORT:"8080",
    PORT:"",
}
//全局配置项
export let config = {
    HOST:"cluster.cardiochina.net",
    //新版接口IP
    "NEW_HOST":'http://'+HOST_INFO.HOST,
    // "CLUSTER_HOST":'http://cluster.cardiochina.net',

    //请求超时时间 单位毫秒
    "TIME_OUT":30000,

    //签名对象
    "SIGN_OBJ":{
        "company": "6F79078F79D77550739EF61CD0DC2A83",

        "nonce_str": "e0b8nd1t3snmbjteb76t6cjd8q0x0aon",
        //"sign": "38387C462729607F06FA0A58D90CB82E",
        //"timeStamp": "1488503479228",
        "timeStamp": Date.parse(new Date()),
        //"key":"432A7532943C39C1EBE335F10EB2E103"
    },

    //基础地址,默认访问地址
    BASE_URL:'/medcare/login.html',

    //资源文件地址
    RES_URL:'http://'+HOST_INFO.HOST+':'+HOST_INFO.PORT,

    //数据接口地址
    INTERFACE_BASE_URL:'http://'+HOST_INFO.HOST+':'+HOST_INFO.PORT,

    //websocket 通讯地址
    WS_URL:"ws://"+HOST_INFO.HOST+':'+HOST_INFO.PORT+"/websocket/",

    //是否显示console 信息
    DEBUG:false,

    //状态码
    CODEARRAY:[
        {code:0XFFFFFF,describe:'客户端版本太低, 请升级客户端'},
        {code:1001,describe:'正常'},
        {code:1002,describe:'IO异常'},
        {code:1003,describe:'网络连接异常'},
        {code:1004,describe:'网络连接超时'},
        {code:1005,describe:'参数无效'},
        {code:1006,describe:'空指针异常'},
        {code:1007,describe:'URL异常'},
        {code:1008,describe:'未知主机'},
        {code:1009,describe:'服务器连接失败'},
        {code:1010,describe:'协议解析失败'},
        //{code:1011,describe:'Access_Token鉴权失败'},
        {code:1011,describe:'您的账号已在其他地方登录,请重新登录'},
        {code:1012,describe:'验证码失效'},
        {code:1013,describe:'未知错误'},
        {code:1014,describe:'参数解析异常'},
        {code:1015,describe:'保存数据失败'},
        {code:1016,describe:'更新数据失败'},
        {code:1017,describe:'查询数据失败'},
        {code:1018,describe:'删除数据失败'},
        {code:1019,describe:'服务端异常'},
        {code:1020,describe:'登录失败'},
        {code:1021,describe:'注册失败'},
        {code:1022,describe:'账号已经被注册或者已经绑定了其他信息'},
        {code:1023,describe:'账号未注册'},
        {code:1024,describe:'数据验证失败'},
        {code:1025,describe:'数据解析失败'},
        {code:1026,describe:'权限不足'},
        {code:1027,describe:'签名错误'},
        {code:1028,describe:'密码错误'},

        {code:2001,describe:'医生设置门诊冲突'},
        {code:2002,describe:'修改门诊状态失败'},
        {code:2003,describe:'修改门诊信息失败'},
        {code:2004,describe:'当前挂号总数小于已挂号数量'},
        {code:2005,describe:'未获取到相关门诊设置信息'},
        {code:2006,describe:'门诊挂号已满'},
        {code:2007,describe:'当前就诊信息不可用'},
        {code:2008,describe:'预约失败'},
        {code:2009,describe:'图片上传失败'},
        {code:2010,describe:'保存病例失败'},
        {code:2011,describe:'更新病例失败'},
        {code:2012,describe:'服务端未接收到图片'},
        {code:2013,describe:'服务端未接收到数据'},
        {code:2014,describe:'当前就诊已上传过病例'},
        {code:2015,describe:'当前医生已添加到我的医生列表'},
        {code:2016,describe:'挂号时间不得早于当前时间'},
        {code:2017,describe:'用户已预约过此次门诊'},
        {code:2018,describe:'当前时间已超过挂号时间范围'},
        {code:2019,describe:'待审核或已审核的图片不能删除'},
        {code:2020,describe:'手机号码格式错误'},
        {code:2021,describe:'发送短信数量已超出上限'},
        {code:2022,describe:'此条订阅已添加'},
        {code:2023,describe:'密码格式错误'},
        {code:2024,describe:'验证码不匹配'},
        {code:2025,describe:'验证码获取操作过于频繁'},
        {code:2026,describe:'没有查到对应ID的医院'},
        {code:2027,describe:'没有查到对应ID的科室'},
        {code:2028,describe:'该身份证号码已存在'},
        // {code:2029,describe:'根据ID未查到对应数据'},
        {code:2029,describe:'暂无相关数据，请稍后再试'},
        {code:2030,describe:'请求关联亲人已经关联'},
        {code:2031,describe:'关联亲人是自己'},
        {code:2032,describe:'用户不是群管理员'},
        {code:2033,describe:'门诊就诊数量超出约束值'},
        {code:2034,describe:'门诊预约费用超出约束值'},
        {code:2035,describe:'请求支付平台下单失败'},
        {code:2036,describe:'支付金额小于等于0'},
        {code:2037,describe:'未获取到就诊信息'},
        {code:2038,describe:'就诊卡号重复'},

        {code:2039,describe:'没找到对应订单号的订单流水'},
        {code:2040,describe:'去支付系统查询订单失败'},
        {code:2041,describe:'问题已过期'},
        {code:2042,describe:'没找到对应的消息'},
        {code:2043,describe:'当前视频已是最新版本'},
        {code:2044,describe:'未找到视频资源'},
        {code:2045,describe:'视频类型不能为空'},
        {code:2046,describe:'视频id不能为空'},
        {code:2047,describe:'当前用户已绑定此银行卡'},
        {code:2048,describe:'您不能删除医嘱用药提醒'},
        {code:2049,describe:'未获取到账户类型信息'},
        {code:2050,describe:'未获取到用户的账户信息'},
        {code:2051,describe:'账户余额小于提款金额'},
        {code:2052,describe:'服务端未获取到相关的交易信息'},
        {code:2053,describe:'服务端未获取到相关的账户配置信息'},
        {code:2054,describe:'钻石兑换数量大于账户可兑换数量'},
        {code:2055,describe:'订单号不存在'},
        {code:2056,describe:'通用统一下单参数签名错误'},
        {code:2057,describe:'支付应用不可用'},
        {code:2058,describe:'提现金额必须大于0'},
        {code:2059,describe:'提现金额必须为100的整数倍'},
        {code:2060,describe:'当前日期不能提现'},

        {code:2061,describe:'当前用户账户钻石总数小于要赠送的钻石数量'},
        {code:2062,describe:'账户处理失败'},
        {code:2063,describe:'关心堂支付应用不存在'},
        {code:2064,describe:'订单已支付'},
        {code:2065,describe:'订单号不存在'},
        {code:2066,describe:'查询支付结果失败'},
        {code:2067,describe:'转诊状态未完成,不能进行相关补贴操作'},
        {code:2068,describe:'已经使用 过一键提醒功能'},
        {code:2069,describe:'没有找到管理员信息'},
        {code:2070,describe:'不支持此支付方式'},
        {code:2071,describe:'不可重复提交'},
        {code:2072,describe:'未查询到支付信息'},

        {code:2073,describe:'赠送的钻石数量必须大于0'},
        {code:2074,describe:'银行卡验证有误'},
        {code:2075,describe:'银行卡号错误'},
        {code:2076,describe:'此银行卡不是当前选中银行下的银行卡'},
        {code:2077,describe:'此接口维护升级中'},
        {code:2078,describe:'引导内容不可用'},
        {code:2079,describe:'未获取到计步设置信息'},
        {code:2080,describe:'发送短信失败'},
        {code:2081,describe:'该医生目前处于离线状态，暂不能收到提问消息，请选择其他医生进行提问'},
        {code:2070,describe:'不支持此支付方式'},
        {code:2071,describe:'不可重复提交'},
        {code:2072,describe:'未查询到支付信息'},

        {code:2088,describe:'存在未结束的维护信息'},
        {code:2090,describe:'已经签约过该服务'},

        {code:2092,describe:'所开启的指标占比超过100%'},
        {code:2093,describe:'订单状态异常，操作失败'},
        {code:2094,describe:'组长没有绑定银行卡，无法创建订单'},
        {code:2105,describe:'已经续约,不能再续约'},

        {code:3001,describe:'当前任务类型已添加'},
        {code:3002,describe:'当前任务类型不存在'},
        {code:3003,describe:'任务类型数据为空'},
        {code:3004,describe:'当前任务已被其他人接受'},
        {code:3005,describe:'当前任务已完成'},
        {code:3006,describe:'服务端未获取到当前任务信息'},

        {code:4001,describe:'服务端未获取到订单类型'},
        {code:4002,describe:'航天医院接口返回数据为空'},
        {code:4003,describe:'航天医院接口返回数据异常'},
        {code:4004,describe:'订单不能重复提交'},
        {code:4005,describe:'缴费单据为空'},
        {code:4006,describe:'没有找到订单'},
        {code:4007,describe:'用户不是订单创建人'},
        {code:4008,describe:'该订单类型不能取消'},
        {code:4009,describe:'订单取消失败'},
    ]
};