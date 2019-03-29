var num = 0;
var container = document.getElementById('container');

function A() { //功能函数 
    num++;
    container.innerHTML = num;
}

//使用时间戳来实现节流
function throttle(func, wait) {
    var that, args;
    var prev = 0; //设置时间戳
    return function() {
        var now = +new Date(); //获取当前时间戳
        that = this;
        args = arguments;
        if (now - prev >= wait) { //当前时间大于等于设置时间戳
            func.apply(that.args);
            prev = now; //节流实现的关键  当每次触发事件时，当前时间戳会减去前一次的时间戳，间隔时间大于规定最小时间，就会执行功能函数，否则不执行
        }
    }
}

container.onmousemove = throttle(A, 3000);


//使用定时器来实现节流

function throttle(func, wait) {
    var time;
    return () => {
        if (!time) {
            time = setTimeout(() => {
                time = null; //定时器在指定的时间延迟后执行回调函数后，将time设置为空，当再一次触发事件，再一次触发定时器。如此往复
                func()
            }, wait);
        }
    }
}

//节流相对于防抖，显得更加温柔，规定的时间内，不管事件在这个时间内触发几次，它都会且只会执行一次。
//使用时间戳是在触发的瞬间也就是规定时间开头立即执行，使用定时器，是在定时器延迟的时间后，也就是规定时间后立即执行
//时间戳方法在脱离事件后不会执行功能，定时器方法可以在脱离事件后等待执行一次功能。
//结合两者完成一个事件触发立即执行，事件脱离后也能在节流规定时间后再次执行。