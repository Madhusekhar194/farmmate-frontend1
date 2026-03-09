import React from 'react';

function App() {
    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                LibreMind
            </h1>
            <p className="text-slate-400 text-lg">AI-Powered Library Management System</p>
            <div className="mt-8 p-6 bg-slate-800 rounded-xl shadow-2xl border border-slate-700">
                <p>Initializing your intelligent library experience...</p>
            </div>
        </div>
    );
}

export default App;
