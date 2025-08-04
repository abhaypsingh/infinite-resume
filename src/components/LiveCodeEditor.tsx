import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

interface LiveCodeEditorProps {
  onExecute: (output: string) => void
}

export const LiveCodeEditor: React.FC<LiveCodeEditorProps> = ({ onExecute }) => {
  const [code, setCode] = useState(`// Live coding environment
// Try editing this code!

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Calculate first 10 Fibonacci numbers
const results = [];
for (let i = 0; i < 10; i++) {
  results.push(fibonacci(i));
}

console.log("Fibonacci sequence:", results);

// Data transformation example
const data = [1, 2, 3, 4, 5];
const transformed = data
  .map(x => x * x)
  .filter(x => x > 10)
  .reduce((sum, x) => sum + x, 0);

console.log("Transformed sum:", transformed);`)

  const [isExecuting, setIsExecuting] = useState(false)
  const editorRef = useRef<HTMLTextAreaElement>(null)

  const executeCode = () => {
    setIsExecuting(true)
    
    try {
      // Create a safe execution environment
      const logs: string[] = []
      const customConsole = {
        log: (...args: any[]) => {
          logs.push(args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' '))
        },
        error: (...args: any[]) => {
          logs.push('ERROR: ' + args.join(' '))
        }
      }
      
      // Create a function with the custom console
      const func = new Function('console', code)
      func(customConsole)
      
      const output = logs.join('\n') || 'Code executed successfully with no output'
      onExecute(output)
    } catch (error) {
      onExecute(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsExecuting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = editorRef.current?.selectionStart || 0
      const end = editorRef.current?.selectionEnd || 0
      const newCode = code.substring(0, start) + '  ' + code.substring(end)
      setCode(newCode)
      
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.selectionStart = start + 2
          editorRef.current.selectionEnd = start + 2
        }
      }, 0)
    } else if (e.ctrlKey && e.key === 'Enter') {
      executeCode()
    }
  }

  // Syntax highlighting (basic)
  const highlightCode = (code: string) => {
    const keywords = ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'new']
    const highlighted = code
      .replace(/\/\/.*$/gm, '<span class="comment">$&</span>')
      .replace(/(['"])(?:(?=(\\?))\2.)*?\1/g, '<span class="string">$&</span>')
      .replace(/\b(\d+)\b/g, '<span class="number">$1</span>')
    
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g')
      highlighted.replace(regex, `<span class="keyword">${keyword}</span>`)
    })
    
    return highlighted
  }

  return (
    <div className="code-editor-container">
      <div className="editor-header">
        <div className="editor-title">
          <span className="dot dot-red"></span>
          <span className="dot dot-yellow"></span>
          <span className="dot dot-green"></span>
          <span className="title-text">live-code.js</span>
        </div>
        <motion.button
          className="execute-button"
          onClick={executeCode}
          disabled={isExecuting}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isExecuting ? 'Executing...' : 'Run Code (Ctrl+Enter)'}
        </motion.button>
      </div>
      
      <div className="editor-body">
        <div className="line-numbers">
          {code.split('\n').map((_, i) => (
            <div key={i} className="line-number">{i + 1}</div>
          ))}
        </div>
        
        <textarea
          ref={editorRef}
          className="code-textarea"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          placeholder="Write your code here..."
        />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .code-editor-container {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          background: #1a1a1f;
          border-radius: var(--fibonacci-8);
          overflow: hidden;
        }

        .editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--fibonacci-13);
          background: #2a2a2f;
          border-bottom: 1px solid #3a3a3f;
        }

        .editor-title {
          display: flex;
          align-items: center;
          gap: var(--fibonacci-8);
        }

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .dot-red {
          background: #ff5f57;
        }

        .dot-yellow {
          background: #ffbd2e;
        }

        .dot-green {
          background: #28ca42;
        }

        .title-text {
          color: var(--color-thought-gray);
          font-family: var(--font-mono);
          font-size: var(--fibonacci-8);
        }

        .execute-button {
          padding: var(--fibonacci-8) var(--fibonacci-21);
          background: var(--color-infinity-secondary);
          border: none;
          border-radius: var(--fibonacci-5);
          color: white;
          font-family: var(--font-mono);
          font-size: var(--fibonacci-8);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .execute-button:hover {
          background: var(--color-infinity-primary);
        }

        .execute-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .editor-body {
          flex: 1;
          display: flex;
          overflow: hidden;
        }

        .line-numbers {
          padding: var(--fibonacci-13);
          background: #252529;
          color: #5a5a5f;
          font-family: var(--font-mono);
          font-size: var(--fibonacci-8);
          line-height: 1.5;
          user-select: none;
          min-width: 40px;
          text-align: right;
        }

        .line-number {
          height: 21px;
        }

        .code-textarea {
          flex: 1;
          padding: var(--fibonacci-13);
          background: transparent;
          border: none;
          color: var(--color-data-white);
          font-family: var(--font-mono);
          font-size: var(--fibonacci-8);
          line-height: 1.5;
          resize: none;
          outline: none;
          tab-size: 2;
        }

        .code-textarea::selection {
          background: rgba(139, 92, 246, 0.3);
        }

        .comment {
          color: #7a7a7f;
        }

        .string {
          color: #98c379;
        }

        .number {
          color: #d19a66;
        }

        .keyword {
          color: #c678dd;
        }
      ` }} />
    </div>
  )
}