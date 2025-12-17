export default()=>({
    port:parseInt(process.env.PORT ||'super_secret_key_123', 10)||3000,
    cors:{
        origin:'*',
        methods:'GET,HEAD,PUT,PATCH,POST,DELETE',
    },
    JWT:{
        secret:process.env.JWT_SECRET ||'super_secret_key_123',
        expiresIn:'10m',
    },
    database:{
        url:process.env.DATABASE_URL,
    },
})