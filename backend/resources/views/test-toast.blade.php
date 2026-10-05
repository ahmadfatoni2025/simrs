<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Toast Notifications Demo</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-gray-950 text-gray-100 min-h-screen flex items-center justify-center p-8">
    <div class="max-w-2xl w-full space-y-6">
        <div class="text-center">
            <h1 class="text-3xl font-bold mb-2">Toast Notifications Demo</h1>
            <p class="text-gray-400">Next.js 16 style toast notifications (Sonner-like)</p>
        </div>

        <div class="grid gap-3 sm:grid-cols-2">
            <button onclick="testToast.error('Failed to save changes. Please try again.')" 
                class="bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30 px-4 py-3 rounded-lg transition-colors w-full">
                Show Error Toast
            </button>
            <button onclick="testToast.success('Changes saved successfully!')" 
                class="bg-green-500/20 border border-green-500/30 text-green-300 hover:bg-green-500/30 px-4 py-3 rounded-lg transition-colors w-full">
                Show Success Toast
            </button>
            <button onclick="testToast.warning('Your session will expire in 5 minutes')" 
                class="bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/30 px-4 py-3 rounded-lg transition-colors w-full">
                Show Warning Toast
            </button>
            <button onclick="testToast.info('New update available')" 
                class="bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30 px-4 py-3 rounded-lg transition-colors w-full">
                Show Info Toast
            </button>
        </div>

        <div class="border-t border-gray-800 pt-6">
            <h3 class="text-lg font-semibold mb-4">API Error Simulation</h3>
            <div class="grid gap-3 sm:grid-cols-2">
                <button onclick="fetchError()" 
                    class="bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30 px-4 py-3 rounded-lg transition-colors w-full">
                    Trigger API Error (500)
                </button>
                <button onclick="fetchSuccess()" 
                    class="bg-green-500/20 border border-green-500/30 text-green-300 hover:bg-green-500/30 px-4 py-3 rounded-lg transition-colors w-full">
                    Trigger API Success (200)
                </button>
            </div>
        </div>

        <div class="border-t border-gray-800 pt-6">
            <h3 class="text-lg font-semibold mb-4">JS Error Simulation</h3>
            <button onclick="throw new Error('Uncaught JavaScript error!')" 
                class="bg-orange-500/20 border border-orange-500/30 text-orange-300 hover:bg-orange-500/30 px-4 py-3 rounded-lg transition-colors w-full">
                Throw Uncaught JS Error
            </button>
        </div>

        <div class="border-t border-gray-800 pt-6">
            <h3 class="text-lg font-semibold mb-4">Promise Rejection Simulation</h3>
            <button onclick="Promise.reject(new Error('Failed to fetch user data'))" 
                class="bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30 px-4 py-3 rounded-lg transition-colors w-full">
                Trigger Unhandled Promise Rejection
            </button>
        </div>

        <div class="text-center text-sm text-gray-500 pt-4">
            <a href="/" class="text-indigo-400 hover:underline">← Back to Schema</a>
        </div>
    </div>

    <script>
        import { toast } from './toast.js';
        
        window.testToast = toast;

        async function fetchError() {
            try {
                await fetch('/api/test-error');
            } catch (e) {
            }
        }

        async function fetchSuccess() {
            try {
                await fetch('/api/test-success');
            } catch (e) {
            }
        }
    </script>
</body>
</html>