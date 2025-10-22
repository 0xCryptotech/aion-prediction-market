@echo off
echo ========================================
echo AION GitHub Upload
echo ========================================
echo.
echo Masukkan GitHub Personal Access Token:
echo (Buat di: https://github.com/settings/tokens)
echo.
set /p TOKEN="Token: "
echo.
echo Uploading to GitHub...
git remote set-url origin https://%TOKEN%@github.com/0xCryptotech/aion-prediction-market.git
git push -u origin master
echo.
echo ========================================
echo Upload Complete!
echo Repository: https://github.com/0xCryptotech/aion-prediction-market
echo ========================================
pause