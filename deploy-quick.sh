#!/bin/bash

# ========================================
# PHX CTF - Quick Netlify Deployment
# ========================================

echo ""
echo "🚀 PHX CTF - Quick Deployment"
echo "============================="
echo ""

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI not found. Installing..."
    npm install -g netlify-cli
fi

# Check if user is logged in
if ! netlify status &> /dev/null; then
    echo "🔐 Please login to Netlify first..."
    netlify login
fi

echo ""
echo "📋 Quick Deployment Options:"
echo "============================"
echo "1. Deploy Preview (netlify deploy)"
echo "2. Deploy Production (netlify deploy --prod)"
echo "3. Deploy Production + Open (netlify deploy --prod --open)"
echo "4. Deploy No Build (netlify deploy --no-build)"
echo "5. Deploy with Message (netlify deploy --message 'message')"
echo "6. Deploy to Specific Site (netlify deploy --site site-id)"
echo "7. Create New Site (netlify deploy --create-site site-name)"
echo "8. Deploy with Trigger (netlify deploy --trigger)"
echo "9. Deploy Production If Unlocked (netlify deploy --prod-if-unlocked)"
echo "0. Exit"
echo ""

read -p "Enter your choice (0-9): " choice

case $choice in
    1)
        echo "🚀 Deploying to preview..."
        netlify deploy
        ;;
    2)
        echo "🚀 Deploying to production..."
        netlify deploy --prod
        ;;
    3)
        echo "🚀 Deploying to production and opening..."
        netlify deploy --prod --open
        ;;
    4)
        echo "🚀 Deploying without build..."
        netlify deploy --no-build
        ;;
    5)
        read -p "Enter deployment message: " message
        echo "🚀 Deploying with message: $message"
        netlify deploy --message "$message"
        ;;
    6)
        read -p "Enter site ID: " site_id
        echo "🚀 Deploying to site: $site_id"
        netlify deploy --site "$site_id"
        ;;
    7)
        read -p "Enter site name: " site_name
        echo "🚀 Creating new site and deploying: $site_name"
        netlify deploy --create-site "$site_name"
        ;;
    8)
        echo "🚀 Deploying with trigger..."
        netlify deploy --trigger
        ;;
    9)
        echo "🚀 Deploying to production if unlocked..."
        netlify deploy --prod-if-unlocked
        ;;
    0)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice. Please try again."
        exit 1
        ;;
esac

echo ""
echo "✅ Deployment completed!"
echo ""
