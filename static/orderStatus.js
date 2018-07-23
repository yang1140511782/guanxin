export function orderStatus(status){
    var statusArray=['未确认','已预约','已拒绝','已取消','已到时','已完成','已超时'];
    return statusArray[status-1]
}