# 快速设置在线更新功能

## 🚀 5分钟快速配置

### 步骤1: 创建GitHub仓库
1. 登录 [GitHub](https://github.com)
2. 点击右上角的 "+" → "New repository"
3. 填写仓库名称（如：`security-risk-labels`）
4. 设置为 Public（公开仓库）
5. 点击 "Create repository"

### 步骤2: 配置插件
打开 `background.js` 文件，找到第6行的配置：

```javascript
// 修改这一行，替换为你的GitHub用户名和仓库名
GITHUB_REPO: 'your-username/your-repo-name',
```

**示例：**
```javascript
GITHUB_REPO: 'zhangsan/security-risk-labels',
```

### 步骤3: 重新加载插件
1. 打开 Chrome 浏览器
2. 访问 `chrome://extensions/`
3. 找到"安全风险标签展示"插件
4. 点击刷新按钮 🔄

### 步骤4: 测试更新功能
1. 打开插件窗口
2. 点击标题栏的 🔄 按钮
3. 应该显示"当前已是最新版本"

## 📦 发布第一个版本

### 创建Release
1. 进入你的GitHub仓库
2. 点击 "Releases" → "Create a new release"
3. 填写信息：
   - **Tag version**: `v1.0.1`
   - **Release title**: `版本 1.0.1`
   - **Description**:
     ```
     ## 更新内容
     - 添加在线更新功能
     - 优化用户界面
     - 修复已知问题
     ```
4. 上传插件zip文件
5. 点击 "Publish release"

### 验证更新
1. 将 `manifest.json` 中的版本改为 `1.0.0`
2. 重新加载插件
3. 点击更新按钮，应该提示有新版本 `1.0.1`

## ⚡ 常用配置

### 更改检查频率
```javascript
// 每12小时检查一次
CHECK_INTERVAL: 12 * 60 * 60 * 1000,

// 每6小时检查一次
CHECK_INTERVAL: 6 * 60 * 60 * 1000,

// 禁用自动检查（仅手动）
CHECK_INTERVAL: Infinity,
```

### 使用私有仓库
如果使用私有仓库，需要：
1. 生成GitHub Personal Access Token
2. 修改API请求添加认证头
3. 或者使用自己的更新服务器

## 🔧 故障排除

### 问题1: 检查更新失败
**可能原因：**
- GitHub仓库名称错误
- 网络连接问题
- 仓库设置为私有

**解决方法：**
1. 检查 `GITHUB_REPO` 配置是否正确
2. 确保仓库是公开的
3. 在浏览器控制台查看错误信息

### 问题2: 没有收到通知
**可能原因：**
- 浏览器通知权限被禁用
- 插件权限不足

**解决方法：**
1. 检查浏览器通知设置
2. 在 `chrome://extensions/` 中检查插件权限

### 问题3: 版本比较错误
**可能原因：**
- 版本号格式不正确
- Release标签格式错误

**解决方法：**
1. 使用标准版本号格式：`1.0.0`
2. Release标签使用：`v1.0.0`

## 📋 检查清单

配置完成后，请确认：

- [ ] GitHub仓库已创建且为公开
- [ ] `background.js` 中的 `GITHUB_REPO` 已正确配置
- [ ] 插件已重新加载
- [ ] 手动检查更新功能正常
- [ ] 已创建第一个Release进行测试
- [ ] 版本号遵循语义化版本规范

## 🎯 下一步

1. **定期更新**: 建议每月发布一次更新
2. **用户反馈**: 收集用户反馈并及时修复问题
3. **功能增强**: 根据需求添加新功能
4. **安全更新**: 及时修复安全漏洞

---

**需要帮助？** 查看详细的 [更新指南.md](./更新指南.md) 或联系技术支持。
