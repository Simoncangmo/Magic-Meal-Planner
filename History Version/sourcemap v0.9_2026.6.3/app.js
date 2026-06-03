// app.js
const ENV_ID = 'cloud1-d8gr0op9k5175b818';

App({
  onLaunch() {
    // 初始化云开发
    if (!wx.cloud) {
      console.error('请更新至基础库 2.2.3 以上版本');
    } else {
      wx.cloud.init({
        env: ENV_ID,
        traceUser: true,
      });
    }

    // 从本地缓存恢复 currentChildId（首次进入或已登录状态）
    const saved = wx.getStorageSync('currentChildId');
    this.globalData.currentChildId = saved || null;
    this.globalData.children = [];
    this.globalData.familyId = wx.getStorageSync('familyId') || null;
    this.globalData.openid = null; // 由登录后设置
  },

  globalData: {
    currentChildId: null,
    children: [],
    familyId: null,
    openid: null,
  },

  // 获取当前选中孩子（同步，基于 globalData 缓存）
  getCurrentChild() {
    const children = this.globalData.children;
    if (!children || children.length === 0) return null;
    const id = this.globalData.currentChildId;
    return children.find(c => c._id === id || c.id === id) || children[0];
  },

  setCurrentChild(id) {
    this.globalData.currentChildId = id;
    if (id) {
      wx.setStorageSync('currentChildId', id);
    } else {
      wx.removeStorageSync('currentChildId');
    }
  },

  setFamilyId(familyId) {
    this.globalData.familyId = familyId;
    if (familyId) {
      wx.setStorageSync('familyId', familyId);
    } else {
      wx.removeStorageSync('familyId');
    }
  },

  // 刷新孩子列表（异步，用于页面 onShow）
  async refreshChildren() {
    const db = require('./utils/db');
    try {
      const children = await db.getChildren();
      this.globalData.children = children || [];
      return children;
    } catch (e) {
      console.warn('refreshChildren error', e);
      return [];
    }
  },
});
