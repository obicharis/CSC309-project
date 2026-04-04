require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

// ─── Knowledge Base ───────────────────────────────────────────────────────────
const CHUNKS = [
  "Artificial Intelligence (AI) is a branch of Science which deals with helping machines finding solutions to complex problems in a more human-like fashion. This generally involves borrowing characteristics from human intelligence, and applying them as algorithms in a computer friendly way. AI is generally associated with Computer Science, but it has many important links with other fields such as Maths, Psychology, Cognition, Biology and Philosophy. AI was formally initiated in 1956, when the name was coined. AI currently encompasses subfields from general-purpose areas such as perception and logical reasoning, to specific tasks such as playing chess, proving mathematical theorems, writing poetry, and diagnosing diseases.",

  "Definition of Artificial Intelligence: AI is the computer-based exploration of methods for solving challenging tasks that have traditionally depended on people for solution. Such tasks include complex logical inference, diagnosis, visual recognition, comprehension of natural language, game playing, explanation, and planning. AI is concerned with developing computer systems that can store knowledge and effectively use the knowledge to help solve problems and accomplish tasks.",

  "Alternative definitions of AI: (1) AI is the study of how to make computers do things which at the moment people do better. (2) AI is a field of study that encompasses computational techniques for performing tasks that apparently require intelligence when performed by humans. (3) AI is the branch of computer science concerned with the automation of intelligent behaviour. (4) AI is the field of study that seeks to explain and emulate intelligent behaviour in terms of computational processes. (5) AI is the part of computer science concerned with designing intelligent computer systems that exhibit characteristics we associate with intelligence in human behaviour.",

  "The four possible goals in Artificial Intelligence: (1) Systems that think like humans – cognitive modelling approach. (2) Systems that act like humans – Turing Test approach. (3) Systems that think rationally – laws of thought approach using logic. (4) Systems that act rationally – rational agent approach. Historically, all four approaches have been followed. A tension exists between human-centred and rationality-centred approaches.",

  "The Turing Test, proposed by Alan Turing (1950), was designed to provide a satisfactory operational definition of intelligence. Turing defined intelligent behaviour as the ability to achieve human-level performance in cognitive tasks sufficient to fool an interrogator communicating via text. The computer would need: natural language processing, knowledge representation, automated reasoning, and machine learning. The Total Turing Test adds video signal and physical interaction. Critics include John Searle's Chinese Room argument – following rules for symbols does not imply understanding, just as a computer executing a program performs syntax without semantics.",

  "History of AI milestones: 1943 – McCulloch and Pitts proposed artificial neurons. 1950 – Alan Turing's 'Computing Machinery and Intelligence'. 1956 – Dartmouth Conference, the official birth of AI. 1957–1970 – Early enthusiasm: GPS and ELIZA chatbot. 1966–1973 – First AI Winter. 1980s – Expert systems boom and second AI Winter. 1990s – Return of statistical methods. 2012 – AlexNet deep learning breakthrough. 2017 – Transformer architecture. 2018–present – Large Language Models (BERT, GPT).",

  "Types of AI based on capabilities: (1) Narrow AI (Weak AI) – specific task only, e.g., facial recognition, spam filters. All existing AI is narrow. (2) General AI (Strong AI) – any intellectual task a human can do; does not yet exist. (3) Super AI – surpasses human intelligence; purely theoretical. Types based on functionalities: (1) Reactive Machines – no memory (e.g., IBM Deep Blue). (2) Limited Memory – uses past experiences (e.g., self-driving cars). (3) Theory of Mind – understands emotions; still under research. (4) Self-Aware AI – human-like consciousness; purely theoretical.",

  "Applications of AI: E-Commerce (personalized recommendations, fraud detection), Education (intelligent tutoring, adaptive learning), Healthcare (medical imaging, drug discovery), Navigation (GPS, Google Maps), Robotics (industrial automation, surgical robots), NLP (translation, sentiment analysis), Computer Vision (object detection, face recognition), Human Resources (resume screening), Finance (algorithmic trading). Advantages of AI: reduces human error, 24/7 availability, zero risk in dangerous tasks, digital assistants, unbiased decisions, new inventions, automation. Disadvantages: lacks creativity, no emotional intelligence, raises privacy concerns, causes job displacement, encourages laziness, over-dependence on technology.",

  "Natural Language Processing (NLP) is a subfield of AI focused on interaction between computers and humans through natural language. NLP combines computational linguistics with ML and deep learning. Key NLP tasks: Machine Translation (Google Translate), Sentiment Analysis, Named Entity Recognition (NER), Text Summarization, Question Answering, Speech Recognition, Chatbots and Virtual Assistants, Text Classification. Key NLP concepts: Tokenization, Stop word removal, Stemming, Lemmatization, POS Tagging, Parsing, Bag of Words (BoW), TF-IDF weighting, Word Embeddings (Word2Vec, GloVe), Contextual Embeddings (BERT).",

  "History of NLP: 1954 – Georgetown-IBM machine translation experiment. 1966 – ELIZA chatbot (Weizenbaum, MIT), simulated a psychotherapist via pattern-matching. 1980s – Statistical methods replacing rule-based systems. 1990s – HMMs for speech recognition. 2000s – SVM for text classification. 2010s – RNNs, LSTMs, attention mechanisms. 2017 – Transformer architecture (Vaswani et al., 'Attention is All You Need'). 2018 – BERT by Google. 2018–present – GPT series by OpenAI, large language models.",

  "The Transformer architecture (2017) revolutionized NLP. Components: Self-attention (each word attends to all others), Multi-head attention (multiple attention heads capturing different relationships), Positional encoding (encodes sequence position), Feed-forward layers, Encoder-Decoder structure. Transformers enabled BERT (bidirectional encoder) and GPT (generative decoder). Key advantage: fully parallelizable unlike RNNs, captures long-range dependencies efficiently.",

  "BERT (Bidirectional Encoder Representations from Transformers) by Google (2018): Pre-trained on Masked Language Modelling (MLM) and Next Sentence Prediction. Bidirectional – reads both left and right context simultaneously. Fine-tuned for classification, NER, and question answering. Variants: RoBERTa, ALBERT, DistilBERT. GPT by OpenAI: Unidirectional (left-to-right) decoder. GPT-1 (2018) → GPT-2 (2019) → GPT-3 (2020, 175B params) → GPT-4 (2023, multimodal). ChatGPT uses RLHF (Reinforcement Learning from Human Feedback).",

  "Word Embeddings – dense vector representations: Word2Vec (Skip-gram/CBOW), GloVe (co-occurrence statistics), FastText (sub-word). Key property: king − man + woman ≈ queen. Contextual embeddings (ELMo, BERT) produce different vectors per context, solving polysemy. Machine Learning is a subset of AI enabling systems to learn from data. Types: (1) Supervised – labelled data (classification, regression). (2) Unsupervised – unlabelled data (clustering, dimensionality reduction). (3) Reinforcement – rewards and penalties. (4) Semi-supervised – small labelled + large unlabelled data.",

  "Key ML algorithms: Linear Regression, Logistic Regression, Decision Trees, Random Forests, SVM (optimal hyperplane), KNN (nearest neighbours), Naive Bayes (Bayes theorem), Neural Networks, K-Means Clustering. Evaluation metrics: Accuracy, Precision, Recall, F1-Score, ROC-AUC (classification); MAE, MSE, RMSE, R² (regression). K-fold cross-validation estimates generalisation. Overfitting solutions: regularization (L1/L2), dropout, early stopping, data augmentation. Underfitting: increase model complexity. Bias-Variance tradeoff: high bias = underfitting, high variance = overfitting.",

  "Deep Learning uses multi-layered neural networks to automatically learn representations from raw data. Key architectures: CNN (Convolutional Neural Networks – image tasks, local features), RNN (sequential data; LSTM and GRU solve vanishing gradient), Transformers (attention-based, dominate NLP and vision), GAN (generator vs discriminator for generative tasks), Autoencoders (encoder-decoder for compression). The Perceptron (Rosenblatt, 1957) is the basic neural unit. Activation functions: Sigmoid (binary output), Tanh (zero-centred), ReLU f(x)=max(0,x) most common in hidden layers, Leaky ReLU, Softmax (multi-class output).",

  "CNN (Convolutional Neural Network) architecture: Input → Convolutional Layers (learn edges, textures, shapes via filters/kernels) → ReLU activation → Pooling (spatial downsampling, max pooling) → Fully Connected Layers → Softmax output. CNNs exploit spatial locality and translational invariance. AlexNet (2012) won ImageNet and launched the deep learning era. Modern architectures: VGG, ResNet (skip/residual connections), Inception, EfficientNet, Vision Transformer (ViT). Applications: image classification, object detection (YOLO, Faster R-CNN, SSD), segmentation, medical imaging.",

  "Backpropagation trains neural networks: (1) Forward pass – compute predictions layer by layer. (2) Compute loss (cross-entropy for classification, MSE for regression). (3) Backward pass – compute gradients using chain rule. (4) Update weights: w = w − α∇L where α is learning rate. Optimizers: SGD (stochastic gradient descent), Adam (adaptive, most popular), RMSProp, Adagrad. Transfer Learning: reuse pre-trained models (ResNet, BERT) and fine-tune for new tasks. Benefits: less data needed, faster training, better performance on small datasets.",

  "Reinforcement Learning (RL): an agent learns by interacting with an environment to maximize cumulative reward. Key concepts: Agent, Environment, State, Action, Reward, Policy, Value Function. Mathematical framework: Markov Decision Process (MDP). Algorithms: Q-Learning (state-action values), Deep Q-Network (DQN – combines Q-learning with deep neural networks), Policy Gradient methods, Actor-Critic methods. Famous examples: AlphaGo (2016) defeated world champion using MCTS + deep RL. AlphaZero mastered chess, shogi, and Go from self-play only.",

  "Expert Systems emulate human expert decision-making. Components: (1) Knowledge Base – domain facts and rules. (2) Inference Engine – applies rules via forward chaining (data-driven) or backward chaining (goal-driven). (3) User Interface. Examples: MYCIN (medical diagnosis, antibiotics), DENDRAL (chemistry, molecular structure), XCON (computer configuration). Limitation: knowledge acquisition bottleneck. Knowledge Representation methods: Semantic Networks, Frames, Propositional Logic, First-Order Logic (FOL) with quantifiers (∀ ∃), Production Rules (IF-THEN), Ontologies. Bayesian Networks handle uncertainty probabilistically.",

  "Search algorithms: Uninformed: BFS (breadth-first, complete, optimal), DFS (depth-first, memory efficient), Uniform Cost Search, Iterative Deepening DFS. Informed: Greedy Best-First Search, A* algorithm uses f(n) = g(n) + h(n) – complete and optimal when heuristic is admissible. Local search: Hill Climbing, Simulated Annealing, Genetic Algorithms (selection, crossover, mutation). Game Playing: Minimax (two-player zero-sum), Alpha-Beta Pruning (doubles effective search depth), Monte Carlo Tree Search (MCTS). CSP: backtracking, arc consistency (AC-3), MRV heuristic.",

  "Computer Vision enables machines to interpret visual information. Tasks: Image Classification, Object Detection (YOLO, Faster R-CNN), Image Segmentation (semantic/instance), Facial Recognition, OCR, Pose Estimation. Image recognition pipeline: (1) Acquisition, (2) Preprocessing (resize, normalize, denoise), (3) Feature Extraction (edges, corners, shapes, textures), (4) Classification using ML or DL. Traditional methods: edge detection (Sobel, Canny), template matching. Deep learning (CNN, DNN) gives highest accuracy. Advantages: fast, accurate, continuous operation. Limitations: requires large datasets, sensitive to image quality, high computational cost.",

  "Ethical issues in AI: (1) Bias and Fairness – AI amplifies training data biases. (2) Privacy – mass data collection and surveillance. (3) Accountability – who is responsible for AI decisions? (4) Transparency – XAI (Explainable AI) uses LIME and SHAP for interpretability. (5) Job Displacement – automation replacing workers. (6) Autonomous Weapons. (7) Digital Divide. AI Safety: ensuring AI acts in accordance with human values. Governance: EU AI Act (risk-based regulation), GDPR (right to explanation). Future trends: AGI, quantum AI, neuromorphic computing, federated learning, multimodal AI, human-AI collaboration.",

  "Speech Recognition pipeline: (1) Audio preprocessing (noise reduction, framing). (2) Feature extraction (MFCC – Mel-Frequency Cepstral Coefficients). (3) Acoustic model (features to phonemes). (4) Language model (word sequences). (5) Decoder combines both. Modern end-to-end systems: DeepSpeech, Whisper by OpenAI. Probabilistic reasoning: Bayes' Theorem P(A|B) = P(B|A)·P(A)/P(B). Bayesian Networks: directed acyclic graphs for probabilistic dependencies. Fuzzy Logic: allows degrees of truth between 0 and 1. HMMs (Hidden Markov Models) for sequential data. Kalman Filters for robotics state estimation.",

  "Robotics combines sensors (cameras, LIDAR, sonar), actuators (motors, joints), and AI for physical tasks. SLAM (Simultaneous Localisation and Mapping) builds a map while tracking position in real time. Applications: manufacturing assembly lines, surgery (da Vinci robot), exploration (Mars rovers), household (Roomba), autonomous vehicles. Autonomous vehicles use AI for: perception (sensors), localisation (GPS + HD maps), prediction (movement of other agents), path planning, and control (throttle, brake, steering). SAE Levels of autonomy: 0 (no automation) to 5 (fully autonomous).",

  "The CSC 309 course (Introduction to Artificial Intelligence) covers: AI fundamentals and history, Problem solving and search algorithms, Knowledge representation and reasoning, Machine learning (supervised, unsupervised, reinforcement), Deep learning and neural networks, Natural Language Processing (NLP), Computer Vision and Image Recognition, Robotics and autonomous systems, AI Ethics and future directions. The course is taught by A.F. Kana and uses compiled lecture notes as the primary resource.",
];

// ─── Stopwords & Retrieval ────────────────────────────────────────────────────
const SW = new Set(["the","and","for","are","but","not","you","all","any","can","had","her","was","one","our","out","get","has","him","his","how","its","may","new","now","own","see","two","who","did","does","each","from","have","into","more","such","than","that","them","then","they","this","with","been","also","some","what","when","will","your","about","after","their","there","these","those","which","would","could","should","other","being","used","using","both"]);

function tokenize(t) {
  return t.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(w => w.length > 2 && !SW.has(w));
}

function retrieve(query, k = 5) {
  const qt = tokenize(query);
  return CHUNKS
    .map(c => ({ c, s: qt.reduce((s, t) => { const m = (c.toLowerCase().match(new RegExp(`\\b${t}`, "g")) || []).length; return s + (m > 0 ? 1 + Math.log(1 + m) : 0); }, 0) }))
    .filter(x => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, k)
    .map(x => x.c);
}

// ─── API Route ────────────────────────────────────────────────────────────────
app.post("/api/ask", async (req, res) => {
  const { question } = req.body;
  if (!question || typeof question !== "string" || question.trim().length < 2) {
    return res.status(400).json({ error: "Question is required." });
  }
  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: "Server not configured. Set GEMINI_API_KEY in .env" });
  }

  const context = retrieve(question).join("\n\n---\n\n");

  const prompt = `You are a helpful tutor for CSC 309 – Introduction to Artificial Intelligence. Answer the student's question using ONLY the course material context provided below. Be clear, structured, and educational. Use numbered lists or bullet points where helpful. If the answer is not covered in the context, say so honestly.

COURSE MATERIAL:
${context}

STUDENT QUESTION:
${question.trim()}`;

  try {
    const geminiRes = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 1024, temperature: 0.4 },
      }),
    });

    if (!geminiRes.ok) {
      const err = await geminiRes.json();
      return res.status(geminiRes.status).json({ error: err.error?.message || "Gemini API error" });
    }

    const data = await geminiRes.json();
    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
    res.json({ answer });
  } catch (err) {
    console.error("Gemini fetch error:", err.message);
    res.status(500).json({ error: "Failed to reach Gemini API." });
  }
});

// ─── Fallback ─────────────────────────────────────────────────────────────────
app.get("*", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ CSC 309 AI Tutor running on http://localhost:${PORT}`));
