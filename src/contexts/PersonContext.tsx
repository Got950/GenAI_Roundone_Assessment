import { createContext, useContext, useState, ReactNode } from 'react'

// Default API key - Load from environment variable
// Set VITE_GROQ_API_KEY in Vercel environment variables or .env file
const DEFAULT_API_KEY = import.meta.env.VITE_GROQ_API_KEY || ''

interface PersonContextType {
  personDetails: string
  setPersonDetails: (details: string) => void
  apiKey: string
  setApiKey: (key: string) => void
}

const PersonContext = createContext<PersonContextType | undefined>(undefined)

export function PersonProvider({ children }: { children: ReactNode }) {
  const [personDetails, setPersonDetails] = useState<string>(() => {
    const saved = localStorage.getItem('personDetails')
    if (saved) return saved
    
    // Default person details for Harshit Preetam R
    const defaultDetails = `HARSHIT PREETAM R - COMPLETE PROFILE

BASIC INFORMATION:
- Full Name: Harshit Preetam R
- Location: Hyderabad, Telangana, India
- Email: rampalliharshit@gmail.com
- Phone: +91 87927 38152
- Portfolio: https://harshit-portfolio-d3b1.vercel.app
- Experience Level: Entry-Level (0–1.5 years of hands-on project experience)
- Notice Period: 30 days
- Current CTC: ₹4,80,000
- Expected CTC: ₹7–8 LPA (negotiable)

EDUCATION:
- B.Tech in Computer Science & Engineering (AI/ML Focus) from Mahindra University (2021–2025)
- Key coursework: Machine Learning, Deep Learning, Computer Vision, Data Structures & Algorithms, Robotics, Linear Algebra, Probability, Optimization, Operating Systems, Cloud Basics

TECHNICAL SUMMARY:
Harshit is an AI Engineer with strong hands-on experience in Computer Vision (real-time detection, segmentation, tracking), LLMs (prompting, fine-tuning, tool use), RAG Pipelines (embeddings, retrieval, vector DBs), Multi-Agent AI systems (LangChain agents, shared memory, tools), Edge AI deployment (Jetson Xavier), Backend for AI (FastAPI, Flask), and Model optimization (TensorRT, quantization). He is skilled in building practical, production-ready AI systems that integrate CV + LLMs + backend automation.

TECHNICAL SKILLS:
- Programming: Python (Primary), JavaScript (basic), SQL
- Frameworks & Libraries: PyTorch, OpenCV, MediaPipe, YOLO (v5/v7), TensorRT, ONNX Runtime, NumPy/pandas
- GenAI & NLP: LangChain, LlamaIndex, Vector Databases (pgvector, Supabase), Embedding models, Prompt Engineering, RAG Systems, AI agents (context-aware, tool-using agents)
- Backend & Deployment: FastAPI, Flask, Docker, Jetson Xavier/Nano, Linux, Git
- Cloud: AWS (basic: S3, Lambda, SageMaker, Bedrock familiar)

PROJECT EXPERIENCE:
1. Autonomous Ball Detection & Dropping Robot (ABU Robocon): Built a real-time computer vision system to detect, track, and drop balls using YOLOv5. Implemented Kalman filtering for stable tracking. Optimized inference on Jetson Xavier with TensorRT. Integrated vision with robot actuation system. Achieved high accuracy in a dynamic competition environment.

2. Gesture-Based Robot Navigation: Implemented hand-gesture recognition using OpenCV + MediaPipe. Created mapping between gestures and movement commands. Designed a real-time, low-latency control pipeline.

3. Face Detection + Recognition Attendance System: Built a face recognition module using deep learning and OpenCV. Backend deployment using FastAPI. Inference sped up using TensorRT on Jetson Xavier.

4. RAG-Based SQL Query Assistant: Built an LLM-based assistant that converts natural language queries to SQL. Integrated with Supabase + pgvector. Built retrieval pipelines using LangChain. Optimized embedding and latency <1s.

5. Multi-Agent AI System: Developed agents for Retrieval, Summarization, and Verification. Used context buffers for shared memory. Improved reliability of agent outputs.

STRENGTHS & WORK STYLE:
- Strong logical reasoning & debugging skills
- Learns new technologies extremely fast
- Good communicator & concise explainer
- Enjoys building real, working systems rather than just theoretical models
- Excels in high-speed, applied engineering environments
- Adaptive, proactive, and detail-oriented

IDEAL ROLES:
AI Engineer, Machine Learning Engineer, Computer Vision Engineer, GenAI/LLM Engineer, AI Agent Developer, Edge AI Developer

PERSONAL TRAITS:
- Curious, self-driven, and highly motivated
- Prefers hands-on implementation over theory
- Interested in robotics, defense AI, and multimodal systems
- Enjoys solving end-to-end problems
- Team player with ownership mindset

ACHIEVEMENTS:
- Deployed multiple working AI systems during engineering
- Successfully implemented real-time vision systems in robotics
- Built production-grade RAG and agent workflows
- Optimized models for edge hardware performance

SUMMARY:
Harshit is an AI Engineer specializing in computer vision, LLM-based systems, RAG pipelines, and AI agents, with strong Python experience and a track record of building real-world, deployable AI applications. His experience spans robotics CV pipelines, gesture recognition, face recognition, RAG assistants, and multi-agent frameworks. He works efficiently, learns quickly, and focuses on building scalable, practical AI solutions.`
    
    localStorage.setItem('personDetails', defaultDetails)
    return defaultDetails
  })
  const [apiKey, setApiKey] = useState<string>(() => {
    // First check localStorage for saved key
    const savedKey = localStorage.getItem('groqApiKey')
    if (savedKey) return savedKey
    
    // If no saved key, use default from environment variable
    if (DEFAULT_API_KEY) {
      // Save default key to localStorage so it persists
      localStorage.setItem('groqApiKey', DEFAULT_API_KEY)
      return DEFAULT_API_KEY
    }
    
    return ''
  })

  const updatePersonDetails = (details: string) => {
    setPersonDetails(details)
    localStorage.setItem('personDetails', details)
  }

  const updateApiKey = (key: string) => {
    setApiKey(key)
    localStorage.setItem('groqApiKey', key)
  }

  return (
    <PersonContext.Provider
      value={{
        personDetails,
        setPersonDetails: updatePersonDetails,
        apiKey,
        setApiKey: updateApiKey,
      }}
    >
      {children}
    </PersonContext.Provider>
  )
}

export function usePerson() {
  const context = useContext(PersonContext)
  if (context === undefined) {
    throw new Error('usePerson must be used within a PersonProvider')
  }
  return context
}

