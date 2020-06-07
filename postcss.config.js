module.exports = {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 37.5, // 转换px的基准值。例如一个元素宽是75px，则换成rem之后就是2rem。
      propList: ['*']
    }
  }
}
