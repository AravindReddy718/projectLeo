// Backend/startup.js - Pre-flight Checks and Startup
const fs = require('fs');
const path = require('path');

console.log('\n🚀 HMC Backend Startup Checks\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

let allChecksPass = true;

// Check 1: Node.js Version
console.log('1️⃣  Checking Node.js version...');
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
if (majorVersion >= 14) {
  console.log(`   ✅ Node.js ${nodeVersion} (OK)\n`);
} else {
  console.log(`   ❌ Node.js ${nodeVersion} (Need v14 or higher)\n`);
  allChecksPass = false;
}

// Check 2: Environment Variables
console.log('2️⃣  Checking environment variables...');
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('   ✅ .env file found\n');
  
  // Load and check critical variables
  require('dotenv').config();
  
  const criticalVars = ['MONGODB_URI', 'JWT_SECRET', 'PORT'];
  let envVarsOk = true;
  
  criticalVars.forEach(varName => {
    if (process.env[varName]) {
      console.log(`   ✅ ${varName} is set`);
    } else {
      console.log(`   ❌ ${varName} is missing`);
      envVarsOk = false;
      allChecksPass = false;
    }
  });
  console.log();
  
  if (!envVarsOk) {
    console.log('   ⚠️  Some environment variables are missing!');
    console.log('   Please check your .env file.\n');
  }
} else {
  console.log('   ❌ .env file not found');
  console.log('   Create a .env file with required variables.\n');
  allChecksPass = false;
}

// Check 3: Dependencies
console.log('3️⃣  Checking dependencies...');
const packageJsonPath = path.join(__dirname, 'package.json');
const nodeModulesPath = path.join(__dirname, 'node_modules');

if (fs.existsSync(packageJsonPath) && fs.existsSync(nodeModulesPath)) {
  console.log('   ✅ Dependencies installed\n');
} else {
  console.log('   ❌ Dependencies not installed');
  console.log('   Run: npm install\n');
  allChecksPass = false;
}

// Check 4: Models
console.log('4️⃣  Checking models...');
const modelsPath = path.join(__dirname, 'models');
const requiredModels = ['User.js', 'Student.js', 'Complaint.js', 'Payment.js'];
let modelsOk = true;

requiredModels.forEach(model => {
  const modelPath = path.join(modelsPath, model);
  if (fs.existsSync(modelPath)) {
    console.log(`   ✅ ${model} found`);
  } else {
    console.log(`   ❌ ${model} missing`);
    modelsOk = false;
    allChecksPass = false;
  }
});
console.log();

// Check 5: Routes
console.log('5️⃣  Checking routes...');
const routesPath = path.join(__dirname, 'routes');
const requiredRoutes = ['auth.js', 'students.js', 'complaints.js', 'payments.js', 'dashboard.js'];
let routesOk = true;

requiredRoutes.forEach(route => {
  const routePath = path.join(routesPath, route);
  if (fs.existsSync(routePath)) {
    console.log(`   ✅ ${route} found`);
  } else {
    console.log(`   ❌ ${route} missing`);
    routesOk = false;
    allChecksPass = false;
  }
});
console.log();

// Check 6: Middleware
console.log('6️⃣  Checking middleware...');
const middlewarePath = path.join(__dirname, 'middleware');
const requiredMiddleware = ['auth.js', 'errorHandler.js'];
let middlewareOk = true;

requiredMiddleware.forEach(mw => {
  const mwPath = path.join(middlewarePath, mw);
  if (fs.existsSync(mwPath)) {
    console.log(`   ✅ ${mw} found`);
  } else {
    console.log(`   ❌ ${mw} missing`);
    middlewareOk = false;
    allChecksPass = false;
  }
});
console.log();

// Final Summary
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

if (allChecksPass) {
  console.log('✅ All checks passed!\n');
  console.log('📋 Next Steps:');
  console.log('   1. Seed the database: npm run seed');
  console.log('   2. Start the server: npm start or npm run dev\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  // Start the server
  console.log('🚀 Starting server...\n');
  require('./server');
  
} else {
  console.log('❌ Some checks failed!\n');
  console.log('Please fix the issues above before starting the server.\n');
  console.log('Common fixes:');
  console.log('  • Run: npm install');
  console.log('  • Create .env file with required variables');
  console.log('  • Ensure all model and route files exist\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  process.exit(1);
}