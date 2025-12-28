// generate_salt_test_suite.js
// ---------------------------------------------
// 1.  npm install xlsx @faker-js/faker
// 2.  node generate_salt_test_suite.js
// 3.  grab the files from ./top20_complete_test_suite

const fs   = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const { faker } = require('@faker-js/faker');

const OUT_DIR = './top20_complete_test_suite';
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
const writeFile = (name, data) => {
  const p = path.join(OUT_DIR, name);
  fs.writeFileSync(p, data);
  const { size } = fs.statSync(p);
  console.log(`✅ ${name.padEnd(45)} ${(size/1024).toFixed(1).padStart(6)} KB`);
};

console.log('🚀 Generating Top-20 SALT Platform Test Suite\n');

// 1.  QuickBooks "Profit & Loss by State" – 14 GL codes
const qbComplex = `Profit & Loss by State
January 1, 2024 through December 31, 2024
Client: Advanced Manufacturing Solutions Inc.
Tax ID: 12-3456789
Fiscal Year: 2024

State,40000 - Product Sales,40100 - Service Revenue,40200 - Maintenance,40300 - Shipping,40400 - Installation,40500 - Training,40600 - Software,40700 - Consulting,40800 - Royalties,40900 - Returns,41000 - Discounts,41100 - Warranty,41200 - Other Income,41300 - Late Fees,Total
Alabama,"12,450.00","3,210.00","8,750.00","450.00","1,200.00","0.00","0.00","1,500.00","0.00","-250.00","-120.00","350.00","45.00","26,585.00"
Arizona,"45,780.00","12,340.00","15,670.00","1,230.00","3,450.00","2,100.00","8,900.00","4,500.00","-1,200.00","-450.00","-230.00","890.00","120.00","92,000.00"
California,"289,560.00","78,430.00","56,890.00","12,340.00","23,450.00","15,670.00","45,780.00","23,450.00","-12,340.00","-5,670.00","-2,340.00","12,340.00","2,340.00","540,000.00"
Colorado,"34,560.00","9,870.00","12,340.00","780.00","1,230.00","0.00","3,450.00","2,340.00","-450.00","-120.00","-45.00","670.00","45.00","64,680.00"
Florida,"156,780.00","45,670.00","34,560.00","4,560.00","9,870.00","5,430.00","12,340.00","8,900.00","-3,450.00","-1,230.00","-560.00","3,450.00","560.00","275,900.00"
Georgia,"67,890.00","23,450.00","15,670.00","2,340.00","4,560.00","1,230.00","9,870.00","5,430.00","-890.00","-340.00","-120.00","1,230.00","120.00","129,550.00"
Illinois,"134,560.00","34,560.00","23,450.00","3,450.00","7,890.00","3,450.00","15,670.00","9,870.00","-2,340.00","-890.00","-340.00","2,340.00","340.00","232,520.00"
Massachusetts,"45,670.00","12,340.00","9,870.00","1,230.00","2,340.00","0.00","4,560.00","3,450.00","-670.00","-230.00","-90.00","890.00","90.00","78,950.00"
New York,"201,230.00","56,890.00","45,670.00","7,890.00","15,670.00","9,870.00","23,450.00","15,670.00","-4,560.00","-1,670.00","-670.00","4,560.00","670.00","373,800.00"
Texas,"312,340.00","78,430.00","67,890.00","9,870.00","23,450.00","12,340.00","34,560.00","23,450.00","-7,890.00","-2,890.00","-1,230.00","7,890.00","1,230.00","558,980.00"
Washington,"89,470.00","23,450.00","15,670.00","2,340.00","5,430.00","2,100.00","9,870.00","6,780.00","-1,230.00","-450.00","-180.00","2,340.00","180.00","154,770.00"
Total,"1,400,290.00","380,050.00","306,430.00","47,490.00","99,540.00","50,190.00","168,460.00","105,790.00","-35,030.00","-13,290.00","-5,915.00","38,550.00","5,915.00","2,452,450.00"
`;
writeFile('01_QB_PL_Complex_Client.csv', qbComplex);

// 2.  NetSuite Saved Search – mis-labeled columns
const netsuite = `Transaction Search Results
Date Range: 01/01/2024 to 12/31/2024
Search: "Revenue by Ship-to Location"
Columns: Date, Document No, Customer, Ship-to, Item, Qty, Amount, Tax Code, Subsidiary

Transaction Date,Doc Number,Customer Name,Ship Location,Item/Service,Quantity,Amount,Currency,Tax Code,Subsidiary,Department
01/15/2024,INV-10045,Acme Corporation,California,Tech Widget Pro,10,"12,500.00",USD,CA-STANDARD,West Operations,Sales
02/03/2024,INV-10089,Global Industries Inc,Texas,Annual Service Contract,1,"8,750.00",USD,TX-STANDARD,West Operations,Service
03/22/2024,INV-10123,Retail Chain LLC,Florida,Installation Package,5,"23,450.00",USD,FL-STANDARD,South Operations,Install
04/10/2024,INV-10167,Midwest Distributors,Illinois,Tech Widget Standard,25,"31,250.00",USD,IL-STANDARD,Midwest Operations,Sales
05/05/2024,INV-10201,West Coast Services,California,Annual Maintenance,12,"56,890.00",USD,CA-STANDARD,West Operations,Service
06/18/2024,INV-10245,Southern Retailers Inc,Georgia,On-site Training,8,"15,670.00",USD,GA-STANDARD,South Operations,Training
07/09/2024,INV-10289,Northeast Partners,New York,Premium Support Plan,3,"34,560.00",USD,NY-STANDARD,NE Operations,Service
08/24/2024,INV-10323,Texas Manufacturing,Texas,Custom Software License,1,"67,890.00",USD,TX-EXEMPT,West Operations,Software
09/12/2024,INV-10367,Florida Services Group,Florida,Consulting Hours,40,"45,670.00",USD,FL-STANDARD,South Operations,Consulting
10/30/2024,INV-10401,Mountain States LLC,Colorado,Basic Widget Package,100,"12,340.00",USD,CO-STANDARD,West Operations,Sales
11/15/2024,INV-10445,Pacific Northwest Corp,Washington,Advanced Training,6,"23,450.00",USD,WA-STANDARD,West Operations,Training
12/03/2024,INV-10489,Desert Industries,Arizona,Remote Support,15,"9,870.00",USD,AZ-STANDARD,West Operations,Service
12/15/2024,CM-10523,Acme Corporation,California,Credit Memo (Return),-2,"-2,500.00",USD,CA-STANDARD,West Operations,Sales
12/20/2024,INV-10567,Global Industries Inc,Texas,Rush Service,1,"1,250.00",USD,TX-STANDARD,West Operations,Service
`;
writeFile('02_NetSuite_Ship_Location_Mislabeled.csv', netsuite);

// 3.  All 50 states – mixed formats
const all50 = `State,Revenue
AL,125000
Alaska,89000
AZ,156000
Arkansas,67000
CA,285000
Colorado,123000
CT,98000
Delaware,45000
Florida,145000
GA,172000
Hawaii,34000
ID,56000
Illinois,205000
Indiana,112000
IA,78000
Kansas,67000
KY,89000
Louisiana,101000
ME,34000
Maryland,156000
Massachusetts,89000
MI,178000
Minnesota,134000
MS,56000
Missouri,123000
MT,45000
Nebraska,67000
NV,112000
New Hampshire,78000
NJ,201000
New Mexico,89000
NY,189000
North Carolina,156000
ND,34000
Ohio,234000
OK,101000
Oregon,123000
PA,178000
Rhode Island,45000
SC,89000
South Dakota,34000
TN,112000
Texas,310000
UT,78000
Vermont,45000
VA,201000
Washington,123000
WV,56000
Wisconsin,134000
WY,34000`;
writeFile('03_All_50_States_Mixed.csv', all50);

// 4.  Currency format variations
const currency = `State,Revenue,Format
CA,"$285,000.00","Standard with $ and commas"
TX,"310000.00","No currency symbol"
FL,"145,000","No decimal"
IL,"205000","No commas or decimal"
GA,"172K","K abbreviation"
NY,"$189.5K","Decimal K with $"
WA,"123,000.00 USD","Currency suffix"
MA,"89000.0000","Four decimals"
CO,"156,000.00","Standard two decimals"
AZ,"$134,000.000","Three decimals with $" `;
writeFile('04_Currency_Format_Variations.csv', currency);

// 5.  Negative numbers & adjustments
const negatives = `State,Month,Gross_Revenue,Returns,Discounts,Adjustments,Net_Revenue
CA,Jan,25000,0,-500,0,24500
CA,Feb,30000,-2500,-1000,-500,26000
CA,Mar,35000,0,-750,0,34250
TX,Jan,40000,0,-1000,0,39000
TX,Feb,45000,-5000,-1500,-1000,37500
TX,Mar,50000,0,-2000,0,48000
FL,Jan,15000,-1000,-500,0,13500
FL,Feb,12000,0,-300,3000,14700
FL,Mar,18000,-1500,-600,0,15900
IL,Jan,20000,0,-800,0,19200
IL,Feb,22000,-3000,-1000,-500,17500
IL,Mar,24000,0,-1200,0,22800
GA,Jan,16000,-500,-400,0,15100
GA,Feb,17000,0,-600,1000,17400
GA,Mar,19000,-1000,-500,0,17500`;
writeFile('05_Negative_Numbers_Adjustments.csv', negatives);

// 6.  Multi-channel marketplace
const marketplace = `State,Direct_Sales,Amazon_Sales,Shopify_Sales,Walmart_Marketplace,Ebay_Sales,Google_Shopping,Social_Media,Affiliate,Total
CA,150000,85000,50000,25000,15000,10000,5000,5000,345000
TX,180000,90000,40000,30000,12000,8000,4000,3000,361000
FL,80000,40000,25000,15000,8000,5000,2000,2000,177000
IL,120000,60000,25000,20000,10000,6000,3000,2000,246000
GA,100000,50000,22000,18000,9000,5000,2500,1500,202000
NY,140000,70000,35000,25000,12000,8000,4000,3000,296000
WA,90000,45000,20000,15000,8000,5000,2500,1500,186000
MA,60000,30000,15000,10000,5000,3000,1500,1000,126500
CO,75000,35000,18000,12000,6000,4000,2000,1000,152000
AZ,65000,30000,15000,10000,5000,3000,1500,1000,131600`;
writeFile('06_Multi_Channel_Marketplace.csv', marketplace);

// 7.  Digital products & services
const digital = `State,SaaS_Subscriptions,Digital_Downloads,Online_Courses,Cloud_Storage,API_Calls,Virtual_Services,Licensing,Total_Digital
CA,120000,45000,35000,25000,20000,15000,10000,270000
TX,110000,40000,30000,22000,18000,12000,8000,240000
FL,60000,25000,20000,15000,12000,8000,5000,145000
IL,80000,35000,25000,20000,15000,10000,6000,191000
GA,70000,30000,22000,18000,14000,9000,5000,168000
NY,90000,40000,30000,25000,20000,15000,10000,230000
WA,75000,35000,25000,20000,15000,10000,6000,176000
MA,50000,20000,15000,12000,10000,7000,4000,118000
CO,55000,25000,18000,15000,12000,8000,4000,137000
AZ,48000,22000,15000,12000,10000,6000,3000,122000`;
writeFile('07_Digital_Products_Services.csv', digital);

// 8.  Employee classification – remote work
const employees = `Employee_ID,Full_Name,Work_State,Home_State,Employee_Type,Status,Start_Date,End_Date,Department,Role,Hours_2024,W2_Box1,Activities,Nexus_Notes
EMP-1001,John A. Smith,CA,CA,W-2,Active,2020-03-15,,Engineering,Senior Developer,2080,125000,"Development, Code Reviews","CA HQ - Creates nexus"
EMP-1002,Maria L. Garcia,TX,TX,W-2,Active,2019-08-22,,Sales,Account Executive,2080,110000,"Client Meetings, Demos","TX office - Creates nexus"
EMP-1003,Robert Chen,FL,FL,W-2,Active,2021-01-10,,Support,Support Engineer,2080,95000,"Troubleshooting, Training","Remote FL - Creates nexus"
EMP-2001,Consulting Group LLC,NY,NY,1099,Active,2023-02-01,,Marketing,Strategy Consultant,500,75000,"Marketing Strategy","1099 contractor - Evaluate nexus"
EMP-2002,Tech Support Co.,GA,GA,1099,Active,2022-08-15,,IT,Remote Support,1200,60000,"Support, Maintenance","1099 - May create nexus"
EMP-3001,Jane K. Wilson,CO,CO,W-2,Active,2023-11-30,,Admin,Executive Assistant,1040,65000,"Scheduling, Admin","Part-time remote - Check nexus"
EMP-3002,Mike Johnson,AZ,AZ,W-2,Terminated,2022-04-05,2024-08-15,Customer Service,Service Rep,900,55000,"Customer Support","Terminated mid-year"
EMP-4001,Design Studio Inc.,WA,WA,1099,Active,2024-01-10,,Design,UX Designer,300,45000,"UI/UX Design","1099 contractor"
EMP-5001,Sarah Williams,IL,IL,W-2,Leave of Absence,2021-06-18,2024-12-31,Operations,Manager,1560,105000,"Process Improvement","On leave - Nexus may remain"
EMP-6001,David Miller,MA,MA,W-2,Active,2020-11-05,,Finance,Controller,2080,135000,"Accounting, Reporting","Remote MA - Creates nexus"`;
writeFile('08_Employee_Classification_Remote.csv', employees);

// 9.  Intercompany complex transactions
const interco = `Transaction_ID,Date,From_Entity,From_State,To_Entity,To_State,Type,Description,Amount,GL_Account,Elimination_Required,Consolidated_Treatment
ICT-001,2024-01-15,Mfg Corp - CA,CA,Tech Solutions - TX,TX,Product Sale,"Widget shipment",125000,40000,Yes,Eliminate
ICT-002,2024-02-01,Mfg Corp - CA,CA,Tech Solutions - TX,TX,Management Fee,"Quarterly management",25000,40100,Yes,Eliminate
ICT-003,2024-03-10,Tech Solutions - TX,TX,Sales LLC - FL,FL,License,"Software license",75000,40600,Yes,Eliminate
ICT-004,2024-04-05,Sales LLC - FL,FL,Mfg Corp - CA,CA,Royalty,"IP royalty",15000,40300,Yes,Eliminate
ICT-005,2024-05-20,Holdings - DE,DE,Mfg Corp - CA,CA,Allocation,"Corporate overhead",50000,49900,No,Consolidate
ICT-006,2024-06-15,Holdings - DE,DE,Tech Solutions - TX,TX,Allocation,"Corporate overhead",30000,49900,No,Consolidate
ICT-007,2024-07-10,EU Parent - NL,NL,Holdings - DE,DE,Funding,"Equity injection",200000,30000,No,Consolidate
ICT-008,2024-08-05,Mfg Corp - CA,CA,Asia Subsidiary - SG,SG,Technology,"Tech transfer",85000,40500,Yes,Eliminate
ICT-009,2024-09-12,Tech Solutions - TX,TX,Canada Branch - ON,ON,Service,"Support services",45000,40100,Yes,Eliminate
ICT-010,2024-10-18,Sales LLC - FL,FL,Mexico JV - MX,MX,Commission,"Sales commission",32000,40200,Yes,Eliminate
ICT-011,2024-11-22,Mfg Corp - CA,CA,R&D Subsidiary - MA,MA,R&D Charge,"Research funding",68000,40700,Yes,Capitalize
ICT-012,2024-12-15,All Entities,MULTI,Holdings - DE,DE,Year-End,"True-up adjustment",-15000,49900,Yes,Eliminate`;
writeFile('09_Intercompany_Complex_Transactions.csv', interco);

// 10.  Borderline threshold cases
const thresholds = `State,Type,Threshold,Actual,Percentage,Days_Over,Status,Risk_Level,Action_Required
CA,Sales Tax,500000,495000,99.0%,0,Below Threshold,Low,Monitor
CA,Sales Tax,500000,502000,100.4%,92,Above Threshold,High,Register
TX,Sales Tax,500000,498500,99.7%,0,Below Threshold,Medium,Monitor closely
TX,Income Tax,500000,512000,102.4%,180,Above Threshold,High,File return
FL,Sales Tax,100000,99000,99.0%,0,Below Threshold,Low,Monitor
FL,Sales Tax,100000,101000,101.0%,45,Above Threshold,Medium,Register
NY,Sales Tax,300000,295000,98.3%,0,Below Threshold,Low,Monitor
NY,Economic Nexus,300000,302500,100.8%,120,Above Threshold,High,Register
WA,B&O Tax,285000,284999,99.9996%,0,Below Threshold,Low,Verify calculation
WA,B&O Tax,285000,285001,100.0004%,1,Above Threshold,High,File immediately
CO,Sales Tax,100000,99999,99.999%,0,Below Threshold,Medium,Review transactions
MA,Sales Tax,100000,100001,100.001%,1,Above Threshold,High,Register
IL,Income Tax,100000,99000,99.0%,0,Below Threshold,Low,Monitor
IL,Income Tax,100000,101000,101.0%,30,Above Threshold,High,File
GA,Sales Tax,100000,99950,99.95%,0,Below Threshold,Medium,Review Q4
GA,Sales Tax,100000,100050,100.05%,15,Above Threshold,High,Register`;
writeFile('10_Borderline_Threshold_Cases.csv', thresholds);

// 11.  PL 86-272 analysis
const pl86 = `State,Activity_Type,Employee_Count,Sales_Revenue,Solicitation_Only,Protected_Activities,Unprotected_Activities,Risk_Assessment,Nexus_Created
CA,In-state sales rep,2,285000,No,"Sales meetings, order taking","Installation, training, repairs",High,Yes
TX,Remote employees only,0,310000,Yes,"Phone solicitation, email","None",Low,No (Protected)
FL,Contractor on-site,1,145000,No,"Solicitation","Installation, maintenance",Medium,Yes
IL,Trade show attendance,0,205000,Yes,"Display at trade show","Taking orders on-site",Medium,Maybe
GA,Website only,0,172000,Yes,"Online advertising","None",Low,No (Protected)
NY,Office with inventory,5,189000,No,"Sales office","Inventory storage, shipping",High,Yes
WA,Remote tech support,3,123000,No,"Phone support","Remote troubleshooting",Medium,Yes
MA,Independent reps,0,89000,Yes,"Commissioned sales","No physical presence",Low,No (Protected)
CO,Warehouse,2,156000,No,"Sales office","Inventory, fulfillment",High,Yes
AZ,Service technicians,4,134000,No,"Solicitation","Repairs, maintenance",High,Yes`;
writeFile('11_PL86_272_Analysis.csv', pl86);

// 12.  Very large file (100 K rows – quick to generate)
console.log('⏳ Creating 100 K row stress-test file…');
const largePath = path.join(OUT_DIR, '12_Very_Large_File_100K.csv');
const largeStream = fs.createWriteStream(largePath);
largeStream.write('Date,Invoice,Customer,State,Product,Qty,UnitPrice,Total\n');
const states = ['CA','TX','FL','IL','GA','NY','WA','MA','CO','AZ'];
const products = ['Widget Pro','Enterprise Suite','Basic Widget','Premium Support','Installation','Training','Maintenance','Consulting'];
for (let i=1;i<=100000;i++){
  const s = states[i%10];
  const line = `${faker.date.between({from: '2024-01-01', to: '2024-12-31'}).toISOString().slice(0,10)},INV-${String(i).padStart(6,'0')},Customer ${i%500},${s},${products[i%8]},${faker.number.int({min:1,max:50})},${faker.number.int({min:50,max:1000})},${faker.number.int({min:1000,max:50000})}\n`;
  largeStream.write(line);
}
largeStream.end();
console.log('✅ 12_Very_Large_File_100K.csv   (LARGE)');

// 13.  Corrupted / malformed files
writeFile('13_Corrupted_File.csv','����\nState,Revenue\nCA,285\nTX,310\n�FL,145\nIL,205\nEOF\x00\x00\x00');
writeFile('14_Malformed_CSV.csv','State;Revenue;Date\nCA;285000;2024-01-01\nTX;310000;2024-02-01\nFL|145000|2024-03-01\nIL,205000,2024-04-01\nGA 172000 2024-05-01');

// 14.  Multi-sheet Excel workbook
(()=>{
  const wb = xlsx.utils.book_new();
  const rev24 = [
    ['Advanced Manufacturing Solutions Inc.','','','','',''],
    ['REVENUE REPORT - 2024','','','','',''],
    ['State','Q1','Q2','Q3','Q4','Total'],
    ['CA',65000,70000,75000,75000,285000],
    ['TX',70000,80000,80000,80000,310000],
    ['FL',35000,35000,35000,40000,145000],
    ['IL',50000,50000,52000,53000,205000],
    ['GA',40000,42000,44000,46000,172000],
    ['NY',45000,47000,48000,49000,189000],
    ['WA',30000,31000,31000,31000,123000],
    ['Total',335000,355000,365000,374000,1429000]
  ];
  const ws1 = xlsx.utils.aoa_to_sheet(rev24);
  xlsx.utils.book_append_sheet(wb,ws1,'2024 Revenue');

  const emp = [
    ['Employee Locations (Remote)'],
    ['Employee ID','Name','Work State','Department'],
    ['E1001','Sarah Johnson','CA','Engineering'],
    ['E1002','Michael Chen','TX','Sales'],
    ['E1003','Jessica Williams','FL','Support'],
    ['E1004','David Miller','NY','Marketing'],
    ['E1005','Emily Davis','WA','Product'],
    ['E1006','Robert Garcia','IL','Operations'],
    ['E1007','Jennifer Lee','GA','Finance'],
    ['E1008','Thomas Brown','CO','Engineering']
  ];
  const ws2 = xlsx.utils.aoa_to_sheet(emp);
  xlsx.utils.book_append_sheet(wb,ws2,'Employee Locations');

  xlsx.writeFile(wb, path.join(OUT_DIR,'15_Excel_Multi_Sheet.xlsx'));
  console.log('✅ 15_Excel_Multi_Sheet.xlsx');
})();

// 15.  JSON API response
const api = {
  status:"success",
  generated:"2024-12-31T23:59:59Z",
  revenue_by_state:[
    {state:"CA",revenue:285000,transactions:145},
    {state:"TX",revenue:310000,transactions:189},
    {state:"FL",revenue:145000,transactions:92},
    {state:"IL",revenue:205000,transactions:123},
    {state:"GA",revenue:172000,transactions:105}
  ]
};
writeFile('16_API_Response.json', JSON.stringify(api,null,2));

// 16.  XML export
const xml = `<?xml version="1.0"?>
<RevenueReport>
  <Header><Client>Advanced Manufacturing</Client><Date>2024-12-31</Date></Header>
  <States>
    <State><Code>CA</Code><Revenue>285000</Revenue></State>
    <State><Code>TX</Code><Revenue>310000</Revenue></State>
    <State><Code>FL</Code><Revenue>145000</Revenue></State>
  </States>
</RevenueReport>`;
writeFile('17_XML_Export.xml', xml);

// 17.  Audit trail
const audit = `Timestamp,User,Action,Entity,Field,Old_Value,New_Value,Reason
2024-12-31 09:15:23,jsmith@firm.com,UPDATE,Client-001,State Revenue,284500,285000,Q4 adjustment logged
2024-12-31 10:30:12,partner@firm.com,APPROVE,Nexus Memo,CA-2024-001,Pending,Approved,Partner review completed
2024-12-31 14:20:18,jsmith@firm.com,CORRECT,Client-001,TX Revenue,309000,310000,Found missing invoice
2024-12-31 23:59:59,system,BACKUP,Database,null,null,Automated nightly backup`;
writeFile('18_Audit_Trail.csv', audit);

// 18.  README
const readme = `# Top-20 SALT Platform Test Suite

This folder contains 18 realistic files covering every edge case a Top-20 firm encounters:

1. QuickBooks 14-GL export
2. NetSuite "Ship Location" column
3. All 50 states – mixed formats
4. Currency & number formats
5. Negative numbers & adjustments
6. Multi-channel marketplace
7. Digital products & services
8. Remote employee nexus
9. Intercompany transactions
10. Borderline thresholds
11. PL 86-272 analysis
12. 100 K row stress test
13. Corrupted file
14. Malformed CSV
15. Multi-sheet Excel
16. JSON API response
17. XML export
18. Audit trail

Use these to validate ingestion, AI cleaning, error handling, and professional-judgment flags.

Generated: ${new Date().toISOString()}
`;
writeFile('README.md', readme);

console.log('\n📂 All files created in ./top20_complete_test_suite – grab the folder and test away!');

