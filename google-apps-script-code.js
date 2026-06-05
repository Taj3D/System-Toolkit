/**
 * ============================================
 * GOOGLE APPS SCRIPT FOR SYSTEM TOOLKIT
 * ============================================
 * 
 * এই কোডটি Google Apps Script এ পেস্ট করুন
 * 
 * ধাপ ১: https://script.google.com যান
 * ধাপ ২: "New Project" ক্লিক করুন
 * ধাপ ৩: নিচের সম্পূর্ণ কোড কপি করে পেস্ট করুন
 * ধাপ ৪: "Save" করুন (Ctrl+S)
 * ধাপ ৫: "Deploy" > "New deployment" ক্লিক করুন
 * ধাপ ৬: Type: "Web app" সিলেক্ট করুন
 * ধাপ ৭: Execute as: "Me", Who has access: "Anyone"
 * ধাপ ৮: "Deploy" ক্লিক করুন এবং URL কপি করুন
 * 
 * ============================================
 */

// Google Sheet ID - আপনার Google Sheet ID দিন
const SPREADSHEET_ID = '1N4eRRA0NkL9MsKC_dyZQhFJEQrWuRVRD8vxOGK9kZiU';
const SHEET_NAME = 'Sheet1'; // অথবা আপনার শীটের নাম

// doGet - Webhook URL টেস্ট করার জন্য
function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({
      status: 'success',
      message: 'System Toolkit Webhook is working!',
      timestamp: new Date().toISOString()
    })
  ).setMimeType(ContentService.MimeType.JSON);
}

// doPost - অর্ডার ডেটা গ্রহণ করার জন্য
function doPost(e) {
  try {
    // Request body parse করুন
    let data;
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter && e.parameter.data) {
      data = JSON.parse(e.parameter.data);
    } else {
      // Fallback - query parameters
      data = e.parameter;
    }
    
    console.log('Received data:', data);
    
    // Google Sheet খুলুন
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      // যদি শীট না পায়, নতুন শীট তৈরি করুন
      const newSheet = ss.insertSheet(SHEET_NAME);
      // Headers যোগ করুন
      newSheet.appendRow([
        'Timestamp',
        'Order ID',
        'Name',
        'Mobile',
        'Email',
        'Plan',
        'Amount',
        'Status'
      ]);
      // Format headers
      newSheet.getRange(1, 1, 1, 8).setFontWeight('bold').setBackground('#4CAF50').setFontColor('white');
    }
    
    const targetSheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    
    // Headers আছে কিনা চেক করুন
    const lastRow = targetSheet.getLastRow();
    if (lastRow === 0) {
      targetSheet.appendRow([
        'Timestamp',
        'Order ID',
        'Name',
        'Mobile',
        'Email',
        'Plan',
        'Amount',
        'Status'
      ]);
      targetSheet.getRange(1, 1, 1, 8).setFontWeight('bold').setBackground('#4CAF50').setFontColor('white');
    }
    
    // ডেটা যোগ করুন
    targetSheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.orderId || 'N/A',
      data.name || 'N/A',
      data.mobile || 'N/A',
      data.email || 'N/A',
      data.plan || 'N/A',
      data.amount || 0,
      data.status || 'pending'
    ]);
    
    // Auto-resize columns
    targetSheet.autoResizeColumns(1, 8);
    
    console.log('Data saved to Google Sheet successfully');
    
    return ContentService.createTextOutput(
      JSON.stringify({
        status: 'success',
        message: 'Order saved to Google Sheet',
        orderId: data.orderId,
        timestamp: new Date().toISOString()
      })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('Error processing request:', error);
    
    return ContentService.createTextOutput(
      JSON.stringify({
        status: 'error',
        message: error.toString(),
        timestamp: new Date().toISOString()
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function - সরাসরি run করে টেস্ট করুন
function testAddOrder() {
  const testData = {
    timestamp: new Date().toISOString(),
    orderId: 'TEST-' + Date.now(),
    name: 'Test User',
    mobile: '01711999999',
    email: 'test@example.com',
    plan: 'বেসিক',
    amount: 299,
    status: 'pending'
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  console.log(result.getContent());
}

// Initialize sheet with headers
function initSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  
  // Clear existing data (optional)
  // sheet.clear();
  
  // Add headers if sheet is empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Timestamp',
      'Order ID',
      'Name',
      'Mobile',
      'Email',
      'Plan',
      'Amount',
      'Status'
    ]);
    sheet.getRange(1, 1, 1, 8)
      .setFontWeight('bold')
      .setBackground('#4CAF50')
      .setFontColor('white')
      .setHorizontalAlignment('center');
  }
  
  console.log('Sheet initialized successfully!');
}
