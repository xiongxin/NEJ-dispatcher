# NEJ dispatcher
NEJ 模块调度系统

## 写在前面

NEJ中有个很重要的部分: [模块调度系统](https://github.com/genify/nej/blob/master/doc/DISPATCHER.md), 作者单独将其抽离出来讲解, 可见起重要程度之高. 那模块调度系统主要用来做什么呢? 
模块调度系统, 顾名思义, 将页面的功能剥离成一个个的模块(module), 由专门的模块调度器(dispatcher)对模块进行调度, 实现单个页面内复杂的功能.

自然的, 我们可以看到, 其实这个模块调度系统, 一方面是以模块对功能进行整合和划分, 另一方面也是一个构建单页系统的强有力的工具. 正如文档里写的: 

> NEJ提供了一套模块调度系统 用于支持单页富应用的系统架构、模块拆分和重组、模块调度管理等功能.

## 原理说明

其实基本的原理[文档](https://github.com/genify/nej/blob/master/doc/DISPATCHER.md)里已经说得很详细了. 我在这里只是说一些我自己的一些见解.

首先, 我们知道, 一个单页系统中最重要的就是路由, 由路由来驱动功能, 在NEJ的dispatcher中, 并没有提及路由的概念, 而是创造了一个与之相对应的概念: 模块标识(其实这是自然的, NEJ中关注的是模块). 模块标识(*UMI*: Uniform Module Identifier), 他有一些规则:

- 格式同URI的Path部分，如 /m/m0/
- 必须以“/”符开始
- 私有模块必须以“/?”开始
- 承载模块的依赖关系，如 /m/m0/ 和 /m/m1/ 表明这两个标识对应模块的父模块标识均为 /m

从格式来看, 和路由类似, 不过也有不同, 比如私有模块以"/?"开始. 另外通过UMI也表明了模块之间的依赖关系, 为之后的调度提供依据.

其次, 虽然NEJ中称之为模块, 但是, 在之后的实际操作中你会发现, 结合NEJ的[模板系统](https://github.com/genify/nej/blob/master/doc/TEMPLATE.md), 模块调度系统其实是一种很先进的组件化开发方式.

## How I Use

NEJ的模块调度系统很强大, 但也很难理解, 尤其只是看文档. 查看API文档, 阅读先前项目的代码, 再抱着试试看的态度去写, 去试, 也只是大概了解了基本的用法.

NEJ的dispatcher最重要的两个源文件:

- [util/dispatcher/dispatcher.js](http://nej.netease.com/help/dispatcher._$$Dispatcher.html)
- [util/dispatcher/module.js](http://nej.netease.com/help/module._$$ModuleAbstract.html)

正好对应了`模块`和`调度`两个概念, 推荐浏览源代码, 代码的注释里有基本的用法以及用法的解释. 和上面给出的API链接地址一样.

接下来, 我们通过一个简单的示例, 不会涉及到过多的模块组合和层级, 来展示NEJ 模块调度的用法.

### 我们要做什么

和文档中的示例类似, 一个左右结构的单页应用, 左侧一个tab, 两个选择(`博客管理`和`日志管理`)来切换选项, 右侧根据左侧的选项显示不同的内容, 同时博客管理下还有一个tab, 切换显示`博客列表`和`博客标签`.

### 模块拆分

我们将模块的粒度拆分的足够小. 这里可以按照组件的思想拆分, 整个页面是一个大的组件(模块), 来控制布局. 左侧是一个tab, 这个tab始终要显示在页面上, 属于私有模块, 不会对外单独显示,  右侧根据tab来显示不同的内容, 不同的内容可以作为不同的组件(模块).
而博客管理模块, 则类似于顶级的布局模块, 可以拆分为两个模块.

根据UMI, 我们的模块大概分为这么几部分

```
- /m                  // 布局模块, 顶级模块
  - /?/tab            // Tab模块, 内部私有模块.
  - /m/blog           // 博客管理模块, 博客顶级模块
    - /m/blog/list    // 博客列表模块, 对外可访问
    - /m/blog/tag     // 博客标签模块, 对外可访问
```

### 构建模块

在构建模块之前, NEJ推荐我们先针对自身的项目扩展一个项目的模块基类, 其余所有的模块都从这个基类继承.

```js
NEJ.define([
    '{lib}base/klass.js',
    '{lib}util/dispatcher/module.js'
], function(_k, _t, _p) {

    var _pro;

    _p._$$Module = _k._$klass();
    _pro = _p._$$Module._$extend(_t._$$ModuleAbstract);

    _pro.__onShow = function(options) {
        this.__super(options);
        // magic
    }

    return _p;

});
```

然后你就可以编写各个独立的模块了. 首先要说明的是, 之前已经提到, NEJ中dispatcher中模块和现在大热的组件概念是类似的, 每个组件会单独管理的自己的资源(html, js, css), NEJ中模块是由模板来实现的. (不过由于css使用了boostrap, 一般不会出现css资源了, 不过用法和其他资源是类似的.)

一个典型的模块如下:

```html
<textarea name="txt">
<!-- 组件结构, html -->
</textarea>

<textarea name="css">
<!-- 组件样式, css -->
</textarea>

<!-- 组件逻辑 -->
<textarea name="js" data-src="./m.js"></textarea>
```

比如接下来我们实现/m模块, 首先编写模块的模板:

```html
<meta charset="utf-8"/>

<textarea name="txt" id="nav">
    <div class="col-md-3 j-module">
    </div>
    <div class="col-md-9 j-module">    
    </div>
</textarea>

<!-- @TEMPLATE -->
<textarea name="js" data-src="./index.js"></textarea>
<!-- /@TEMPLATE -->
```

然后编写组件的逻辑, 一般js代码会比较多, 我们使用外联的文件, 这里就需要扩展我们之前编写的项目模块基类. 其他在代码中注释.

```js

NEJ.define([
    '{lib}base/klass.js',
    '{lib}util/dispatcher/module.js',
    '{pro}base/module.js',
    '{lib}base/element.js',
    '{lib}base/event.js',
    '{lib}util/template/tpl.js'
], function(_k, _m, _bm, _e, _v, _t, _p) {

    var _pro;

    // 扩展模块基类
    _p._$$MainModule = _k._$klass();
    _pro = _p._$$MainModule._$extend(_bm._$$Module);

    // 对于顶级模块, 可以重写__doParseParent方法
    // 确定整个应用的父容器.
    // 这里的module-box是容器的id.
    _pro.__doParseParent = function(options) {
        return _e._$get('module-box');
    }

    // 模块构建阶段
    // this.__body确定模块的html结构, 取出模板的html资源即可.
    _pro.__doBuild = function() {
        this.__body = _e._$html2node(_t._$getTextTemplate('nav'));
        var list = _e._$getByClassName(this.__body, 'j-module');

        this.__export = {
            tab: list[0],
            parent: list[1]
        }
    }

    // 模块的显示
    _pro.__onShow = function(options) {
        // 除非你有自己的显示方式
        // 否则一定要调用父类方法
        // 此外options参数不要漏掉
        this.__super(options);

        // magic code
    }

    // 模块刷新
    _pro.__onRefresh = function(options) {
        this.__super(options);

        // magic code
    }

    // 其他 __onHide 等等

    // 监听document的templateready事件, 注册组件.
    _v._$addEvent(document, 'templateready', function() {
        _m._$regist('m', _p._$$MainModule);
    });
});

```

按照此方式编写其他模块, 此外模块还可以发送消息, 订阅消息等.

### 模块测试

模块编写完毕后, 我们对模块进行测试, NEJ提供了模块测试的支持, 测试的方法很简单, 比如我们的/?/tab模块, 文件夹下建立测试文件夹(这里使用unit).

- 新建html页面, 使用模板引入模块实现文件.
- 模块放至document.mbody指定的容器中

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>test tab module</title>
    <link rel="stylesheet" type="text/css" href="/src/css/bootstrap.css">
</head>
<body>
    <div id="template-box" style="display:none;">
        <textarea name="html" data-src="../index.html"></textarea>
    </div>

    <div id="module-id"></div>

    <script src="/nej/src/define.js?pro=/src/javascript/"></script>
    <script>
    NEJ.define(['{lib}util/dispatcher/test.js'], function(_e) {
        document.mbody = 'module-id';
        _e._$testByTemplate('template-box')
    });
    </script>
</body>
</html>
```

浏览器访问与预期显示一致即可.

### 更深一层的模块

我们的博客管理模块, 包含tab以及其他两个模块, 这时候可以将`/m/blog`看过是博客管理模块的顶级模块, 不过这次不再单独写m和tab模块, 因为两者比较简单, 我们将其合二为一. 
唯一需要注意的是, `/m/blog`模块依然要告诉他的子模块元素要插入的位置.

```js
var list = _e._$getByClassName(this.__body, 'j-module');
this.__export = {
    parent: list[0]
}
```

### 模块整合

模块编写完毕后, 就可以对模块进行整合了, 之前我们已经提取了模块的整合规则. 整合后即可进行调度了.

还是直接上代码吧, 都在注释里:

```js


/**
 * 模块入口文件
 */

NEJ.define([
    '{lib}util/dispatcher/dispatcher.js'
], function(_p) {

    // 实例化调度器，并在全局设置dispatcher变量供模块使用
    // 源码中你会看到, _$startup方法设置了window.dispatcher.
    // 可直接dispatcher._$redirect('umi or alias')进行模块的跳转.
    _p._$startup({
        // 设置规则
        // 这个rewrite比较坑爹, 404是指如果访问了不存在的模块就跳转到/m/blog模块, 
        // 但是其他的规则是反的, 比如404下面的, 访问/m模块会直接跳转到/m/blog模块.
        rules: {
            rewrite : {
                '404': '/m/blog/list',
                '/m/blog/list': '/m',
                '/m/blog/list': '/m/blog'
            },
            title: {
                '/m/blog/list': '博客列表',
                '/m/blog/tag': '博客标签'
            },
            // 别名设置
            // 书写简单
            alias: {
                'm': '/m',
                'tab': '/?/tab',

                'blog': '/m/blog',
                'blog-list': '/m/blog/list',
                'blog-tag': '/m/blog/tag'
            }
        },

        // 注册模块
        modules: {
            '/?/tab': 'tab/index.html',

            '/m': {
                module: 'm/index.html',
                composite: {
                    tab: '/?/tab'
                }
            },
            '/m/blog': 'blog/index.html',
            '/m/blog/list': 'blog/list/index.html',
            '/m/blog/tag': 'blog/tag/index.html'
        }
    });

});
```

最后入口html文件给个module-box的容器(还记得顶级模块么), 访问即可了.

## 和Regular结合

随着[Regular](regularjs.github.io)的广泛使用, 如何Regular和NEJ结合呢. 其实两者在概念上是有不少冲突的, 所以需要对双方都做一些割舍.

我们新添加一个`/m/article`模块, 首先构建模块, 这里都一样, 只是html模板换成regular的.

```html
<textarea name="txt" id="article-module">
    <div class="panel panel-default">
        <div class="panel-heading">
            <h3 class="panel-title">{article.title}</h3>
        </div>
        <div class="panel-body">
            {#include article.content}
        </div>
    </div>
    <button class="btn btn-block btn-default" on-click={this.confirm()}>确定</button>
</textarea>

<textarea name="js" data-src="./index.js"></textarea>
```

模块逻辑部分自然要加载Regular了.

```js

NEJ.define([
    '{lib}base/klass.js',
    '{lib}util/dispatcher/module.js',
    '{pro}base/module.js',
    '{lib}base/element.js',
    '{lib}base/event.js',
    '{lib}util/template/tpl.js',
    '{lib}util/template/jst.js',
    '{pro}base/regular.js'
], function(_k, _m, _bm, _e, _v, _t, _j, _r, _p) {

    var _pro;
    var prof;

    _p._$$ArticleModule = _k._$klass();
    _pro = _p._$$ArticleModule._$extend(_bm._$$Module);

    _pro.__doBuild = function() {
        var ArticleComp = Regular.extend({
            template: _t._$getTextTemplate('article-module'),
            data: {
                article: {
                    title: '一篇文章',
                    content: 'blalalal'
                }
            },
            confirm: function() {
                this.data.article.title = 'modify';
            }
        });

        prof = new ArticleComp();
        this.__body = document.createElement('div');
        prof.$inject(this.__body);
    }

    _v._$addEvent(document, 'templateready', function() {
        _m._$regist('article', _p._$$ArticleModule);
    });
});
```

新增一个模块, 只需在配置modules部分添加`/m/article`这个模块即可.

## 打包部署

NEJ提供的打包工具十分方便, 真正做到了一键发布.
不过在入口html页面有几个地方需要额外标记.

```html
<!-- @MODULE -->
<textarea name="html" data-src="/src/html/m/index.html"></textarea>
<textarea name="html" data-src="/src/html/tab/index.html"></textarea>
<textarea name="html" data-src="/src/html/blog/index.html"></textarea>
<textarea name="html" data-src="/src/html/blog/tag/index.html"></textarea>
<textarea name="html" data-src="/src/html/blog/list/index.html"></textarea>
<textarea name="html" data-src="/src/html/article/index.html"></textarea> 
<!-- /@MODULE -->

<!-- @VERSION -->
<script>location.config={root:'/src/html/'};</script>
<!-- @DEFINE -->
<script type="text/javascript" src="/nej/src/define.js?pro=/src/javascript/"></script>
```

然后`cd deploy && nej build`试一下吧.

## 总结

NEJ的module是一种很先进的模块调度(组件)系统, 优势在于可配置, 完善的模板系统, 完善的测试, 结合Regular会更加强大.



