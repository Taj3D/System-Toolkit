/**
 * ============================================
 * GOOGLE APPS SCRIPT FOR SYSTEM TOOLKIT
 * Version: 5.0 - Error handling improved
 * ============================================
 */

// Configuration
const SPREADSHEET_ID = '1N4eRRA0NkL9MsKC_dyZQhFJEQrWuRVRD8vxOGK9kZiU';
const SHEET_NAME = 'Sheet1';

// Handle GET requests
function doGet(e) {
  try {
    var params = e && e.parameter ? e.parameter : {};
    
    // Test endpoint - no parameters
    if (!params.orderId) {
      return ContentService.createTextOutput(
        JSON.stringify({ 
          status: 'success', 
          message: 'System Toolkit Webhook v5 ready!',
          sheetId: SPREADSHEET_ID 
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Process order
    var data = {
      timestamp: params.timestamp || new Date().toISOString(),
      orderId: params.orderId || 'ORD-' + Date.now(),
      name: params.name || 'N/A',
      mobile: params.mobile || 'N/A',
      email: params.email || 'N/A',
      plan: params.plan || 'N/A',
      amount: params.amount || '0',
      status: params.status || 'pending'
    };
    
    return saveToSheet(data);
    
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ 
        status: 'error', 
        message: error.toString(),
        stack: error.stack
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle POST requests
function doPost(e) {
  try {
    var data = {};
    
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        data = { error: 'Parse error: ' + parseErr.toString() };
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }
    
    if (!data.orderId) {
      data.orderId = 'ORD-' + Date.now();
    }
    
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

// Save to Google Sheet
function saveToSheet(data) {
  try {
    // Open spreadsheet
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME);
    
    // Create sheet if doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }
    
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
      // Format header
      var headerRange = sheet.getRange(1, 1, 1, 8);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#10b981');
      headerRange.setFontColor('white');
    }
    
    // Append data row
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.orderId || 'N/A',
      data.name || 'N/A',
      data.mobile || 'N/A',
      data.email || 'N/A',
      data.plan || 'N/A',
      data.amount || '0',
      data.status || 'pending'
    ]);
    
    // Auto-resize columns
    try {
      sheet.autoResizeColumns(1, 8);
    } catch (resizeErr) {
      // Ignore resize errors
    }
    
    // Return success
    return ContentService.createTextOutput(
      JSON.stringify({ 
        status: 'success', 
        message: 'Order saved to Google Sheet!',
        orderId: data.orderId,
        sheetName: SHEET_NAME,
        row: sheet.getLastRow()
      })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ 
        status: 'error', 
        message: 'Sheet error: ' + error.toString(),
        sheetId: SPREADSHEET_ID,
        sheetName: SHEET_NAME
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function - run from Script Editor
function testOrder() {
  var mockEvent = {
    parameter: {
      orderId: 'TEST-' + Date.now(),
      name: 'Test from Editor',
      mobile: '01711999999',
      email: 'test@example.com',
      plan: 'বেসিক',
      amount: '299',
      status: 'pending'
    }
  };
  
  var result = doGet(mockEvent);
  Logger.log(result.getContent());
}

// Initialize sheet
function initSheet() {
  try {
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }
    
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp', 'Order ID', 'Name', 'Mobile', 'Email', 'Plan', 'Amount', 'Status'
      ]);
      sheet.getRange(1, 1, 1, 8)
        .setFontWeight('bold')
        .setBackground('#10b981')
        .setFontColor('white');
    }
    
    Logger.log('Sheet initialized: ' + SHEET_NAME);
    Logger.log('Rows: ' + sheet.getLastRow());
    
  } catch (error) {
    Logger.log('Init error: ' + error.toString());
  }
}
