# VideoShare

VideoShare is a full-featured video sharing platform where creators and viewers connect through engaging video content. Built with the MERN stack, it offers a seamless experience for uploading, discovering, and interacting with videos.

🔗 App Link: [https://videoshare.shubhamprakash681.in/](https://videoshare.shubhamprakash681.in/)

## Features

- 🎬 **Create Your Channel** - Build your personal video hub

- 👍 **Engagement Tools** - Like, dislike, and comment on videos

- 🔔 **Subscription System** - Follow favorite creators

- 📁 **Playlists** - Organize videos into collections

- 🔍 **Smart Search** - Fuzzy search powered by MongoDB Atlas

- ☁ **Smooth Streaming** - Cloudinary-powered video storage

## How to Use VideoShare 🚀

### 👤 For Viewers

1.**Browse Videos**

- Explore trending/public videos on homepage
- 🔍 Use search bar to find specific content

2.**Watch Videos**

- Click any video thumbnail to play
- 👍/👎 Rate videos with like/dislike buttons
- 💬 Add comments below the player

3.**Manage Content**

- ➕ Create playlists to organize favorite videos

### 🎥 For Creators

1.**Setup Your Channel**

- Sign up → Go to _My Channel_ → Add profile picture and banner to personalize your Channel

2.**Upload Videos**

- Go to _Dashboard_ → _Upload Video_ to upload Videos to your Channel
- Add title, description, thumbnail (required)
- By Default, Videos are _Public_ to everyone

3.**Manage Content**

- Get Channel Stats on _Dashboard_
- Edit/delete videos from _Dashboard_

4.**Engage Audience**

- Reply to viewer comments
- Like/Dislike Viewers comments

## Tech Stack 🛠️

| Frontend          | Backend | Database | Services     |
| ----------------- | ------- | -------- | ------------ |
| React.js          | Node.js | MongoDB  | Cloudinary   |
| Redux             | Express | Mongoose | JWT Auth     |
| Shadcn + Tailwind | Axios   | Atlas    | Fuzzy Search |

## Installation & Setup

### VideoShare API

Clone the repository:

```bash
    git clone https://github.com/shubhamprakash681/videoshare-server.git
```

Navigate to the API directory:

```bash
    cd videoshare-server
```

Install dependencies:

```bash
  npm install
```

Add Environment Variables

- Copy all variables from .env.sample to a new .env file
- Fill in your API credentials:

```bash
    NODE_ENV='development'
    # NODE_ENV='production'

    PORT=5000

    # MongoDB Atlas
    MONGODB_URI=""

    ORIGIN='your frontend link'
    CLIENT_BASE_URI='your frontend link'

    # JWT
    ACCESS_TOKEN_SECRET=""
    ACCESS_TOKEN_EXPIRY=
    REFRESH_TOKEN_SECRET=""
    REFRESH_TOKEN_EXPIRY=
    ACCESS_COOKIE_EXPIRE=  # COOKIE_EXPIRE<Number> in terms of days
    REFRESH_COOKIE_EXPIRE=  # COOKIE_EXPIRE<Number> in terms of days

    # Cloudinary
    CLOUDINARY_CLOUD_NAME=''
    CLOUDINARY_API_KEY=''
    CLOUDINARY_API_SECRET=''
    CLOUDINARY_API_ENVIRONMENT=''

    # nodemailer
    SMTP_HOST=''
    SMTP_PORT=
    SMTP_SECURE=''
    SMTP_SERVICE_NAME=''
    SMTP_MAIL_ID=''
    SMTP_PSWD=''
```

Run development API Server:

```bash
  npm run dev
```

API will be available on:

```bash
  http://localhost:5000/api/v1
```

### VideoShare UI

Clone the repository:

```bash
    git clone https://github.com/shubhamprakash681/videoshare.git
```

Navigate to the API directory:

```bash
    cd videoshare
```

Install dependencies:

```bash
  npm install
```

Add Environment Variables

- Copy all variables from .env.sample to a new .env file
- Fill in your UI credentials:

```bash
    NODE_ENV='development'

    VITE_APP_API_BASE_URL='http://localhost:5000' # on localhost
```

Run development UI Server:

```bash
  npm run dev
```

UI will be available on:

```bash
  http://localhost:5173/
```

## Contributing

Contributions are always welcome!

## Deployment

- API is deployed on Linux VM on Azure.
- UI is deployed on Vercel.

## License

[MIT](https://choosealicense.com/licenses/mit/)
