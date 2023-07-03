import Components from 'unplugin-vue-components/webpack';
import AutoImport from 'unplugin-auto-import/webpack'
// import NutUIResolver from '@nutui/nutui-taro/dist/resolver';
const path = require('path');
console.log({
  path: path.resolve(__dirname, '..', 'src')
})
const NutUIResolver = () => {
  return (name) => {
    if (name.startsWith('Nut')) {
      const partialName = name.slice(3);
      return {
        name: partialName,
        from: '@nutui/nutui-taro',
        sideEffects: `@nutui/nutui-taro/dist/packages/${partialName.toLowerCase()}/style`
      }
    }
  }
}
const config = {
  projectName: 'taro-vue3',
  date: '2023-6-5',
  alias: {
    '~': path.resolve(__dirname, '../src')
  },
  designWidth(input) {
    if (input?.file?.replace(/\\+/g, '/').indexOf('@nutui') > -1) {
      return 375
    }
    return 750
  },
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
    375: 2 / 1
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: ['@tarojs/plugin-html'],
  defineConstants: {
  },
  copy: {
    patterns: [
    ],
    options: {
    }
  },
  framework: 'vue3',
  compiler: {
    type: 'webpack5',
    prebundle: { enable: false }
  },
  cache: {
    enable: false // Webpack 持久化缓存配置，建议开启。默认配置请参考：https://docs.taro.zone/docs/config-detail#cache
  },
  sass: {
    data: `@import "@nutui/nutui-taro/dist/styles/variables.scss";`
  },
  mini: {
    //解决编译报错couldn't fulfill desired order of chunk group(s),issues：https://github.com/jdf2e/nutui/issues/2126
    miniCssExtractPluginOption:{
      ignoreOrder:true
    },
    webpackChain(chain) {
      chain.plugin('unplugin-vue-components').use(Components({
        include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/],
        resolvers: [NutUIResolver()],
      }))
      chain.plugin('unplugin-auto-import').use(AutoImport({
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/, /\.vue\?vue/, // .vue
        ],
        imports:["vue"],
        dts:"types/auto-imports.d.ts"
      }))
    },

    postcss: {
      pxtransform: {
        enable: true,
        config: {
          // selectorBlackList: ['nut-']
        }
      },
      url: {
        enable: true,
        config: {
          limit: 1024 // 设定转换尺寸上限
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      },
      "@unocss/postcss": {
        enable: true
      }
    }
  },
  h5: {
    webpackChain(chain) {
      chain.plugin('unplugin-vue-components').use(Components({
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        resolvers: [NutUIResolver()],
      }))
      chain.plugin('unplugin-auto-import').use(AutoImport({
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/, /\.vue\?vue/, // .vue
        ],
        imports:["vue"],
      }))
    },
    publicPath: '/',
    staticDirectory: 'static',
    esnextModules: ['nutui-taro', 'icons-vue-taro'],
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    },
    '@unocss/postcss': {
      enable: true,
    },
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
