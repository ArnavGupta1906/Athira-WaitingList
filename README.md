
npm install
```

### 2. Configure Google Sheets Integration

**Step 1: Create Google Sheet**
1. Create a new Google Sheet called "Athira Waitlist"
2. Add these headers in row 1:
   - A1: First Name
   - B1: Last Name  
   - C1: Email
   - D1: Description
   - E1: Timestamp

**Step 2: Set up Google Apps Script**
1. Open [Google Apps Script](https://script.google.com)
2. Create a new project
3. Copy the code from `google-apps-script-example.js` into the script editor
4. Update the `SPREADSHEET_ID` with your Google Sheet ID
5. Deploy as a web app:
   - Execute as: Me
   - Who has access: Anyone
6. Copy the web app URL

**Step 3: Update React App Configuration**
1. Open `src/config/googleAppsScript.js`
2. Replace `YOUR_SCRIPT_ID_HERE` with your actual Google Apps Script web app URL

### 3. Run the Application
```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000).

## Pages

### Landing Page (/)
- Hero section with Athira branding
- Feature highlights
- Call-to-action button leading to registration

### Registration Form (/register)
- **First Name** (required)
- **Last Name** (required) 
- **Email Address** (required, validated)
- **Tell us about your learning** (optional text area)
- Form validation with inline error messages
- Success message after submission

## Form Validation

- All required fields must be filled
- Email must be in valid format
- Inline error messages appear for validation failures
- Form prevents submission until all validations pass

## Data Storage

Form submissions are saved directly to Google Sheets via Google Apps Script. Each submission creates a new row with:
- First Name
- Last Name  
- Email Address
- Learning Description (optional)
- Timestamp

The Google Apps Script handles validation, error handling, and provides JSON responses back to the React application.

## Deployment

1. Build the project: `npm run build`
2. Deploy the `build` folder to your hosting platform
3. Ensure your Google Apps Script web app is deployed and accessible

## Customization

The design uses a modern gradient theme with blue and indigo colors. You can customize:

- Colors in `tailwind.config.js`
- Component styling in the respective component files
- Branding elements like logo and company name

## Browser Support

Modern browsers supporting ES6+ and CSS Grid/Flexbox.# Email configuration updated
