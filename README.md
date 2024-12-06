# Express Assignment

How to run the project
Create database, then fill the .env and rename it into real.env

```
DATABASE_URL=postgres://admin:admin@localhost:5432/lahelu
JWT_SECRET=your-secret-key

// get this sdk from https://cloudinary.com
CLOUDINARY_CLOUD_NAME=sadklaslkd
CLOUDINARY_API_KEY=skadmklas
CLOUDINARY_API_SECRET=aksjdnkajsn
```

Run migration
```
npx sequelize-cli db:migrate
```

Install and Run the project
```
npm install
npm run dev
```

import the postmant express.postman_collection.json and start to test the API
