/**
 * Google Apps Script 核心服務
 * 負責處理木屋鑑定資料的存檔與網頁入口
 */

// 1. 當使用者存取網址時，載入 index.html 頁面
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('木屋文化資產鑑定管理系統')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL) // 允許跨網域嵌入
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// 2. 接收前端傳來的資料並寫入 Google Sheets
function saveWoodenHouseData(data) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetName = "木屋特徵紀錄表"; // 這是試算表的分頁名稱
    let sheet = ss.getSheetByName(sheetName);
    
    // 如果分頁不存在，則自動建立並寫入標題
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      sheet.appendRow([
        "紀錄時間", 
        "價值地位", 
        "建築特色", 
        "建築材料", 
        "建造年份", 
        "使用現況", 
        "完整度評分", 
        "保存價值結論", 
        "鑑定原因說明", 
        "建議動作方案"
      ]);
      // 設定標題列樣式：粗體且背景色
      sheet.getRange(1, 1, 1, 10).setBackground("#5A5A40").setFontColor("#FFFFFF").setFontWeight("bold");
    }

    // 格式化資料準備寫入
    const row = [
      new Date(), // 紀錄時間
      data.判別結果.價值地位 || "未知",
      data.判別結果.建築特色 || "未填寫",
      data.判別結果.建築材料 || "未填寫",
      data.判別結果.建築年份 || "未知",
      data.判別結果.使用狀況 || "未知",
      data.判別結果.建築物完整度 || "0",
      data.保存價值評估.是否建議保存 || "待評估",
      data.保存價值評估.原因 || "無",
      data.補助建議.建議方案 || "無特別建議"
    ];

    // 將資料附加到最後一列
    sheet.appendRow(row);
    
    return {
      success: true,
      timestamp: new Date().toLocaleString(),
      message: "鑑定紀錄已成功保存至試算表！"
    };
  } catch (error) {
    // 錯誤處理
    return {
      success: false,
      message: "儲存失敗：" + error.toString()
    };
  }
}
