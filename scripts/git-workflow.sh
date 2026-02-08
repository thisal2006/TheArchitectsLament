#!/bin/bash
# Git workflow helper for game development

echo "Architect's Lament - Development Workflow"
echo "========================================"

case "$1" in
    "start")
        echo "Starting new feature..."
        read -p "Feature name: " feature
        git checkout -b feature/$feature
        echo "Switched to feature/$feature"
        ;;
    "commit")
        read -p "Commit message: " message
        git add .
        git commit -m "$message"
        echo "Committed with message: $message"
        ;;
    "push")
        git push origin $(git branch --show-current)
        echo "Pushed to GitHub"
        ;;
    "finish")
        git checkout main
        git merge $(git branch --show-current)
        git branch -d $(git branch --show-current)
        echo "Feature merged and branch deleted"
        ;;
    *)
        echo "Usage: ./git-workflow.sh [start|commit|push|finish]"
        ;;
esac