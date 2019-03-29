//未防抖
var container = document.getElementById('container');
var num = 0;

function A() { //功能函数
    num++;
    container.innerHTML = num;
}
container.onmousemove = A;


//接下来我们将这个事件防抖
//转debounce2.js