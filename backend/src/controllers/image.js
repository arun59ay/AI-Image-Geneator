import OpenAI from 'openai';
import User from '../models/User.js';
import Image from '../models/Image.js';
import { ValidationError, ForbiddenError } from '../utils/errors.js';

// Initialize OpenAI with API key from environment variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const generateImage = async (req, res, next) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      throw new ValidationError('Prompt is required');
    }

    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured');
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      throw new ValidationError('User not found');
    }

    if (user.credits < 1) {
      throw new ForbiddenError('Not enough credits');
    }

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
    });

    const imageUrl = response.data[0].url;

    const image = new Image({
      user: user._id,
      prompt,
      imageUrl,
    });
    await image.save();

    user.credits -= 1;
    await user.save();

    res.json({
      imageUrl,
      creditsRemaining: user.credits,
    });
  } catch (error) {
    if (error.response?.status === 401) {
      next(new Error('Invalid OpenAI API key'));
    } else {
      next(error);
    }
  }
};

export const getUserImages = async (req, res, next) => {
  try {
    const images = await Image.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);
    
    res.json(images);
  } catch (error) {
    next(error);
  }
};