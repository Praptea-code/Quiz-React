// SET A — Original questions
export const SET_A = {
  ior: [
    { q: "What does CIDR stand for in networking?", a: "Classless Inter-Domain Routing" },
    { q: "What is the default port for HTTPS?", a: "443" },
    { q: "What OSI layer does TCP operate on?", a: "Layer 4 – Transport Layer" },
    { q: "What does DNS stand for?", a: "Domain Name System" },
    { q: "What is the IPv4 loopback address?", a: "127.0.0.1" },
    { q: "What type of cable transmits data using light pulses?", a: "Fiber optic cable" },
    { q: "What protocol is used for secure remote login?", a: "SSH (Secure Shell)" },
    { q: "What does NAT stand for in networking?", a: "Network Address Translation" },
    { q: "What is the maximum theoretical speed of USB 3.2 Gen 2×2?", a: "20 Gbps" },
    { q: "Which layer of the OSI model handles MAC addresses?", a: "Layer 2 – Data Link Layer" },
  ],
  robotics: [
    { q: "What sensor uses sound waves to measure distance?", a: "Ultrasonic sensor" },
    { q: "What does DOF stand for in robotics?", a: "Degrees of Freedom" },
    { q: "What is the name of Boston Dynamics' famous bipedal robot?", a: "Atlas" },
    { q: "What type of motor gives precise angular position control?", a: "Servo motor" },
    { q: "What does ROS stand for?", a: "Robot Operating System" },
    { q: "Which sensor measures orientation and rotation?", a: "Gyroscope / IMU" },
    { q: "What is inverse kinematics used for?", a: "Calculating joint angles needed to reach a target end-effector position" },
    { q: "What is a LIDAR sensor used for?", a: "Measuring distances using laser light for mapping and navigation" },
    { q: "What does PID stand for in control systems?", a: "Proportional, Integral, Derivative" },
    { q: "What is the term for a robot's end-effector?", a: "The tool or device at the end of a robotic arm (gripper, welding tip, etc.)" },
  ],
  cloud: [
    { q: "What does IaaS stand for?", a: "Infrastructure as a Service" },
    { q: "Which AWS service runs serverless functions?", a: "AWS Lambda" },
    { q: "What is the Google Cloud equivalent of AWS S3?", a: "Google Cloud Storage" },
    { q: "What does CDN stand for?", a: "Content Delivery Network" },
    { q: "What is Kubernetes used for?", a: "Container orchestration – managing containerized applications" },
    { q: "What does SLA stand for in cloud services?", a: "Service Level Agreement" },
    { q: "What is the difference between vertical and horizontal scaling?", a: "Vertical = more power to one machine; Horizontal = adding more machines" },
    { q: "What cloud model is used exclusively by one organization?", a: "Private cloud" },
    { q: "What does DevOps combine?", a: "Development and IT Operations" },
    { q: "What is Docker used for?", a: "Containerizing applications with their dependencies" },
  ],
  ai: [
    { q: "What does GPT stand for?", a: "Generative Pre-trained Transformer" },
    { q: "What is the purpose of an activation function in a neural network?", a: "To introduce non-linearity into the network" },
    { q: "What does CNN stand for in deep learning?", a: "Convolutional Neural Network" },
    { q: "What is overfitting in machine learning?", a: "When a model performs well on training data but poorly on unseen data" },
    { q: "What is gradient descent?", a: "An optimization algorithm that minimizes loss by iteratively adjusting weights" },
    { q: "What does NLP stand for?", a: "Natural Language Processing" },
    { q: "What is the transformer architecture best known for?", a: "The attention mechanism for processing sequences in parallel" },
    { q: "What is reinforcement learning?", a: "An ML approach where an agent learns by interacting with an environment to maximize rewards" },
    { q: "What is the difference between supervised and unsupervised learning?", a: "Supervised uses labeled data; Unsupervised finds patterns in unlabeled data" },
    { q: "What is a word embedding?", a: "A dense vector representation of words in a continuous space" },
  ],
  iq: [
    { q: "A train travels 60 km in 40 minutes. What is its speed in km/h?", a: "90 km/h" },
    { q: "If you have 3 apples and take away 2, how many apples do YOU have?", a: "2 (the ones you took)" },
    { q: "What comes next: 2, 6, 12, 20, 30, ?", a: "42 — pattern is n×(n+1)" },
    { q: "A bat and ball cost $1.10. The bat costs $1 more than the ball. How much is the ball?", a: "$0.05 (5 cents)" },
    { q: "How many squares are in a 4×4 grid (including overlapping squares)?", a: "30 squares (16+9+4+1)" },
    { q: "What is the next number: 1, 1, 2, 3, 5, 8, 13, ?", a: "21 — Fibonacci sequence" },
    { q: "If all Bloops are Razzies and all Razzies are Lazzies, are all Bloops Lazzies?", a: "Yes" },
    { q: "A man drives A→B at 30 mph and returns at 60 mph. What is his average speed?", a: "40 mph (harmonic mean)" },
    { q: "I have 2 coins totaling 30 cents. One is not a nickel. What are the coins?", a: "A quarter and a nickel (the OTHER one is not a nickel)" },
    { q: "What 3-digit number is a perfect cube and ends in 5?", a: "125 (5³)" },
  ],
};

// SET B — New sample questions
export const SET_B = {
  ior: [
    { q: "What does HTTP stand for?", a: "HyperText Transfer Protocol" },
    { q: "What is the purpose of a subnet mask?", a: "To divide an IP address into network and host portions" },
    { q: "What does VPN stand for?", a: "Virtual Private Network" },
    { q: "Which port does FTP use by default?", a: "Port 21" },
    { q: "What is the difference between TCP and UDP?", a: "TCP is connection-oriented and reliable; UDP is connectionless and faster but unreliable" },
    { q: "What does DHCP stand for?", a: "Dynamic Host Configuration Protocol" },
    { q: "What is a MAC address?", a: "A unique hardware identifier assigned to a network interface card" },
    { q: "What does ARP stand for?", a: "Address Resolution Protocol" },
    { q: "What is the purpose of a firewall?", a: "To monitor and control incoming/outgoing network traffic based on security rules" },
    { q: "What is the maximum number of hosts on a /24 subnet?", a: "254 usable hosts" },
  ],
  robotics: [
    { q: "What is the difference between open-loop and closed-loop control?", a: "Open-loop has no feedback; closed-loop uses sensor feedback to adjust" },
    { q: "What does SLAM stand for in robotics?", a: "Simultaneous Localization and Mapping" },
    { q: "What is a stepper motor?", a: "A motor that moves in discrete steps for precise positioning without encoders" },
    { q: "What sensor detects the presence of objects without contact?", a: "Proximity sensor (IR or capacitive)" },
    { q: "What does Cartesian robot mean?", a: "A robot that moves along 3 linear axes (X, Y, Z)" },
    { q: "What is the purpose of an encoder in robotics?", a: "To measure rotation/position of a motor shaft" },
    { q: "What is teleoperation?", a: "Controlling a robot remotely by a human operator" },
    { q: "What does the acronym UAV stand for?", a: "Unmanned Aerial Vehicle (drone)" },
    { q: "What is human-robot interaction (HRI)?", a: "The study of how humans and robots communicate and work together" },
    { q: "What programming language is commonly used with Arduino robots?", a: "C/C++ (Arduino's simplified version)" },
  ],
  cloud: [
    { q: "What is serverless computing?", a: "Running code without managing servers — the provider handles infrastructure" },
    { q: "What does PaaS stand for?", a: "Platform as a Service" },
    { q: "What is cloud bursting?", a: "Using public cloud resources when on-premise capacity is exceeded" },
    { q: "What does S3 stand for in AWS?", a: "Simple Storage Service" },
    { q: "What is auto-scaling?", a: "Automatically adjusting the number of servers based on demand" },
    { q: "What is a microservice architecture?", a: "Breaking an application into small, independently deployable services" },
    { q: "What is the difference between a region and an availability zone in AWS?", a: "A region is a geographic area; an AZ is an isolated data center within a region" },
    { q: "What is CI/CD?", a: "Continuous Integration / Continuous Delivery — automating build, test, and deploy" },
    { q: "What is a container registry?", a: "A storage service for Docker container images (e.g., Docker Hub, ECR)" },
    { q: "What is Infrastructure as Code (IaC)?", a: "Managing and provisioning infrastructure through machine-readable config files" },
  ],
  ai: [
    { q: "What is a confusion matrix?", a: "A table showing true positives, false positives, true negatives, false negatives" },
    { q: "What does GAN stand for?", a: "Generative Adversarial Network" },
    { q: "What is transfer learning?", a: "Using a pre-trained model as a starting point for a new task" },
    { q: "What is the purpose of dropout in neural networks?", a: "To prevent overfitting by randomly disabling neurons during training" },
    { q: "What is precision in machine learning?", a: "The ratio of true positives to all positive predictions" },
    { q: "What is tokenization in NLP?", a: "Splitting text into smaller units (tokens) like words or subwords" },
    { q: "What is a hyperparameter?", a: "A configuration value set before training that controls the learning process" },
    { q: "What does BERT stand for?", a: "Bidirectional Encoder Representations from Transformers" },
    { q: "What is the vanishing gradient problem?", a: "When gradients become too small during backpropagation, stopping deep networks from learning" },
    { q: "What is prompt engineering?", a: "Crafting inputs to guide an LLM toward desired outputs" },
  ],
  iq: [
    { q: "What is 15% of 200?", a: "30" },
    { q: "Mary's father has 4 daughters: Spring, Summer, Autumn, and who?", a: "Mary" },
    { q: "How many months have 28 days?", a: "All 12 months" },
    { q: "A rooster lays an egg on top of a barn. Which way does it roll?", a: "Roosters don't lay eggs" },
    { q: "If you overtake the 2nd place person in a race, what place are you in?", a: "2nd place" },
    { q: "Which is heavier: a ton of feathers or a ton of steel?", a: "Neither — they both weigh one ton" },
    { q: "What has hands but can't clap?", a: "A clock" },
    { q: "A farmer has 17 sheep and all but 9 die. How many sheep are left?", a: "9 sheep" },
    { q: "What number becomes zero when you remove half of it?", a: "8 (remove the top half → 0)" },
    { q: "What occurs once in a minute, twice in a moment, but never in a thousand years?", a: "The letter M" },
  ],
};

export const GENRE_META = {
  ior:      { label: "IOR",      emoji: "🌐", color: "#00f5ff" },
  robotics: { label: "ROBOTICS", emoji: "🤖", color: "#ff6b35" },
  cloud:    { label: "CLOUD",    emoji: "☁️",  color: "#00ff88" },
  ai:       { label: "AI",       emoji: "🧠", color: "#b347ff" },
  iq:       { label: "IQ",       emoji: "💡", color: "#ffd700" },
};

export function allQuestions(set) {
  const src = set === 'B' ? SET_B : SET_A;
  let arr = [];
  for (const g in src) src[g].forEach((q, i) => arr.push({ ...q, genre: g, idx: i }));
  return arr;
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
