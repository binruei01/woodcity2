/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface IdentificationResult {
  valueStatus: string;
  architecturalStyle: string;
  materials: string;
  year: string;
  usageStatus: string;
  completeness: number;
}

export interface AnalysisOutput {
  判別結果: {
    價值地位: string;
    建築特色: string;
    建築材料: string;
    建築年份: string;
    使用狀況: string;
    建築物完整度: string;
  };
  保存價值評估: {
    是否建議保存: "是" | "否";
    原因: string;
  };
  補助建議: {
    建議方案: string;
    說明: string;
  };
}

export function analyzeWoodenHouse(input: IdentificationResult): AnalysisOutput {
  const { valueStatus, architecturalStyle, materials, year, usageStatus, completeness } = input;
  
  // 1. 保存價值評估
  const reasons: string[] = [];
  let shouldPreserve: "是" | "否" = "否";

  const isMonumentOrWoodCity = 
    valueStatus === "國定古蹟" || 
    valueStatus === "市定古蹟" || 
    valueStatus === "已申請嘉義市木都3.0改造計畫之老屋";

  if (isMonumentOrWoodCity) {
    reasons.push("符合「古蹟」或「木都3.0」身分，具備高度保存價值。");
    shouldPreserve = "是";
  }

  const buildYear = parseInt(year);
  if (!isNaN(buildYear) && buildYear < 1950) {
    reasons.push("建築年分在 1950 年以前，具有高度文化歷史價值。");
    shouldPreserve = "是";
  }

  if (completeness >= 4) {
    reasons.push(`建築物完整度達 ${completeness} 分，修復與保存可行性極高。`);
    shouldPreserve = "是";
  }

  if (usageStatus === "荒廢中") {
    reasons.push("目前處於荒廢狀態，為避免進一步毀損，應列為優先保存對象。");
    shouldPreserve = "是";
  }

  if (reasons.length === 0) {
    reasons.push("目前屋況與歷史背景查無特殊保存急迫性，建議持續觀察。");
  }

  // 2. 補助建議
  let subsidyPlan = "";
  let subsidyDesc = "";

  if (usageStatus === "整修中") {
    subsidyPlan = "建議申請「木都3.0補助」";
    subsidyDesc = "目前正在整修，非常適合對接木都 3.0 計畫，申請修繕經費與專業技術諮詢。";
  } else if (usageStatus === "荒廢中") {
    subsidyPlan = "建議優先保存並積極申請專案補助";
    subsidyDesc = "建物目前荒廢，應先進行簡易加固防止坍塌，並同步申請再造歷史現場或木都專案規劃。";
  } else if (usageStatus === "使用中" && completeness >= 4) {
    subsidyPlan = "建議進行文化資產登錄評估";
    subsidyDesc = "屋況良好且使用中，具備轉化為文化資產的潛力，可向文化局諮詢登錄流程以獲得長期保護。";
  } else {
    subsidyPlan = "可不優先補助";
    subsidyDesc = "根據目前評估資訊，建議資源優先投放至其他具有更高歷史價值或急迫性的物件。";
  }

  return {
    "判別結果": {
      "價值地位": valueStatus,
      "建築特色": architecturalStyle,
      "建築材料": materials,
      "建築年份": year,
      "使用狀況": usageStatus,
      "建築物完整度": `${completeness} 分`
    },
    "保存價值評估": {
      "是否建議保存": shouldPreserve,
      "原因": reasons.join(" ")
    },
    "補助建議": {
      "建議方案": subsidyPlan,
      "說明": subsidyDesc
    }
  };
}
