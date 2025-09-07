#!/bin/bash

# ========================================
# PHX CTF - Netlify Deployment Script
# ========================================

echo ""
echo "🚀 PHX CTF - Netlify Deployment"
echo "================================"
echo ""

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI not found. Installing..."
    npm install -g netlify-cli
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install Netlify CLI"
        exit 1
    fi
fi

# Check if user is logged in
if ! netlify status &> /dev/null; then
    echo "🔐 Please login to Netlify first..."
    netlify login
    if [ $? -ne 0 ]; then
        echo "❌ Login failed"
        exit 1
    fi
fi

echo ""
echo "📋 Available Deployment Options:"
echo "================================"
echo "1. Deploy to current site (preview)"
echo "2. Deploy to production"
echo "3. Deploy to production and open"
echo "4. Deploy without build"
echo "5. Deploy with custom message"
echo "6. Deploy with environment variables"
echo "7. Create new site and deploy"
echo "8. Deploy with custom site ID"
echo "9. Deploy with trigger"
echo "0. Exit"
echo ""

read -p "Enter your choice (0-9): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Deploying to preview..."
        netlify deploy
        ;;
    2)
        echo ""
        echo "🚀 Deploying to production..."
        netlify deploy --prod
        ;;
    3)
        echo ""
        echo "🚀 Deploying to production and opening..."
        netlify deploy --prod --open
        ;;
    4)
        echo ""
        echo "🚀 Deploying without build..."
        netlify deploy --no-build
        ;;
    5)
        echo ""
        read -p "Enter deployment message: " message
        echo "🚀 Deploying with message: $message"
        netlify deploy --message "$message"
        ;;
    6)
        echo ""
        echo "🚀 Deploying with environment variables..."
        read -p "Enter Netlify Auth Token (optional): " auth_token
        if [ -z "$auth_token" ]; then
            netlify deploy --prod
        else
            netlify deploy --prod --auth "$auth_token"
        fi
        ;;
    7)
        echo ""
        echo "🚀 Creating new site and deploying..."
        read -p "Enter site name: " site_name
        read -p "Enter team name (optional): " team_name
        if [ -z "$team_name" ]; then
            netlify deploy --create-site "$site_name"
        else
            netlify deploy --create-site "$site_name" --team "$team_name"
        fi
        ;;
    8)
        echo ""
        read -p "Enter site ID: " site_id
        echo "🚀 Deploying to site: $site_id"
        netlify deploy --site "$site_id"
        ;;
    9)
        echo ""
        echo "🚀 Deploying with trigger..."
        netlify deploy --trigger
        ;;
    0)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo ""
        echo "❌ Invalid choice. Please try again."
        exit 1
        ;;
esac

echo ""
echo "✅ Deployment completed!"
echo ""
