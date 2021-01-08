module.exports = {
    publicPath: process.env.NODE_ENV==='production'?'/usecase-ui/vue':'/',
    outputDir: 'vue',
    devServer: {
        port: 8089
    }
}