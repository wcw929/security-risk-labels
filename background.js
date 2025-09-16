// 更新配置
const UPDATE_CONFIG = {
  // GitHub仓库信息 - 请根据实际情况修改
  GITHUB_REPO: 'your-username/your-repo-name', // 替换为实际的GitHub仓库
  CHECK_INTERVAL: 24 * 60 * 60 * 1000, // 24小时检查一次
  UPDATE_URL_TEMPLATE: 'https://github.com/{repo}/releases/latest', // 更新页面模板
  API_URL_TEMPLATE: 'https://api.github.com/repos/{repo}/releases/latest' // API地址模板
};

// 版本比较函数
function compareVersions(version1, version2) {
  const v1parts = version1.split('.').map(Number);
  const v2parts = version2.split('.').map(Number);

  for (let i = 0; i < Math.max(v1parts.length, v2parts.length); i++) {
    const v1part = v1parts[i] || 0;
    const v2part = v2parts[i] || 0;

    if (v1part < v2part) return -1;
    if (v1part > v2part) return 1;
  }
  return 0;
}

// 获取当前版本
function getCurrentVersion() {
  return chrome.runtime.getManifest().version;
}

// 检查更新
async function checkForUpdates() {
  try {
    const apiUrl = UPDATE_CONFIG.API_URL_TEMPLATE.replace('{repo}', UPDATE_CONFIG.GITHUB_REPO);

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const releaseData = await response.json();
    const latestVersion = releaseData.tag_name.replace(/^v/, ''); // 移除v前缀
    const currentVersion = getCurrentVersion();

    console.log(`当前版本: ${currentVersion}, 最新版本: ${latestVersion}`);

    if (compareVersions(currentVersion, latestVersion) < 0) {
      // 有新版本可用
      const updateInfo = {
        hasUpdate: true,
        currentVersion,
        latestVersion,
        releaseNotes: releaseData.body || '暂无更新说明',
        downloadUrl: UPDATE_CONFIG.UPDATE_URL_TEMPLATE.replace('{repo}', UPDATE_CONFIG.GITHUB_REPO),
        publishedAt: releaseData.published_at
      };

      // 保存更新信息
      await chrome.storage.local.set({ updateInfo });

      // 通知用户有更新
      await notifyUpdate(updateInfo);

      return updateInfo;
    } else {
      // 没有更新
      await chrome.storage.local.set({
        updateInfo: { hasUpdate: false, lastChecked: Date.now() }
      });
      return { hasUpdate: false };
    }
  } catch (error) {
    console.error('检查更新失败:', error);
    return { hasUpdate: false, error: error.message };
  }
}

// 通知用户有更新
async function notifyUpdate(updateInfo) {
  // 检查是否已经通知过这个版本
  const { notifiedVersions = [] } = await chrome.storage.local.get('notifiedVersions');

  if (!notifiedVersions.includes(updateInfo.latestVersion)) {
    // 创建通知
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: '安全风险标签展示 - 有新版本可用',
      message: `发现新版本 v${updateInfo.latestVersion}，点击查看更新详情`,
      buttons: [
        { title: '立即更新' },
        { title: '稍后提醒' }
      ]
    });

    // 记录已通知的版本
    notifiedVersions.push(updateInfo.latestVersion);
    await chrome.storage.local.set({ notifiedVersions });
  }
}

// 处理通知点击
chrome.notifications.onClicked.addListener(async (notificationId) => {
  const { updateInfo } = await chrome.storage.local.get('updateInfo');
  if (updateInfo && updateInfo.hasUpdate) {
    chrome.tabs.create({ url: updateInfo.downloadUrl });
  }
});

// 处理通知按钮点击
chrome.notifications.onButtonClicked.addListener(async (notificationId, buttonIndex) => {
  const { updateInfo } = await chrome.storage.local.get('updateInfo');

  if (buttonIndex === 0) { // 立即更新
    if (updateInfo && updateInfo.hasUpdate) {
      chrome.tabs.create({ url: updateInfo.downloadUrl });
    }
  } else if (buttonIndex === 1) { // 稍后提醒
    // 设置稍后提醒时间（4小时后）
    const remindTime = Date.now() + (4 * 60 * 60 * 1000);
    await chrome.storage.local.set({ remindTime });
  }

  chrome.notifications.clear(notificationId);
});

// 定期检查更新
async function scheduleUpdateCheck() {
  const { lastUpdateCheck = 0 } = await chrome.storage.local.get('lastUpdateCheck');
  const now = Date.now();

  if (now - lastUpdateCheck > UPDATE_CONFIG.CHECK_INTERVAL) {
    await checkForUpdates();
    await chrome.storage.local.set({ lastUpdateCheck: now });
  }
}

// 检查是否需要提醒
async function checkReminder() {
  const { remindTime, updateInfo } = await chrome.storage.local.get(['remindTime', 'updateInfo']);

  if (remindTime && Date.now() >= remindTime && updateInfo && updateInfo.hasUpdate) {
    await notifyUpdate(updateInfo);
    await chrome.storage.local.remove('remindTime');
  }
}

// 扩展安装或启动时
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    console.log('安全风险标签展示插件已安装');
    // 首次安装时检查更新
    setTimeout(checkForUpdates, 5000); // 延迟5秒检查
  } else if (details.reason === 'update') {
    console.log('安全风险标签展示插件已更新');
    // 清除旧的更新信息
    await chrome.storage.local.remove(['updateInfo', 'notifiedVersions', 'remindTime']);
  }
});

// 扩展启动时
chrome.runtime.onStartup.addListener(() => {
  console.log('安全风险标签展示插件已启动');
  scheduleUpdateCheck();
  checkReminder();
});

// 定期检查（每小时检查一次提醒和更新）
setInterval(() => {
  scheduleUpdateCheck();
  checkReminder();
}, 60 * 60 * 1000); // 1小时

// 监听来自content script的消息
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === 'checkUpdate') {
    const result = await checkForUpdates();
    sendResponse(result);
  } else if (request.action === 'getUpdateInfo') {
    const { updateInfo } = await chrome.storage.local.get('updateInfo');
    sendResponse(updateInfo || { hasUpdate: false });
  }
});

// 添加通知权限检查
chrome.runtime.onInstalled.addListener(() => {
  // 请求通知权限
  chrome.notifications.getPermissionLevel((level) => {
    if (level !== 'granted') {
      console.log('需要通知权限来接收更新提醒');
    }
  });
});
