module.exports = {
    apps: [
        {
            name: "FTP",
            script: "./index.js",
            watch: true,
            env: {
                "NODE_ENV": "production"
            }
        }
    ]
}