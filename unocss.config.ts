import presetWeapp from 'unocss-preset-weapp'
import { transformerClass, extractorAttributify } from 'unocss-preset-weapp/transformer'
import { defineConfig } from 'unocss'
const transformRules = {
    '.': '-d111-',
    '/': '-s111-',
    ':': '-c111-',
    '%': '-p111-',
    '!': '-e111-',
    '#': '-w111-',
    '(': '-b111l-',
    ')': '-b111r-',
    '[': '-f111l-',
    ']': '-f111r-',
    '$': '-r111-',
    ',': '-r222-',
}
const prefix = 'nut-'
const { presetWeappAttributify, transformerAttributify } = extractorAttributify({
    transformRules,
    classPrefix:prefix
})
export default defineConfig({
    presets: [
        // https://github.com/MellowCo/unocss-preset-weapp
        presetWeapp({
            transformRules
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
            "primary-color": "text-#fa6419"
        },
    ],

    transformers: [
        transformerAttributify(),
        transformerClass({
            transformRules
        }),
    ],
})