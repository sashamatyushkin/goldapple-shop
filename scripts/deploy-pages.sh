#!/usr/bin/env bash
# Публикация Mini App на GitHub Pages — как в проекте LIT Energy.
# Требует: авторизованный gh (gh auth status).
# Запуск:  bash scripts/deploy-pages.sh
set -euo pipefail
cd "$(dirname "$0")/.."

REPO="${REPO:-goldapple-shop}"
OWNER="$(gh api user -q .login)"
URL="https://${OWNER}.github.io/${REPO}/"

echo "▶ сборка статики…"
npm run build
touch dist/.nojekyll

# 1. репозиторий + исходники в main
if ! git ls-remote origin >/dev/null 2>&1; then
  echo "▶ создаю репозиторий ${OWNER}/${REPO}…"
  gh repo create "$REPO" --public --source=. --remote=origin --push
else
  echo "▶ пушу исходники в main…"
  git push -u origin main
fi

ORIGIN_URL="$(git remote get-url origin)"

# 2. статика dist → ветка gh-pages
echo "▶ публикую dist в ветку gh-pages…"
pushd dist >/dev/null
rm -rf .git
git init -q
git checkout -qb gh-pages
git add -A
git -c user.name="$OWNER" -c user.email="${OWNER}@users.noreply.github.com" commit -q -m "deploy $(date +%F_%T)"
git push -f "$ORIGIN_URL" gh-pages
rm -rf .git
popd >/dev/null

# 3. включить Pages (branch gh-pages, /)
echo "▶ включаю GitHub Pages…"
gh api -X POST "repos/${OWNER}/${REPO}/pages" \
  -f "source[branch]=gh-pages" -f "source[path]=/" 2>/dev/null \
  || gh api -X PUT "repos/${OWNER}/${REPO}/pages" \
     -f "source[branch]=gh-pages" -f "source[path]=/" 2>/dev/null || true

echo ""
echo "✅ Готово. Адрес Mini App (через 1–2 минуты соберётся):"
echo "   $URL"
echo ""
echo "Дальше: впишите этот адрес в .env → WEBAPP_URL и перезапустите бота (npm run bot)."
