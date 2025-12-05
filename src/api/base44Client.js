// Base44 API Client with localStorage backend
// Local storage implementation for forum and game data

// Initialize demo data if needed
function initializeDemoData() {
  const hasInitialized = localStorage.getItem('nird-demo-initialized');
  if (hasInitialized) return;

  // Demo forum posts
  const demoPosts = [
    {
      id: 'demo-1',
      title: 'Migration réussie vers LibreOffice dans mon établissement',
      content: 'Bonjour à tous ! Je voulais partager notre expérience de migration vers LibreOffice. Nous avons commencé il y a 6 mois et c\'est un succès ! Les enseignants ont été formés et les élèves s\'adaptent bien. Économie de 15 000€ par an sur les licences Microsoft.',
      category: 'experience',
      author_name: 'Marie D.',
      likes: 12,
      replies_count: 5,
      useful_count: 8,
      marked_useful: true,
      created_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'demo-2',
      title: 'Comment gérer la résistance au changement lors d\'une migration ?',
      content: 'Nous prévoyons de migrer vers des solutions libres mais certains enseignants sont réticents. Avez-vous des conseils pour faciliter l\'adoption ?',
      category: 'question',
      author_name: 'Pierre L.',
      likes: 7,
      replies_count: 3,
      useful_count: 4,
      marked_useful: false,
      created_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'demo-3',
      title: 'Ressources pour sensibiliser aux enjeux du numérique responsable',
      content: 'Je cherche des ressources pédagogiques pour sensibiliser mes élèves au numérique responsable. Des vidéos, des activités, des outils interactifs... Qu\'est-ce qui fonctionne bien selon vous ?',
      category: 'resource',
      author_name: 'Sophie M.',
      likes: 15,
      replies_count: 8,
      useful_count: 12,
      marked_useful: true,
      created_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'demo-4',
      title: 'Bonnes pratiques : Réduire l\'empreinte carbone du numérique',
      content: 'Voici ce que nous avons mis en place :\n- Extension de la durée de vie des équipements (5 ans minimum)\n- Achat de matériel reconditionné\n- Sensibilisation à l\'usage raisonné\n- Serveurs locaux pour réduire le cloud\n\nRésultat : -30% d\'émissions en 2 ans !',
      category: 'best-practice',
      author_name: 'Thomas R.',
      likes: 23,
      replies_count: 11,
      useful_count: 19,
      marked_useful: true,
      created_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  // Demo replies
  const demoReplies = [
    {
      id: 'reply-1',
      post_id: 'demo-1',
      content: 'Félicitations ! Nous avons fait la même chose. Le plus important c\'est la formation continue.',
      author_name: 'Jean P.',
      likes: 5,
      helpful_count: 3,
      marked_helpful: true,
      created_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'reply-2',
      post_id: 'demo-2',
      content: 'Organisez des sessions de formation progressives, montrez les avantages concrets, et surtout : écoutez leurs retours !',
      author_name: 'Marie D.',
      likes: 8,
      helpful_count: 6,
      marked_helpful: true,
      created_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'reply-3',
      post_id: 'demo-3',
      content: 'Je recommande les ressources de l\'ADEME et les vidéos de "Data Gueule" sur YouTube. Très pédagogiques !',
      author_name: 'Thomas R.',
      likes: 4,
      helpful_count: 2,
      marked_helpful: false,
      created_date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  // Demo impact data
  const demoImpactData = [
    {
      id: 'impact-1',
      establishment_name: 'Lycée Victor Hugo',
      month: new Date(Date.now() - 2 * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 7), // Il y a 2 mois
      server_consumption_kwh: 1200,
      devices_recycled: 15,
      devices_extended_life: 25,
      free_software_percentage: 65,
      linux_devices: 80,
      total_devices: 150,
      notes: 'Migration progressive vers Linux sur les postes administratifs. Formation des enseignants en cours.',
      co2_saved_kg: (15 * 150) + (25 * 50) + (80 * 20), // Calcul automatique
      created_date: new Date(Date.now() - 2 * 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'impact-2',
      establishment_name: 'Lycée Victor Hugo',
      month: new Date(Date.now() - 1 * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 7), // Il y a 1 mois
      server_consumption_kwh: 1100,
      devices_recycled: 8,
      devices_extended_life: 12,
      free_software_percentage: 72,
      linux_devices: 95,
      total_devices: 150,
      notes: 'Continuation de la migration. 95 postes Linux maintenant. Économies de licences : 4500€/mois.',
      co2_saved_kg: (8 * 150) + (12 * 50) + (95 * 20),
      created_date: new Date(Date.now() - 1 * 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'impact-3',
      establishment_name: 'Lycée Victor Hugo',
      month: new Date().toISOString().slice(0, 7), // Ce mois
      server_consumption_kwh: 1050,
      devices_recycled: 5,
      devices_extended_life: 8,
      free_software_percentage: 78,
      linux_devices: 110,
      total_devices: 150,
      notes: 'Objectif 80% atteint ! Les élèves participent activement à la maintenance des postes Linux.',
      co2_saved_kg: (5 * 150) + (8 * 50) + (110 * 20),
      created_date: new Date().toISOString()
    },
    {
      id: 'impact-4',
      establishment_name: 'Collège Jean Jaurès',
      month: new Date(Date.now() - 1 * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 7),
      server_consumption_kwh: 800,
      devices_recycled: 12,
      devices_extended_life: 18,
      free_software_percentage: 45,
      linux_devices: 35,
      total_devices: 90,
      notes: 'Début de migration. Formation des équipes techniques. Premiers retours positifs.',
      co2_saved_kg: (12 * 150) + (18 * 50) + (35 * 20),
      created_date: new Date(Date.now() - 1 * 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'impact-5',
      establishment_name: 'Collège Jean Jaurès',
      month: new Date().toISOString().slice(0, 7),
      server_consumption_kwh: 750,
      devices_recycled: 6,
      devices_extended_life: 10,
      free_software_percentage: 55,
      linux_devices: 45,
      total_devices: 90,
      notes: 'Progression constante. Atelier de réparation avec les élèves organisé ce mois.',
      co2_saved_kg: (6 * 150) + (10 * 50) + (45 * 20),
      created_date: new Date().toISOString()
    }
  ];

  localStorage.setItem('nird-forum-posts', JSON.stringify(demoPosts));
  localStorage.setItem('nird-forum-replies', JSON.stringify(demoReplies));
  localStorage.setItem('nird-impact-data', JSON.stringify(demoImpactData));
  localStorage.setItem('nird-demo-initialized', 'true');
}

// Initialize on import
if (typeof window !== 'undefined') {
  initializeDemoData();
  
  // Vérifier et ajouter les données d'impact si elles n'existent pas
  const existingImpactData = localStorage.getItem('nird-impact-data');
  if (!existingImpactData || JSON.parse(existingImpactData).length === 0) {
    const demoImpactData = [
      {
        id: 'impact-1',
        establishment_name: 'Lycée Victor Hugo',
        month: new Date(Date.now() - 2 * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 7),
        server_consumption_kwh: 1200,
        devices_recycled: 15,
        devices_extended_life: 25,
        free_software_percentage: 65,
        linux_devices: 80,
        total_devices: 150,
        notes: 'Migration progressive vers Linux sur les postes administratifs. Formation des enseignants en cours.',
        co2_saved_kg: (15 * 150) + (25 * 50) + (80 * 20),
        created_date: new Date(Date.now() - 2 * 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'impact-2',
        establishment_name: 'Lycée Victor Hugo',
        month: new Date(Date.now() - 1 * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 7),
        server_consumption_kwh: 1100,
        devices_recycled: 8,
        devices_extended_life: 12,
        free_software_percentage: 72,
        linux_devices: 95,
        total_devices: 150,
        notes: 'Continuation de la migration. 95 postes Linux maintenant. Économies de licences : 4500€/mois.',
        co2_saved_kg: (8 * 150) + (12 * 50) + (95 * 20),
        created_date: new Date(Date.now() - 1 * 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'impact-3',
        establishment_name: 'Lycée Victor Hugo',
        month: new Date().toISOString().slice(0, 7),
        server_consumption_kwh: 1050,
        devices_recycled: 5,
        devices_extended_life: 8,
        free_software_percentage: 78,
        linux_devices: 110,
        total_devices: 150,
        notes: 'Objectif 80% atteint ! Les élèves participent activement à la maintenance des postes Linux.',
        co2_saved_kg: (5 * 150) + (8 * 50) + (110 * 20),
        created_date: new Date().toISOString()
      },
      {
        id: 'impact-4',
        establishment_name: 'Collège Jean Jaurès',
        month: new Date(Date.now() - 1 * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 7),
        server_consumption_kwh: 800,
        devices_recycled: 12,
        devices_extended_life: 18,
        free_software_percentage: 45,
        linux_devices: 35,
        total_devices: 90,
        notes: 'Début de migration. Formation des équipes techniques. Premiers retours positifs.',
        co2_saved_kg: (12 * 150) + (18 * 50) + (35 * 20),
        created_date: new Date(Date.now() - 1 * 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'impact-5',
        establishment_name: 'Collège Jean Jaurès',
        month: new Date().toISOString().slice(0, 7),
        server_consumption_kwh: 750,
        devices_recycled: 6,
        devices_extended_life: 10,
        free_software_percentage: 55,
        linux_devices: 45,
        total_devices: 90,
        notes: 'Progression constante. Atelier de réparation avec les élèves organisé ce mois.',
        co2_saved_kg: (6 * 150) + (10 * 50) + (45 * 20),
        created_date: new Date().toISOString()
      }
    ];
    localStorage.setItem('nird-impact-data', JSON.stringify(demoImpactData));
  }
}

// Helper functions for localStorage
function getStorageKey(entity) {
  // Map entity names to storage keys
  const keyMap = {
    'forum-posts': 'nird-forum-posts',
    'forum-replies': 'nird-forum-replies',
    'impact-data': 'nird-impact-data',
    'multiplayer-sessions': 'nird-multiplayer-sessions',
    'player-results': 'nird-player-results',
    'simulation-scores': 'nird-simulation-scores'
  };
  return keyMap[entity] || `nird-${entity.toLowerCase()}`;
}

function getAllItems(entity) {
  const key = getStorageKey(entity);
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function saveItems(entity, items) {
  const key = getStorageKey(entity);
  localStorage.setItem(key, JSON.stringify(items));
}

function sortItems(items, orderBy) {
  if (!orderBy) return items;
  
  const [field, direction] = orderBy.startsWith('-') 
    ? [orderBy.slice(1), 'desc'] 
    : [orderBy, 'asc'];
  
  return [...items].sort((a, b) => {
    let aVal = a[field];
    let bVal = b[field];
    
    if (field === 'created_date') {
      aVal = new Date(aVal).getTime();
      bVal = new Date(bVal).getTime();
    }
    
    if (direction === 'desc') {
      return bVal > aVal ? 1 : bVal < aVal ? -1 : 0;
    } else {
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    }
  });
}

// AI Helper functions (mock but intelligent)
function analyzeContentForCategory(content) {
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('question') || lowerContent.includes('comment') || lowerContent.includes('conseil') || lowerContent.includes('?')) {
    return 'question';
  }
  if (lowerContent.includes('ressource') || lowerContent.includes('lien') || lowerContent.includes('outil') || lowerContent.includes('site')) {
    return 'resource';
  }
  if (lowerContent.includes('pratique') || lowerContent.includes('astuce') || lowerContent.includes('méthode') || lowerContent.includes('technique')) {
    return 'best-practice';
  }
  if (lowerContent.includes('suggestion') || lowerContent.includes('idée') || lowerContent.includes('proposition')) {
    return 'suggestion';
  }
  return 'experience';
}

function extractTags(content) {
  const lowerContent = content.toLowerCase();
  const tags = [];
  
  if (lowerContent.includes('libre') || lowerContent.includes('open source') || lowerContent.includes('linux')) {
    tags.push('linux');
  }
  if (lowerContent.includes('écologie') || lowerContent.includes('carbone') || lowerContent.includes('environnement') || lowerContent.includes('durable')) {
    tags.push('ecology');
  }
  if (lowerContent.includes('privée') || lowerContent.includes('données') || lowerContent.includes('rgpd') || lowerContent.includes('confidentialité')) {
    tags.push('privacy');
  }
  if (lowerContent.includes('inclusion') || lowerContent.includes('accessibilité') || lowerContent.includes('handicap')) {
    tags.push('inclusion');
  }
  if (lowerContent.includes('migration') || lowerContent.includes('changement') || lowerContent.includes('transition')) {
    tags.push('migration');
  }
  if (lowerContent.includes('éducation') || lowerContent.includes('pédagogie') || lowerContent.includes('élève') || lowerContent.includes('étudiant')) {
    tags.push('education');
  }
  if (lowerContent.includes('responsable') || lowerContent.includes('éthique')) {
    tags.push('responsability');
  }
  if (lowerContent.includes('durable') || lowerContent.includes('durabilité')) {
    tags.push('durability');
  }
  
  return tags.length > 0 ? tags : ['education'];
}

function generateSummary(content, title) {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
  if (sentences.length >= 2) {
    return sentences.slice(0, 2).join('. ').trim() + '.';
  }
  return content.substring(0, 150) + (content.length > 150 ? '...' : '');
}

export const base44 = {
  entities: {
    ForumPost: {
      create: async (data) => {
        const posts = getAllItems('forum-posts');
        const newPost = {
          id: `post-${Date.now()}`,
          ...data,
          likes: 0,
          replies_count: 0,
          useful_count: 0,
          marked_useful: false,
          created_date: new Date().toISOString()
        };
        posts.push(newPost);
        saveItems('forum-posts', posts);
        return newPost;
      },
      list: async (orderBy) => {
        const posts = getAllItems('forum-posts');
        return sortItems(posts, orderBy);
      },
      filter: async (query, orderBy) => {
        const posts = getAllItems('forum-posts');
        let filtered = posts;
        if (query && Object.keys(query).length > 0) {
          filtered = posts.filter(post => {
            return Object.keys(query).every(key => post[key] === query[key]);
          });
        }
        return sortItems(filtered, orderBy);
      },
      update: async (id, data) => {
        const posts = getAllItems('forum-posts');
        const index = posts.findIndex(p => p.id === id);
        if (index !== -1) {
          posts[index] = { ...posts[index], ...data };
          saveItems('forum-posts', posts);
          return posts[index];
        }
        return null;
      },
      delete: async (id) => {
        const posts = getAllItems('forum-posts');
        const filtered = posts.filter(p => p.id !== id);
        saveItems('forum-posts', filtered);
        return { success: true };
      }
    },
    ForumReply: {
      create: async (data) => {
        const replies = getAllItems('forum-replies');
        const newReply = {
          id: `reply-${Date.now()}`,
          ...data,
          likes: 0,
          helpful_count: 0,
          marked_helpful: false,
          created_date: new Date().toISOString()
        };
        replies.push(newReply);
        saveItems('forum-replies', replies);
        return newReply;
      },
      list: async (orderBy) => {
        const replies = getAllItems('forum-replies');
        return sortItems(replies, orderBy);
      },
      filter: async (query, orderBy) => {
        const replies = getAllItems('forum-replies');
        let filtered = replies;
        if (query && Object.keys(query).length > 0) {
          filtered = replies.filter(reply => {
            return Object.keys(query).every(key => reply[key] === query[key]);
          });
        }
        return sortItems(filtered, orderBy);
      },
      update: async (id, data) => {
        const replies = getAllItems('forum-replies');
        const index = replies.findIndex(r => r.id === id);
        if (index !== -1) {
          replies[index] = { ...replies[index], ...data };
          saveItems('forum-replies', replies);
          return replies[index];
        }
        return null;
      }
    },
    ImpactData: {
      create: async (data) => {
        const impactData = getAllItems('impact-data');
        const newImpact = {
          id: `impact-${Date.now()}`,
          ...data,
          created_date: new Date().toISOString()
        };
        impactData.push(newImpact);
        saveItems('impact-data', impactData);
        return newImpact;
      },
      list: async (orderBy) => {
        const impactData = getAllItems('impact-data');
        return sortItems(impactData, orderBy);
      },
      filter: async (query, orderBy) => {
        const impactData = getAllItems('impact-data');
        let filtered = impactData;
        if (query && Object.keys(query).length > 0) {
          filtered = impactData.filter(item => {
            return Object.keys(query).every(key => item[key] === query[key]);
          });
        }
        return sortItems(filtered, orderBy);
      }
    },
    MultiplayerSession: {
      create: async (data) => {
        const sessions = getAllItems('multiplayer-sessions');
        const newSession = {
          id: `session-${Date.now()}`,
          ...data,
          created_date: new Date().toISOString()
        };
        sessions.push(newSession);
        saveItems('multiplayer-sessions', sessions);
        return newSession;
      },
      filter: async (query) => {
        const sessions = getAllItems('multiplayer-sessions');
        if (query && Object.keys(query).length > 0) {
          return sessions.filter(session => {
            return Object.keys(query).every(key => session[key] === query[key]);
          });
        }
        return sessions;
      },
      update: async (id, data) => {
        const sessions = getAllItems('multiplayer-sessions');
        const index = sessions.findIndex(s => s.id === id);
        if (index !== -1) {
          sessions[index] = { ...sessions[index], ...data };
          saveItems('multiplayer-sessions', sessions);
          return sessions[index];
        }
        return null;
      }
    },
    PlayerResult: {
      create: async (data) => {
        const results = getAllItems('player-results');
        const newResult = {
          id: `result-${Date.now()}`,
          ...data,
          created_date: new Date().toISOString()
        };
        results.push(newResult);
        saveItems('player-results', results);
        return newResult;
      },
      filter: async (query, orderBy) => {
        const results = getAllItems('player-results');
        let filtered = results;
        if (query && Object.keys(query).length > 0) {
          filtered = results.filter(result => {
            return Object.keys(query).every(key => result[key] === query[key]);
          });
        }
        return sortItems(filtered, orderBy);
      }
    },
    SimulationScore: {
      create: async (data) => {
        const scores = getAllItems('simulation-scores');
        const newScore = {
          id: `score-${Date.now()}`,
          ...data,
          created_date: new Date().toISOString()
        };
        scores.push(newScore);
        saveItems('simulation-scores', scores);
        return newScore;
      },
      filter: async (query) => {
        const scores = getAllItems('simulation-scores');
        if (query && Object.keys(query).length > 0) {
          return scores.filter(score => {
            return Object.keys(query).every(key => score[key] === query[key]);
          });
        }
        return scores;
      }
    }
  },
  integrations: {
    Core: {
      InvokeLLM: async (params) => {
        // Intelligent mock AI implementation
        const { prompt, response_json_schema } = params;
        
        // Auto-categorization
        if (prompt.includes('catégorie') || prompt.includes('category')) {
          const contentMatch = prompt.match(/Contenu:\s*(.+?)(?:\n|$)/);
          const content = contentMatch ? contentMatch[1] : '';
          const category = analyzeContentForCategory(content);
          const tags = extractTags(content);
          
          return {
            category,
            suggestedTags: tags
          };
        }
        
        // Resource analysis
        if (prompt.includes('Analyse ce contenu') || prompt.includes('résumé')) {
          const titleMatch = prompt.match(/Titre:\s*(.+?)(?:\n|$)/);
          const contentMatch = prompt.match(/Contenu:\s*(.+?)(?:\n|$)/);
          const title = titleMatch ? titleMatch[1] : '';
          const content = contentMatch ? contentMatch[1] : '';
          
          const tags = extractTags(content);
          const summary = generateSummary(content, title);
          
          // Extract key points
          const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 30);
          const keyPoints = sentences.slice(0, 3).map(s => s.trim()).filter(s => s.length > 0);
          
          // Calculate NIRD score based on keywords
          let nirdScore = 5;
          if (tags.includes('linux') || tags.includes('ecology') || tags.includes('privacy')) nirdScore += 2;
          if (tags.includes('inclusion') || tags.includes('education')) nirdScore += 1;
          nirdScore = Math.min(10, nirdScore);
          
          return {
            summary,
            tags,
            keyPoints: keyPoints.length > 0 ? keyPoints : ['Contenu pertinent pour le numérique responsable'],
            nirdScore
          };
        }
        
        // Dynamic scenario generation
        if (prompt.includes('scénario') || prompt.includes('scenario') || prompt.includes('Génère UN NOUVEAU scénario')) {
          // Analyze previous decisions to generate appropriate scenario
          const budgetMatch = prompt.match(/Budget\s+(-?\d+)/);
          const autonomyMatch = prompt.match(/Autonomie\s+(-?\d+)/);
          const ecologyMatch = prompt.match(/Écologie\s+(-?\d+)/);
          
          const currentBudget = budgetMatch ? parseInt(budgetMatch[1]) : 0;
          const currentAutonomy = autonomyMatch ? parseInt(autonomyMatch[1]) : 0;
          const currentEcology = ecologyMatch ? parseInt(ecologyMatch[1]) : 0;
          
          // Select scenario based on current state
          const scenarioTemplates = [
            {
              title: 'Défi infrastructure cloud',
              context: 'Votre établissement doit choisir entre renouveler son contrat avec un fournisseur cloud américain (coût élevé, dépendance) ou migrer vers une solution souveraine française.',
              image: '☁️',
              bgGradient: 'from-blue-900/50 to-cyan-900/50',
              decisions: [
                {
                  id: 'renew',
                  title: 'Renouveler le contrat',
                  description: 'Maintenir le service actuel malgré le coût',
                  consequences: {
                    budget: -50000,
                    satisfaction: 0,
                    autonomy: -20,
                    ecology: -10,
                    message: 'Dépendance maintenue, coût élevé.'
                  }
                },
                {
                  id: 'migrate',
                  title: 'Migrer vers solution souveraine',
                  description: 'Choisir un hébergeur français certifié',
                  consequences: {
                    budget: -30000,
                    satisfaction: 10,
                    autonomy: 40,
                    ecology: 20,
                    message: 'Souveraineté numérique renforcée, économie réalisée.'
                  }
                },
                {
                  id: 'hybrid',
                  title: 'Solution hybride',
                  description: 'Partager entre cloud souverain et local',
                  consequences: {
                    budget: -35000,
                    satisfaction: 5,
                    autonomy: 25,
                    ecology: 15,
                    message: 'Compromis équilibré entre coût et souveraineté.'
                  }
                }
              ]
            },
            {
              title: 'Crise de maintenance matérielle',
              context: 'Votre parc informatique vieillit. 40% des ordinateurs ont plus de 6 ans. Vous devez décider de la stratégie de renouvellement.',
              image: '💻',
              bgGradient: 'from-orange-900/50 to-red-900/50',
              decisions: [
                {
                  id: 'replace-all',
                  title: 'Remplacer tout le parc',
                  description: 'Acheter du matériel neuf pour tous les postes',
                  consequences: {
                    budget: -80000,
                    satisfaction: 20,
                    autonomy: 0,
                    ecology: -30,
                    message: 'Performance optimale mais impact écologique important.'
                  }
                },
                {
                  id: 'refurbished',
                  title: 'Matériel reconditionné',
                  description: 'Acheter du matériel reconditionné certifié',
                  consequences: {
                    budget: -40000,
                    satisfaction: 15,
                    autonomy: 10,
                    ecology: 25,
                    message: 'Économie et écologie, qualité maintenue.'
                  }
                },
                {
                  id: 'extend-life',
                  title: 'Prolonger la durée de vie',
                  description: 'Réparer et optimiser le matériel existant',
                  consequences: {
                    budget: -15000,
                    satisfaction: -5,
                    autonomy: 15,
                    ecology: 35,
                    message: 'Très écologique mais maintenance accrue nécessaire.'
                  }
                }
              ]
            },
            {
              title: 'Formation aux outils libres',
              context: 'Vous souhaitez former vos enseignants aux alternatives libres. Comment organiser cette transition ?',
              image: '📚',
              bgGradient: 'from-purple-900/50 to-pink-900/50',
              decisions: [
                {
                  id: 'external-training',
                  title: 'Formation externe',
                  description: 'Faire appel à un organisme de formation spécialisé',
                  consequences: {
                    budget: -25000,
                    satisfaction: 25,
                    autonomy: 30,
                    ecology: 10,
                    message: 'Formation de qualité, adoption rapide.'
                  }
                },
                {
                  id: 'internal-training',
                  title: 'Formation interne',
                  description: 'Former des référents internes qui formeront les autres',
                  consequences: {
                    budget: -8000,
                    satisfaction: 15,
                    autonomy: 40,
                    ecology: 15,
                    message: 'Économique et renforce l\'autonomie de l\'établissement.'
                  }
                },
                {
                  id: 'progressive',
                  title: 'Adoption progressive',
                  description: 'Former progressivement par petits groupes',
                  consequences: {
                    budget: -12000,
                    satisfaction: 10,
                    autonomy: 25,
                    ecology: 20,
                    message: 'Transition douce, moins de résistance.'
                  }
                }
              ]
            }
          ];
          
          // Select scenario based on current scores
          let selectedScenario;
          if (currentBudget < -50000 || currentAutonomy < 20) {
            selectedScenario = scenarioTemplates[1]; // Material crisis
          } else if (currentAutonomy < 40) {
            selectedScenario = scenarioTemplates[2]; // Training
          } else {
            selectedScenario = scenarioTemplates[0]; // Cloud
          }
          
          return selectedScenario;
        }
        
        // AI Advice generation
        if (prompt.includes('conseil stratégique') || prompt.includes('aide le joueur')) {
          const budgetMatch = prompt.match(/Budget\s*:\s*(-?\d+)/);
          const autonomyMatch = prompt.match(/Autonomie\s*:\s*(-?\d+)/);
          const ecologyMatch = prompt.match(/Impact écologique\s*:\s*(-?\d+)/);
          
          const budget = budgetMatch ? parseInt(budgetMatch[1]) : 0;
          const autonomy = autonomyMatch ? parseInt(autonomyMatch[1]) : 0;
          const ecology = ecologyMatch ? parseInt(ecologyMatch[1]) : 0;
          
          let advice, focus, warning;
          
          if (budget < -60000) {
            advice = 'Votre budget est serré. Privilégiez les solutions économiques à long terme, même si elles demandent plus d\'efforts initiaux.';
            focus = 'budget';
            warning = 'Attention à ne pas compromettre la qualité pour l\'économie.';
          } else if (autonomy < 30) {
            advice = 'Votre autonomie numérique est faible. Pensez aux solutions qui réduisent votre dépendance aux grands acteurs.';
            focus = 'autonomy';
            warning = 'La transition prend du temps, soyez patient.';
          } else if (ecology < 20) {
            advice = 'L\'impact écologique peut être amélioré. Les solutions durables sont souvent aussi économiques sur le long terme.';
            focus = 'ecology';
            warning = 'L\'écologie ne doit pas être négligée dans vos décisions.';
          } else {
            advice = 'Vos scores sont équilibrés. Continuez à chercher des solutions qui allient performance, économie et responsabilité.';
            focus = 'satisfaction';
          }
          
          return { advice, focus, warning };
        }
        
        // Strategy analysis
        if (prompt.includes('Analyse la partie') || prompt.includes('analyse la stratégie')) {
          const budgetMatch = prompt.match(/Budget restant\s*:\s*(-?\d+)/);
          const autonomyMatch = prompt.match(/Autonomie numérique\s*:\s*(-?\d+)/);
          const ecologyMatch = prompt.match(/Impact écologique\s*:\s*(-?\d+)/);
          
          const budget = budgetMatch ? parseInt(budgetMatch[1]) : 0;
          const autonomy = autonomyMatch ? parseInt(autonomyMatch[1]) : 0;
          const ecology = ecologyMatch ? parseInt(ecologyMatch[1]) : 0;
          
          let overallGrade = 'C';
          if (budget > -40000 && autonomy > 50 && ecology > 40) overallGrade = 'A';
          else if (budget > -60000 && autonomy > 30 && ecology > 25) overallGrade = 'B';
          else if (budget < -80000 || autonomy < 10 || ecology < 10) overallGrade = 'D';
          
          const strengths = [];
          const improvements = [];
          
          if (autonomy > 40) strengths.push('Excellente autonomie numérique développée');
          else improvements.push('Renforcer l\'autonomie numérique pour réduire les dépendances');
          
          if (ecology > 30) strengths.push('Bonne gestion de l\'impact écologique');
          else improvements.push('Améliorer l\'impact écologique de vos choix');
          
          if (budget > -50000) strengths.push('Gestion budgétaire maîtrisée');
          else improvements.push('Optimiser davantage les coûts');
          
          return {
            overallGrade,
            summary: `Votre stratégie montre ${autonomy > 40 ? 'une bonne' : 'des progrès en'} autonomie numérique. ${ecology > 30 ? 'L\'impact écologique est bien géré.' : 'L\'écologie peut être améliorée.'}`,
            strengths: strengths.length > 0 ? strengths : ['Engagement dans le numérique responsable'],
            improvements: improvements.length > 0 ? improvements : ['Continuer à équilibrer les différents enjeux'],
            bestDecision: autonomy > 40 ? 'Vos choix favorisant l\'autonomie numérique sont excellents' : 'Pensez à privilégier les solutions qui renforcent votre autonomie',
            alternativeStrategy: 'Essayer une approche plus progressive pour réduire les risques',
            realWorldTip: 'Dans la réalité, impliquez tous les acteurs (enseignants, élèves, administration) dans les décisions pour une meilleure adoption.'
          };
        }
        
        // Default response
        return {
          summary: 'Analyse générée automatiquement',
          tags: ['education'],
          keyPoints: ['Point clé 1', 'Point clé 2'],
          nirdScore: 7
        };
      }
    }
  }
};
