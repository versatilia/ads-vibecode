// Utility to generate random owners with avatars and names

export interface Owner {
  id: string;
  name: string;
  avatar: string;
  email: string;
}

// Random first names for variety
const firstNames = [
  'Alex', 'Jordan', 'Casey', 'Taylor', 'Morgan', 'Riley', 'Quinn', 'Avery', 'Blake', 'Cameron',
  'Drew', 'Emery', 'Finley', 'Gray', 'Harper', 'Indigo', 'Jamie', 'Kendall', 'Logan', 'Mason',
  'Noah', 'Oakley', 'Parker', 'Quinn', 'River', 'Sage', 'Tatum', 'Unity', 'Vale', 'Winter',
  'Xander', 'Yuki', 'Zara', 'Aria', 'Bella', 'Cora', 'Daisy', 'Eva', 'Fiona', 'Grace',
  'Hazel', 'Iris', 'Jade', 'Kate', 'Luna', 'Maya', 'Nora', 'Opal', 'Poppy', 'Ruby'
];

// Random last names
const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'
];

// Generate a random avatar URL using DiceBear API
function generateAvatarUrl(seed: string): string {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&size=24&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
}

// Generate a random email
function generateEmail(firstName: string, lastName: string): string {
  const domains = ['company.com', 'tech.org', 'enterprise.io', 'digital.net'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`;
}

// Generate a random owner
export function generateOwner(id: string): Owner {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const fullName = `${firstName} ${lastName}`;
  const seed = `${firstName}${lastName}${id}`;
  
  return {
    id,
    name: fullName,
    avatar: generateAvatarUrl(seed),
    email: generateEmail(firstName, lastName)
  };
}

// Generate owners for different entity types
export function generateDomainOwner(domainId: string): Owner {
  return generateOwner(`domain-${domainId}-owner`);
}

export function generateTeamOwner(teamId: string): Owner {
  return generateOwner(`team-${teamId}-owner`);
}

export function generateProductOwner(productId: string): Owner {
  return generateOwner(`product-${productId}-owner`);
}

export function generateBusinessUnitOwner(businessUnit: string): Owner {
  return generateOwner(`bu-${businessUnit.toLowerCase()}-owner`);
} 