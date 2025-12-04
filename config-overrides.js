// config-overrides.js

module.exports = function override(config, env) {
  // 1. Tìm quy tắc source-map-loader
  const sourceMapLoaderRule = config.module.rules.find(
    (rule) =>
      rule.enforce === "pre" &&
      rule.use &&
      rule.use.includes("source-map-loader")
  );

  if (sourceMapLoaderRule) {
    // 2. Đảm bảo 'exclude' là một mảng
    if (!sourceMapLoaderRule.exclude) {
      sourceMapLoaderRule.exclude = [];
    }

    // Xử lý trường hợp 'exclude' không phải là mảng (nếu có)
    if (!Array.isArray(sourceMapLoaderRule.exclude)) {
      sourceMapLoaderRule.exclude = [sourceMapLoaderRule.exclude];
    }

    // 3. Thêm thư viện @mediapipe/tasks-vision vào danh sách loại trừ
    sourceMapLoaderRule.exclude.push(/@mediapipe\/tasks-vision/);

    console.log(
      "✅ Webpack Config Modified: Excluded @mediapipe/tasks-vision from source-map-loader"
    );
  } else {
    console.warn(
      "⚠️ Webpack Config Warning: source-map-loader rule not found!"
    );
  }

  // Trả về cấu hình đã sửa đổi
  return config;
};
