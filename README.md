# Birthday Card Generator

A modern web application that lets users create and share personalized digital birthday cards. Built with Next.js 13+ and MongoDB.

## Features

- 🎨 **Customizable Themes**: Choose from different themes (Friend, Family, Love) with unique color schemes
- 📝 **Personalized Messages**: Add custom birthday messages
- 🎵 **Slideshow Support**: Create slideshows with up to 5 slides, each with:
  - Custom messages
  - Image uploads
  - Real-time image preview
- ☁️ **Cloud Storage**: Image hosting via Cloudinary
- 🔗 **Easy Sharing**: Shareable links for recipients
- 💫 **Modern UI**: Responsive design with glassmorphism effects
- 🚀 **Fast Performance**: Built with Next.js App Router and server components

## Tech Stack

- **Frontend**: Next.js 13+, React, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Image Storage**: Cloudinary
- **State Management**: React Hooks + Local Storage
- **Styling**: TailwindCSS with custom animations
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 16.8 or later
- MongoDB database
- Cloudinary account

### Environment Variables

Create a `.env.local` file in the root directory with:

```env
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/birthday-card-generator.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── create/            # Card creation pages
│   └── view/              # Card viewing pages
├── components/            # React components
├── lib/                   # Utility functions and configurations
│   ├── cardStorage.ts     # Local storage management
│   ├── cloudinary.ts      # Cloudinary configuration
│   ├── mongodb.ts         # MongoDB connection
│   └── themeStyles.ts     # Theme configurations
└── models/               # MongoDB models
    └── BirthdayCard.ts   # Birthday card schema
```

## Features in Detail

### Card Creation

- Input fields for sender and recipient names
- Rich text area for main birthday message
- Theme selection with live preview
- Optional slideshow creation

### Slideshow Creation

- Up to 5 slides per card
- Each slide supports:
  - Custom message
  - Image upload with preview
  - Real-time upload status

### Card Viewing

- Responsive layout for all devices
- Multiple viewing options:
  - Full card view
  - Slideshow mode
  - Letter mode
  - Wish mode

### Sharing

- Unique URL for each card
- Easy copy-to-clipboard functionality
- Preview before sharing

## Performance Optimization

- Images optimized through Cloudinary
- Next.js Image component for optimal loading
- Lazy loading for slideshow images
- Suspense boundaries for better loading states

## Security Features

- File type validation for uploads
- File size limits (max 10MB)
- Secure URL generation
- MongoDB sanitization

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Cloudinary for image hosting
- MongoDB for database services
