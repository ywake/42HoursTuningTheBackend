(cd ../scoring/tool/nodeTool && npm ci)
(cd ../scoring/tool && node ./nodeTool/check.js "fallback") || echo "処理に失敗しました。"