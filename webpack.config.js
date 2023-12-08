// webpack.config.js
const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");

module.exports = {
  entry: ["./src/client/controllers.js"], // 번들링할 파일의 시작점
  output: {
    filename: "bundle.js", // 생성될 번들 파일의 이름
    path: path.resolve(__dirname, "public/dist"), // 번들 파일이 저장될 경로
  },
  mode: "development", // 'development'로 설정할 수도 있습니다.,
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
      }),
    ],
  },
  resolve: {
    fallback: {
      process: false,
    },
  },
};
