
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

    _p._$$TabModule = _k._$klass();
    _pro = _p._$$TabModule._$extend(_bm._$$Module);

    var types = [{name: '博客管理', 'href': 'blog'},
                {name: '日志管理', 'href': 'article'}];

    _pro.__doBuild = function() {
        this.__body = _e._$html2node(_t._$getTextTemplate('tab-module'));
        _j._$render(_e._$get('j-tab'), 'jst-tab', {
            types: types
        });
    }

    _pro.__onMessage = function(_event) {
        var _d = _event.data;
        _e._$get('j-tab').innerHTML += '<a href="#/m/' + _d.href + '" class="list-group-item">' + _d.name + '</a>';
    }

    _v._$addEvent(document, 'templateready', function() {
        _m._$regist('tab', _p._$$TabModule);
    });
});