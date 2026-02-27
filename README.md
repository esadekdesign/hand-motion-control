<p align="center">
  <img src="./Preview.gif" alt="Prism-Check-CAPTCHA preview" width="900" />
</p>

## **The Idea**

This experiment uses real-time hand-tracking to turn simple open- and closed-hand gestures into playful, intuitive control of a 3D particle object. 


## **How It Works**

The camera detects your hands using MediaPipe, allowing the system to interpret your gestures in real time. When you open your hand, the 3D particle object expands outward, and when you close your hand, it contracts or scales down. Every movement updates instantly, creating a direct, responsive connection between your hand motion and the behavior of the particles.


## **Notes**

Performance may vary based on camera quality and GPU strength of your computer.


## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
