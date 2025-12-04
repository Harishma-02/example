export default()=>({
    port:parseInt(process.env.PORT as string, 10)||3000,
    cors:{
        origin:'*',
        methods:'GET,HEAD,PUT,PATCH,POST,DELETE',
    },
    JWT:{
        secret:process.env.JWT_SECRET ||'default_secret',
        expiresIn:'10m',
    },
    database:{
        url:process.env.DATABASE_URL,
    },
})