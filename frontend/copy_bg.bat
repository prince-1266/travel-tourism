@echo off
copy /Y "C:\Users\m\.gemini\antigravity\brain\b6f2424f-4152-4405-ba92-617902928a11\uploaded_media_1769682405918.png" "c:\Users\m\OneDrive\Desktop\travel and tour\frontend\src\assets\app-bg.png"
if %errorlevel% neq 0 (
    echo Copy Failed with error %errorlevel%
    exit /b %errorlevel%
)
echo Copy Successful
