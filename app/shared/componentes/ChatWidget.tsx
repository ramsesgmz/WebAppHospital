'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface ChatMessage {
  id: string
  type: 'report' | 'question' | 'other' | 'response'
  subject?: string
  context?: string
  message: string
  status: 'pending' | 'answered'
  responses?: Array<{
    id: string
    message: string
    timestamp: Date
    isAdmin: boolean
  }>
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
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = [
    { id: 1, title: 'Problemas con inventario', type: 'report' },
    { id: 2, title: 'Horario de turnos', type: 'question' },
    { id: 3, title: 'Acceso al sistema', type: 'other' }
  ];

  const handleSuggestionClick = (suggestion: { title: string, type: string }) => {
    setMessageType(suggestion.type as 'report' | 'question' | 'other');
    setSubject(suggestion.title);
    setShowSuggestions(false);
  };

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

    // Crear un nuevo mensaje de respuesta
    const adminResponse = {
      id: Date.now().toString(),
      type: 'response',
      message: response.trim(),
      status: 'answered',
      timestamp: new Date(),
      isAdmin: true
    }

    // Actualizar el mensaje seleccionado con la nueva respuesta
    const updatedMessage = {
      ...selectedMessage,
      status: 'answered' as const,
      responses: [...(selectedMessage.responses || []), adminResponse]
    }

    setMessages(prevMessages => 
      prevMessages.map(msg => 
        msg.id === selectedMessage.id ? updatedMessage : msg
      )
    )
    
    setUnreadCount(Math.max(0, unreadCount - 1))
    setResponse('')
    setSelectedMessage(updatedMessage) // Mantener el mensaje seleccionado actualizado
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
            {!isAdmin && (
              <div className="relative mr-2">
                <button 
                  className="btn btn-circle btn-sm btn-ghost text-primary-content"
                  onClick={() => setShowSuggestions(!showSuggestions)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {showSuggestions && (
                  <div className="absolute bottom-full right-0 mb-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <div className="p-2">
                      {suggestions.map((suggestion) => (
                        <button
                          key={suggestion.id}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg text-sm text-gray-700"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            <button className="btn btn-circle btn-sm btn-ghost text-primary-content" onClick={() => setIsOpen(false)}>✕</button>
          </div>
        </div>
        
        <div className="overflow-y-auto overflow-x-hidden" style={{ height: '500px' }}>
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className="border-b last:border-b-0 p-4 hover:bg-base-200 cursor-pointer"
              onClick={() => setSelectedMessage(msg)}
            >
              <div className="flex items-center gap-3">
                <div className="avatar placeholder">
                  <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
                    <span>CF</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-primary mb-1">Cliente Final</div>
                  <div className="font-medium truncate">{msg.subject || 'Sin asunto'}</div>
                  <p className="text-sm opacity-70 truncate">{msg.message}</p>
                  <div className="text-xs opacity-50 mt-1">
                    {new Date(msg.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderMessageDetail = () => (
    <div className="card w-[450px] bg-base-100 shadow-2xl flex flex-col">
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

      <div className="flex-1 overflow-y-auto" style={{ maxHeight: '350px' }}>
        <div className="p-6 space-y-4">
          <div className="chat chat-start">
            <div className="chat-image avatar placeholder">
              <div className="bg-primary text-primary-content rounded-full w-10">
                <span>CF</span>
              </div>
            </div>
            <div className="chat-bubble bg-base-200 text-gray-800">
              <div className="font-bold text-primary mb-1">Cliente Final</div>
              {selectedMessage?.context && (
                <div className="bg-base-300 p-3 rounded-lg mb-3 text-sm">
                  <span className="font-semibold">Contexto:</span> {selectedMessage.context}
                </div>
              )}
              <p className="text-lg">{selectedMessage?.message}</p>
            </div>
          </div>

          {selectedMessage?.responses?.map((response, index) => (
            <div key={response.id} className="chat chat-end">
              <div className="chat-image avatar placeholder">
                <div className="bg-primary text-primary-content rounded-full w-10">
                  <span>AD</span>
                </div>
              </div>
              <div className="chat-bubble bg-primary text-primary-content">
                <div className="font-bold mb-1">Administrador</div>
                <p className="text-lg">{response.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t bg-base-100 p-4">
        <div className="divider my-0">Respuesta</div>
        <form onSubmit={handleResponseSubmit} className="space-y-3 mt-3">
          <textarea 
            className="textarea textarea-bordered w-full min-h-[80px] text-lg"
            placeholder="Escribe tu respuesta..."
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                if (response.trim()) {
                  handleResponseSubmit(e)
                }
              }
            }}
          />
          
          <div className="flex justify-end">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={!response.trim()}
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  )

  const renderUserChat = () => (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body p-0">
        <div className="bg-primary text-primary-content p-4 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="card-title text-primary-content">Chat</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <button 
                  className="btn btn-circle btn-sm btn-ghost text-primary-content"
                  onClick={() => setShowSuggestions(!showSuggestions)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {showSuggestions && (
                  <div className="absolute bottom-full right-0 mb-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <div className="p-2">
                      {suggestions.map((suggestion) => (
                        <button
                          key={suggestion.id}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-lg text-sm text-gray-700"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button 
                className="btn btn-circle btn-sm btn-ghost text-primary-content" 
                onClick={() => setIsOpen(false)}
              >✕</button>
            </div>
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    if (message.trim()) {
                      handleSubmit(e)
                    }
                  }
                }}
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
        selectedMessage ? (
          renderMessageDetail()
        ) : (
          renderMessageList()
        )
      ) : (
        renderAdminBubble()
      )}
    </div>
  )
}