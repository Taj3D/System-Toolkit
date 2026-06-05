/**
 * ============================================
 * GOOGLE APPS SCRIPT FOR SYSTEM TOOLKIT
 * Updated: Individual query parameters support
 * ============================================
 * 
 * এই কোডটি আপনার Google Apps Script এ পেস্ট করুন
 * 
 * ============================================
 */

// Google Sheet ID
const SPREADSHEET_ID = '1N4eRRA0NkL9MsKC_dyZQhFJEQrWuRVRD8vxOGK9kZiU';
const SHEET_NAME = 'Sheet1';

// ===== HANDLE GET REQUESTS =====
function doGet(e) {
  try {
    const params = e.parameter;
    
    // Check if this is an addOrder action
    if (params.action === 'addOrder' || params.orderId) {
      const data = {
        timestamp: params.timestamp || new Date().toISOString(),
        orderId: params.orderId || 'ORD-' + Date.now(),
        name: params.name || 'N/A',
        mobile: params.mobile || 'N/A',
        email: params.email || 'N/A',
        plan: params.plan || 'N/A',
        amount: params.amount || 0,
        status: params.status || 'pending'
      };
      
      return saveToSheet(data);
    }
    
    // Test endpoint - no parameters
    return ContentService.createTextOutput(
      JSON.stringify({
        status: 'success',
        message: 'System Toolkit Webhook is ready!',
        timestamp: new Date().toISOString(),
        sheetId: SPREADSHEET_ID
      })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({
        status: 'error',
        message: error.toString(),
        timestamp: new Date().toISOString()
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// ===== HANDLE POST REQUESTS =====
function doPost(e) {
  try {
    const params = e.parameter;
    let data;
    
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (parseError) {
        data = params;
      }
    } else {
      data = params;
    }
    
    // Normalize data
    data = {
      timestamp: data.timestamp || new Date().toISOString(),
      orderId: data.orderId || 'ORD-' + Date.now(),
      name: data.name || 'N/A',
      mobile: data.mobile || 'N/A',
      email: data.email || 'N/A',
      plan: data.plan || 'N/A',
      amount: data.amount || 0,
      status: data.status || 'pending'
    };
    
    return saveToSheet(data);
    
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({
        status: 'error',
        message: error.toString()
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// ===== SAVE TO SHEET =====
function saveToSheet(data) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    // Create sheet if doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }
    
    // Add headers if empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp',
        'Order ID', 
        'Name',
        'Mobile',
        'Email',
        'Plan',
        'Amount (৳)',
        'Status'
      ]);
      sheet.getRange(1, 1, 1, 8)
        .setFontWeight('bold')
        .setBackground('#10b981')
        .setFontColor('white')
        .setHorizontalAlignment('center')
        .setFrozen(true);
    }
    
    // Append order data
    sheet.appendRow([
      data.timestamp,
      data.orderId,
      data.name,
      data.mobile,
      data.email,
      data.plan,
      data.amount,
      data.status
    ]);
    
    // Auto-resize
    sheet.autoResizeColumns(1, 8);
    
    console.log('✅ Order saved:', data.orderId);
    
    return ContentService.createTextOutput(
      JSON.stringify({
        status: 'success',
        message: 'Order saved to Google Sheet',
        orderId: data.orderId,
        timestamp: new Date().toISOString()
      })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('❌ Error:', error);
    return ContentService.createTextOutput(
      JSON.stringify({
        status: 'error',
        message: 'Failed to save: ' + error.toString()
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// ===== TEST FUNCTION =====
function testOrder() {
  const mockEvent = {
    parameter: {
      action: 'addOrder',
      orderId: 'TEST-' + Date.now(),
      name: 'Test from Script Editor',
      mobile: '01711999999',
      email: 'test@example.com',
      plan: 'বেসিক',
      amount: '299',
      status: 'pending'
    }
  };
  
  const result = doGet(mockEvent);
  console.log(result.getContent());
}

// ===== INIT SHEET =====
function initSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Timestamp', 'Order ID', 'Name', 'Mobile', 'Email', 'Plan', 'Amount (৳)', 'Status'
    ]);
    sheet.getRange(1, 1, 1, 8)
      .setFontWeight('bold')
      .setBackground('#10b981')
      .setFontColor('white');
  }
  
  console.log('Sheet initialized!');
}
