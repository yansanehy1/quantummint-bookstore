@echo off
setlocal

echo 🎬 Setting up QuantumMint Video Platform...

REM 1. Check for FFmpeg
where ffmpeg >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ FFmpeg not found. Please install FFmpeg and add it to your PATH.
    echo    Download from: https://ffmpeg.org/download.html
) else (
    echo ✅ FFmpeg found.
)

REM 2. Check for Redis
where redis-server >nul 2>nul
if %errorlevel% neq 0 (
    echo ⚠️  Redis not found. Please install Redis for Windows or run via Docker.
    echo    Docker: docker run -d -p 6379:6379 redis
) else (
    echo ✅ Redis found.
)

REM 3. Create Directories
echo 📂 Creating directory structure...
if not exist "videos\originals" mkdir "videos\originals"
if not exist "videos\encoded" mkdir "videos\encoded"
if not exist "videos\thumbnails" mkdir "videos\thumbnails"
if not exist "videos\previews" mkdir "videos\previews"
if not exist "temp\uploads" mkdir "temp\uploads"
if not exist "logs" mkdir "logs"

REM 4. Install Dependencies
echo 📦 Installing Node.js dependencies...
cd video-processor
call npm install
cd ..

REM 5. Create .env file if not exists
if not exist "video-processor\.env" (
    echo 📝 Creating default .env file...
    (
        echo PORT=3000
        echo STREAM_PORT=8000
        echo REDIS_URL=redis://localhost:6379
        echo VIDEO_STORAGE=../videos
        echo TEMP_DIR=../temp
    ) > video-processor\.env
)

echo.
echo ✅ Setup complete!
echo.
echo To start the video platform:
echo   cd video-processor
echo   npm start
echo.
echo To test uploads:
echo   Open http://localhost:3000/upload-test.html
echo.
echo To view the player:
echo   Open http://localhost:3000/video-player.html
pause
