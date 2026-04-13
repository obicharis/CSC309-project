const express = require("express");
const cors = require("cors");
const path = require("path");
const natural = require("natural");

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.API_KEY;

// ─── DATASET ─────────────────────────────────────────────────────────────────
// Q&A pairs derived from CSC 309 lecture notes.
// Each entry: { question, answer, label }
// Label is the topic class the classifier learns to map questions to.

const DATASET = [
  // AI FUNDAMENTALS
  { label: "ai_definition", question: "what is artificial intelligence", answer: "Artificial Intelligence (AI) is a branch of Science which deals with helping machines find solutions to complex problems in a more human-like fashion. It involves borrowing characteristics from human intelligence and applying them as algorithms in a computer-friendly way. AI was formally initiated in 1956 at the Dartmouth Conference." },
  { label: "ai_definition", question: "define artificial intelligence", answer: "AI is the computer-based exploration of methods for solving challenging tasks traditionally dependent on people, including logical inference, diagnosis, visual recognition, comprehension of natural language, game playing, and planning." },
  { label: "ai_definition", question: "what does AI stand for", answer: "AI stands for Artificial Intelligence — the science of making machines perform tasks that normally require human intelligence such as reasoning, learning, problem-solving, and language understanding." },
  { label: "ai_definition", question: "who created artificial intelligence", answer: "AI as a formal field was created at the 1956 Dartmouth Conference by John McCarthy, Marvin Minsky, Claude Shannon, and others. Alan Turing laid the theoretical foundation in 1950 with his paper 'Computing Machinery and Intelligence'." },
  { label: "ai_definition", question: "what are the goals of AI", answer: "The four goals of AI are: (1) Systems that think like humans – cognitive modelling approach. (2) Systems that act like humans – Turing Test approach. (3) Systems that think rationally – laws of thought using logic. (4) Systems that act rationally – rational agent approach." },

  // TURING TEST
  { label: "turing_test", question: "what is the turing test", answer: "The Turing Test, proposed by Alan Turing in 1950, is a test of machine intelligence. A machine passes if it can converse via text in a way indistinguishable from a human. The machine requires NLP, knowledge representation, automated reasoning, and machine learning." },
  { label: "turing_test", question: "explain the turing test", answer: "The Turing Test involves an interrogator communicating via text with both a human and a machine. If the interrogator cannot reliably tell which is which, the machine passes. It defines intelligent behaviour as achieving human-level performance in cognitive tasks." },
  { label: "turing_test", question: "what is the chinese room argument", answer: "John Searle's Chinese Room argument (1980) states that a person following rules to respond to Chinese symbols doesn't understand Chinese — they only perform syntax without semantics. Similarly, a computer running a program performs symbol manipulation without true understanding." },
  { label: "turing_test", question: "who proposed the turing test", answer: "Alan Turing proposed the Turing Test in his 1950 paper 'Computing Machinery and Intelligence'. He defined intelligence as the ability to exhibit behaviour indistinguishable from that of a human in text-based conversation." },

  // AI HISTORY
  { label: "ai_history", question: "what is the history of AI", answer: "Key AI milestones: 1943 – artificial neurons by McCulloch & Pitts. 1950 – Turing Test proposed. 1956 – Dartmouth Conference (birth of AI). 1966 – ELIZA chatbot. 1970s – First AI Winter. 1980s – Expert systems boom. 1990s – Statistical methods. 2012 – AlexNet deep learning breakthrough. 2017 – Transformer architecture. 2018 – BERT and GPT." },
  { label: "ai_history", question: "what was the first AI program", answer: "One of the first AI programs was the Logic Theorist (1956) by Newell and Simon, which proved mathematical theorems. ELIZA (1966) by Weizenbaum was the first chatbot, simulating conversation via pattern matching." },
  { label: "ai_history", question: "what is an AI winter", answer: "An AI Winter is a period of reduced funding and interest in AI research. The first AI Winter occurred in the 1970s after early AI systems failed to scale. The second occurred in the late 1980s after expert systems proved too brittle and expensive to maintain." },
  { label: "ai_history", question: "when was AI invented", answer: "AI was formally initiated at the Dartmouth Conference in 1956, where the name 'Artificial Intelligence' was coined by John McCarthy. However, foundational work began in the early 1950s with Alan Turing's theoretical work and McCulloch & Pitts' neural network models in 1943." },

  // TYPES OF AI
  { label: "types_of_ai", question: "what are the types of AI", answer: "By capability: (1) Narrow AI – designed for specific tasks, all current AI. (2) General AI – can perform any human intellectual task, does not yet exist. (3) Super AI – surpasses human intelligence in all areas, purely theoretical. By functionality: Reactive Machines, Limited Memory, Theory of Mind, Self-Aware AI." },
  { label: "types_of_ai", question: "what is narrow AI", answer: "Narrow AI (Weak AI) is AI designed for one specific task, such as facial recognition, spam filtering, or playing chess. All AI that exists today is narrow AI — it cannot transfer learning to other domains." },
  { label: "types_of_ai", question: "what is general AI", answer: "General AI (Strong AI or AGI) refers to a hypothetical AI system that can perform any intellectual task that a human can do. It does not currently exist. Unlike Narrow AI, it would reason, learn, and adapt across any domain." },
  { label: "types_of_ai", question: "what is reactive machine AI", answer: "Reactive Machines are the simplest type of AI — they have no memory and only respond to current inputs. IBM's Deep Blue chess computer is an example. It cannot use past experiences to inform future decisions." },
  { label: "types_of_ai", question: "what is limited memory AI", answer: "Limited Memory AI can use past experiences to inform current decisions. Self-driving cars are the primary example — they observe the environment over time and use recent data to make driving decisions." },

  // MACHINE LEARNING
  { label: "machine_learning", question: "what is machine learning", answer: "Machine Learning (ML) is a subset of AI that enables systems to learn from data and improve without being explicitly programmed. Instead of writing rules manually, ML algorithms find patterns in data automatically." },
  { label: "machine_learning", question: "what are types of machine learning", answer: "Types of ML: (1) Supervised Learning – learning from labelled data (classification, regression). (2) Unsupervised Learning – finding patterns in unlabelled data (clustering, dimensionality reduction). (3) Reinforcement Learning – learning through rewards and penalties. (4) Semi-supervised Learning – small labelled + large unlabelled data." },
  { label: "machine_learning", question: "what is supervised learning", answer: "Supervised Learning trains a model on labelled input-output pairs. The algorithm learns to map inputs to correct outputs. Examples: spam detection (classification), house price prediction (regression). Common algorithms: Linear Regression, Logistic Regression, SVM, Decision Trees, Neural Networks." },
  { label: "machine_learning", question: "what is unsupervised learning", answer: "Unsupervised Learning finds patterns in unlabelled data without predefined correct answers. Techniques include clustering (K-Means, hierarchical), dimensionality reduction (PCA), and association rules. Used for customer segmentation and anomaly detection." },
  { label: "machine_learning", question: "what is reinforcement learning", answer: "Reinforcement Learning (RL) is where an agent learns by interacting with an environment to maximize cumulative reward. Key concepts: Agent, State, Action, Reward, Policy. Framework: Markov Decision Process (MDP). Examples: AlphaGo, game-playing AI, robotic control." },
  { label: "machine_learning", question: "what is overfitting", answer: "Overfitting occurs when a model learns training data too well, including noise, and fails to generalize to new data. Solutions: L1/L2 regularization, dropout, early stopping, data augmentation, cross-validation, and collecting more training data." },
  { label: "machine_learning", question: "what is underfitting", answer: "Underfitting occurs when a model is too simple to capture the underlying patterns in data. The model performs poorly on both training and test data. Solutions: increase model complexity, train longer, add more features, reduce regularization." },
  { label: "machine_learning", question: "what is the bias variance tradeoff", answer: "The bias-variance tradeoff describes the tension between two sources of error. High bias = underfitting (model too simple). High variance = overfitting (model too complex). The goal is to find a balance that minimizes total error on unseen data." },
  { label: "machine_learning", question: "what are ML evaluation metrics", answer: "Classification metrics: Accuracy, Precision, Recall, F1-Score, ROC-AUC, Confusion Matrix. Regression metrics: MAE (Mean Absolute Error), MSE (Mean Squared Error), RMSE, R². Cross-validation (k-fold) estimates how well a model generalizes to unseen data." },
  { label: "machine_learning", question: "what is cross validation", answer: "Cross-validation is a technique to evaluate ML models by splitting data into k folds. The model trains on k-1 folds and tests on the remaining fold, repeating k times. K-fold cross-validation gives a more reliable estimate of model performance than a single train-test split." },

  // DEEP LEARNING
  { label: "deep_learning", question: "what is deep learning", answer: "Deep Learning is a subset of Machine Learning using multi-layered neural networks (deep neural networks) to automatically learn representations from raw data. It excels at image recognition, speech recognition, and NLP tasks without manual feature engineering." },
  { label: "deep_learning", question: "what is a neural network", answer: "A neural network is a computational model inspired by the human brain, consisting of layers of interconnected nodes (neurons). It includes an input layer, one or more hidden layers, and an output layer. Each connection has a weight adjusted during training via backpropagation." },
  { label: "deep_learning", question: "what is the perceptron", answer: "The Perceptron, invented by Frank Rosenblatt in 1957, is the simplest neural network unit. It takes inputs, multiplies them by weights, sums them up, and passes the result through an activation function. A single perceptron can only classify linearly separable data." },
  { label: "deep_learning", question: "what are activation functions", answer: "Activation functions introduce non-linearity into neural networks. Common ones: Sigmoid (range 0–1, binary output), Tanh (range -1 to 1, zero-centred), ReLU f(x)=max(0,x) (most common in hidden layers), Leaky ReLU (fixes dying ReLU), Softmax (multi-class output probabilities)." },
  { label: "deep_learning", question: "what is backpropagation", answer: "Backpropagation trains neural networks by: (1) Forward pass – compute predictions. (2) Compute loss (cross-entropy or MSE). (3) Backward pass – compute gradients using chain rule. (4) Update weights: w = w − α∇L. Optimizers include SGD, Adam (most popular), RMSProp, and Adagrad." },
  { label: "deep_learning", question: "what is a CNN", answer: "A Convolutional Neural Network (CNN) is a deep learning architecture designed for image processing. Architecture: Input → Convolutional layers (detect edges, textures, shapes) → ReLU → Pooling (downsampling) → Fully Connected layers → Softmax output. CNNs exploit spatial locality and translational invariance." },
  { label: "deep_learning", question: "how does a convolutional neural network work", answer: "CNNs use convolutional filters/kernels that slide over input images to detect local features like edges and textures. Each layer learns increasingly complex features. Pooling layers reduce spatial dimensions. AlexNet (2012) won ImageNet and launched the deep learning era. Modern architectures: VGG, ResNet (skip connections), EfficientNet, Vision Transformer (ViT)." },
  { label: "deep_learning", question: "what is an RNN", answer: "A Recurrent Neural Network (RNN) is designed for sequential data. It maintains a hidden state that captures information about past inputs. The vanishing gradient problem makes training long sequences difficult. LSTM (Long Short-Term Memory) and GRU (Gated Recurrent Unit) solve this using gating mechanisms." },
  { label: "deep_learning", question: "what is LSTM", answer: "LSTM (Long Short-Term Memory) is an RNN architecture that solves the vanishing gradient problem using three gates: input gate (what new info to store), forget gate (what to discard), output gate (what to output). LSTMs can learn long-range dependencies in sequential data like text and speech." },
  { label: "deep_learning", question: "what is transfer learning", answer: "Transfer Learning reuses a model trained on one task for a different but related task. Fine-tuning updates some or all layers of a pre-trained model. Feature extraction freezes pre-trained layers and only trains new layers. Pre-trained models: VGG, ResNet (vision); BERT, GPT (NLP). Benefits: less data, faster training." },
  { label: "deep_learning", question: "what is a GAN", answer: "A Generative Adversarial Network (GAN) consists of two networks: a Generator (creates fake data) and a Discriminator (distinguishes real from fake). They compete in a minimax game until the generator produces realistic data. Used for image synthesis, deepfakes, data augmentation." },

  // NLP
  { label: "nlp", question: "what is NLP", answer: "Natural Language Processing (NLP) is a subfield of AI focused on enabling computers to understand, interpret, and generate human language. It combines computational linguistics with ML and deep learning. Applications include machine translation, sentiment analysis, chatbots, and question answering." },
  { label: "nlp", question: "what is natural language processing", answer: "NLP enables computers to process human language. Key tasks: Machine Translation (Google Translate), Sentiment Analysis, Named Entity Recognition (NER), Text Summarization, Question Answering, Speech Recognition. Techniques: Tokenization, TF-IDF, Word2Vec, Transformers." },
  { label: "nlp", question: "what is tokenization", answer: "Tokenization is the process of breaking text into smaller units called tokens — typically words or subwords. For example, 'I love AI' becomes ['I', 'love', 'AI']. It is the first step in most NLP pipelines before further processing like stemming or embedding." },
  { label: "nlp", question: "what is stemming and lemmatization", answer: "Stemming reduces words to their root form by cutting suffixes (running → run, better → bett). Lemmatization reduces words to their dictionary base form using vocabulary and morphological analysis (better → good, running → run). Lemmatization is more accurate but slower than stemming." },
  { label: "nlp", question: "what is TF-IDF", answer: "TF-IDF (Term Frequency–Inverse Document Frequency) measures word importance in a document relative to a corpus. TF = how often a word appears in a document. IDF = penalizes words that appear in many documents. High TF-IDF means the word is important and distinctive to that document." },
  { label: "nlp", question: "what are word embeddings", answer: "Word embeddings are dense vector representations of words that capture semantic meaning. Word2Vec (Skip-gram/CBOW) trains on large corpora to position similar words close together. GloVe uses global co-occurrence statistics. FastText handles subwords. Key property: king − man + woman ≈ queen." },
  { label: "nlp", question: "what is the transformer architecture", answer: "The Transformer (Vaswani et al., 2017) revolutionized NLP. Components: Self-attention (each word attends to all others), Multi-head attention (multiple attention heads), Positional encoding (encodes sequence position), Feed-forward layers, Encoder-Decoder structure. Fully parallelizable, captures long-range dependencies. Basis for BERT and GPT." },
  { label: "nlp", question: "what is BERT", answer: "BERT (Bidirectional Encoder Representations from Transformers) by Google (2018) is pre-trained on Masked Language Modelling and Next Sentence Prediction. It reads both left and right context simultaneously (bidirectional). Fine-tuned for classification, NER, QA. Variants: RoBERTa, ALBERT, DistilBERT." },
  { label: "nlp", question: "what is GPT", answer: "GPT (Generative Pre-trained Transformer) by OpenAI is a unidirectional (left-to-right) language model. GPT-1 (2018) → GPT-2 (2019) → GPT-3 (2020, 175B parameters) → GPT-4 (2023, multimodal). ChatGPT is GPT fine-tuned with RLHF (Reinforcement Learning from Human Feedback)." },
  { label: "nlp", question: "what is sentiment analysis", answer: "Sentiment Analysis (opinion mining) uses NLP to determine the emotional tone of text — positive, negative, or neutral. It's used in social media monitoring, product reviews, and customer feedback analysis. Approaches range from lexicon-based methods to deep learning classifiers." },
  { label: "nlp", question: "what is named entity recognition", answer: "Named Entity Recognition (NER) identifies and classifies named entities in text into categories such as Person, Organization, Location, Date, and Money. Example: 'Elon Musk founded SpaceX in 2002' → Person: Elon Musk, Organization: SpaceX, Date: 2002." },
  { label: "nlp", question: "what is ELIZA", answer: "ELIZA (1966) was an early NLP program created at MIT by Joseph Weizenbaum. Its DOCTOR script simulated a Rogerian psychotherapist by pattern-matching user input to scripted responses. Despite its simplicity, users attributed understanding to it — known as the ELIZA effect." },

  // EXPERT SYSTEMS
  { label: "expert_systems", question: "what is an expert system", answer: "Expert Systems are AI programs that emulate the decision-making of human experts. Components: (1) Knowledge Base – domain facts and rules. (2) Inference Engine – applies rules using forward chaining (data-driven) or backward chaining (goal-driven). (3) User Interface. Examples: MYCIN (medicine), DENDRAL (chemistry), XCON (computers)." },
  { label: "expert_systems", question: "what is a knowledge base", answer: "A Knowledge Base stores the domain-specific facts and rules used by an expert system. It contains declarative knowledge (facts about the world) and procedural knowledge (rules for reasoning). Knowledge acquisition from human experts is the main bottleneck in building expert systems." },
  { label: "expert_systems", question: "what is forward chaining", answer: "Forward chaining is a data-driven inference strategy used in expert systems. It starts from known facts and applies rules to derive new conclusions, continuing until the goal is reached or no more rules apply. Used when all data is known upfront and the goal is to discover what conclusions follow." },
  { label: "expert_systems", question: "what is backward chaining", answer: "Backward chaining is a goal-driven inference strategy. It starts from the desired goal and works backward to find the facts and rules that support it. Used in diagnostic systems where you know what you're trying to prove and need to find supporting evidence." },

  // SEARCH ALGORITHMS
  { label: "search_algorithms", question: "what is BFS", answer: "Breadth-First Search (BFS) explores all nodes at the current depth before moving deeper. It is complete (always finds a solution if one exists) and optimal for uniform-cost problems. Memory usage is O(b^d) where b is branching factor and d is depth. Used in shortest path problems." },
  { label: "search_algorithms", question: "what is DFS", answer: "Depth-First Search (DFS) explores as far as possible along each branch before backtracking. It uses less memory than BFS (O(bm) where m is max depth) but is not guaranteed to find the shortest path. It may get stuck in infinite loops without cycle detection." },
  { label: "search_algorithms", question: "what is the A star algorithm", answer: "A* is an informed search algorithm using f(n) = g(n) + h(n), where g(n) is the cost to reach node n and h(n) is the heuristic estimate to the goal. A* is complete and optimal when the heuristic is admissible (never overestimates). It's widely used in pathfinding and game AI." },
  { label: "search_algorithms", question: "what is a heuristic", answer: "A heuristic is an estimate used to guide search algorithms toward the goal more efficiently. An admissible heuristic never overestimates the true cost to reach the goal. In A*, the Manhattan distance or Euclidean distance are common heuristics for grid-based pathfinding." },
  { label: "search_algorithms", question: "what is minimax", answer: "The Minimax algorithm is used for two-player zero-sum games. The maximizing player tries to maximize their score while the minimizing player minimizes it. The algorithm explores all possible moves to the end of the game. Alpha-Beta Pruning eliminates branches that cannot affect the final decision, doubling effective search depth." },
  { label: "search_algorithms", question: "what is alpha beta pruning", answer: "Alpha-Beta Pruning is an optimization of the Minimax algorithm that prunes branches that cannot affect the final decision. Alpha is the best value the maximizer can guarantee; beta is the best value the minimizer can guarantee. It effectively doubles the search depth without changing the result." },
  { label: "search_algorithms", question: "what is genetic algorithm", answer: "Genetic Algorithms are optimization algorithms inspired by natural selection. Steps: (1) Initialize population (chromosomes). (2) Evaluate fitness. (3) Select parents. (4) Apply crossover (recombine genes) and mutation (random changes). (5) Replace old population. Repeat until convergence. Used for optimization, scheduling, and neural architecture search." },

  // KNOWLEDGE REPRESENTATION
  { label: "knowledge_representation", question: "what is knowledge representation", answer: "Knowledge Representation is how AI stores and organizes knowledge for reasoning. Methods: Semantic Networks (graph-based), Frames (stereotyped situations), Propositional Logic (true/false statements), First-Order Logic (predicates and quantifiers ∀ ∃), Production Rules (IF-THEN), Ontologies (formal domain descriptions)." },
  { label: "knowledge_representation", question: "what is propositional logic", answer: "Propositional Logic deals with statements that are either true or false. Connectives: AND (∧), OR (∨), NOT (¬), IMPLIES (→), IFF (↔). Modus Ponens: if P and P→Q then Q. It forms the basis of automated reasoning in AI but cannot represent objects or relationships." },
  { label: "knowledge_representation", question: "what is first order logic", answer: "First-Order Logic (FOL or Predicate Logic) extends propositional logic with predicates, variables, and quantifiers. Universal quantifier (∀): 'for all'. Existential quantifier (∃): 'there exists'. Example: ∀x Human(x) → Mortal(x) means 'all humans are mortal'." },
  { label: "knowledge_representation", question: "what is a bayesian network", answer: "A Bayesian Network is a directed acyclic graph representing probabilistic relationships among variables. Each node represents a variable and each edge represents a conditional dependency. It uses Bayes' Theorem P(A|B) = P(B|A)·P(A)/P(B) to update beliefs given new evidence." },
  { label: "knowledge_representation", question: "what is fuzzy logic", answer: "Fuzzy Logic extends classical logic to handle degrees of truth between 0 and 1, rather than strictly true or false. Example: temperature can be 'somewhat hot' (0.7) rather than just hot or not hot. Used in control systems, appliances, and decision-making under uncertainty." },

  // COMPUTER VISION
  { label: "computer_vision", question: "what is computer vision", answer: "Computer Vision enables machines to interpret and understand visual information from images and videos. Key tasks: Image Classification, Object Detection (YOLO, Faster R-CNN), Image Segmentation, Facial Recognition, OCR (text extraction), and Pose Estimation. CNNs are the dominant approach." },
  { label: "computer_vision", question: "how does image recognition work", answer: "Image recognition pipeline: (1) Image Acquisition. (2) Preprocessing – resize, normalize, denoise. (3) Feature Extraction – detect edges, corners, shapes, textures. (4) Classification using ML/DL. Traditional methods: Sobel/Canny edge detection, template matching. Deep learning (CNN) gives highest accuracy. AlexNet (2012) launched the modern era." },
  { label: "computer_vision", question: "what is object detection", answer: "Object Detection locates and classifies multiple objects in an image simultaneously. It outputs bounding boxes and class labels. Key algorithms: YOLO (You Only Look Once) – single-pass, real-time detection. Faster R-CNN – region proposal network for high accuracy. SSD (Single Shot MultiBox Detector)." },
  { label: "computer_vision", question: "what is image segmentation", answer: "Image Segmentation assigns a class label to every pixel in an image. Semantic segmentation classifies each pixel by category. Instance segmentation distinguishes between separate objects of the same class. Used in medical imaging, autonomous vehicles, and satellite imagery analysis." },

  // ROBOTICS
  { label: "robotics", question: "what is robotics", answer: "Robotics involves designing, building, and programming robots that can perceive, reason, and act. Key components: Sensors (cameras, LIDAR, sonar), Actuators (motors, joints), Control systems, Planning algorithms. AI enables robots to navigate, manipulate objects, and interact with humans." },
  { label: "robotics", question: "what is SLAM", answer: "SLAM (Simultaneous Localisation and Mapping) is a technique where a robot builds a map of an unknown environment while simultaneously tracking its own location within it. It is fundamental to autonomous navigation in robots and self-driving vehicles." },
  { label: "robotics", question: "what are self driving cars", answer: "Autonomous vehicles use AI for: Perception (cameras, LIDAR, radar detect environment), Localisation (GPS + HD maps + SLAM), Prediction (forecasting other agents' movements), Path Planning (finding safe routes), Control (throttle, brake, steering commands). SAE defines 6 levels of autonomy (0–5)." },

  // AI ETHICS
  { label: "ai_ethics", question: "what are ethical issues in AI", answer: "Key AI ethics issues: (1) Bias and Fairness – AI amplifies training data biases. (2) Privacy – mass data collection. (3) Accountability – who is responsible for AI decisions? (4) Transparency – XAI uses LIME and SHAP for interpretability. (5) Job Displacement. (6) Autonomous Weapons. (7) Digital Divide. Governance: EU AI Act, GDPR." },
  { label: "ai_ethics", question: "what is explainable AI", answer: "Explainable AI (XAI) makes AI decisions interpretable to humans. LIME (Local Interpretable Model-agnostic Explanations) approximates model behaviour locally. SHAP (SHapley Additive exPlanations) assigns each feature an importance value. Saliency maps highlight important image regions in CNNs." },
  { label: "ai_ethics", question: "what is AI bias", answer: "AI bias occurs when a model produces systematically unfair results due to biased training data or algorithm design. Examples: facial recognition systems performing worse on darker skin tones, hiring algorithms favouring male candidates. Mitigation: diverse datasets, fairness constraints, regular auditing." },

  // APPLICATIONS
  { label: "ai_applications", question: "what are the applications of AI", answer: "AI applications: E-Commerce (recommendations, fraud detection), Education (intelligent tutoring, adaptive learning), Healthcare (medical imaging, drug discovery, AlphaFold for protein structures), Navigation (GPS, Google Maps), Robotics (automation, surgical robots), NLP (translation, chatbots), Finance (algorithmic trading), HR (resume screening)." },
  { label: "ai_applications", question: "how is AI used in healthcare", answer: "AI in Healthcare: Medical Imaging (CNN for X-ray, MRI, CT scan analysis), Drug Discovery (predicting molecular interactions), Clinical Decision Support (expert systems for diagnosis), NLP for Electronic Health Records, Personalised Medicine (genomics + AI), Remote Patient Monitoring, AlphaFold (protein structure prediction)." },
  { label: "ai_applications", question: "advantages of AI", answer: "Advantages of AI: (1) Reduces human error when programmed correctly. (2) Available 24/7 without fatigue. (3) Can work in dangerous environments (zero risk to humans). (4) Processes large data rapidly for better decisions. (5) Powers digital assistants (Siri, Alexa). (6) Drives new inventions. (7) Automates repetitive tasks. (8) Can make unbiased decisions." },
  { label: "ai_applications", question: "disadvantages of AI", answer: "Disadvantages of AI: (1) Lacks creativity – cannot think outside training data. (2) No emotional intelligence or empathy. (3) Encourages human laziness and over-dependence. (4) Raises serious privacy concerns through mass data collection. (5) Causes job displacement through automation. (6) High development and maintenance costs." },

  // SPEECH RECOGNITION
  { label: "speech_recognition", question: "what is speech recognition", answer: "Speech Recognition converts spoken language to text. Pipeline: (1) Audio preprocessing (noise reduction, framing). (2) Feature extraction using MFCC (Mel-Frequency Cepstral Coefficients). (3) Acoustic model (features → phonemes). (4) Language model (word sequences). (5) Decoder combines both. Modern systems: DeepSpeech, Whisper (OpenAI end-to-end)." },
  { label: "speech_recognition", question: "what is MFCC", answer: "MFCC (Mel-Frequency Cepstral Coefficients) are features extracted from audio signals for speech recognition. They represent the short-term power spectrum of sound on a mel scale that approximates human auditory perception. MFCCs are the standard input features for acoustic models in speech recognition." },
];

// ─── TRAIN NAIVE BAYES CLASSIFIER ────────────────────────────────────────────
const classifier = new natural.BayesClassifier();

console.log("Training Naive Bayes classifier on", DATASET.length, "examples...");
DATASET.forEach(({ question, label }) => {
  classifier.addDocument(question, label);
});
classifier.train();
console.log("Training complete. Classes:", [...new Set(DATASET.map(d => d.label))].length);

// ─── ANSWER LOOKUP ────────────────────────────────────────────────────────────
// Build map: label → array of answers
const answerMap = {};
DATASET.forEach(({ label, answer }) => {
  if (!answerMap[label]) answerMap[label] = [];
  answerMap[label].push(answer);
});

function getLocalAnswer(question) {
  const label = classifier.classify(question.toLowerCase());
  const answers = answerMap[label] || [];
  if (answers.length === 0) return null;
  // Return the most relevant answer by keyword overlap
  const words = question.toLowerCase().split(/\s+/);
  let best = answers[0];
  let bestScore = 0;
  answers.forEach(ans => {
    const score = words.filter(w => ans.toLowerCase().includes(w)).length;
    if (score > bestScore) { bestScore = score; best = ans; }
  });
  return { label, answer: best };
}

// ─── API ROUTE ────────────────────────────────────────────────────────────────
app.post("/api/ask", async (req, res) => {
  const { question } = req.body;
  if (!question || question.trim().length < 2) {
    return res.status(400).json({ error: "Question is required." });
  }

  // Step 1: classify question with trained Naive Bayes
  const local = getLocalAnswer(question);

  // Step 2: use classified answer as context for LLM to elaborate
  if (!API_KEY) {
    // No LLM key — return classifier answer directly
    return res.json({ answer: local?.answer || "I could not find an answer in the course material.", label: local?.label });
  }

  const context = local?.answer || "General AI course material";
  const prompt = `You are a helpful tutor for CSC 309 – Introduction to Artificial Intelligence.
A Naive Bayes classifier determined this question is about: "${local?.label?.replace(/_/g, " ")}"

Use the following course material context to answer the student's question clearly and in detail.
Add structure (numbered lists or bullets) where helpful.

COURSE CONTEXT:
${context}

STUDENT QUESTION:
${question.trim()}`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "openrouter/auto",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      // Fall back to classifier answer if LLM fails
      return res.json({ answer: local?.answer || "API error: " + (err.error?.message || response.status), label: local?.label });
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || local?.answer || "No response.";
    res.json({ answer, label: local?.label });
  } catch (err) {
    // Fall back to classifier answer on network error
    res.json({ answer: local?.answer || "Network error: " + err.message, label: local?.label });
  }
});

// ─── STATIC & FALLBACK ────────────────────────────────────────────────────────
app.use(express.static(__dirname));
app.get("*", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`CSC 309 AI Tutor running on port ${PORT}`));
