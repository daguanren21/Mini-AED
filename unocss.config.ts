import presetWeapp from 'unocss-preset-weapp'
import {  transformerClass,extractorAttributify } from 'unocss-preset-weapp/transformer'
import { defineConfig } from 'unocss/webpack'
const { presetWeappAttributify, transformerAttributify } = extractorAttributify()
export default defineConfig({
    presets: [
        // https://github.com/MellowCo/unocss-preset-weapp
        presetWeapp(),
        presetWeappAttributify(),
    ],
    shortcuts: [
        {
            'border-base': 'border border-gray-500/10',
            'center': 'flex justify-center items-center',
        },
    ],

    transformers: [

        transformerAttributify(),

        transformerClass(),
    ],
})