/**
 * ========================================
 * GOOGLE APPS SCRIPT - WEDDING PLANNER FORM BACKEND
 * ========================================
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open Google Sheets and create a new spreadsheet named "Wedding Leads"
 * 2. In the first row, add these headers:
 *    Timestamp | Name | Phone | Event Date | Guest Count | Budget | Venue Location
 * 
 * 3. Go to Extensions > Apps Script
 * 4. Delete any existing code and paste this script
 * 5. Click "Deploy" > "New deployment"
 * 6. Select type: "Web app"
 * 7. Set "Execute as": Me
 * 8. Set "Who has access": Anyone
 * 9. Click "Deploy" and copy the Web App URL
 * 10. Paste that URL in script.js where it says 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'
 */

// ========================================
// MAIN FUNCTION - Handles POST requests from the website
// ========================================
function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Prepare the row data in the correct order matching your headers
    const rowData = [
      data.timestamp || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      data.name || '',
      data.phone || '',
      data.eventDate || '',
      data.guestCount || '',
      data.budget || '',
      data.venue || ''
    ];
    
    // Append the row to the sheet
    sheet.appendRow(rowData);
    
    // Optional: Format the last row for better readability
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1, 1, 7).setFontFamily('Lato');
    
    // Highlight premium budget leads with gold background
    if (data.budget === '₹10L+' || data.budget === '₹5L - ₹10L') {
      sheet.getRange(lastRow, 1, 1, 7).setBackground('#fff8dc');
    }
    
    // Optional: Send email notification to yourself
    sendEmailNotification(data);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'data': data }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Log error and return error response
    Logger.log('Error: ' + error.toString());
    
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ========================================
// EMAIL NOTIFICATION FUNCTION (Optional but recommended)
// ========================================
function sendEmailNotification(data) {
  try {
    // Replace with your email address
    const recipientEmail = 'Adl.weddings@gmail.com';
    
    // Determine priority based on budget
    let priority = 'Standard';
    if (data.budget === '₹10L+') {
      priority = '🌟 HIGH PRIORITY';
    } else if (data.budget === '₹5L - ₹10L') {
      priority = '⭐ MEDIUM PRIORITY';
    }
    
    // Email subject
    const subject = `${priority} - New Wedding Inquiry: ${data.name}`;
    
    // Email body with HTML formatting
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #d4af37, #c19b2e); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-family: 'Georgia', serif;">Dream Weddings</h1>
          <p style="color: white; margin: 10px 0 0 0;">New Lead Notification</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border: 1px solid #e0e0e0;">
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #d4af37; margin-top: 0;">Client Information</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;"><strong>Name:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">${data.name}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;"><strong>WhatsApp:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">
                  <a href="https://wa.me/91${data.phone}" style="color: #25d366;">${data.phone}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;"><strong>Event Date:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">${data.eventDate}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;"><strong>Guest Count:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">${data.guestCount}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;"><strong>Budget:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #e0e0e0;">
                  <span style="color: #d4af37; font-weight: bold;">${data.budget}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px;"><strong>Venue:</strong></td>
                <td style="padding: 10px;">${data.venue}</td>
              </tr>
            </table>
          </div>
          
          <div style="background: ${getPriorityColor(data.budget)}; padding: 15px; border-radius: 8px; text-align: center;">
            <p style="margin: 0; font-weight: bold; color: #333;">Priority Level: ${priority}</p>
          </div>
          
          <div style="margin-top: 20px; text-align: center;">
            <a href="https://wa.me/91${data.phone}" 
               style="display: inline-block; background: #25d366; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 25px; font-weight: bold;">
              Contact on WhatsApp
            </a>
          </div>
        </div>
        
        <div style="background: #333; padding: 20px; text-align: center;">
          <p style="color: #ccc; margin: 0; font-size: 12px;">
            This is an automated notification from Dream Weddings Lead System
          </p>
        </div>
      </div>
    `;
    
    // Plain text version (fallback)
    const plainBody = `
New Wedding Inquiry - ${priority}

Client Details:
Name: ${data.name}
WhatsApp: ${data.phone}
Event Date: ${data.eventDate}
Guest Count: ${data.guestCount}
Budget: ${data.budget}
Venue: ${data.venue}

Contact immediately: https://wa.me/91${data.phone}
    `;
    
    // Send the email
    MailApp.sendEmail({
      to: recipientEmail,
      subject: subject,
      body: plainBody,
      htmlBody: htmlBody
    });
    
    Logger.log('Email notification sent successfully');
    
  } catch (error) {
    Logger.log('Email notification error: ' + error.toString());
  }
}

// ========================================
// HELPER FUNCTION - Get color based on budget priority
// ========================================
function getPriorityColor(budget) {
  if (budget === '₹10L+') {
    return '#ffd700'; // Gold
  } else if (budget === '₹5L - ₹10L') {
    return '#ffe699'; // Light gold
  } else {
    return '#f0f0f0'; // Grey
  }
}

// ========================================
// TEST FUNCTION (Optional - for debugging)
// ========================================
function testFormSubmission() {
  const testData = {
    timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    name: 'Test Client',
    phone: '9876543210',
    eventDate: '2024-12-25',
    guestCount: '300-500',
    budget: '₹10L+',
    venue: 'Dimapur'
  };
  
  const testEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  doPost(testEvent);
  Logger.log('Test submission completed. Check your sheet and email.');
}

// ========================================
// AUTO-SORTING FUNCTION (Optional Enhancement)
// ========================================
function sortLeadsByPriority() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const lastRow = sheet.getLastRow();
  
  if (lastRow <= 1) return; // No data to sort
  
  // Sort by Budget column (column 6) in descending order
  // This will put ₹10L+ leads at the top
  const range = sheet.getRange(2, 1, lastRow - 1, 7);
  range.sort([
    {column: 6, ascending: false}, // Budget
    {column: 1, ascending: false}  // Timestamp
  ]);
  
  Logger.log('Leads sorted by priority');
}

// ========================================
// TRIGGER SETUP (Run this once to set up automatic sorting)
// ========================================
function setupTriggers() {
  // Delete existing triggers
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));
  
  // Create new trigger to sort leads every hour
  ScriptApp.newTrigger('sortLeadsByPriority')
    .timeBased()
    .everyHours(1)
    .create();
  
  Logger.log('Triggers set up successfully');
}