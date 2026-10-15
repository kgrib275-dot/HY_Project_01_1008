@echo off
chcp 65001 >nul
rem 더블클릭하면 프로젝트 스킬을 전역(~/.claude/skills)으로 동기화한다. 인자를 주면 그대로 전달 (예: sync_to_global.bat --dry-run)
python "%~dp0sync_to_global.py" %*
echo.
pause
