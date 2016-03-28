

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
        var selfPro = this;
        var ArticleComp = Regular.extend({
            template: _t._$getTextTemplate('article-module'),
            data: {
                article: {
                    title: '一篇文章',
                    content: '<ul><li><a href="https://github.com/genify/nej/blob/master/doc/DEPENDENCY.md">依赖管理系统</a>支持 </li><li><a href="https://github.com/genify/nej/blob/master/doc/PLATFORM.md">平台适配系统</a>支持（浏览器、移动APP、桌面APP等）</li><li>丰富可灵活扩展的<a href="https://github.com/genify/nej/blob/master/doc/WIDGET.md">控件系统</a>（可验证表单、列表、拖拽、滑块、日历、富文本编辑器等）</li><li>多方案集成（<a href="https://github.com/genify/nej/blob/master/doc/TEMPLATE.md">模板系统</a>、<a href="https://github.com/genify/nej/blob/master/doc/DISPATCHER.md">可组合的模块化开发</a>、<a href="https://github.com/genify/nej/blob/master/doc/DISPATCHER.md">单页系统按需载入</a>、<a href="https://github.com/genify/nej/blob/master/doc/AJAX.md">基于配置的跨域异步请求</a>等）</li><li>可自由定制的产品发布（按平台定制、按功能定制）</li><li>工具支持（<a href="https://github.com/genify/toolkit">NEJ工具集</a>、NEJ脚手架等）</li><li>新技术整合（对于高端目标平台自动应用新技术）</li></ul>'
                }
            },
            confirm: function() {
                // 此处需要指明模块的umi
                // 不能使用alias
                selfPro.__doSendMessage('/?/tab', { 
                    'name': 'xx管理',
                    'href': 'xx' 
                });
                setTimeout(function() {
                    window.dispatcher._$redirect('/m/blog/list');
                }, 1000);
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