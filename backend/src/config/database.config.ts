import {registerAs} from '@nestjs/config';

export default registerAs('database',()=>({
    url:process.env.DATABASE_URL || 'postgresql://postgres:harisraj@localhost:5433/postgres',
    host:process.env.DB_HOST ,
    port:parseInt(process.env.DB_PORT ||'5432'),
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD ,
    name:process.env.DB_NAME,
}))