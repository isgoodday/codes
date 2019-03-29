//防抖的目的在于防止高频率触发一个事件，频繁执行事件的功能函数，导致卡顿
//防抖的原理 不管你如何触发事件，与事件绑定的功能一定是在事件触发的N秒后才会去执行。
//如果在事件触发的N秒内再次触发此事件，那就以新时间触发的时间为基准重新计时。N秒后再执行。
//使用定时器,每次触发事件都会定义一个定时器，当在规定的时间内(定时器的延迟时间)没有再次触发事件，定时器正常执行，
//但是在规定的时间内触发，直接清除定时器，定时器被清除，并再一次被重新设置


var container = document.getElementById('container');
var num = 0;

function underscore(fn, def) {
    var time = null;
    return function() {
        clearTimeout(time);
        time = setTimeout(fn, def);
    }
}

container.onmousemove = underscore(A, 1000);

//上面的代码使用定时器，构建了一个简单的防抖
//我们接下来要改造 功能函数，让其的this指向触发事件的元素，并且让功能函数能使用事件对象event，这样让我们能在功能函数更方便添加功能
//转3.js