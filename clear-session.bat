@echo off
REM ========================================
REM PHX CTF - Clear Session Data Script
REM ========================================

echo.
echo 🧹 PHX CTF - Clearing Session Data
echo ==================================
echo.

echo 📝 Instructions for clearing session data:
echo.
echo 1. Open your browser
echo 2. Press F12 to open Developer Tools
echo 3. Go to Application tab (Chrome) or Storage tab (Firefox)
echo 4. Find "Local Storage" and "Session Storage"
echo 5. Delete all entries for localhost:3000
echo 6. Or use incognito/private browsing mode
echo.
echo 🔄 Alternative: Use incognito/private browsing mode
echo.
echo 📋 Or run these commands in browser console:
echo    localStorage.clear()
echo    sessionStorage.clear()
echo.
pause
