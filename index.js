/**
 * 全局替换require静态资源文件
 */

function VitePluginStaticSourceRequire() {
  return {
    name: 'vite-plugin-static-source-require',
    apply: 'serve',

    transform(code, id) {
      if (id.includes('.vue') && !id.includes('?')) {
        // const scriptTag = '<script>'

        const matchScriptReg = /<scrip(.*)>/
        const scriptTag = matchScriptReg.exec(code)[0]

        // 匹配静态资源正则
        const requireReg = /(?<=(\srequire\(\'))([^']*)(?=(\'\)))/g

        // 静态资源字符 @/assets/images/xxxx/rank3.png
        const urlArr = code.match(requireReg)

        // 生成静态资源文件名
        const importNameArr = urlArr && urlArr.map((ar) => ar.split('/').slice(-3).join('_').split('.')[0].replace('-', '_'))

        importNameArr &&
          importNameArr.forEach((item, index) => {
            // 生成随机hash以防同一页面有相同引入
            const randomHash = Math.floor(Math.random(1, 9999) * 1000000)

            // hash后名字
            const importNameRan = `${item}_${randomHash}`

            // 1. 把所有的静态资源路径替换成文件名
            code = code.replace(`require('${urlArr[index]}')`, importNameRan)

            // 2. 引入静态资源文件
            const importStr = `${scriptTag}\nimport ${importNameRan} from '${urlArr[index]}'\n`
            code = code.replace(scriptTag, importStr)
          })

        return code
      }
    }
  }
}

export default VitePluginStaticSourceRequire
