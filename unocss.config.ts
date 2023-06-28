import presetWeapp from 'unocss-preset-weapp'
import { transformerClass, extractorAttributify } from 'unocss-preset-weapp/transformer'
import { defineConfig } from 'unocss/webpack'
const { presetWeappAttributify, transformerAttributify } = extractorAttributify()
export default defineConfig({
    presets: [
        // https://github.com/MellowCo/unocss-preset-weapp
        presetWeapp({
            platform:'taro'
        }),
        presetWeappAttributify(),
    ],
    shortcuts: [
        {
            "~": "flex",
            "wh-full": 'w-full h-full',
            "flex-center": "flex justify-center items-center",
            "flex-x-center": "flex justify-center",
            "flex-y-center": "flex items-center",
            "flex-col": "flex flex-col",
            "primary-color":"text-#fa6419"
        },
    ],

    transformers: [

        transformerAttributify(),

        transformerClass(),
    ],
})