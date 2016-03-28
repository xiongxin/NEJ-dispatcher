
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