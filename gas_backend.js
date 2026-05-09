// 本程式碼需要部署至 Google Apps Script，發布為「網頁應用程式」，並允許「所有人」存取。
// 注意：前端發送請求時，請使用 method: 'POST', body: JSON.stringify(data), 且 headers 不要設定 'Content-Type': 'application/json' 以避免 CORS 預檢請求錯誤（GAS 會自動將 body 視為文字）。

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    if (action === 'getQuestions') {
      const count = data.count || 5;
      const questions = getQuestions(count);
      return ContentService.createTextOutput(JSON.stringify({ success: true, data: questions }))
                           .setMimeType(ContentService.MimeType.JSON);
    } else if (action === 'submitScore') {
      const result = submitScore(data.id, data.answers, data.threshold);
      return ContentService.createTextOutput(JSON.stringify({ success: true, data: result }))
                           .setMimeType(ContentService.MimeType.JSON);
    } else {
      throw new Error("Invalid action");
    }
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}

function getQuestions(count) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("題目");
  if (!sheet) throw new Error("找不到「題目」工作表");

  const data = sheet.getDataRange().getValues();
  // 欄位：題號(0), 題目(1), A(2), B(3), C(4), D(5), 解答(6)
  const rows = data.slice(1);

  // 隨機抽取 count 題
  const shuffled = rows.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count);

  return selected.map(row => ({
    id: row[0],
    text: row[1],
    options: {
      A: row[2],
      B: row[3],
      C: row[4],
      D: row[5]
    }
  }));
}

function submitScore(id, userAnswers, threshold) {
  const sheetQs = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("題目");
  const dataQs = sheetQs.getDataRange().getValues();
  const rowsQs = dataQs.slice(1);

  // 建立解答對應表：題號 -> 解答
  const answerMap = {};
  rowsQs.forEach(row => {
    answerMap[row[0]] = row[6]; // 解答在第7欄(索引6)
  });

  // 計算分數
  let correctCount = 0;
  userAnswers.forEach(ans => {
    if (String(answerMap[ans.questionId]) === String(ans.selectedOption)) {
      correctCount++;
    }
  });

  const totalQuestions = userAnswers.length;
  const score = correctCount; // 以答對題數作為分數
  const passed = score >= (threshold || 3);

  const sheetAns = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("回答");
  if (!sheetAns) throw new Error("找不到「回答」工作表");

  const dataAns = sheetAns.getDataRange().getValues();
  // 預設欄位：ID(0)、闖關次數(1)、總分(2)、最高分(3)、第一次通關分數(4)、花了幾次通關(5)、最近遊玩時間(6)
  
  let rowIndex = -1;
  for (let i = 1; i < dataAns.length; i++) {
    if (String(dataAns[i][0]) === String(id)) {
      rowIndex = i + 1; // GAS 列號從 1 開始
      break;
    }
  }

  const now = new Date();
  
  if (rowIndex > 0) {
    // 已存在的使用者
    const rowData = dataAns[rowIndex - 1];
    let playCount = Number(rowData[1]) || 0;
    let highestScore = Number(rowData[3]) || 0;
    let totalScore = Number(rowData[2]) || 0;
    let firstPassScore = rowData[4]; // 可能為空
    let triesToPass = rowData[5];    // 可能為空
    
    playCount++;
    if (score > highestScore) highestScore = score;
    totalScore += score;

    // 如果這次通關，且原本還沒通關過
    if (passed && (triesToPass === "" || triesToPass === undefined || triesToPass === null)) {
      sheetAns.getRange(rowIndex, 5).setValue(score);     // 第一次通關分數
      sheetAns.getRange(rowIndex, 6).setValue(playCount); // 花了幾次通關
    }

    sheetAns.getRange(rowIndex, 2).setValue(playCount); // 闖關次數
    sheetAns.getRange(rowIndex, 3).setValue(totalScore); // 總分
    sheetAns.getRange(rowIndex, 4).setValue(highestScore); // 最高分
    sheetAns.getRange(rowIndex, 7).setValue(now); // 最近遊玩時間

    return { score, correctCount, totalQuestions, highestScore, playCount, isNew: false };
  } else {
    // 新使用者
    sheetAns.appendRow([
      id,
      1, // 闖關次數
      score, // 總分
      score, // 最高分
      passed ? score : "", // 第一次通關分數
      passed ? 1 : "", // 花了幾次通關
      now // 最近遊玩時間
    ]);
    return { score, correctCount, totalQuestions, highestScore: score, playCount: 1, isNew: true };
  }
}
