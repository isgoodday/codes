var num = 0;
var container = document.getElementById('container');

function A(e) { //功能函数 
    num++;
    container.innerHTML = num;
}

function throttle(func, wait) {
    var timeStamp = +new Date(); //定义一个时间戳 
    var tiemOut = null;
    return () => {
        clearTimeout(tiemOut); //每次事件触发时，定时器都不会执行
        var that = this,
            args = arguments, //这两个就不细说
            now = +new Date(); //获取事件触发时的时间戳，用来判断当前时间距离上一次时间戳是否大于规定时间
        if (now - timeStamp >= wait) {
            func.apply(that, args);
            timeStamp = now;
        } else {
            tiemOut = setTimeout(() => { //再脱离事件后也能执行一次,实现功能的完整
                func.apply(that, args);
            }, wait);
        }
    }
}
container.onmousemove = throttle(A, 1000);

//拓展使用 requestAnimationFrame进行防抖,理念是相同的。
function throttle(func, wait) {
    var time = +new Date();
    return () => {
        var now = +new Date(),
            that = this,
            args = arguments;
        if (now - time >= 1000) {
            time = requestAnimationFrame(() => {
                func.call(that, args);
                time = now;
            })
        }
    }
}
input.onkeyup = throttle(demo);