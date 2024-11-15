export default function Login() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-500 to-blue-600">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm">
            <div className="flex justify-center mb-6">
              <img src="logo.jpg" alt="Hombres de Blanco Logo" className="w-24 h-24" />
            </div>
            <form className="space-y-4">
              <div>
                <label className="sr-only" htmlFor="username">Username</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a5 5 0 100-10 5 5 0 000 10zm0 2c-3.33 0-10 1.67-10 5v1h20v-1c0-3.33-6.67-5-10-5z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    id="username"
                    placeholder="Username"
                    className="w-full pl-10 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="sr-only" htmlFor="password">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 8a3 3 0 016 0v1h1a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4a2 2 0 012-2h1V8zm4-1a1 1 0 00-2 0v1h2V7zm-5 5v4h10v-4H4z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    className="w-full pl-10 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Iniciar sesión
              </button>
            </form>
          </div>
        </div>
      );
}