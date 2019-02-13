export default function formatTime(val) {
    if (!val) {
       return '无'
    }
    let d = new Date(val)
    let year = d.getFullYear()
    let month = (d.getMonth() + 1) < 10 ? ('0' + (d.getMonth() + 1)) : (d.getMonth() + 1)
    let day = d.getDate() < 10 ? ('0' + d.getDate()) : d.getDate()
    return year + '-' + month + '-' + day
}