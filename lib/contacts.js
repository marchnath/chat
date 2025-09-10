// Contact profiles for different conversation types
export const contacts = [
  {
    id: 1,
    name: "Bond", // Bond is Romantic, courting, flirtatious type of conversation especially with lower proficiency levels with a lover
    avatar: "/avatars/image2.png",
    last: "Good evening, darling",
  },
  {
    id: 2,
    name: "Connect",
    avatar: "/avatars/image3.png",
    last: "Let's make meaningful connections! 🤝",
  },
  {
    id: 3,
    name: "Gossip",
    avatar: "/avatars/image1.png",
    last: "Guess what I just heard! 🕵️",
  },
  {
    id: 4,
    name: "Sell",
    avatar: "/avatars/image4.png",
    last: "This offer is too good to miss! 🤑",
  },
  {
    id: 5,
    name: "Debate",
    avatar: "/avatars/image5.png",
    last: "Let's dive into the pros and cons. ⚖️",
  },
  {
    id: 6,
    name: "Question",
    avatar: "/avatars/image7.png",
    last: "I was wondering about something... 🤔",
  },
];

// Get contact by ID
export const getContactById = (id) => {
  return contacts.find((contact) => contact.id === parseInt(id));
};

// Get contact by name
export const getContactByName = (name) => {
  return contacts.find(
    (contact) => contact.name.toLowerCase() === name.toLowerCase().trim()
  );
};
