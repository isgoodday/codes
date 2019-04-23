



深入响应式原理

当视图模型(VM)中的数据模型(M)发生改变时，视图(V)就会进行更新

底层原理：通过数据劫持和订阅发布的形式来进行数据状态的管理

  数据劫持的核心使用的是ES5的方法(Object.defineProperty)，这个方法不支持ie8及以下



**Object.defineProperty(obj,prop,descriptot)** 

大致先说明下，它是做什么的？

为obj对象定义或修改`"属性"`，并且返回这个修改或定义属性后的对象。

上文的属性怎么理解？准确点说，应该是修改属性的特性.返回这个修改属性特性后的对象。



`属性特性(attribute)`：只有内部才用的特性(attribute)`，用来描述了`属性(property)`的各种特征。它是`为了Javascritp运行环境的实现的内部值。因此在Javascript中不`能直接访问它们`，并且在ECMA规范中将它们放在了[[]]中。



比如:**对象属性是否只读，属性值是否可以修改，等**

在**ES5之前**，是无法对这些特性进行检测的。

但是！ES5之后，所有的属性都有了属性描述符

`属性描述符`:它对这些属性特性的进行了具象化，我们可以使用它去操作属性特性了。

**举例**：:bookmark_tabs: 让我们用**Object.getOwnPropertyDescriptor()**来看一看一个普通对象的属性对应的属性描述符

```javascript
    var obj = {
            a: 2
        };
    var d = Object.getOwnPropertyDescriptor(obj, "a");
    console.log(d);
	//输出
  	{	//configurable: true
		//enumerable: true
		//value: 2
		//writable: true
    }
```

可以看到，这个对象对应默认的属性描述符，有四个特性

注：属性描述符也被称作`数据描述符`，因为它只保存了一个数据值，本例子中是2。

接下来我们尝试对下面的属性描述符进行操作，要操作属性默认的特性，必须使用`Object.defineProperty()`

`configurable`：

我们来看一个例子:bookmark_tabs: 

```javascript
 var obj = {
            a: 2
        };
        Object.defineProperty(obj, 'a', {
            value: 2,
            writable: true,
            configurable: true,
            enumerable: true
        });
        delete obj.a   		//删除属性
        console.log(obj.a); //undeifined
```

默认情况下，我们是可以删除属性的，但是，假如我们将`configurable`设置为false,那么`属性描述符不可被配置`。

对象属性不可被删除，不能修改属性的值，不能把特性修改为访问器特性。:bookmark_tabs: 

```javascript
     var obj = {
            a: 2
        };
        Object.defineProperty(obj, 'a', {
            value: 2,
            writable: true,
            configurable: false, //属性描述符不可配置，属性锁死状态
            enumerable: true
        });
        obj.a = 3; //无效
        delete obj.a; //无效
        console.log(obj.a); //2
```

这个属性访问器已经无法手动去配置了，如果在严格模式下，手动配置还会报错。

`注:`有一个小小的例外：即便属性是`configurable:false`， 我们还是可以把`writable` 的状态由`true 改为false`，但是`无法由false 改为true`。



`enumerable`：属性是否会出现在对象的属性枚举中，比如for in 去遍历对象，如果把这个属性设置为false，则这个属性不会出现在枚举中，所有属性`enumerable`默认值为true



 `value`：它保存着属性的数据，读取数据时，从这里读，写入数据时，将写入的数据存放在这。



`writable`:这个特性决定是否可以修改属性的值，默认为true，表示可以修改。

正常情况下，我们是可以去修改对象的属性的属性值，But,当我们将这个特性值改为false会如何。:bookmark_tabs: 

```javascript
  var obj = {
            a: 2
        };
        Object.defineProperty(obj, 'a', {
            value: 2,
            writable: false, //不可写
            configurable: true,
            enumerable: true
        });
        obj.a = 3;
        console.log(obj.a);  //2
```

是的，我们修改的属性值无效，并且在严格模式下，按照上文的写法，还会报错，错误说我们无法修改一个不可写的属性。



那么，在EMCA规范中，有两种类型的属性描述符

**OK，当属性包含以上四个特性我们称这个属性为数据属性。**

将这个属性描述符叫数据描述符。 



**当对象的属性被访问时**，到底发生了什么？:bookmark_tabs: 

```javascript
 var obj = {
            a: 2
        };
    obj.a；
```

上面的`obj.a` 发生了什么？可以知道的是，它是一次属性访问，但是它是怎么访问的。

在ECMA规范中。属性的访问会用到另一个特性`[[Get]]`,实际上我们`访问属性`是一次`[[Get]]`操作。

那么什么是访问一次属性:grey_question:   非赋值操作的`变量/属性`引用

对象默认的内置`[[Get]]`操作:

首先在对象中查找是否有名称相同的属性，如果找到就会返回这个属性的值。

然而， 如果没有找到名称相同的属性，[[Get]]算法的定义会执行另外一种非常重要的行为。那就是按`原型链`查找名称相同的属性，如果这样还没有查找到名称相同的属性，那[[Get]] 操作会返回值undefined

**[[Get]]**/getter：对象属性提供getter函数，`当属性被访问时`，触发此函数，并将它的返回值当作属性访问的返回值 :bookmark_tabs: ，`getter函数默认返回值undefined`,

```javascript
var obj = {
            a: 2
        };
        Object.defineProperty(obj, 'a', {
            configurable: true,
            enumerable: true,
			get(){
				return 123;
				}
       	});
		obj.a   // 123
```

所以说，我们现在知道为什么当对象访问一个不存在的属性，不报错，而是undefined :bookmark_tabs: 

```javascript
var obj = {
            a: 2
        };
  obj.b  //undefined
```



在我们了解[[Set]]前，先了解`访问描述符`，当你给一个属性定义getter，setter或者两者都有，这个属性会被定义为访问器属性。它的`value`和`writable`属性将被忽略。:bookmark_tabs: 

```javascript
var obj = {
            a: 2
        };
        Object.defineProperty(obj, 'a', {
            configurable: true,
            enumerable: true,
			get(){},
			set(val){
			console.log(val);
		}
        });

 obj.a    //undefined
```



 **[[Set]]**/setter：当我们对属性进行赋值时，调用setter函数，setter函数接受一个参数，参数值就是属性的修改值。:bookmark_tabs: 

```javascript
var obj = {
            a: 2
        };
        Object.defineProperty(obj, 'a', {
            configurable: true,
            enumerable: true,
			get(){},
			set(val){
			console.log(val);
		}
        });

     obj.a =4; 
```















