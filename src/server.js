import 'dotenv/config';
import app from './app/app.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
   
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();