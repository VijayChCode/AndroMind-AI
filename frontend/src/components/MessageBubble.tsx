import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, ThumbsUp, ThumbsDown, Download, RefreshCw } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Message } from '../store/chatStore'
import toast from 'react-hot-toast'

interface MessageBubbleProps {
  message: Message
  index: number
}

const MessageBubble = ({ message, index }: MessageBubbleProps) => {
  const [isCopied, setIsCopied] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setIsCopied(true)
      toast.success('Message copied to clipboard')
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy message')
    }
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    if (isDisliked) setIsDisliked(false)
    toast.success(isLiked ? 'Like removed' : 'Message liked')
  }

  const handleDislike = () => {
    setIsDisliked(!isDisliked)
    if (isLiked) setIsLiked(false)
    toast.success(isDisliked ? 'Dislike removed' : 'Message disliked')
  }

  const handleRegenerate = () => {
    toast.success('Regenerating response...')
    // Here you would implement the regenerate functionality
  }

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`max-w-4xl ${message.role === 'user' ? 'ml-12' : 'mr-12'}`}>
        <motion.div
          whileHover={{ scale: 1.01 }}
          className={`relative group ${
            message.role === 'user'
              ? 'chat-bubble-user'
              : 'chat-bubble-ai'
          }`}
        >
          {/* Message Content */}
          <div className="prose prose-invert max-w-none">
            {message.role === 'assistant' ? (
              <ReactMarkdown
                components={{
                  code({ node, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '')
                    return match ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus as any}
                        language={match[1]}
                        PreTag="div"
                        className="rounded-lg"
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className="bg-dark-700 px-1 py-0.5 rounded text-sm" {...props}>
                        {children}
                      </code>
                    )
                  },
                  p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="text-gray-200">{children}</li>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-primary-500 pl-4 italic text-gray-300 my-3">
                      {children}
                    </blockquote>
                  ),
                  h1: ({ children }) => <h1 className="text-2xl font-bold text-white mb-3">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-xl font-bold text-white mb-2">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-lg font-bold text-white mb-2">{children}</h3>,
                  a: ({ children, href }) => (
                    <a 
                      href={href} 
                      className="text-primary-400 hover:text-primary-300 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-3">
                      <table className="min-w-full border border-gray-600 rounded-lg">
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="border border-gray-600 px-4 py-2 bg-dark-700 text-left font-semibold">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border border-gray-600 px-4 py-2">
                      {children}
                    </td>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            ) : (
              <p className="text-white whitespace-pre-wrap">{message.content}</p>
            )}
          </div>

          {/* Timestamp */}
          <div className="text-xs text-gray-400 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {formatTimestamp(message.timestamp)}
          </div>

          {/* Action Buttons */}
          <div className="absolute -right-12 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex flex-col space-y-1">
              <button
                onClick={handleCopy}
                className="p-2 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors"
                title="Copy message"
              >
                {isCopied ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-4 h-4 text-green-400"
                  >
                    ✓
                  </motion.div>
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>

              {message.role === 'assistant' && (
                <>
                  <button
                    onClick={handleLike}
                    className={`p-2 rounded-lg transition-colors ${
                      isLiked 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-dark-700 hover:bg-dark-600 text-gray-400'
                    }`}
                    title="Like message"
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleDislike}
                    className={`p-2 rounded-lg transition-colors ${
                      isDisliked 
                        ? 'bg-red-500/20 text-red-400' 
                        : 'bg-dark-700 hover:bg-dark-600 text-gray-400'
                    }`}
                    title="Dislike message"
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleRegenerate}
                    className="p-2 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors"
                    title="Regenerate response"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default MessageBubble
