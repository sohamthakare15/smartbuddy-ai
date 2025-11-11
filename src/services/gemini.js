import { GoogleGenAI, Type } from "@google/genai";
import { API_CONFIG } from '../../config.js';

let ai = null;

export const initializeAi = () => {
    if (ai) return;
    
    if (!API_CONFIG.GEMINI_API_KEY || API_CONFIG.GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
        console.error("⚠️ API_KEY not configured. Please update config.js with your Gemini API key.");
        console.error("Get your key from: https://aistudio.google.com/app/apikey");
        throw new Error("AI not initialized: API key is missing or not configured.");
    }
    
    ai = new GoogleGenAI({ apiKey: API_CONFIG.GEMINI_API_KEY });
};

const getSystemInstruction = (personality = 'mentor') => {
    switch (personality) {
        case 'funny':
            return "You are SmartBuddy, an AI study mentor for university students. Your personality is funny and witty. You use jokes, puns, and sarcasm to make learning entertaining, but still provide accurate information. Use emojis to match your humorous tone. 🤡😂🤪";
        case 'strict':
            return "You are SmartBuddy, a strict AI study mentor for university students. Your tone is direct, no-nonsense, and demanding. You push the user to be disciplined and focused. No emojis, no sugar-coating. Your goal is to ensure the user achieves peak performance through rigorous guidance.";
        case 'mentor':
        default:
            return "You are SmartBuddy, an AI study mentor for university students. Your tone is encouraging, supportive, and slightly playful. Use emojis to make the conversation engaging. You help students with study plans, explaining complex topics simply, and providing motivation. When the user provides an image, you act as an expert doubt solver. Analyze the image and provide a clear, step-by-step explanation for the question or concept shown. Keep your responses concise and actionable.";
    }
};

export const sendMessageToAI = async (message, history, image, personality = 'mentor') => {
    initializeAi();
    if (!ai) {
        return "Sorry, I'm having trouble connecting to my brain right now. Please check your API key configuration in config.js";
    }

    try {
        const systemInstruction = getSystemInstruction(personality);

        const contents = history
            .slice(1)
            .filter(msg => msg.text || msg.image)
            .map(msg => {
                const parts = [];
                if (msg.text) {
                    parts.push({ text: msg.text });
                }
                if (msg.image) {
                    parts.push({
                        inlineData: {
                            data: msg.image.data,
                            mimeType: msg.image.mimeType,
                        }
                    });
                }
                return {
                    role: msg.sender === 'user' ? 'user' : 'model',
                    parts: parts,
                };
            });
        
        const currentUserParts = [];
        if (message) {
            currentUserParts.push({ text: message });
        }
        if (image) {
            currentUserParts.push({
                inlineData: {
                    data: image.data,
                    mimeType: image.mimeType,
                },
            });
        }
        contents.push({ role: 'user', parts: currentUserParts });

        const response = await ai.models.generateContent({
            model: API_CONFIG.MODEL_NAME,
            contents: contents,
            config: {
                systemInstruction: systemInstruction,
            },
        });

        return response.text;
    } catch (error) {
        console.error("Error sending message to Gemini:", error);
        return "Oops! Something went wrong. Let's try that again.";
    }
};

export const breakDownTaskWithAI = async (taskTitle) => {
    initializeAi();
    if (!ai) {
        throw new Error("AI not initialized");
    }

    try {
        const response = await ai.models.generateContent({
            model: API_CONFIG.MODEL_NAME,
            contents: `You are an expert study planner. Break down the following complex study task into 3 to 5 smaller, actionable sub-tasks. For each sub-task, provide a title and suggest an appropriate XP reward between 25 and 100 based on its complexity. The task is: '${taskTitle}'.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: {
                                type: Type.STRING,
                                description: 'The title of the sub-task.',
                            },
                            xp: {
                                type: Type.NUMBER,
                                description: 'The XP reward for the sub-task, between 25 and 100.',
                            },
                        },
                        required: ["title", "xp"],
                    },
                },
            },
        });

        const jsonString = response.text.trim();
        const subTasks = JSON.parse(jsonString);
        
        if (!Array.isArray(subTasks)) {
            throw new Error("AI response is not an array.");
        }

        return subTasks.map(st => ({
            title: st.title,
            xp: st.xp,
        }));

    } catch (error) {
        console.error("Error breaking down task with Gemini:", error);
        throw new Error("Sorry, I couldn't break down that task. Please try again or add it manually.");
    }
};

export const generateQuizWithAI = async (topic) => {
    initializeAi();
    if (!ai) {
        throw new Error("AI not initialized");
    }

    try {
        const response = await ai.models.generateContent({
            model: API_CONFIG.MODEL_NAME,
            contents: `You are an expert educator. Create a short, engaging multiple-choice quiz on the topic: "${topic}". The quiz should have exactly 3 questions. For each question, provide 4 options and indicate the correct one.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        topic: {
                            type: Type.STRING,
                            description: "The topic of the quiz."
                        },
                        questions: {
                            type: Type.ARRAY,
                            description: "An array of quiz questions.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    question: {
                                        type: Type.STRING,
                                        description: "The question text."
                                    },
                                    options: {
                                        type: Type.ARRAY,
                                        description: "An array of 4 possible answers.",
                                        items: { type: Type.STRING }
                                    },
                                    correctAnswerIndex: {
                                        type: Type.NUMBER,
                                        description: "The 0-based index of the correct answer in the options array."
                                    }
                                },
                                required: ["question", "options", "correctAnswerIndex"]
                            }
                        }
                    },
                    required: ["topic", "questions"]
                },
            },
        });

        const jsonString = response.text.trim();
        const quizData = JSON.parse(jsonString);

        if (!quizData.questions || !Array.isArray(quizData.questions)) {
            throw new Error("AI response did not contain valid questions.");
        }

        return quizData;

    } catch (error) {
        console.error("Error generating quiz with Gemini:", error);
        throw new Error("Sorry, I couldn't generate that quiz. Please try a different topic.");
    }
};

export const generateStudyPlanWithAI = async (tasks) => {
    initializeAi();
    if (!ai) {
        throw new Error("AI not initialized");
    }

    const uncompletedTasks = tasks.filter(task => !task.completed);

    if (uncompletedTasks.length === 0) {
        return "Looks like you've completed all your tasks for today! Great job! 🎉 Maybe it's time for a well-deserved break? Or we can brainstorm some new goals for tomorrow!";
    }

    const taskList = uncompletedTasks.map(task => `- ${task.title} (+${task.xp} XP)`).join('\n');

    const prompt = `You are SmartBuddy, an AI study mentor for university students. Your tone is encouraging, supportive, and slightly playful. Use emojis to make the conversation engaging.
    
Based on the user's current list of uncompleted tasks, generate a concise and actionable study plan for today. Group tasks logically if possible and suggest a schedule or order to tackle them. Keep it brief and motivating.

Here are the user's remaining tasks:
${taskList}
`;

    try {
        const response = await ai.models.generateContent({
            model: API_CONFIG.MODEL_NAME,
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error generating study plan with Gemini:", error);
        throw new Error("Sorry, I couldn't generate a study plan right now. Please try again in a moment.");
    }
};
