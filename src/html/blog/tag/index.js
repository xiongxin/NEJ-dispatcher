

NEJ.define([
    '{lib}base/klass.js',
    '{lib}util/dispatcher/module.js',
    '{pro}base/module.js',
    '{lib}base/element.js',
    '{lib}base/event.js',
    '{lib}util/template/tpl.js',
    '{lib}util/template/jst.js'
], function(_k, _m, _bm, _e, _v, _t, _j, _p) {

    var _pro;

    _p._$$BlogTagModule = _k._$klass();
    _pro = _p._$$BlogTagModule._$extend(_bm._$$Module);

    _pro.__doBuild = function() {
        this.__body = _e._$html2node(_t._$getTextTemplate('blog-tag-module'));
    }

    _v._$addEvent(document, 'templateready', function() {
        _m._$regist('blog-tag', _p._$$BlogTagModule);
    });
});