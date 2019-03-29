//修改如下
var container = document.getElementById('container');
var num = 0;

function A(e) { //需要防抖的事件功能函数
    num++;
    container.innerHTML = num;
    console.log(this, e);
}

function underscore(fn, def) { //防抖函数
    var time = null;
    return function() {
        var that = this;
        var args = arguments; //事件绑定函数在事件被触发时，其arguments对象会接受一个参数，这个参数就是事件对象event
        clearTimeout(time);
        time = setTimeout(() => {
            //调用函数，并且绑定函数的this指向.用执行上下文概念解释 就是apply调用函数,
            //并且将that的值赋值给this,此时this的值在函数未执行时就确定了，指向that所在的上下文
            fn.apply(that, args); //修改功能函数的this并将事件对象作为参数传入
        }, def);
    }
}

container.onmousemove = underscore(A, 1000);

//做最后的总结 参见4.js