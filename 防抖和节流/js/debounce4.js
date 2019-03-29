var input = document.querySelector('input');
var container = document.getElementById('container');
var num = 0;
var debouncefn = underscore(A, 350);


function A(e) { //功能函数
    num++;
    container.innerHTML = num;
    console.log(this, e, num);
}

function underscore(fn, def) {
    var time = null;
    return function() {
        var that = this;
        var args = arguments;
        clearTimeout(time);
        time = setTimeout(() => {
            fn.apply(that, args);
        }, def);
    }
}

container.onmousemove = underscore(A, 1000);
input.addEventListener('keyup', debouncefn);