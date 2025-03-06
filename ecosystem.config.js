module.exports = {
    apps: [
        {
            name: 'artci-signal', // Nom de ton application
            script: 'node_modules/next/dist/bin/next', // Chemin vers le binaire Next.js
            args: 'start', // Commande pour démarrer Next.js en mode production
            env: {
                NODE_ENV: 'development', // Variables d'environnement pour développement
                PORT: 3010, // Port par défaut (modifiable selon tes besoins)
            },
            env_production: {
                NODE_ENV: 'production', // Variables pour production
                PORT: 4000, // Port personnalisé pour production
            },
            env_test: {
                NODE_ENV: 'test', // Variables pour test
                PORT: 5000, // Port pour environnement de test
            },
            instances: 1, // Une seule instance (Next.js ne bénéficie pas du mode cluster nativement)
            exec_mode: 'fork', // Mode fork (Next.js ne nécessite pas de cluster)
            watch: false, // Désactiver le watch en production pour éviter des redémarrages inutiles
            autorestart: true, // Redémarrer automatiquement en cas de crash
            max_memory_restart: '1G', // Redémarrer si la mémoire dépasse 1 Go
            cwd: './', // Répertoire de travail (racine de ton projet Next.js)
        },
    ],
};