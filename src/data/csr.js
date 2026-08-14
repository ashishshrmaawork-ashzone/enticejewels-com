export const csrItems = [
  {
    id: "education",
    title: "Education",
    image: "/images/csr-1.png",
    description: "Supporting access to learning and creating opportunities for brighter futures.",
    intro:
      "Education has the power to transform individuals, families, and communities. Through sustained support for learning initiatives, KGK Group works to make quality education more accessible to children and young people.",
    paragraphs: [
      "Our efforts focus on strengthening the foundations that help students learn with confidence—from educational resources and supportive environments to initiatives that encourage continued participation in school.",
      "By investing in knowledge and opportunity, we aim to help the next generation develop the skills, curiosity, and independence needed to shape a better future.",
    ],
  },
  {
    id: "healthcare",
    title: "Healthcare",
    image: "/images/csr-2.png",
    description: "Helping communities access compassionate, dependable healthcare and support.",
    intro:
      "Good health is essential to a life of dignity and possibility. KGK Group supports healthcare initiatives designed to bring compassionate medical care closer to the people who need it most.",
    paragraphs: [
      "These efforts contribute to patient care, medical awareness, and stronger health infrastructure, with a particular emphasis on respectful treatment and the wellbeing of families.",
      "Our commitment is rooted in a simple belief: every person deserves access to care delivered with humanity, responsibility, and compassion.",
    ],
  },
  {
    id: "skill-development",
    title: "Skill Development",
    image: "/images/csr-3.png",
    description: "Building practical skills that enable independence, confidence, and employment.",
    intro:
      "Skill development turns potential into opportunity. KGK Group supports vocational learning that equips people with practical knowledge and prepares them for sustainable livelihoods.",
    paragraphs: [
      "Training initiatives are shaped around employable skills, professional discipline, and the confidence required to participate meaningfully in a changing economy.",
      "By helping individuals become self-reliant, these programmes create an impact that extends beyond one career to families and entire communities.",
    ],
  },
  {
    id: "heritage-tourism",
    title: "Heritage & Tourism",
    image: "/images/csr-4.png",
    description: "Preserving cultural landmarks and their stories for generations to come.",
    intro:
      "Heritage connects communities to their history, identity, and shared sense of place. KGK Group has contributed to conservation efforts that protect culturally significant landmarks and encourage responsible tourism.",
    paragraphs: [
      "The restoration of historic spaces requires sensitivity to original craftsmanship alongside a long-term vision for preservation. Such work helps revive public appreciation for architecture, artistry, and local heritage.",
      "Through thoughtful conservation, we seek to ensure that remarkable places and the stories they carry remain accessible to future generations.",
    ],
  },
];

export const getCsrItem = (slug) => csrItems.find((item) => item.id === slug);
