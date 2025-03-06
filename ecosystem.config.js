module.exports = {
    apps: [
        {
            name: 'artci-signal',
            script: '/root/ARTCI/artci-signal/node_modules/next/dist/bin/next',
            args: 'dev -p 5000', // Mode dev avec port personnalisé
            env: {
                NODE_ENV: 'development', // Par défaut
                PORT: 3000,
            },
            env_production: {
                NODE_ENV: 'production',
                PORT: 4000,
            },
            env_test: {
                NODE_ENV: 'test', // Environnement test
                PORT: 5000,
            },
            instances: 1,
            exec_mode: 'fork',
            watch: true, // Activer le watch pour un environnement de test/dev
            autorestart: true,
            max_memory_restart: '1G',
            cwd: '/root/ARTCI/artci-signal',
        },
    ],
};