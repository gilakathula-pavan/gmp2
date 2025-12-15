import React, { useState, useEffect, useRef, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import chatbotLogo from '../../assets/chatbot-logo.svg'
import gmlogo from '../../assets/images/gmlogo-removebg-preview.png'
import backend from '../../services/mockBackend'
import { AuthContext } from '../../contexts/AuthContext'

export default function Chatbot(){
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [logoSrc, setLogoSrc] = useState(gmlogo)
  const { user } = useContext(AuthContext)
  const listRef = useRef(null)

  useEffect(() => {
    try {
      const db = JSON.parse(localStorage.getItem('grahmind_mock_db_v1') || '{}')
      setMessages(db?.chat || [])
    } catch (e) {
      setMessages([])
    }
  }, [])

  // Use provided gmlogo PNG as chatbot logo (keeps bot branding consistent)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages, open])

  const saveMessages = (msgs) => {
    try {
      const raw = localStorage.getItem('grahmind_mock_db_v1')
      const db = raw ? JSON.parse(raw) : { profile: {} }
      db.chat = msgs
      localStorage.setItem('grahmind_mock_db_v1', JSON.stringify(db))
    } catch (e) {
      console.error(e)
    }
  }

  const handleSend = async () => {
    if (!text.trim()) return
    setSending(true)
    const userMsg = { id: `m${Date.now()}`, from: user?.name || 'You', text: text.trim(), ts: Date.now() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    saveMessages(newMessages)
    setText('')

    // Simulate bot reply
    setTimeout(() => {
      const reply = { id: `b${Date.now()}`, from: 'Grahmind Bot', text: `Got it — I received: "${userMsg.text}"`, ts: Date.now() }
      const after = [...newMessages, reply]
      setMessages(after)
      saveMessages(after)
      setSending(false)
    }, 700)
  }

  return (
    <div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed right-6 bottom-24 w-84 md:w-96 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col"
            style={{ maxHeight: '60vh' }}
          >
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <img src={logoSrc} alt="bot" className="w-9 h-9 rounded-lg object-cover" />
                <div>
                  <div className="text-sm font-semibold text-slate-900">Grahmind Chat</div>
                  <div className="text-xs text-slate-500">Ask about your dashboard</div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-sm px-3 py-1 rounded-lg border border-slate-200">Close</button>
            </div>

            <div ref={listRef} className="flex-1 overflow-auto p-4 space-y-3 bg-slate-50">
              {messages.length === 0 && <div className="text-xs text-slate-500">No messages yet — say hi 👋</div>}
              {messages.map(m => (
                <div key={m.id} className={`flex ${m.from === (user?.name||'You') ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[78%] px-4 py-2 rounded-2xl ${m.from === (user?.name||'You') ? 'bg-grahmind-teal/90 text-white' : 'bg-white border border-slate-100 text-slate-800'}`}>
                    <div className="text-xs font-medium">{m.from}</div>
                    <div className="text-sm mt-1">{m.text}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-slate-100 bg-white">
              <div className="flex gap-2">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-xl outline-none"
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSend() }}
                />
                <button onClick={handleSend} disabled={sending} className="px-4 py-2 rounded-xl bg-indigo-600 text-white">Send</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed right-6 bottom-6 w-14 h-14 rounded-full bg-white border border-slate-200 shadow-lg z-50 flex items-center justify-center"
        aria-label="Open chat"
      >
        <img src={logoSrc} alt="chat" className="w-8 h-8 object-cover" />
      </motion.button>
    </div>
  )
}
