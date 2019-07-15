function zp(num,length){
    return ('0000000000' + num).slice(-length);
}
const date2str= (sec: number): string  => {
    process.env.TZ = 'Asia/Tokyo';
    const date = new Date(sec * 1000);
    date.toLocaleString()
    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();
    const H = date.getHours();
    const M = date.getMinutes();
    // const S = date.getSeconds();
    return `${y}/${zp(m,2)}/${zp(d,2)} ${zp(H,2)}:${zp(M,2)}`
}
export default date2str;