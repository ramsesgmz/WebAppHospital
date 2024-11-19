'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface ChatMessage {
  id: string
  type: 'report' | 'question' | 'other'
  subject?: string
  context?: string
  message: string
  status: 'pending' | 'answered'
  response?: string
  attachment?: string
  timestamp: Date
}

interface ChatWidgetProps {
  isAdmin?: boolean;
  onNewMessage?: (message: ChatMessage) => void;
}

export default function ChatWidget({ isAdmin = false, onNewMessage }: ChatWidgetProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<ChatMessage | null>(null)
  const [messageType, setMessageType] = useState<'report' | 'question' | 'other' | null>(null)
  const [context, setContext] = useState<string>('')
  const [message, setMessage] = useState('')
  const [subject, setSubject] = useState('')
  const [response, setResponse] = useState('')
  const [attachment, setAttachment] = useState<File | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'report',
      subject: 'Problema con inventario',
      context: 'Inventario > Jabón líquido [50 litros disponibles]',
      message: 'El stock actual no coincide con el sistema',
      status: 'pending',
      timestamp: new Date(Date.now() - 3600000) // 1 hora atrás
    },
    {
      id: '2',
      type: 'question',
      context: 'Calendario > Turno A [7AM-3PM]',
      message: '¿Se puede modificar el horario del turno de limpieza?',
      status: 'pending',
      timestamp: new Date(Date.now() - 7200000) // 2 horas atrás
    },
    {
      id: '3',
      type: 'other',
      message: 'Necesito acceso al sistema de inventario',
      status: 'pending',
      timestamp: new Date(Date.now() - 10800000) // 3 horas atrás
    }
  ])
  const [unreadCount, setUnreadCount] = useState(3)

  useEffect(() => {
    const handleRouteChange = () => {
      setIsOpen(false)
    }

    // Usar el pathname para detectar cambios de ruta
    const currentPathname = window.location.pathname
    if (currentPathname !== pathname) {
      handleRouteChange()
    }
  }, [pathname])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!messageType || !message.trim()) return
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: messageType,
      subject: subject.trim(),
      context: context.trim(),
      message: message.trim(),
      status: 'pending',
      timestamp: new Date()
    }
    
    // Agregar el mensaje al estado local y mantener el orden cronológico inverso
    setMessages(prevMessages => [newMessage, ...prevMessages])
    
    // Limpiar solo el formulario, NO el messageType
    setMessage('')
    setSubject('')
    setContext('')
    
    // Notificar al enterprise
    if (onNewMessage) {
      onNewMessage(newMessage)
    }
    
    // Simular respuesta automática para el demo
    setTimeout(() => {
      const autoResponse: ChatMessage = {
        ...newMessage,
        id: Date.now().toString(),
        status: 'answered',
        response: '¡Mensaje recibido! Te responderemos pronto.',
        timestamp: new Date()
      }
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === newMessage.id ? autoResponse : msg
        )
      )
    }, 2000)
  }

  const handleResponseSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMessage || !response.trim()) return

    let attachmentUrl = ''
    if (attachment) {
      // Aquí iría la lógica para subir la imagen al servidor
      attachmentUrl = URL.createObjectURL(attachment)
    }

    const updatedMessage = {
      ...selectedMessage,
      status: 'answered' as const,
      response: response.trim(),
      attachment: attachmentUrl
    }

    setMessages(messages.map(msg => 
      msg.id === selectedMessage.id ? updatedMessage : msg
    ))
    
    setUnreadCount(Math.max(0, unreadCount - 1))
    setResponse('')
    setAttachment(null)
    setSelectedMessage(null)
  }

  // Si es admin, mostrar el contador de mensajes no leídos
  const renderAdminBubble = () => (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(true)}
        className="btn btn-circle btn-lg btn-primary shadow-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </div>
  )

  const renderMessageList = () => (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body p-0">
        <div className="bg-primary text-primary-content p-4 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="card-title text-primary-content">Mensajes Pendientes</h2>
            <button className="btn btn-circle btn-sm btn-ghost text-primary-content" onClick={() => setIsOpen(false)}>✕</button>
          </div>
        </div>
        
        <div className="overflow-y-auto max-h-[60vh]">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className="border-b last:border-b-0 p-4 hover:bg-base-200 cursor-pointer"
              onClick={() => setSelectedMessage(msg)}
            >
              <div className="flex items-center gap-3">
                <div className="avatar placeholder">
                  <div className="bg-neutral-focus text-neutral-content rounded-full w-12">
                    <span>{msg.type.charAt(0).toUpperCase()}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="font-medium">{msg.subject || 'Sin asunto'}</div>
                  <p className="text-sm opacity-70 truncate">{msg.message}</p>
                  <div className="text-xs opacity-50 mt-1">
                    {new Date(msg.timestamp).toLocaleString()}
                  </div>
                </div>
                {msg.status === 'pending' && (
                  <div className="badge badge-primary">Nuevo</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderMessageDetail = () => (
    <div className="card w-[450px] bg-base-100 shadow-2xl">
      <div className="card-body p-0">
        <div className="bg-primary text-primary-content p-4 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <button 
              className="btn btn-circle btn-sm btn-ghost text-primary-content hover:bg-primary-focus"
              onClick={() => setSelectedMessage(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <div>
              <h2 className="card-title text-primary-content mb-1">{selectedMessage?.subject || 'Mensaje'}</h2>
              <p className="text-sm opacity-75">{new Date(selectedMessage?.timestamp || '').toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          <div className="chat chat-start">
            <div className="chat-image avatar placeholder">
              <div className="bg-neutral-focus text-neutral-content rounded-full w-12">
                <span className="text-lg">{selectedMessage?.type.charAt(0).toUpperCase()}</span>
              </div>
            </div>
            <div className="chat-bubble chat-bubble-primary">
              {selectedMessage?.context && (
                <div className="bg-primary-focus/20 p-3 rounded-lg mb-3 text-sm">
                  <span className="font-semibold">Contexto:</span> {selectedMessage.context}
                </div>
              )}
              <p className="text-lg">{selectedMessage?.message}</p>
            </div>
          </div>

          <div className="divider">Respuesta</div>

          <form onSubmit={handleResponseSubmit} className="space-y-4">
            <textarea 
              className="textarea textarea-bordered w-full min-h-[120px] text-lg"
              placeholder="Escribe tu respuesta..."
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleResponseSubmit(e);
                }
              }}
            />
            
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="btn btn-outline btn-sm gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {attachment ? attachment.name : 'Adjuntar imagen'}
                  <input 
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file && file.type.startsWith('image/')) {
                        setAttachment(file)
                      } else {
                        alert('Por favor, selecciona solo archivos de imagen')
                      }
                    }}
                  />
                </label>
              </div>
              <button 
                type="submit" 
                className="btn btn-primary btn-lg gap-2"
                disabled={!response.trim()}
              >
                Enviar
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            
            {attachment && (
              <div className="mt-2">
                <img 
                  src={URL.createObjectURL(attachment)} 
                  alt="Vista previa" 
                  className="max-h-32 rounded-lg"
                />
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )

  const renderUserChat = () => (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body p-0">
        <div className="bg-primary text-primary-content p-4 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="card-title text-primary-content">Chat</h2>
            <button className="btn btn-circle btn-sm btn-ghost text-primary-content" onClick={() => setIsOpen(false)}>✕</button>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4">
          {messageType ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {messageType === 'report' && (
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="Asunto del reporte..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              )}
              <textarea 
                className="textarea textarea-bordered w-full min-h-[120px]" 
                placeholder="Escribe tu mensaje..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
              <div className="flex justify-end gap-2">
                <button type="button" className="btn bg-base-200" onClick={() => setMessageType(null)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Enviar
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="space-y-2">
                    <div className="chat chat-end">
                      <div className="chat-bubble chat-bubble-primary">
                        {msg.subject && <div className="font-bold">{msg.subject}</div>}
                        <p>{msg.message}</p>
                        <div className="text-xs opacity-75 mt-1">
                          {new Date(msg.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    {msg.response && (
                      <div className="chat chat-start">
                        <div className="chat-bubble bg-base-200">
                          {msg.response}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2">
                <button className="btn w-full btn-primary" onClick={() => setMessageType('report')}>
                  Reporte
                </button>
                <button className="btn w-full btn-primary" onClick={() => setMessageType('question')}>
                  Pregunta
                </button>
                <button className="btn w-full btn-primary" onClick={() => setMessageType('other')}>
                  Otro
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        isAdmin ? (
          selectedMessage ? renderMessageDetail() : renderMessageList()
        ) : (
          renderUserChat()
        )
      ) : (
        renderAdminBubble()
      )}
    </div>
  )
}