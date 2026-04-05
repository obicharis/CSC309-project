
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const API_KEY = process.env.API_KEY;

const CHUNKS = [
  "Artificial Intelligence (AI) is a branch of Science which deals with helping machines finding solutions to complex problems in a more human-like fashion. AI was formally initiated in 1956. It encompasses subfields from perception and logical reasoning to chess, medical diagnosis, and language understanding.",
  "Definition of AI: AI is the computer-based exploration of methods for solving challenging tasks traditionally dependent on people, including logical inference, diagnosis, visual recognition, natural language comprehension, game playing, and planning.",
  "Alternative definitions of AI: (1) Study of how to make computers do things people do better. (2) Computational techniques for tasks requiring intelligence when done by humans. (3) Automation of intelligent behaviour. (4) Explains and emulates intelligent behaviour computationally. (5) Designing systems that understand language, learn, reason, and solve problems.",
  "Four goals of AI: (1) Systems that think like humans – cognitive modelling. (2) Systems that act like humans – Turing Test approach. (3) Systems that think rationally – logic-based. (4) Systems that act rationally – rational agent approach.",
  "The Turing Test (Alan Turing, 1950): a machine is intelligent if indistinguishable from a human in text conversation. Requires NLP, knowledge representation, automated reasoning, machine learning. Searle's Chinese Room argues syntax without semantics is not true understanding.",
  "AI history: 1943 artificial neurons, 1950 Turing Test, 1956 Dartmouth Conference, 1966 ELIZA chatbot, 1970s first AI winter, 1980s expert systems, 1990s statistical methods, 2012 AlexNet deep learning, 2017 Transformer, 2018 BERT and GPT.",
  "Types of AI by capability: Narrow AI (specific tasks, all current AI), General AI (any human task, does not exist yet), Super AI (beyond human, theoretical). By functionality: Reactive Machines (no memory, e.g. Deep Blue), Limited Memory (self-driving cars), Theory of Mind (research stage), Self-Aware (theoretical).",
  "AI applications: E-Commerce (recommendations, fraud detection), Education (tutoring, adaptive learning), Healthcare (imaging, drug discovery), Navigation (GPS), Robotics (automation, surgery), NLP (translation, sentiment), Computer Vision (detection, recognition), HR (resume screening), Finance (trading). Advantages: less error, 24/7, automation. Disadvantages: no creativity, job displacement, privacy concerns.",
  "NLP (Natural Language Processing): subfield of AI for human-computer language interaction. Tasks: Machine Translation, Sentiment Analysis, NER, Text Summarization, Question Answering, Speech Recognition, Chatbots. Techniques: Tokenization, Stemming, Lemmatization, POS Tagging, Bag of Words, TF-IDF, Word2Vec, GloVe, BERT embeddings.",
  "NLP history: 1954 machine translation, 1966 ELIZA, 1980s statistical methods, 1990s HMMs, 2000s SVMs, 2010s RNNs/LSTMs, 2017 Transformer (Attention is All You Need), 2018 BERT, 2018-present GPT series.",
  "Transformer architecture (2017): Self-attention (each word attends to all others), Multi-head attention, Positional encoding, Feed-forward layers, Encoder-Decoder structure. Fully parallelizable, captures long-range dependencies. Basis for BERT and GPT.",
  "BERT (Google, 2018): bidirectional, pre-trained on Masked Language Modelling and Next Sentence Prediction, fine-tuned for classification/NER/QA. Variants: RoBERTa, ALBERT, DistilBERT. GPT (OpenAI): unidirectional decoder, GPT-1 to GPT-4 (175B params, multimodal), ChatGPT uses RLHF.",
  "Word Embeddings: Word2Vec (Skip-gram/CBOW), GloVe (co-occurrence), FastText (sub-word). Property: king-man+woman=queen. Contextual: ELMo, BERT. Machine Learning types: Supervised (labelled data), Unsupervised (clustering, PCA), Reinforcement (rewards), Semi-supervised.",
  "ML algorithms: Linear/Logistic Regression, Decision Trees, Random Forests, SVM, KNN, Naive Bayes, Neural Networks, K-Means. Metrics: Accuracy, Precision, Recall, F1, ROC-AUC, MAE, MSE, R2. Overfitting fix: L1/L2 regularization, dropout, early stopping. Underfitting fix: more complexity.",
  "Deep Learning: multi-layer neural networks. CNN (images, convolutional filters), RNN/LSTM/GRU (sequences), Transformers (attention), GAN (generative), Autoencoders (compression). Perceptron (Rosenblatt 1957). Activations: Sigmoid, Tanh, ReLU (most common), Softmax.",
  "CNN architecture: Input -> Convolutional layers (edges/textures/shapes) -> ReLU -> Pooling -> Fully Connected -> Softmax. AlexNet won ImageNet 2012. Architectures: VGG, ResNet (skip connections), EfficientNet, ViT. Used for classification, YOLO/Faster R-CNN detection, segmentation, medical imaging.",
  "Backpropagation: forward pass, compute loss (cross-entropy/MSE), backward pass via chain rule, update weights w=w-alpha*gradient. Optimizers: SGD, Adam (most popular), RMSProp. Transfer Learning: reuse pretrained models (ResNet, BERT), fine-tune for new tasks.",
  "Reinforcement Learning: agent maximizes cumulative reward via MDP framework. Q-Learning, DQN, Policy Gradient, Actor-Critic. AlphaGo defeated world champion (2016). AlphaZero mastered chess, shogi, Go from self-play.",
  "Expert Systems: Knowledge Base (facts/rules) + Inference Engine (forward/backward chaining) + UI. Examples: MYCIN (medicine), DENDRAL (chemistry), XCON (computers). Knowledge Representation: Semantic Networks, Frames, Propositional Logic, FOL (forall, exists), Production Rules, Ontologies, Bayesian Networks, Fuzzy Logic.",
  "Search algorithms: BFS, DFS, Uniform Cost, Iterative Deepening (uninformed). A* uses f(n)=g(n)+h(n), optimal with admissible heuristic. Hill Climbing, Simulated Annealing, Genetic Algorithms (local search). Minimax + Alpha-Beta Pruning for games. MCTS for Go. CSP: backtracking, AC-3, MRV.",
  "Computer Vision tasks: Image Classification, Object Detection (YOLO, Faster R-CNN), Segmentation, Face Recognition, OCR, Pose Estimation. Pipeline: Acquisition, Preprocessing, Feature Extraction, Classification. Traditional: Sobel/Canny edges, template matching. DL (CNN) gives best accuracy. Advantages: fast, accurate, tireless. Limits: needs big data, sensitive to lighting.",
  "AI Ethics: Bias/Fairness, Privacy, Accountability, Transparency (XAI uses LIME/SHAP), Job Displacement, Autonomous Weapons, Digital Divide. EU AI Act, GDPR. Future: AGI, Quantum AI, Neuromorphic computing, Federated Learning, Multimodal AI, Human-AI collaboration.",
  "Robotics: sensors (cameras, LIDAR), actuators (motors), SLAM for mapping and localisation. Applications: manufacturing, surgery (da Vinci), Mars rovers, Roomba, autonomous vehicles. SAE Levels 0-5. Speech Recognition: MFCC features, acoustic model, language model, decoder. Whisper (OpenAI). Bayes Theorem: P(A|B)=P(B|A)*P(A)/P(B). HMMs for sequences.",
  "CSC 309 Introduction to Artificial Intelligence covers: AI history and fundamentals, search algorithms, knowledge representation, machine learning, deep learning, NLP, computer vision, robotics, ethics. Taught by A.F. Kana.",
];

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

app.post("/api/ask", async (req, res) => {
  const { question } = req.body;
  if (!question || question.trim().length < 2) {
    return res.status(400).json({ error: "Question is required." });
  }
  if (!API_KEY) {
    return res.status(500).json({ error: "API_KEY not set on server." });
  }

  const context = retrieve(question).join("\n\n---\n\n");
  const prompt = `You are a helpful tutor for CSC 309 – Introduction to Artificial Intelligence. Answer using ONLY the course material below. Be clear and use numbered lists or bullets where helpful. If not in context, say so.\n\nCOURSE MATERIAL:\n${context}\n\nSTUDENT QUESTION:\n${question.trim()}`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct:free",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      return res.status(response.status).json({ error: err.error?.message || "API error" });
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || "No response.";
    res.json({ answer });
  } catch (err) {
    res.status(500).json({ error: "Failed to reach API: " + err.message });
  }
});

app.get("*", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
