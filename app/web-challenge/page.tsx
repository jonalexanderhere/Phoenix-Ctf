'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function WebChallenge() {
  const [showHint, setShowHint] = useState(false)
  const [showSource, setShowSource] = useState(false)

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/challenges" className="text-primary-600 hover:text-primary-800">
                ← Back to Challenges
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                {showHint ? 'Hide Hint' : 'Show Hint'}
              </button>
              <button
                onClick={() => setShowSource(!showSource)}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                {showSource ? 'Hide Source' : 'View Source'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">🌐 Web Exploitation Challenge</h1>
          
          <div className="space-y-6">
            <div className="p-6 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <h2 className="text-lg font-semibold text-blue-900 mb-2">Challenge Description</h2>
              <p className="text-blue-800">
                Welcome to the web exploitation challenge! Your task is to find the hidden flag on this page. 
                The flag might be hidden in various places - source code, comments, cookies, or even in the 
                network requests. Use your web development and security knowledge to uncover it!
              </p>
            </div>

            {showHint && (
              <div className="p-6 bg-green-50 rounded-lg border-l-4 border-green-400">
                <h2 className="text-lg font-semibold text-green-900 mb-2">💡 Hint</h2>
                <p className="text-green-800">
                  Check the page source code and look for HTML comments. Also, try inspecting the network 
                  requests and checking for any hidden elements or attributes.
                </p>
              </div>
            )}

            {showSource && (
              <div className="p-6 bg-gray-50 rounded-lg border">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">📄 Page Source</h2>
                <pre className="text-sm text-gray-700 overflow-x-auto">
{`<!DOCTYPE html>
<html>
<head>
  <title>Web Challenge</title>
  <meta name="description" content="Find the flag!">
  <!-- CTF{web_exploitation_success} -->
</head>
<body>
  <h1>Web Exploitation Challenge</h1>
  <p>Welcome to the challenge!</p>
  <!-- Hidden in comment: CTF{hidden_in_html_comment} -->
  <div style="display:none;">
    <span>CTF{hidden_in_hidden_div}</span>
  </div>
</body>
</html>`}
                </pre>
              </div>
            )}

            <div className="p-6 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
              <h2 className="text-lg font-semibold text-yellow-900 mb-2">🎯 Instructions</h2>
              <ul className="text-yellow-800 space-y-2">
                <li>• Right-click and "View Page Source" to inspect the HTML</li>
                <li>• Use browser developer tools (F12) to examine the page</li>
                <li>• Check the Network tab for any hidden requests</li>
                <li>• Look for hidden elements, comments, or attributes</li>
                <li>• Try different approaches to find the flag</li>
              </ul>
            </div>

            <div className="p-6 bg-red-50 rounded-lg border-l-4 border-red-400">
              <h2 className="text-lg font-semibold text-red-900 mb-2">⚠️ Security Note</h2>
              <p className="text-red-800">
                This is a controlled environment for learning purposes. In real-world scenarios, 
                always ensure you have proper authorization before testing web applications.
              </p>
            </div>
          </div>

          {/* Hidden elements for the challenge */}
          <div style={{ display: 'none' }}>
            <span>CTF{`{hidden_in_hidden_element}`}</span>
          </div>
          
          {/* Hidden flag in HTML comment */}
          {/* CTF{`{web_exploitation_success}`} */}
          
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <p className="text-gray-600 text-sm">
              <strong>Challenge Type:</strong> Web Exploitation | 
              <strong> Difficulty:</strong> Easy | 
              <strong> Points:</strong> 100
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
