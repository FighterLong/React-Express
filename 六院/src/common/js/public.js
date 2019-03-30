export function timeFillter(time,flag){
  if(time === 0){
    return '-'
  }else {
    let timme = new Date(time)

    let year = timme.getFullYear()
    let month = timme.getMonth()+1 < 10 ? '0' + (timme.getMonth()+1) : timme.getMonth()+1
    let day = timme.getDate() < 10 ? '0' + timme.getDate() : timme.getDate()
    let hour = timme.getHours() < 10 ? '0' + timme.getHours() : timme.getHours()
    let min = timme.getMinutes() < 10 ? '0' + timme.getMinutes() : timme.getMinutes()
    let son = timme.getSeconds() < 10 ? '0' + timme.getSeconds() : timme.getSeconds()
    if(flag){
      return year+'-'+month+'-'+day+' '+hour+":"+min+':'+son
    }
    return year+'-'+month+'-'+day
  }
}
export function statusFillter(status){
  switch(status){
    case 'UNPUBLISH': return '未发布';
    case 'PUBLISH': return '已发布';
    case 'TOP': return '置顶';
    default: return;
  }
}