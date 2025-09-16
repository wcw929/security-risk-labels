// 配置示例文件
// 复制此文件内容到 background.js 中的 UPDATE_CONFIG 部分

const UPDATE_CONFIG_EXAMPLE = {
  // ===== 必须配置 =====
  // 替换为你的GitHub仓库信息（格式：用户名/仓库名）
  GITHUB_REPO: 'your-username/your-repo-name',
  // 示例：'zhangsan/risk-label-plugin'

  // ===== 可选配置 =====
  // 检查更新的时间间隔（毫秒）
  CHECK_INTERVAL: 24 * 60 * 60 * 1000, // 24小时
  // 其他选项：
  // 12 * 60 * 60 * 1000  // 12小时
  // 6 * 60 * 60 * 1000   // 6小时
  // Infinity             // 禁用自动检查

  // GitHub Release页面模板（通常不需要修改）
  UPDATE_URL_TEMPLATE: 'https://github.com/{repo}/releases/latest',

  // GitHub API地址模板（通常不需要修改）
  API_URL_TEMPLATE: 'https://api.github.com/repos/{repo}/releases/latest'
};

// ===== 配置步骤 =====
/*
1. 创建GitHub仓库（如果还没有）
2. 将 GITHUB_REPO 替换为你的仓库信息
3. 根据需要调整 CHECK_INTERVAL
4. 保存文件并重新加载插件

示例配置：
const UPDATE_CONFIG = {
  GITHUB_REPO: 'zhangsan/security-risk-labels',
  CHECK_INTERVAL: 24 * 60 * 60 * 1000,
  UPDATE_URL_TEMPLATE: 'https://github.com/{repo}/releases/latest',
  API_URL_TEMPLATE: 'https://api.github.com/repos/{repo}/releases/latest'
};
*/

// ===== 发布新版本步骤 =====
/*
1. 更新 manifest.json 中的版本号
   "version": "1.1.0"

2. 在GitHub仓库创建新的Release
   - 标签：v1.1.0
   - 标题：版本 1.1.0
   - 描述：更新内容说明
   - 上传插件zip文件

3. 发布Release后，用户会自动收到更新通知
*/

// ===== 测试配置 =====
/*
在浏览器控制台运行以下命令测试更新功能：

// 手动检查更新
chrome.runtime.sendMessage({ action: 'checkUpdate' }, console.log);

// 获取当前更新信息
chrome.runtime.sendMessage({ action: 'getUpdateInfo' }, console.log);
*/
