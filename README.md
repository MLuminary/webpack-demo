# webpack-demo

注意以前 node 的版本对 webpack-cli ，然后引入 html-webpack-plugin 后会有很多模块缺失，出现引入 html-webpack-plugin 报错的升级 node 并重新安装一下 webpack-cli 试一下。本人也是推测

## webpack4.0中使用'extract-text-webpack-plugin'报错

```shell
(node:15588) DeprecationWarning: Tapable.plugin is deprecated. Use new API on `.hooks` instead
D:\haoqin\workspace\gitMaster\webpack-demo\node_modules\_webpack@4.5.0@webpack\lib\Chunk.js:468
                throw new Error(
                ^

Error: Chunk.entrypoints: Use Chunks.groupsIterable and filter by instanceof Entrypoint instead
    at Chunk.get (D:\haoqin\workspace\gitMaster\webpack-demo\node_modules\_webpack@4.5.0@webpack\lib\Chunk.js:468:9)
    at D:\haoqin\workspace\gitMaster\webpack-demo\node_modules\_extract-text-webpack-plugin@3.0.2@extract-text-webpack-plugin\dist\index.js:176:48
    at Array.forEach (<anonymous>)
    at D:\haoqin\workspace\gitMaster\webpack-demo\node_modules\_extract-text-webpack-plugin@3.0.2@extract-text-webpack-plugin\dist\index.js:171:18
    at AsyncSeriesHook.eval [as callAsync] (eval at create (D:\haoqin\workspace\gitMaster\webpack-demo\node_modules\_tapable@1.0.0@tapable\lib\HookCodeFactory.js:24:12), <anonymous>:7:1)
    at AsyncSeriesHook.lazyCompileHook [as _callAsync] (D:\haoqin\workspace\gitMaster\webpack-demo\node_modules\_tapable@1.0.0@tapable\lib\Hook.js:35:21)
    at Compilation.seal (D:\haoqin\workspace\gitMaster\webpack-demo\node_modules\_webpack@4.5.0@webpack\lib\Compilation.js:896:27)
    at hooks.make.callAsync.err (D:\haoqin\workspace\gitMaster\webpack-demo\node_modules\_webpack@4.5.0@webpack\lib\Compiler.js:479:17)
    at _done (eval at create (D:\haoqin\workspace\gitMaster\webpack-demo\node_modules\_tapable@1.0.0@tapable\lib\HookCodeFactory.js:24:12), <anonymous>:9:1)
    at _err2 (eval at create (D:\haoqin\workspace\gitMaster\webpack-demo\node_modules\_tapable@1.0.0@tapable\lib\HookCodeFactory.js:24:12), <anonymous>:44:22)
    at _addModuleChain (D:\haoqin\workspace\gitMaster\webpack-demo\node_modules\_webpack@4.5.0@webpack\lib\Compilation.js:764:12)
    at processModuleDependencies.err (D:\haoqin\workspace\gitMaster\webpack-demo\node_modules\_webpack@4.5.0@webpack\lib\Compilation.js:703:9)
    at _combinedTickCallback (internal/process/next_tick.js:131:7)
    at process._tickCallback (internal/process/next_tick.js:180:9)
```

寻找 github 中的 issue https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/701

运行以下代码可以解决

```shell
npm i -D extract-text-webpack-plugin@next
```

## SplitChunkPlugin使用遇到的问题

```shell
webpack.optimize.CommonsChunkPlugin has been removed, please use config.optimization.splitChunks instead.
```

CommonChunkPlugin 已被 webpack4 废弃，推荐使用 SplitChunkPlugin 来提取公共模块，目前实现了公共模块的分离，html 文件也只引用公共文件，但是还是存在问题。打包的 dist 文件中还是会生成 0.js 和 1.js，而且 css 的样式无法加载。这个问题还会再查找相关资料去解决

```js
optimization: {
        //提取公共模块，webpack4去除了CommonsChunkPlugin，使用SplitChunksPlugin作为替代
        //主要用于多页面
        //例子代码 https://github.com/webpack/webpack/tree/master/examples/common-chunk-and-vendor-chunk
        //SplitChunksPlugin配置
        splitChunks: {
            // 表示显示块的范围，有三个可选值：initial(初始块)、async(按需加载块)、all(全部块)，默认为all;
            chunks: "all",
            // 表示在压缩前的最小模块大小，默认为0；
            minSize: 30000,
            //表示被引用次数，默认为1
            minChunks: 1,
            //最大的按需(异步)加载次数，默认为1；
            maxAsyncRequests: 3,
            //最大的初始化加载次数，默认为1；
            maxInitialRequests: 3,
            // 拆分出来块的名字(Chunk Names)，默认由块名和hash值自动生成；设置ture则使用默认值
            name: true,
            //缓存组，目前在项目中设置cacheGroup可以抽取公共模块，不设置则不会抽取
            cacheGroups: {
                //缓存组信息，名称可以自己定义
                commons: {
                    //拆分出来块的名字,默认是缓存组名称+"~" + [name].js
                    name: "test",
                    // 同上
                    chunks: "all",
                    // 同上
                    minChunks: 3,
                    // 如果cacheGroup中没有设置minSize，则据此判断是否使用上层的minSize，true：则使用0，false：使用上层minSize
                    enforce: true,
                    //test: 缓存组的规则，表示符合条件的的放入当前缓存组，值可以是function、boolean、string、RegExp，默认为空；
                    test:""
                },
                //设置多个缓存规则
                vendor: {
                    test: /node_modules/,
                    chunks: "all",
                    name: "vendor",
                    //表示缓存的优先级
                    priority: 10,
                    enforce: true
                }
            }
        }
    }
```

## Extract-text-webpack-plugin 生成空的 css 文件

问题描述：当`runtimeChunk` 为 `false` 时，css 文件夹下 只有 index.css 时最后打包生成的 index.css 为空文件，如果添加 style.css 文件最后打包生成的 index.css 文件中的内容都为 style.css 中的内容，当 `runtimeChunk` 为 `true` 时生成的 index.css 一直为空。　

