export class Util{
    // Time formatting milliseconds to normal
    dateformater(vmstime) {
        if (!vmstime) {
            return ''
        }
        let mstime = Number((vmstime + '').slice(0, 13));
        let time = new Date(mstime);
        let year = time.getFullYear();
        let month = time.getMonth() + 1;
        let day = time.getDate();
        let hours = time.getHours();
        let minutes = time.getMinutes();
        let seconds = time.getSeconds();
        let formattime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
        return formattime;
    }
}