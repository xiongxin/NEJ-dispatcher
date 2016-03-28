
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
                '/m/blog/tag': '博客标签',
                '/m/article': '文章管理'
            },
            // 别名设置
            // 书写简单
            alias: {
                'm': '/m',
                'tab': '/?/tab',

                'blog': '/m/blog',
                'blog-list': '/m/blog/list',
                'blog-tag': '/m/blog/tag',

                'article': '/m/article'
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
            '/m/blog/tag': 'blog/tag/index.html',

            '/m/article': 'article/index.html'
        }
    });

});