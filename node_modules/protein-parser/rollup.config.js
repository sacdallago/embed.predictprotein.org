import replace from 'rollup-plugin-replace';

export default {
    input: 'src/index.js',
    output: {
        format: 'cjs'
    },
    external: [ 'md5' ],
    plugins: [
        replace({
            'process.browser': process.env.BROWSER === "true"
        })
    ]
};